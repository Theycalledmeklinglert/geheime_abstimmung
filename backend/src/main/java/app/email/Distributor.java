package main.java.app.email;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.*;

public class Distributor {

    static String sender = "secret.vote.project@gmail.com";
    static String host = "smtp.gmail.com";

    public String generateLink(){

        String link = "http://localhost:4200/survey?";
        String pollID = "3540";
        String token = "aaaccbb1";

        String finalLink = link + "token=" + token + "&pollID=" + pollID;

        return finalLink;
    }

    public String generateMessage(String surveyName, String link){

        String message = "Sie wurden eingeladen an der Umfrage: " + surveyName + " teilzunehmen" + "\n" + "\n" + "Link zur Umfrage: " + link;

        return message;
    }

    public Session generateSession(){
        Properties properties = System.getProperties();

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

        session.setDebug(true);

        return session;
    }

    public void sendMessage(String recipient, String outMessage){

        try {
            MimeMessage message = new MimeMessage(generateSession());
            message.setFrom(new InternetAddress(sender));

            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(recipient)
            );

            message.setSubject("This is the Subject Line!");
            message.setText(outMessage);
            Transport.send(message);

            System.out.println("Done");
        }

        catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void distribute(ArrayList<String> recipients){
        recipients.forEach(n -> sendMessage(n,generateMessage("Neues Sportzentrum", generateLink())));
    }




    public static void main(String[] args) {

        ArrayList<String> recipients = new ArrayList<>();

        recipients.add("tim.braunger@gmx.de");
        recipients.add("blablacaodg@gmail.com");

        Distributor test = new Distributor();

        test.distribute(recipients);

    }

}
