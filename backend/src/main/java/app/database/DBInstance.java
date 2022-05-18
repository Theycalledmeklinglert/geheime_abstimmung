package main.java.app.database;

import com.mongodb.BasicDBObject;
import com.mongodb.client.*;
import com.mongodb.client.model.*;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.mongodb.client.model.Filters.*;

public class DBInstance
{
        private static DBInstance INSTANCE;
        private static MongoClient client;
        private static MongoDatabase db;
        private static MongoCollection<Document> pollCol;
        private static MongoCollection<Document> userCol;
        private static MongoCollection<Document> answerCol;
        private static MongoCollection<Document> emailCol;
        private static MongoCollection<Document> sessIDCol;



    private static ArrayList<String> pollNames;

    private static ArrayList<String> userNames;

    public static MongoCollection<Document> getCollection( )
        {
                return pollCol;
        }

        public static ArrayList<String> getPollNames( )
        {
            return pollNames;
        }

        public static DBInstance getDBInstance() {
            if(INSTANCE == null)
            {
                return new DBInstance();
            }
            else
            {
                return INSTANCE;
            }
        }

        private DBInstance( )
        {
            // The Mongo Connection URI is mostly provided by the mongodb cloud. It can change depending on what DB user logs into the DB from the application
            // client = MongoClients.create("mongodb://localhost:27017");
            client = MongoClients.create("mongodb+srv://sampleUser:GeheimeAbstimmung@cluster0.eobux.mongodb.net/TestDB?retryWrites=true&w=majority");
            db = client.getDatabase("DB");
            pollCol = db.getCollection("Polls");
            userCol = db.getCollection("Users");
            answerCol = db.getCollection("Answers");
            emailCol = db.getCollection("E-Mails");
            sessIDCol = db.getCollection("SessIDs");
            sessIDCol.createIndex(Indexes.ascending("created at"), new IndexOptions().expireAfter(30L, TimeUnit.MINUTES));

            this.pollNames = new ArrayList<String>( );
            this.userNames = new ArrayList<String>( );
            initializePollNameList();
            initializeUserNameList();
        }

        private void initializePollNameList()
        {
            Bson projection = Projections.fields(Projections.include("name"), Projections.excludeId());
            Bson filter = Filters.empty();
            pollCol.find(filter).projection(projection).forEach(doc -> pollNames.add(doc.getString("name")));
        }

    private void initializeUserNameList()
    {
        Bson projection = Projections.fields(Projections.include("name"), Projections.excludeId());
        Bson filter = Filters.empty();
        userCol.find(filter).projection(projection).forEach(doc -> userNames.add(doc.getString("name")));
    }


    public Optional<Document> getPollAsOptDocumentByID(final String id )
    {
            Optional<Document> optDoc = getSingleDocFromCollection(this.pollCol, Projections.fields(Projections.fields()), "_id", id);
            return optDoc;
    }

    public boolean createPoll(Document poll)
    {
        String name = poll.getString("name");
        if(pollNames.contains(name))
        {
            System.out.println("Poll with identical name already exists. You have to choose a different title");
            return false;
        }
        else
        {
            pollCol.insertOne(poll);
            addNewPollToPollNames(name);
            return true;
        }
    }


    public void deletePollByName(String name) {
        Bson query = eq("name", name);
        this.pollCol.deleteOne(query);
    }

    public void deleteAllPolls() {
        this.pollCol.deleteMany(new Document());
        this.pollNames = new ArrayList<>();
    }

    private void updatePollCollection()
    {
        this.pollCol = db.getCollection("Polls");
    }

    public void addNewPollToPollNames(String name)
    {
        updatePollCollection();
        Optional<Document> optDoc = getSingleDocFromCollection(this.pollCol, Projections.fields(), "name", name);

        if (optDoc.isPresent())
        {
            Document doc = optDoc.get();
            pollNames.add(doc.getString("name"));
        }
        else
        {
            System.out.println("Specified poll was not inserted correctly into database");
            return;
        }
    }

