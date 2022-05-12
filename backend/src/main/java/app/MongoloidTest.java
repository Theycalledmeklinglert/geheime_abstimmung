package main.java.app;

import static com.mongodb.client.model.Filters.eq;
import static main.java.app.database.DBInstance.getDBInstance;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import main.java.app.database.DBInstance;
import org.bson.BsonArray;
import org.bson.Document;

import javax.print.Doc;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.DoubleConsumer;
import java.util.function.DoubleToIntFunction;

public class MongoloidTest {

    public static void main(String[] args)
    {
    DBInstance INSTANCE = getDBInstance();

    INSTANCE.deleteAllUsers();
    INSTANCE.deleteAllPolls();
    INSTANCE.deleteAllAnswers();
    // INSTANCE.deleteAllEmails();


    Document doc = new Document().append("name", "Poll1").append("created by", "Blofeld").append("accessible by", "Bond");;
    Document doc2 = new Document().append("name", "Poll2").append("created by", "adasdsa").append("accessible by", "Blofeld");
    Document doc3 = new Document().append("name", "Poll3").append("created by", "Bond").append("accessible by", "asdsadsad");
    Document doc4 = new Document().append("name", "Poll4").append("created by", "");
    ArrayList<String> l = new ArrayList<>();
    l.add("Bond");
    l.add("Blofeld");
    doc4.put("created by", l);



    INSTANCE.createPoll(doc);
    INSTANCE.createPoll(doc2);
    INSTANCE.createPoll(doc3);
    INSTANCE.createPoll(doc4);
        Optional<Document> optPoll = INSTANCE.getPollAsOptDocumentByName("Poll1");
    if(optPoll.isPresent())
    {
        System.out.println(optPoll.get().toJson());
        System.out.println(optPoll.get().getString("name"));
    }

        Document userDoc = new Document().append("name", "Blofeld").append("role", "admin");
        INSTANCE.createUser(userDoc);
        Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByName("User1");
        if(optUser.isPresent())
        {
            System.out.println(optUser.get().toJson());
            System.out.println(optPoll.get().getString("name"));
        }

        System.out.println();
        System.out.println();


        Optional<ArrayList<Document>> polls = INSTANCE.getAllPollsOfUser("Blofeld");
        if(polls.isPresent())
        {
            System.out.println("GetAllTest hier: ");
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



        doc = new Document().append("name", "AnswerTestPoll").append("admin", "Blofeld");
        String[] tokens = {"aaabbb", "aaabbbccc"};
        doc.put("tokens", Arrays.asList(tokens));

        List<BasicDBObject> adminsAndSupervisors = new ArrayList<>();
        doc.put("accessible by", Arrays.asList(new String[]{"Ernst Blofeld", "James Bondy", "Hier keonnte ihr Nutzername stehen!"}));


        System.out.println(doc.toJson());
        INSTANCE.createPoll(doc);
        Document answer = new Document("pollName", "AnswerTestPoll").append("token", "aaabbb");
        Document answer2 = new Document("pollName", "AnswerTestPoll").append("token", "aaabbbccc");

        INSTANCE.createAnswer(answer);
        INSTANCE.createAnswer(answer2);

        INSTANCE.deleteAnswersOfPollByPollName("AnswerTestPoll");


        doc = new Document().append("name", "AnswerTestPoll2").append("admin", "Blofeld");
        Document answer3 = new Document("pollName", "AnswerTestPoll2").append("token", "MyToken");
        doc.put("tokens", Arrays.asList(new String[]{"MyToken"}));
        INSTANCE.createPoll(doc);
        INSTANCE.createAnswer(answer3);


        ArrayList<Document> res = INSTANCE.getAllPollsOfUser("Ernst Blofeld").get();
        res.stream().forEach(poll -> System.out.println(poll.toJson()));

        Document newPoll = new Document("name", "newPoll").append("admin", "James Bond");
        newPoll.put("accessible by", Arrays.asList(new String[]{"Ernst Blofeld"}));
        INSTANCE.createPoll(newPoll);

        ArrayList<Document> list = new ArrayList<>();
        Document email = new Document("email", "test@test.com");
        list.add(email);
        email = new Document("email", "test@fhws.de");
        list.add(email);
        email = new Document("email", "test@gmail.com");
        list.add(email);
        INSTANCE.postLastUsedEmails(list);


        //doc = new Document("name", "Hi");
       // doc.put("name", "hello");
       // System.out.println(doc.toJson());

    /*
    DBCollection collection = database.getCollection("customers");
    BasicDBObject document = new BasicDBObject();
    document.put("name", "Shubham");
    document.put("company", "Baeldung");
    collection.insert(document);
     */



    }
}
