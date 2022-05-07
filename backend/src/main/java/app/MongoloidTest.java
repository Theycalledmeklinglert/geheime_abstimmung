package main.java.app;

import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class MongoloidTest {

    public static void main(String[] args) {
    MongoClient client = MongoClients.create("mongodb+srv://sampleUser:GeheimeAbstimmung@cluster0.eobux.mongodb.net/TestDB?retryWrites=true&w=majority");

    MongoDatabase db = client.getDatabase("TestDB");

    MongoCollection col = db.getCollection("TestProjects");

    Document doc = new Document("_id", "0").append("name", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
    col.insertOne(doc);

    client.close();

    }
}
