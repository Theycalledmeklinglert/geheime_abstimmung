package main.java.app.email;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Properties;

public class UserEmail {

    static String sender = "secret.vote.project@gmail.com";
    static String host = "smtp.gmail.com";

    public String generateTextMessage(String username, String password){

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

    }

    public String generateMessage(String surveyName){

        String message = "Sie wurden eingeladen an der Umfrage: " + surveyName +" teilzunehmen" ;

        return message;
    }

    public Session generateSession(){
        Properties properties = new Properties();

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

    public void sendMessage(String recipient, String generatedMessage){

        try {

            MimeMessage message = new MimeMessage(generateSession());
            message.setFrom(new InternetAddress(sender));

            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(recipient)
            );
            message.setSubject("This is the Subject Line!");
            message.setText(generatedMessage);

            BodyPart messageBodyPart = new MimeBodyPart();
            Multipart multipart = new MimeMultipart();

            messageBodyPart = new MimeBodyPart();
            String filename = generateTextMessage("blablacaodg@gmail.com", "1234");
            DataSource source = new FileDataSource(filename);
            messageBodyPart.setDataHandler(new DataHandler(source));
            messageBodyPart.setFileName(filename);
            multipart.addBodyPart(messageBodyPart);

            Transport.send(message);

            System.out.println("Done");
        }

        catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void distribute(ArrayList<String> recipients){
        recipients.forEach(n -> sendMessage(n, generateMessage("Fußball")));
    }

    public static void main(String[] args) {
        ArrayList<String> recipients = new ArrayList<>();

        recipients.add("tim.braunger@gmx.de");
        recipients.add("blablacaodg@gmail.com");

        UserEmail test = new UserEmail();

        test.distribute(recipients);

    }

}
