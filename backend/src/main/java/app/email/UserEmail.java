package main.java.app.email;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.ArrayList;




public class UserEmail {

    static String sender = "secret.vote.project@gmail.com";
    //static String host = "smtp.gmail.com";

   /* public String generateTextFile(String username, String password){

        String fileName = "userdata.txt";
        String encoding = "UTF-8";
        try{
            PrintWriter writer = new PrintWriter(fileName, encoding);
            writer.println("username: " + username);
            writer.println("password: " + password);
            writer.close();
        }
        catch (IOException e){
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
        return fileName;

    }*/


 // TODO: mit username und password verschicken
    public String generateMessage(String link){

        String deutsch = "Hallo neuer Nutzer," + "\n" + "du wurdest soeben als ein neuer Nutzer der Poll Application festgelegt." +
                "Deinen neuen Account kannst du unter folgendem link erreichen" + link + "\n" +
                "Bitte ändere dein Passwort, wenn du dich zum ertsen mal in deinen Account einloggst. So ist dein Account" +
                "sicherer vor unbefugten Einloggen in dein Account.";

        String Platzhalter = "\n" + "--------------------------------------------------------------------------------";

        String english = "Hello new User,"+ "\n" +"You were registered as a new User for the poll Application," +
                " you can now log in into your new account" +
                "with the following link" + link + "\n" + "Please change your password after logging in the first time, so that your " +
                "account is safe.";

        String message = deutsch + Platzhalter + english;

        return message;
    }

    public Session generateSession(){
       /* Properties properties = new Properties();

        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "465");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.socketFactory.port", "465");
        properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(sender, "Project420");
            }
        });

        session.setDebug(true);*/

        GmailConnection sess = new GmailConnection();

        Session session = sess.generateSession();

        return session;
    }

    public void sendMessage(String recipient, String generatedMessage){

        try {

            MimeMessage message = new MimeMessage(generateSession());
            message.setFrom(new InternetAddress(sender));

            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(recipient)
            );
            message.setSubject("User Anmeldung für Poll / User Registration of Poll");
            message.setText(generatedMessage);

            /*BodyPart messageBodyPart = new MimeBodyPart();
            Multipart multipart = new MimeMultipart();

            messageBodyPart = new MimeBodyPart();

            String filename = generateTextFile("testMail@gmail.com", "12345");
            DataSource source = new FileDataSource(filename);
            messageBodyPart.setDataHandler(new DataHandler(source));
            messageBodyPart.setFileName(filename);
            multipart.addBodyPart(messageBodyPart);*/

            Transport.send(message);

            System.out.println("Done");
        }

        catch (MessagingException e) {
            e.printStackTrace();
        }
    }
        //TODO Klasse anpassen du Suffkopf
    //TODO english Version


    public void distribute(ArrayList<String> recipients){
        recipients.forEach(n -> sendMessage(n, generateMessage(" am besten ein link")));
    }

    public static void main(String[] args) {
        ArrayList<String> recipients = new ArrayList<>();

        recipients.add("tim.braunger@gmx.de");
        recipients.add("blablacaodg@gmail.com");

        UserEmail test = new UserEmail();

        test.distribute(recipients);

    }

}
