package main.java.app.emaildistributor;

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

    public void sendMessage(String recipient){
        try {
            MimeMessage message = new MimeMessage(generateSession());
            message.setFrom(new InternetAddress(sender));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(recipient)
            );
            message.setSubject("This is the Subject Line!");
            message.setText("Link for the vote");
            Transport.send(message);
            System.out.println("Done");
        }
        catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void distribute(ArrayList<String> recipients){
        recipients.forEach(n -> sendMessage(n));
    }

    // TODO: generateMessage Methode
    // TODO: generateLink Methode


    public static void main(String[] args) {
        ArrayList<String> recipients = new ArrayList<>();

        recipients.add("tim.braunger@gmx.de");
        recipients.add("blablacaodg@gmail.com");

        Distributor test = new Distributor();

        test.distribute(recipients);

    }

}
