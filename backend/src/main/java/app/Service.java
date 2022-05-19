package main.java.app;

import main.java.app.database.DBInstance;
import org.bson.Document;

import javax.print.Doc;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import java.security.SecureRandom;
import java.util.ArrayList;
import org.apache.commons.codec.binary.Base64;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

import static main.java.app.database.DBInstance.getDBInstance;

@Path( "polls" )
public class Service
{
	private final DBInstance INSTANCE = getDBInstance();

	@Context
	protected UriInfo uriInfo;


	@GET
	@Path("{pollID}")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSinglePollByUser(@DefaultValue("") @QueryParam("SessionID") final String sessID, @DefaultValue( "" ) @PathParam( "pollID" ) final String poll_id)
	{
		final Optional<Document> optPoll = INSTANCE.getPollAsOptDocumentByID(poll_id);
		final Optional<Document> optUser = INSTANCE.getUserBySessionID(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build()); // 401 = Authentifizierung notwendig da SessID abgelaufen
																			 // Mit FrontEnd absprechen wie Weiterleitung AUF und NACH Login funktioniert
		}
		if(optPoll.isPresent())
		{
			Document poll = optPoll.get();
			return Response.ok( poll ).build( );
		}
		return Response.status(404).build();
	}


	@GET
	@Produces( MediaType.APPLICATION_JSON )
	public Response getPollsByUser(@DefaultValue("") @QueryParam("sessionID") final String sessID, @DefaultValue( "" ) @QueryParam( "userName" ) final String userName)
	{
		final Optional<ArrayList<Document>> optPolls = INSTANCE.getAllPollsOfUser(userName);

		if(optPolls.isPresent())
		{
			Collection<Document> polls = optPolls.get();
			return Response.ok( polls ).build( );
		}
		return Response.status(404).build();
	}




	// TODO: "Erste" GET Methode die UserName und PW-Hash nimmt, abgleicht und dann Session ID + AllPollsOfUser zuruecksendet


	@POST
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response createPoll(final String json, @DefaultValue("") @QueryParam("userName") final String userName, @DefaultValue("-1") @QueryParam("sessionID") final int sessID)
	{
		//TODO: Kommen der UserName und SessionID als QueryParam oder als PathParam?
		//TODO: Checks für UserName und SessionID einbauen
		//TODO: Ver-/ Entschluesselung implementieren

		if(!json.contains("name") || !json.contains("accessible by") || !json.contains("created by") || !json.contains("tokens"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Optional<Document> user = INSTANCE.getUserAsOptDocumentByName(userName);

		if(!user.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		Document userDoc = user.get();
		Document poll = Document.parse(json);
		poll.put("created by", userDoc.getString("name"));

		INSTANCE.createPoll(poll);
		return Response.ok(INSTANCE.getPollAsOptDocumentByID(poll.getString("_id")).get()).build(); 	//TODO: Checken ob der Muell funktioniert
	}

	@DELETE
	public Response deletePoll(@DefaultValue("") @QueryParam("pollName") final String pollToDelete)
	{
		Optional<Document> opt = this.INSTANCE.getPollAsOptDocumentByID(pollToDelete);
		if(!opt.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}
		this.INSTANCE.deletePollByName(pollToDelete);
		return Response.noContent().build();
	}

	/*

	@DELETE	//TODO
	public Response deleteUser(@DefaultValue("") @QueryParam("pollName") final String pollToDelete) {
	}


	 */



	@POST
	@Path("/user")
	@Consumes( MediaType.APPLICATION_JSON )
	public Response createUser(final String json,@DefaultValue("") @QueryParam("sessionID") final String sessID)
	{

		Optional<Document> opt = INSTANCE.getUserBySessionID(sessID);

		if(!opt.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build()); // Session ID doesn't exist. User has to login on website again
		}

		// TODO: Decrypt JSON

		if(!json.contains("userName") || !json.contains("password"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Document user = Document.parse(json);
		INSTANCE.createUser(user);

		Optional<Document> optRes = INSTANCE.getUserAsOptDocumentByName(user.getString("userName"));

		if(!optRes.isPresent())
		{
			throw new WebApplicationException(Response.status(500).build());
		}

		return Response.ok().build();
	}




	// Session ID of user lasts for 60 Minutes
	@GET
	@Path("/session")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSessIDForUser(final String json)
	{

		// TODO: Decryption

		Document doc = Document.parse(json);
		String userName = doc.getString("userName");
		String password = doc.getString("password");

		final Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByNameWithoutID(userName);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		Document user = optUser.get();

		if(!INSTANCE.comparePWHash(user.getString("pwHash"), INSTANCE.generatePWHash(password, Base64.decodeBase64(user.getString("salt")))))
		{
			System.out.println("Incorrect Password");
			throw new WebApplicationException(Response.status(404).build());
		}

		INSTANCE.generateAndSetSessID(user);

		Document res = new Document().append("Session ID", user.getString("Session ID"));
		String unencryptedJSON = res.toJson();

		// TODO: Encrypt JSON before sending back

		String encryptedJSON = "Placeholder";

		return Response.ok(encryptedJSON).build();

	}


	@POST
	@Path("/answer")
	@Consumes( MediaType.APPLICATION_JSON )
	public Response postAnswer(final String json)
	{

		// TODO: Decryption

		if(!json.contains("poll_id") || !json.contains("token"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Document answer = Document.parse(json);
		Optional<Document> poll = INSTANCE.getPollAsOptDocumentByID(answer.getString("poll_id"));

		if(!poll.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		this.INSTANCE.createAnswer(answer);
		return Response.ok().build();
	}


	@POST
	@Path("/connect")
	@Consumes( MediaType.APPLICATION_JSON )
	public Response postPublicKey(final String json)	// This method will be used to send exchange the public keys between client and server
	{

		Document doc = Document.parse(json);
		String publicKeyClient = doc.getString("Public Key");
		// TODO: Wo soll der PK gespeichert werden? Wie lange? Jede Anfrage neuer PK oder nur jede neue SessionID?
		// TODO: PK in SessID Col speichern?

		// TODO: Generate Public Key

		String publicKeyServer = "Placeholder";
		doc = new Document().append("Public Key", publicKeyServer);

		return Response.ok(doc).build();
	}








}

