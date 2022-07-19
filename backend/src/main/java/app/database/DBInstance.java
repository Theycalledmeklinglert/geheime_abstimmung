package main.java.app.database;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.*;
import com.mongodb.client.model.*;
import org.apache.commons.codec.binary.Base64;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.mongodb.client.model.Filters.*;

public class DBInstance {
    private static DBInstance INSTANCE;
    private static MongoClient client;
    private static MongoDatabase db;
    private static MongoCollection<Document> pollCol;
    private static MongoCollection<Document> userCol;
    private static MongoCollection<Document> answerCol;
    private static MongoCollection<Document> emailCol;
    private static MongoCollection<Document> sessIDCol;
    private static MongoCollection<Document> loginAttemptCol;

    private static ArrayList<String> userNames;

    public static MongoCollection<Document> getCollection() {
        return pollCol;
    }

    public static DBInstance getDBInstance() {
        if (INSTANCE == null) {
            return new DBInstance();
        } else {
            return INSTANCE;
        }
    }

    private DBInstance() {
        client = MongoClients.create("mongodb://localhost:27017");
       // client = MongoClients.create("mongodb+srv://sampleUser:GeheimeAbstimmung@cluster0.eobux.mongodb.net/TestDB?retryWrites=true&w=majority");
        db = client.getDatabase("DB");
        pollCol = db.getCollection("Polls");
        userCol = db.getCollection("Users");
        answerCol = db.getCollection("Answers");
        emailCol = db.getCollection("E-Mails");
        sessIDCol = db.getCollection("SessIDs");
        //  sessIDCol.dropIndex(Indexes.ascending("created at"));
        sessIDCol.createIndex(Indexes.ascending("created at"), new IndexOptions().expireAfter(60L, TimeUnit.MINUTES));
        loginAttemptCol = db.getCollection("LoginAttempts");

        Document initialUser = new Document("name", "initialUser")
                .append("email", "initialUser@mail.com")
                .append("password", "Geheime Abstimmung")
                .append("role", "admin");

        createUser(initialUser);
    }

    public Optional<Document> getPollAsOptDocumentByID(final String id) {
        Document doc = null;

        doc = pollCol.find(eq("_id", new ObjectId(id)))
                .projection(Projections.fields())
                .first();

        if (doc == null) {
            return Optional.empty();
        } else return Optional.of(doc);
    }

    public boolean createPoll(Document poll) {
        pollCol.insertOne(poll);
        Document answers = new Document("poll_id", poll.get("_id").toString()).append("answers", new ArrayList<Document>());
        answerCol.insertOne(answers);
        return true;
    }

    public void removeEmailsFromPoll(Document poll) {
        Bson query = Filters.eq("_id", poll.get("_id"));
        Bson update = Updates.unset("emails");
        pollCol.updateOne(query, update);
    }


    public void deletePollByID(String id) {
        Bson query = eq("_id", new ObjectId(id));
        pollCol.deleteOne(query);
    }

    public void deleteAllPolls() {
        pollCol.deleteMany(new Document());
    }

    public Optional<Document> getUserAsOptDocumentByName(final String name) {
        Optional<Document> optDoc = getSingleDocFromCollection(userCol, Projections.fields(Projections.fields()), "name", name);
        return optDoc;
    }

    public Optional<Document> getUserAsOptDocumentByEmail(final String email) {
        Optional<Document> optDoc = getSingleDocFromCollection(userCol, Projections.fields(Projections.fields()), "email", email);
        return optDoc;
    }

    public Optional<Document> getUserAsOptDocumentByID(final long id) {
        Optional<Document> optDoc = getSingleDocFromCollection(userCol, Projections.fields(), "_id", Long.toString(id));
        return optDoc;
    }


    public Optional<ArrayList<Document>> getAllPollsOfUser(final String userName) {
        MongoCursor<Document> cursor = pollCol.find(or(eq("created by", userName)))
                .projection(Projections.fields())
                .cursor();

        ArrayList<Document> polls = new ArrayList<>();
        while (cursor.hasNext()) {
            Document poll = cursor.next();
            String id = poll.get("_id").toString();
            poll.append("_id", id);
            polls.add(poll);
        }

        return Optional.of(polls);
    }