    // This method also returns the username + password hash
    public Optional<Document> getUserAsOptDocumentByName(final String name)
        {
            Optional<Document> optDoc = getSingleDocFromCollection(this.userCol, Projections.fields(), "name", name);

            if(optDoc.isPresent())
            {
                return optDoc;
            }
            else {
                return Optional.empty();
            }
        }

    // This method also returns the username + password hash
    public Optional<Document> getUserAsOptDocumentByNameWithoutID(final String name)
    {
        Optional<Document> optDoc = getSingleDocFromCollection(this.userCol, Projections.fields(Projections.excludeId()), "name", name);

        if(optDoc.isPresent())
        {
            return optDoc;
        }
        else {
            return Optional.empty();
        }
    }


    public Optional<Document> getUserAsOptDocumentByID(final long id)
    {
        Optional<Document> optDoc = getSingleDocFromCollection(this.userCol, Projections.fields(), "_id", Long.toString(id));

        if(optDoc.isPresent())
        {
            return optDoc;
        }
        else {
            return Optional.empty();
        }
    }

    // This method simply returns all registered usernames
    public ArrayList<String> getAllUserNames()
    {
        ArrayList<String> users = new ArrayList<>();
        MongoCursor<Document> cursor = userCol.find().cursor();

        while (cursor.hasNext()) {
            Document userDoc = (Document) cursor.next();
            users.add(userDoc.getString("name"));
        }
        return userNames;
    }

        public Optional<ArrayList<Document>> getAllPollsOfUser(final String userName)
        {
            Bson projection = Projections.fields(Projections.fields());

            MongoCursor<Document> cursor = pollCol.find(or(eq("accessible by", userName), eq("created by", userName)))
                    .projection(projection)
                    .cursor();

            ArrayList<Document> polls = new ArrayList<>();
            while(cursor.hasNext())
            {
                Document poll = cursor.next();
                polls.add(poll);
            }

            if(polls.isEmpty())
            {
                return Optional.empty();
            }
            else {
                return Optional.of(polls);
            }
        }

    public boolean createUser(Document user) {
        String name = user.getString("name");
        if(userNames.contains(name))
        {
            System.out.println("SurveyLeader with identical name already exists. You have to choose a different Username");
            return false;
        }
        else
        {
            userCol.insertOne(user);
            addNewUserToUserNames(name);
            return true;
        }
    }

    // updateUser() receives the oldUser document of the user to be updated by the getUserAsOptDocumentByID(id)
    // update has to be a complete and valid user document. Aside from not having the _id
    // Do we even need an updateUser() Method? I don't think so
    public void updateUser(Document oldUser, Document update) {
            deleteUserByName(oldUser.getString("name"));
            createUser(update);
            //TODO: createUser(update) HAS TO INCLUDE the _id from the oldUser Doc. Otherwise the _id of the updated SurveyLeader
            //does not match the _id of the original one!
    }


    public void deleteUserByName(String name) {
        Bson query = eq("name", name);
        this.userCol.deleteOne(query);
    }

    public void deleteAllUsers() {
        this.userCol.deleteMany(new Document());
        this.userNames = new ArrayList<>();
    }

    public void addNewUserToUserNames(String name)
    {
        Optional<Document> optDoc = getSingleDocFromCollection(this.userCol, Projections.fields(), "name", name);

        if (optDoc.isPresent())
        {
            Document doc = optDoc.get();
            userNames.add(doc.getString("name"));
        }
        else
        {
            System.out.println("Specified user was not inserted correctly into database");
            return;
        }
    }
    

    private Optional<Document> getSingleDocFromCollection(MongoCollection<Document> col, Bson projection, String attributeName, String attributeVal)
    {
        Document doc = col.find(eq(attributeName, attributeVal))
                .projection(projection)
                .first();

        if (doc == null)
        {
            return Optional.empty();
        }
        else
        {
            return Optional.of(doc);
        }
    }


