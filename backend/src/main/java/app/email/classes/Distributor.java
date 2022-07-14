package main.java.app.email.classes;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.*;




public class Distributor {

    static String sender = "secret.vote.project@gmail.com";
    static String host = "smtp.gmail.com";



    public String generateMessage(String pollName, String link){

        String deutsch = "Sie wurden eingeladen an der Umfrage: " + pollName +" teilzunehmen"
                + "\n" + "Der Link zur Teilnahme an der Umfrage ist: " + link;

        String Platzhalter = "\n" + "--------------------------------------------------------------------------------"
                +"\n";

        String english = " You were invited to take part in the survey about: " + pollName + "\n"
                + " The link for your participation for the survey is: " + link;

        String message = deutsch + Platzhalter + english;

        return message;
    }

    public Session generateSession(){



        /*Properties properties = System.getProperties();

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

        return session;*/

        GmailConnection sess = new GmailConnection();

        Session session = sess.generateSession();

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

            message.setSubject("Einladung zur Teilnahme an Umfrage / Invitation for participation in a poll");
            message.setText(outMessage);
            Transport.send(message);

            System.out.println("Done");
        }

        catch (MessagingException e) {
            e.printStackTrace();
        }
    }






    public void distribute(ArrayList<String[]> recipients, String surveyName){
        recipients.forEach(n -> sendMessage(n[0],generateMessage(surveyName, n[1])));
    }




    public static void main(String[] args) {

        ArrayList<String[]> recipients = new ArrayList<>();

        recipients.add(new String[]
                {"tim.braunger@gmx.de", "http://localhost:4200/"}
        );


        recipients.add(new String[]
                {"blablacaodg@gmail.com","http://localhost:4200/"}
        );

        Distributor test = new Distributor();

        test.distribute(recipients, "Placeholder");

    }

}