    // returns all registered users
    public ArrayList<Document> getAllUsers() {
        ArrayList<Document> users = new ArrayList<>();
        Bson projection = Projections.fields(Projections.exclude("_id"), Projections.exclude("pwHash"), Projections.exclude("salt"));
        MongoCursor<Document> cursor = userCol.find().projection(projection).cursor();

        while (cursor.hasNext()) {
            users.add(cursor.next());
        }
        return users;
    }

    public boolean createUser(Document user) {

        String name = user.getString("name");
        String email = user.getString("email");

        if (checkUserNameExistence(name) || checkEmailExistence(email)) {
        //    System.out.println("User with identical name/email already exists. You have to choose a different Username");
            return false;
        } else {

            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            random.nextBytes(salt);

            String pwHash = generatePWHash(user.getString("password"), salt);

            String saltString = Base64.encodeBase64String(salt);

            user.put("salt", saltString);
            user.put("pwHash", pwHash);

            userCol.insertOne(user);

            Bson query = Filters.eq("name", name);
            Bson update = Updates.unset("password");
            userCol.updateOne(query, update);

            return true;
        }
    }

    public boolean checkUserNameExistence(String name) {
        return getUserAsOptDocumentByName(name).isPresent();
    }

    public boolean checkEmailExistence(String email) {
        return getSingleDocFromCollection(userCol, Projections.fields(), "email", email).isPresent();
    }

    public void updateUserInUserCol(String originalUserID, Document updatedInfo) {
        Bson filter = Filters.eq("_id", new ObjectId(originalUserID));
        BasicDBObject update = new BasicDBObject("$set", updatedInfo);
        userCol.updateOne(filter, update);
    }

    public void updateUserInPollCol(String originalUserName, String newUserName) {
        Bson filter = Filters.eq("created by", originalUserName);
        BasicDBObject update = new BasicDBObject("$set", new Document("created by", newUserName));
        pollCol.updateMany(filter, update);

    }

    public void updateUserInSessIDCol(Document originalUser, Document updatedInfo) {
        Bson filter = Filters.eq("name", originalUser.getString("name"));
        BasicDBObject updateName = new BasicDBObject("$set", new Document("name", updatedInfo.getString("name")));
        sessIDCol.updateOne(filter, updateName);

        filter = Filters.eq("pwHash", originalUser.getString("pwHash"));
        BasicDBObject updatePWHash = new BasicDBObject("$set", new Document("pwHash", updatedInfo.getString("pwHash")));
        sessIDCol.updateOne(filter, updatePWHash);
    }

    public void removeFieldFromUserInUserCol(String userID, Document fieldToBeDeleted) {
        Bson filter = Filters.eq("_id", new ObjectId(userID));
        BasicDBObject update = new BasicDBObject("$unset", fieldToBeDeleted);
        userCol.updateOne(filter, update);
    }

    public void updateKeysInSessIDCol(String sessID, String publicKeyClient, String privateKeyServer) {
        BasicDBObject query = new BasicDBObject("Session ID", sessID);
        BasicDBObject items = new BasicDBObject("Public Key Client", publicKeyClient).append("Private Key Server", privateKeyServer);
        BasicDBObject update = new BasicDBObject("$set", items);
        sessIDCol.updateOne(query, update);
    }

    public void deleteUserByID(String id) {
        Bson query = Filters.eq("_id", new ObjectId(id));
        userCol.deleteOne(query);
    }

    public void deleteAllUsers() {
        userCol.deleteMany(new Document());
        userNames = new ArrayList<>();
    }

    public boolean checkIfMoreThanOneAdminsExist() {
        MongoCursor<Document> cursor = userCol.find(eq("role", "admin"))
                .projection(Projections.fields())
                .cursor();

        ArrayList<Document> admins = new ArrayList<>();
        while (cursor.hasNext()) {
            Document poll = cursor.next();
            admins.add(poll);
        }
        return admins.size() > 1;
    }


