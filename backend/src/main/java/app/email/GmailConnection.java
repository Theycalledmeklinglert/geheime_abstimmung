package main.java.app.email;

import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import java.util.Properties;

public class GmailConnection {

    public String sender = "secret.vote.project@gmail.com";

    public String host = "smtp.gmail.com";

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
}
