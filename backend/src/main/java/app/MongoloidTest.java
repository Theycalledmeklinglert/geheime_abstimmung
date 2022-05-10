package main.java.app;

import static com.mongodb.client.model.Filters.eq;
import static main.java.app.database.DBInstance.getDBInstance;

import main.java.app.database.DBInstance;
import org.bson.Document;

import java.util.Optional;

public class MongoloidTest {

    public static void main(String[] args)
    {
    DBInstance INSTANCE = getDBInstance();
    Document doc = new Document("_id", "1").append("name", "Poll1");
    INSTANCE.createPoll(doc);
    Optional<Document> optPoll = INSTANCE.getPollAsOptDocumentByName("Poll1");
    if(optPoll.isPresent())
    {
        System.out.println(optPoll.get().toJson());
        //  System.out.println(optPoll.get().getString("name"));
    }


        Document userDoc = new Document("_id", "1").append("name", "User1").append("role", "admin");
        INSTANCE.createUser(userDoc);
        Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByName("User1");
        if(optUser.isPresent())
        {
            System.out.println(optUser.get().toJson());
            //  System.out.println(optPoll.get().getString("name"));
        }


    /*
    DBCollection collection = database.getCollection("customers");
    BasicDBObject document = new BasicDBObject();
    document.put("name", "Shubham");
    document.put("company", "Baeldung");
    collection.insert(document);
     */



    }
}
