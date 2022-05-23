package main.java.app;

import main.java.app.database.DBInstance;
import org.bson.Document;

import javax.print.Doc;
import javax.swing.text.html.Option;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import java.util.ArrayList;
import org.apache.commons.codec.binary.Base64;

import java.util.Collection;
import java.util.Optional;

import static main.java.app.database.DBInstance.getDBInstance;

@Path( "polls" )
public class Service
{
	private final DBInstance INSTANCE = getDBInstance();

	@Context
	protected UriInfo uriInfo;


	@POST
	@Path("/connect")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
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


	@GET
	@Path("{pollID}")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSinglePollByUser(@DefaultValue("") @QueryParam("sessionID") final String sessID, @DefaultValue( "" ) @PathParam( "pollID" ) final String poll_id)
	{
		final Optional<Document> optPoll = INSTANCE.getPollAsOptDocumentByID(poll_id);
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build()); // 401 = Authentifizierung notwendig da SessID abgelaufen
																			 // Mit FrontEnd absprechen wie Weiterleitung AUF und NACH Login funktioniert
		}
		if(optPoll.isPresent())
		{
			Document poll = optPoll.get();
			poll.append("Session ID", optUser.get().getString("session ID"));	// Neue Session ID des Users wird mitgesendet und muss von FrontEnd ausgelesen und gespeichert werden

			// TODO: Decrypt JSON

			return Response.ok( poll ).build( );
		}

		// TODO: Decrypt JSON

		return Response.status(404).build();
	}


	@GET
	@Produces( MediaType.APPLICATION_JSON )
	public Response getAllPollsByUser(@DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);
		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		final Optional<ArrayList<Document>> optPolls = INSTANCE.getAllPollsOfUser(optUser.get().getString("name"));

		if(optPolls.isPresent())
		{
			Collection<Document> polls = optPolls.get();
			polls.add(new Document().append("Session ID", optUser.get().getString("Session ID")));	// s. getByID()
			// TODO: encrypt JSON

			return Response.ok( polls ).build( );
		}

		// TODO: encrypt JSON

		return Response.status(404).build();
	}


	@POST
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response createPoll(final String json, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		// TODO: Decrypt JSON

		// "accessible by" muss Array sein
		if(!json.contains("name") || !json.contains("accessible by") || !json.contains("created by") || !json.contains("tokens") || !json.contains("questions"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Document user = optUser.get();
		Document poll = Document.parse(json);
		poll.put("created by", user.getString("name"));
		poll.append("Session ID", user.getString("Session ID"));	// s. getByID()

		// TODO: encrypt JSON

		INSTANCE.createPoll(poll);
		return Response.ok(poll.toJson()).build(); 	//TODO: Checken ob der Muell funktioniert
	}




	// TODO: Check if PollToBeDeleted is accessible by user

	@DELETE
	@Produces( MediaType.APPLICATION_JSON )
	public Response deletePollByID(@DefaultValue("") @QueryParam("pollID")final String pollID, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		// TODO: Decrypt JSON

		Optional<Document> opt = this.INSTANCE.getPollAsOptDocumentByID(pollID);
		if(!opt.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}
		this.INSTANCE.deletePollByID(pollID);

		Document newSessID = new Document().append("Session ID", optUser.get().getString("Session ID"));

		// TODO: encrypt Response

		return Response.ok(newSessID).build();
	}

	@POST
	@Path("/users")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response createUser(final String json, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{

		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build()); // Session ID doesn't exist. User has to login on website again
		}

		// TODO: Decrypt JSON

		if(!json.contains("E-Mail") ||!json.contains("userName") || !json.contains("password") || !json.contains("role"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Document user = Document.parse(json);
		INSTANCE.createUser(user);
		user.append("Session ID", optUser.get().getString("SessionID"));

		// TODO: encrypt Response?

		return Response.ok(user).build();
	}

	// TODO: Change Username, change Password
	// TODO: Check if at least one sysAdmin exists


	@PUT
	@Path("/users")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response updateUser(final String json, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build()); // Session ID doesn't exist. User has to login on website again
		}

		// TODO: Decrypt JSON

		Document user = optUser.get();
		Document newUser = Document.parse(json);
		Optional<Document> existingOptUser = INSTANCE.getUserAsOptDocumentByName(newUser.getString("name"));

		Document existingUser = new Document();

		if(!existingOptUser.isPresent())
		{
			existingUser = user;
		}
		else
		{
			existingUser = existingOptUser.get();
		}

		if(!json.contains("password") || !json.contains("name"))	// || !existingUser.getString("name").equals(user.getString("name")
		{
			throw new WebApplicationException(Response.status(422).build());
		}

			// User with already existing name is the user that needs to be updated
			if(existingUser.getString("name").equals(user.getString("name")) && existingUser.getString("pwHash").equals(user.getString("pwHash")))
			{
				String userID = user.get("_id").toString();
				Document update = new Document("_id", user.get("_id")).append("name", newUser.getString("name")).append("role", user.getString("role"));
				update.append("salt", user.getString("salt")).append("pwHash", INSTANCE.generatePWHash(newUser.getString("password"), Base64.decodeBase64(user.getString("salt"))));

				INSTANCE.updateUserInPollCol(user.getString("name"), update.getString("name"));
				INSTANCE.updateUserInSessIDCol(user, update);		// TODO: pwHash wird nicht aktualisiert???
				INSTANCE.updateUserInUserCol(userID, update);

				// TODO: encrypt Response

				return Response.ok(new Document().append("Session ID", user.getString("Session ID")).toJson()).build();		// TODO: Test
			}
			System.out.println("UserName already exists");
			throw new WebApplicationException(Response.status(404).build());
	}


	@DELETE
	@Path("/users")
	@Produces( MediaType.APPLICATION_JSON )
	public Response deleteUser(@DefaultValue("") @QueryParam("userName") final String userToDeleteByName, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}
		Document user = optUser.get();

		if(userToDeleteByName.equals(user.getString("name")))
		{
			System.out.println("An User can not delete his own account");
			throw new WebApplicationException(Response.status(401).build());
		}

		if(!user.getString("role").equals("admin"))
		{
			System.out.println("User does not have the neccessary permissions to delete another user");
			throw new WebApplicationException(Response.status(401).build());
		}

		optUser = INSTANCE.getUserAsOptDocumentByName(userToDeleteByName);
		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		Document userToDelete = optUser.get();

		if(userToDelete.getString("role").equals("admin") && !INSTANCE.checkIfMoreThanOneAdminsExist())
		{
			System.out.println("Delete Request denied. At least one admin has to exist at all times");
			throw new WebApplicationException(Response.status(404).build());
		}

		INSTANCE.deleteUserByID(userToDelete.get("_id").toString());
		return Response.ok(new Document().append("Session ID", user.getString("Session ID")).toJson()).build();
	}


	// Session ID of user lasts for 60 Minutes
	@POST
	@Path("/session")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSessIDForUser(final String json)
	{

		// TODO: Decrypt JSON

		Document doc = Document.parse(json);
		String userName = doc.getString("userName");
		String password = doc.getString("password");

		final Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByName(userName);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		Document user = optUser.get();

		if(!INSTANCE.comparePWHash(user.getString("pwHash"), INSTANCE.generatePWHash(password, Base64.decodeBase64(user.getString("salt")))))
		{
			System.out.println("Incorrect Password");
			throw new WebApplicationException(Response.status(401).build());
		}

		INSTANCE.generateAndSetSessID(user);

		Document res = new Document().append("Session ID", user.getString("Session ID")).append("userName", user.getString(user.getString("userName")));
		String unencryptedJSON = res.toJson();

		// TODO: Encrypt JSON before sending back

		String encryptedJSON = "Placeholder";

		return Response.ok(unencryptedJSON).build();

	}

				// TODO: Poll_id and answerid per @Path Element
	@POST
	@Path("/answers")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response postAnswer(final String json)	// TODO: remove Session ID
	{

		// TODO: Decrypt JSON

		if(!json.contains("poll_id") || !json.contains("token") || !json.contains("question_id") || !json.contains("content"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Document answer = Document.parse(json);
		Optional<Document> poll = INSTANCE.getPollAsOptDocumentByID(answer.getString("poll_id"));

		if(!poll.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		// TODO: encrypt JSON

		if(!this.INSTANCE.createAnswer(answer))
		{
			throw new WebApplicationException(Response.status(404).build());
		}
		return Response.ok().build();
	}

	@DELETE
	@Path("/answers")
	@Produces( MediaType.APPLICATION_JSON )
	public Response deleteAllAnswersOfPollByID(@DefaultValue("") @QueryParam("pollID") final String pollID, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}
		Document user = optUser.get();

		optUser = INSTANCE.getPollAsOptDocumentByID(pollID);

		if(!optUser.isPresent())
		{
			System.out.println("Specified Poll does not exist");
			throw new WebApplicationException(Response.status(404).build());
		}

		INSTANCE.deleteAnswersOfPollByPollID(pollID);
		return Response.ok(new Document().append("Session ID", user.getString("Session ID")).toJson()).build();
	}

	// Diese Methode ist überflüssig oder? Da die Fragen schon im FrontEnd in den Poll embedded werden
	@POST
	@Path("/questions")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response createQuestion(final String json, @DefaultValue("") @QueryParam("pollID") final String pollID, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		// TODO: Decrypt JSON

		if(!json.contains("title") || !json.contains("description") || !json.contains("type") || !json.contains("poll_id"))	//TODO: Evtl. abaendern --> FrontEnd
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Document user = optUser.get();
		Document question = Document.parse(json);

		if(!this.INSTANCE.createQuestion(question))
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		// TODO: encrypt JSON

		return Response.ok(new Document().append("Session ID", user.getString("Session ID"))).build();
	}


	@GET
	@Path("/emails")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getAlreadyUsedEmails(@DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);
		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		ArrayList<String> emails = INSTANCE.getAllEmails();
		Document result = new Document().append("E-Mails", emails).append("Session ID", optUser.get().getString("Session ID"));

		// TODO: encrypt JSON

		return Response.ok( result.toJson() ).build( );
	}

	@POST
	@Path("/emails")
	@Produces( MediaType.APPLICATION_JSON )
	public Response postLastUsedEmails(@DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);
		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();

		//TODO




		return Response.ok(new Document("Session ID", user.getString("Session ID"))).build();

	}


}

