package main.java.app.email.test;


import main.java.app.email.classes.UserEmail;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;



public class UserEmailTest {


    @Test
    public void generateMessageTest() throws IOException{
        UserEmail mail = new UserEmail();

        String username = "ProjectTest";
        String password = "Project2022";

        Assert.assertTrue(mail.generateMessage(username, password).contains(username));

        Assert.assertTrue(mail.generateMessage(username, password).contains(password));

    }




}