    public boolean createAnswer(Document answer)
    {
        // TODO: Answer MUSS ein Attribut namens poll_id enthalten!!!
        // + Attribut namens "token"
        // Konstruktion des Answer-JSON muss mit FrontEnd abgestimmt werden
        Optional<Document> optPoll = getPollAsOptDocumentByID(answer.getString("poll_id"));
        if(!optPoll.isPresent())
        {
            System.out.println("This answer does not belong to an exisitng poll");
            return false;
        }

        Document poll = optPoll.get();
        ArrayList<String> tokens = (ArrayList<String>) poll.get("tokens");

        if(tokens.contains(answer.getString("token")))
        {
            Bson filter = Filters.eq("name", poll.getString("_id"));
            Bson delete = Updates.pull("tokens", answer.getString("token"));
            pollCol.updateOne(filter, delete);
            answerCol.insertOne(answer);
            return true;
        }
        else
        {
            System.out.println("Answer does not contain a valid token. Answer will not be posted");
            return false;
        }
    }


    public void deleteAnswersOfPollByPollName(String pollName) {
        Bson query = eq("pollName", pollName);
        this.answerCol.deleteMany(query);
    }

    public void deleteAllAnswers() {
        Document doc = new Document();
        this.answerCol.deleteMany(doc);
    }

    public void postLastUsedEmails(List<Document> emails) {
        ArrayList<Document> oldEmails = getAllEmails();
        deleteAllEmails();
        ArrayList<Document> newEmails = new ArrayList<>();

        emails.stream().filter(e -> !oldEmails.contains(e)).forEach(e -> newEmails.add(e));
        oldEmails.stream().forEach(e -> newEmails.add(e));

        Document container = new Document("E-Mails", newEmails);
        emailCol.insertOne(container);
    }

    public void deleteAllEmails() {
        this.emailCol.deleteMany(new Document());
    }

    private ArrayList<Document> getAllEmails() {
        MongoCursor cursor = this.emailCol.find().cursor();
        ArrayList<Document> emails = new ArrayList<>();

        while(cursor.hasNext())
        {
            Document doc = (Document) cursor.next();
            ArrayList<Document> list = (ArrayList<Document>) doc.get("E-Mails");
        }
        return emails;
    }

    public void generateAndSetSessID(Document user) {   // TODO: Test if sessionIDs are deleted after 30 minutes
        String sessID = String.valueOf(System.currentTimeMillis()).substring(8, 13) + UUID.randomUUID().toString().substring(1,10);
        user.append("created at", new Date());
        user.append("Session ID", sessID);

        sessIDCol.insertOne(user);  // TODO: WARUM STATUSCODE 500????

    }

    public Optional<Document> getUserBySessionID(final String sessID) {
        Document doc = sessIDCol.find(eq("Session ID", sessID))
                .projection(Projections.fields())
                .first();

        if (doc == null)
        {
            return Optional.empty();
        }
        else
        {
            return Optional.of(doc);
        }
    }

    /*

        public void delete( final Person person )
        {
            this.storage.remove( person.getId( ) );
        }

        public boolean containsId( final long id )
        {
            return this.storage.containsKey( id );
        }

        public void deleteById( final long id )
        {
            this.storage.remove( id );
        }

        public Collection<Person> findAll( )
        {
            return findBy( "", "" );
        }

        public Collection<Person> findBy( final String firstName, final String lastName )
        {
            return this.storage.values( ).stream( )
                    .filter( byFirstName( firstName ) )
                    .filter( byLastName( lastName ) )
                    .collect( Collectors.toList( ) );
        }

        public Optional<Person> readByEmailAddress( final String emailAddress )
        {
            return this.storage.values( ).stream( )
                    .filter( byEmailAddress( emailAddress ) )
                    .findFirst( );
        }

        private Predicate<Person> byFirstName(final String firstName )
        {
            return person -> StringUtils.isEmpty( firstName ) || person.getFirstName( ).equals( firstName );
        }

        private Predicate<Person> byLastName( final String lastName )
        {
            return person -> StringUtils.isEmpty( lastName ) || person.getLastName( ).equals( lastName );
        }

        private Predicate<Person> byEmailAddress( final String emailAddress )
        {
            return person -> StringUtils.isEmpty( emailAddress ) || person.getEmailAddress( ).equals( emailAddress );
        }


     */


    }


