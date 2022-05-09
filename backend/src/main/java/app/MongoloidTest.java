package main.java.app;

import com.mongodb.MongoException;
import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;
import main.java.app.database.DBInstance;
import org.bson.Document;
import org.bson.conversions.Bson;

public class MongoloidTest {

    public static void main(String[] args) {
    MongoClient client = MongoClients.create("mongodb+srv://sampleUser:GeheimeAbstimmung@cluster0.eobux.mongodb.net/DB?retryWrites=true&w=majority");

    MongoDatabase db = client.getDatabase("DB");

    MongoCollection<Document> col = db.getCollection("Polls");
    DBInstance dbInstance = new DBInstance();

        Bson projection = Projections.fields(Projections.include("name"), Projections.excludeId());
        Bson filter = Filters.empty();
        col.find(filter).projection(projection).forEach(doc -> polls.put(doc.getLong("_id"), doc.getString("name")));

      /*  Document doc = col.find(eq("_id", "0"))
                .projection(projectionFields)
                .first();

        if (doc == null)
        {
            System.out.println("No results found.");
        }
        else
        {
            System.out.println(doc.toJson());
        }

    */
    Document doc = new Document("_id", "6").append("name", "Oh the misery");
    col.insertOne(doc);
    client.close();

    /*
    DBCollection collection = database.getCollection("customers");
    BasicDBObject document = new BasicDBObject();
    document.put("name", "Shubham");
    document.put("company", "Baeldung");
    collection.insert(document);
     */



    }
}