    private Optional<Document> getSingleDocFromCollection(MongoCollection<Document> col, Bson projection, String attributeName, String attributeVal) {
        Document doc = col.find(eq(attributeName, attributeVal))
                .projection(projection)
                .first();

        if (doc == null) {
            return Optional.empty();
        } else {
            return Optional.of(doc);
        }
    }

    public Optional<Document> getAnswersOfPollByID(final String pollID) {
        Document answers = answerCol.find(eq("poll_id", pollID))
                .projection(Projections.excludeId())
                .first();

        if (answers == null) {
            return Optional.empty();
        } else {
            return Optional.of(answers);
        }
    }


    public boolean createAnswer(Document answer, String pollID, String token) {
        Optional<Document> optPoll = getPollAsOptDocumentByID(pollID);

        if (!optPoll.isPresent()) {
            System.out.println("This answer does not belong to an exisitng poll");
            return false;
        }

        Document poll = optPoll.get();
        ArrayList<String> tokens = (ArrayList<String>) poll.get("tokens");

        answer.append("token", token);

        if (tokens.contains(token)) {
            Bson filter = Filters.eq("_id", new ObjectId(pollID));
            Bson delete = Updates.pull("tokens", token);
            pollCol.updateOne(filter, delete);

            filter = Filters.eq("poll_id", pollID);
            BasicDBObject listItem = new BasicDBObject("answers", answer);
            Bson pushToQuestList = new BasicDBObject("$push", listItem);

            answerCol.updateOne(filter, pushToQuestList);
            return true;
        } else {
            System.out.println("Answer does not contain a valid token. Answer will not be posted");
            return false;
        }
    }


    public void deleteAnswersOfPollByPollID(String pollID) {
        Bson query = eq("poll_id", pollID);
        answerCol.deleteMany(query);
    }

    public void deleteAllAnswers() {
        Document doc = new Document();
        answerCol.deleteMany(doc);
    }

    public void saveLastUsedEmails(List<String> emails, String userEmail) {
        deleteLastUsedEmailsOfUser(userEmail);
        Document newEmails = new Document("E-Mails", emails).append("created by", userEmail);
        emailCol.insertOne(newEmails);
    }

    public void deleteLastUsedEmailsOfUser(String userEmail) {
        emailCol.deleteMany(Filters.eq("created by", userEmail));
    }

    public ArrayList<String> getLastUsedEmailsOfUser(String userEmail) {
       Document doc = emailCol.find(Filters.eq("created by", userEmail)).projection(Projections.fields()).first();
       return (ArrayList<String>) doc.get("E-Mails");
    }

    public boolean createQuestion(Document question) {

        Optional<Document> optPoll = getPollAsOptDocumentByID(question.getString("poll_id"));

        if (!optPoll.isPresent()) {
            System.out.println("This answer does not belong to an exisitng poll");
            return false;
        }

        Bson filter = Filters.eq("_id", new ObjectId(question.getString("poll_id")));
        DBObject listItem = new BasicDBObject("questions", question);
        Bson pushToQuestList = new BasicDBObject("$push", listItem);

        pollCol.updateOne(filter, pushToQuestList);
        return true;
    }


    public Optional<Document> authenticate(final String sessID) {
        final Optional<Document> optUser = getUserBySessionID(sessID);

        if (!optUser.isPresent()) {
            return Optional.empty();
        }
        Document user = optUser.get();
        generateAndSetSessID(user);
        return Optional.of(user);
    }


    public String generateAndSetSessID(Document user) {

        if (checkIfUserHasSessID(user)) {
            sessIDCol.deleteMany(eq("email", user.getString("email")));
        }


        String sessID = String.valueOf(System.currentTimeMillis()).substring(8, 13) + UUID.randomUUID().toString().substring(1, 10);
        user.append("created at", new Date());
        user.append("Session ID", sessID);

        sessIDCol.insertOne(user);
        return sessID;

    }

    public Optional<Document> getUserBySessionID(final String sessID) {
        Document doc = sessIDCol.find(eq("Session ID", sessID))
                .projection(Projections.fields())
                .first();

        if (doc == null) {
            return Optional.empty();
        } else {
            return Optional.of(doc);
        }
    }

