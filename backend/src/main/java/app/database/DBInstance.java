package main.java.app.database;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.print.Doc;
import java.lang.reflect.Array;
import java.util.*;

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


    public Optional<Document> getPollAsOptDocumentByName(final String name )
    {
        if (pollNames.contains(name))
        {
            Optional<Document> optDoc = getSingleDocFromCollection(this.pollCol, Projections.fields(Projections.excludeId()), "name", name);
            return optDoc;
        }
        else
        {
            return Optional.empty();
        }
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

    // updatePoll() receives the oldUser document of the Poll to be updated by the getPollAsOptDocumentByName(id)
    // update has to be a complete and valid Poll document. Aside from not having the _id
    public void updatePoll(Document oldPoll, Document update) {
        deletePollByName(oldPoll.getString("name"));
        createPoll(update);
        //TODO: createPoll(Poll) HAS TO INCLUDE the _id from the oldPoll Doc. Otherwise the _id of the updated Poll
        // does not match the _id of the original one!
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
            Bson projection = Projections.fields(Projections.excludeId());

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
        updateUserCollection();
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


    private void updateUserCollection()
    {
        this.userCol = db.getCollection("Users");
    }


    public boolean createAnswer(Document answer)
    {
        Optional<Document> optPoll = getPollAsOptDocumentByName(answer.getString("pollName"));
        if(!optPoll.isPresent())
        {
            System.out.println("This answer does not belong to an exisitng poll");
            return false;
        }

        Document poll = optPoll.get();
        ArrayList<String> tokens = (ArrayList<String>) poll.get("tokens");

        if(tokens.contains(answer.getString("token")))
        {
            Bson filter = Filters.eq("name", answer.getString("pollName"));
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
        updateAnswerCollection();
    }

    public void deleteAllAnswers() {
        Document doc = new Document();
        this.answerCol.deleteMany(doc);
        updateAnswerCollection();
    }


    private void updateAnswerCollection()
    {
        this.answerCol = db.getCollection("Answers");
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


