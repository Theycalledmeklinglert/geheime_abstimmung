package main.java.app.email.test;

import main.java.app.email.classes.Distributor;
import org.junit.Assert;
import org.junit.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;

public class DistributorTest {

    @Test
    public void generateMessageTest() throws IOException {

        Distributor distributor = new Distributor();

        String pollName = "ProjectTest";
        String link = "http://localhost:4200/";

        Assert.assertTrue(distributor.generateMessage(pollName, link).contains(pollName));

        Assert.assertTrue(distributor.generateMessage(pollName, link).contains(link));

    }


    @Test
    public void sendMessageTest() {

        Distributor distributor = new Distributor();

        final ByteArrayOutputStream outputStreamCaptor = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outputStreamCaptor));

        String recipient = "blablacaodg@gmail.com";

        distributor.sendMessage(recipient, distributor.generateMessage("Project", "http://localhost:4200/"));

        Assert.assertTrue( outputStreamCaptor.toString()
                .trim().contains("Done"));


    }
}
