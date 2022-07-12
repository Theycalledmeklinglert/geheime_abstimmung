package main.java.app.email.classes;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;




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



    public String generateMessage(String username, String password){

        String deutsch = "Hallo neuer Nutzer," + "\n" +
                "du wurdest soeben als ein neuer Nutzer der Poll Application festgelegt. " +
                "Deinen neuen Account kannst du unter folgendem link erreichen: " + "http://localhost:4200/" + "\n" + "\n" +

                "Deine Zugangsdaten sind: " +"\n" + "\n"+

                "Username: " + username + "\n"+
                "Passwort: " + password+ "\n" +"\n"+

                "Bitte ändere dein Passwort, wenn du dich zum ertsen mal in deinen Account einloggst. So ist dein Account " +
                "sicherer vor einem unbefugten Einloggen in dein Account.";

        String Platzhalter = "\n"+ "\n"

                + "--------------------------------------------------------------------------------" +

                "\n" + "\n";

        String english = "Hello new User,"+ "\n" +
                "You were registered as a new User for the Poll Application," +
                " you can now log in into your new account " +
                "with the following link: " + "http://localhost:4200/" + "\n" + "\n" +

                "For the first login your username and password are: "+ "\n"+ "\n"+

                "Username: " + username + "\n"+
                "Password: " + password+ "\n" +"\n"+

                "Please change your password after logging in the first time, so that your " +
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
            message.setSubject("User Anmeldung für Poll Application / User Registration of Poll Application");
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




    public void sendUserEmail(String recipient, String username, String password){

        sendMessage(recipient, generateMessage(username, password));

    }

    public static void main(String[] args) {

        /*ArrayList<String> recipients = new ArrayList<>();

        recipients.add("tim.braunger@gmx.de");
        recipients.add("blablacaodg@gmail.com");

         */

        String recipient = "tim.braunger@gmx.de";

        String username = "tim.braunger@gmx.de";

        String password = "Project420";

        UserEmail test = new UserEmail();

        test.sendUserEmail(recipient, username, password);

    }

}
