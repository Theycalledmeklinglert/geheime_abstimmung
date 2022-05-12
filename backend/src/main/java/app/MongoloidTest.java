package main.java.app;

import static com.mongodb.client.model.Filters.eq;
import static main.java.app.database.DBInstance.getDBInstance;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import main.java.app.database.DBInstance;
import org.bson.BsonArray;
import org.bson.Document;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.DoubleConsumer;

public class MongoloidTest {

    public static void main(String[] args)
    {
    DBInstance INSTANCE = getDBInstance();

    INSTANCE.deleteAllUsers();
    INSTANCE.deleteAllPolls();

    Document doc = new Document().append("name", "Poll1").append("admin", "Blofeld");
    Document doc2 = new Document().append("name", "Poll2").append("admin", "Blofeld");
    Document doc3 = new Document().append("name", "Poll3").append("admin", "Blofeld");
    Document doc4 = new Document().append("name", "Poll4").append("admin", "Bond");
    INSTANCE.createPoll(doc);
    INSTANCE.createPoll(doc2);
    INSTANCE.createPoll(doc3);
    INSTANCE.createPoll(doc4);
        Optional<Document> optPoll = INSTANCE.getPollAsOptDocumentByName("Poll1");
    if(optPoll.isPresent())
    {
        System.out.println(optPoll.get().toJson());
        //  System.out.println(optPoll.get().getString("name"));
    }

        Document userDoc = new Document().append("name", "Blofeld").append("role", "admin");
        INSTANCE.createUser(userDoc);
        Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByName("User1");
        if(optUser.isPresent())
        {
            System.out.println(optUser.get().toJson());
            //  System.out.println(optPoll.get().getString("name"));
        }

        System.out.println();
        System.out.println();


        Optional<ArrayList<Document>> polls = INSTANCE.getAllPollsOfUser("Blofeld");
        if(polls.isPresent())
        {
            ArrayList<Document> list = polls.get();
            for(Document poll : list){
                System.out.println(poll.toJson());
            }
        }

        System.out.println();
        System.out.println();



        userDoc = new Document().append("name", "Bond").append("role", "admin");
        INSTANCE.createUser(userDoc);

        ArrayList<String> users = INSTANCE.getAllUserNames();

        for(String userName : users)
            {
                System.out.println(userName);
            }

        System.out.println();
        System.out.println();

        BasicDBObject tk1 = new BasicDBObject("val", "aaabbb");
        BasicDBObject tk2 = new BasicDBObject("val", "aaabbbccc");


        doc = new Document().append("name", "AnswerTestPoll").append("admin", "Blofeld");
        List<BasicDBObject> list = new ArrayList<>();
        list.add(tk1);
        list.add(tk2);
        doc.put("tokens", list);

        System.out.println(doc.toJson());
        INSTANCE.createPoll(doc);
        Document answer = new Document("pollName", "AnswerTestPoll").append("token", "aaabbb");
        Document answer2 = new Document("pollName", "AnswerTestPoll").append("token", "aaabbbccc");

        INSTANCE.createAnswer(answer);
        INSTANCE.createAnswer(answer2);

        INSTANCE.deleteAnswersOfPollByPollName("AnswerTestPoll");


        doc = new Document().append("name", "AnswerTestPoll2").append("admin", "Blofeld");
        Document answer3 = new Document("pollName", "AnswerTestPoll2").append("token", "MyToken");
        List<BasicDBObject> list2 = new ArrayList<>();
        BasicDBObject tk3 = new BasicDBObject("val", "MyToken");
        list2.add(tk3);
        doc.put("tokens", list2);
        INSTANCE.createPoll(doc);

        INSTANCE.createAnswer(answer3);





    /*
    DBCollection collection = database.getCollection("customers");
    BasicDBObject document = new BasicDBObject();
    document.put("name", "Shubham");
    document.put("company", "Baeldung");
    collection.insert(document);
     */



    }
}
