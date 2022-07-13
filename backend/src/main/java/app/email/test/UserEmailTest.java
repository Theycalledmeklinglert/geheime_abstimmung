package main.java.app.email.test;


import main.java.app.email.classes.UserEmail;
import org.junit.Assert;
import org.junit.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;


public class UserEmailTest {


    @Test
    public void generateMessageTest() throws IOException{

        UserEmail mail = new UserEmail();

        String username = "ProjectTest";
        String password = "Project2022";

        Assert.assertTrue(mail.generateMessage(username, password).contains(username));

        Assert.assertTrue(mail.generateMessage(username, password).contains(password));

    }


    @Test
    public void sendMessageTest() {

        UserEmail mail = new UserEmail();
        final ByteArrayOutputStream outputStreamCaptor = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outputStreamCaptor));

        String recipient = "blablacaodg@gmail.com";

        mail.sendMessage(recipient, mail.generateMessage("Project", "Project2022"));

        Assert.assertTrue( outputStreamCaptor.toString()
                .trim().contains("Done"));


    }






}