    private boolean checkIfUserHasSessID(Document user) {
        Optional<Document> optDoc = getSingleDocFromCollection(sessIDCol, Projections.fields(), "email", user.getString("email"));
        return optDoc.isPresent();
    }

    // Hashing Algorith used: PBKDF2
    public String generatePWHash(final String pw, byte[] salt)    // returns hashedPW
    {
        try {

            KeySpec spec = new PBEKeySpec(pw.toCharArray(), salt, 65536, 128);
            SecretKeyFactory factory = null;

            factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");

            byte[] hash = factory.generateSecret(spec).getEncoded();
            return Base64.encodeBase64String(hash);
        } catch (NoSuchAlgorithmException e) {
            System.out.println("Hashing failed");
            throw new RuntimeException(e);
        } catch (InvalidKeySpecException e) {
            System.out.println("Hashing failed");
            throw new RuntimeException(e);
        }
    }

    public boolean comparePWHash(String hashInDB, String givenHash) {
        return hashInDB.equals(givenHash);
    }

    public ArrayList<String> generateTokensOfPoll(int size) {
        ArrayList<String> tokens = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            String token = String.valueOf(System.currentTimeMillis()).substring(8, 13) + UUID.randomUUID().toString().substring(1, 10);
            tokens.add(token);
        //    System.out.println("http://localhost:4200/survey?token=" + token + "&pollID=");
        }

        return tokens;
    }

    public long checkForTimeOut(String email) {
        Document log = loginAttemptCol.find(eq("email", email)).projection(Projections.fields()).first();
        Calendar now = Calendar.getInstance();

        if (log != null)
        {
            int currAttempt = log.getInteger("attempts");
            Calendar newTimeout = Calendar.getInstance();

            long diff = log.getDate("Timeout until").getTime() - now.getTimeInMillis();
            if (diff >= 0)                                                                                    // if a Timeout is still active
            {
                return TimeUnit.MILLISECONDS.toMinutes(diff) + 1;                                             // TimeUnit.MILLISECONDS.toMinutes automatically return cuts away a minute

            } else if (currAttempt == 5)                                                          // check if this is the first Timeout
            {
                newTimeout.add(Calendar.MINUTE, 2);
                log.put("Timeout until", newTimeout.getTime());
                log.put("created at", now.getTime());
                log.put("attempts", 0);
                loginAttemptCol.replaceOne(Filters.eq("email", email), log);

                return 2;
            } else                                                                                     // if Timeout is already 24 hours it's set to now + 24 hours instead
            {
                return 0;
            }
        }
        return 0;
    }


    public int addLoginAttempt(String email) {
        Document log = loginAttemptCol.find(eq("email", email)).projection(Projections.fields()).first();

        if (log == null) {
            logFirstFailedLogin(email);
            return 1;
        }

        int currAttempt = log.getInteger("attempts") + 1;
        log.put("attempts", currAttempt);

        loginAttemptCol.replaceOne(Filters.eq("_id", log.getObjectId("_id")), log);
        return currAttempt;
    }

    public void removeFailedLoginHistory(String email) {
        loginAttemptCol.deleteOne(Filters.eq("email", email));
    }

    private void logFirstFailedLogin(String email) {
        Calendar now = Calendar.getInstance();
        Date created = now.getTime();
        Date TimeoutUntil = now.getTime();

        Document newLog = new Document("email", email).append("attempts", 1).append("created at", created).append("Timeout until", TimeoutUntil);
        loginAttemptCol.insertOne(newLog);
    }

    public static boolean checkIfUserWantsToChangePW(Document existingUser, Document newUser)
    {
        return (existingUser.getString("name").equals(newUser.getString("name")) && !existingUser.getString("pwHash").equals(newUser.getString("pwHash")));
    }

    public static boolean checkIfUserWantsToChangeUserName(Document existingUser, Document newUser, String newUserPWHash)
    {
        return (!existingUser.getString("name").equals(newUser.getString("name")) && existingUser.getString("pwHash").equals(newUserPWHash));
    }

}


