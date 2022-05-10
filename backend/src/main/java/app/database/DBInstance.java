package main.java.app.database;

import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;

public class DBInstance
{
        private static DBInstance INSTANCE;
        private static MongoClient client;
        private static MongoDatabase db;
        private static MongoCollection<Document> pollCol;
        private static MongoCollection<Document> userCol;

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
            client = MongoClients.create("mongodb+srv://sampleUser:GeheimeAbstimmung@cluster0.eobux.mongodb.net/TestDB?retryWrites=true&w=majority");
            db = client.getDatabase("DB");
            pollCol = db.getCollection("Polls");
            userCol = db.getCollection("Users");
            this.pollNames = new ArrayList<String>( );
            this.userNames = new ArrayList<String>( );
            initializePollNameCol();
            initializeUserNameCol();
        }

        private void initializePollNameCol()
        {
            Bson projection = Projections.fields(Projections.include("name"), Projections.excludeId());
            Bson filter = Filters.empty();
            pollCol.find(filter).projection(projection).forEach(doc -> pollNames.add(doc.getString("name")));
        }

    private void initializeUserNameCol()
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


    private void updatePollCollection()
    {
        this.pollCol = db.getCollection("Polls");
    }

    // This method also returns the username + password hash
    public Optional<Document> getUserAsOptDocumentByName(final String name)
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

    // This method simply returns all registered usernames
    public ArrayList<String> getAllUserNames(final String name)
    {
        ArrayList<String> users = new ArrayList<>();

        // TODO: Check if cast works correctly
        FindIterable<Document> iterDoc = userCol.find();
        Iterator it = iterDoc.iterator();

        while (it.hasNext()) {
            Document userDoc = (Document) it.next();
            users.add(userDoc.getString("name"));
        }
        this.userNames = users;
        return userNames;
    }

        public Optional<ArrayList<Document>> getAllPollsOfUser(final String userName)
        {
            Bson projection = Projections.fields(Projections.excludeId());
            FindIterable<Document> iterDoc = pollCol.find(eq("admin", userName))
                    .projection(projection);

            Iterator it = iterDoc.iterator();
            ArrayList<Document> polls = new ArrayList<>();

            while(it.hasNext())
            {
                Document poll = (Document) it.next();
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
            System.out.println("User with identical name already exists. You have to choose a different Username");
            return false;
        }
        else
        {
            userCol.insertOne(user);
            addNewUserToUserNames(name);
            return true;
        }
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


