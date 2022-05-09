package main.java.app.database;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.result.UpdateResult;
import com.sun.tools.javac.tree.DCTree;
import org.apache.commons.lang.StringUtils;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class DBInstance
{
        private static DBInstance INSTANCE;
        private static MongoClient client;
        private static MongoDatabase db;
        private static MongoCollection<Document> col;
        private static ArrayList<String> pollNames;

        public static MongoCollection<Document> getCollection( )
        {
                return col;
        }

        public static ArrayList<String> getPollNames( )
        {
            return pollNames;
        }

        public DBInstance getDBInstance() {
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
            col = db.getCollection("Polls");
            this.pollNames = new ArrayList<String>( );

            Bson projection = Projections.fields(Projections.include("name"), Projections.excludeId());
            Bson filter = Filters.empty();
            col.find(filter).projection(projection).forEach(doc -> pollNames.add(doc.getString("name")));

        }

        public void addNewPoll(Document poll) {
            // Note to self: addNewPoll calls addNewPollToPollNames later
        }


        public void addNewPollToPollNames(String name)
        {
            Bson projection = Projections.fields();
            Document doc = col.find(eq("name", name))
                    .projection(projection)
                    .first();

            if (doc == null)
            {
                System.out.println("Specified poll does not exist");
                return;
            }
            else
            {
                pollNames.add(doc.getString("name"));
            }
        }

        public Optional<Document> readByName(final String name )
        {
            if ( pollNames.contains(name) )
            {
                Bson projection = Projections.fields();
                Document doc = col.find(eq("name", name))
                        .projection(projection)
                        .first();

                return Optional.of(doc);
            }
            else
            {
                return Optional.empty( );
            }
        }

        public void update( final Document poll )
        {
            final String name = poll.getString("name");
            if ( pollNames.contains(name) ) {
                Bson projection = Projections.fields();
                Document doc = new Document().append("name", name);

                UpdateResult result = col.updateOne(doc, )

            }
        }

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
    }


