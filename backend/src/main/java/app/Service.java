package main.java.app;

import main.java.app.database.DBInstance;
import org.bson.Document;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import java.util.ArrayList;
import org.apache.commons.codec.binary.Base64;

import java.util.HashMap;
import java.util.Map;
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
		// TODO: Wo soll der PK gespeichert werden? Wie lange? Jede Anfrage neuer PK oder nur jede Anfrage neue SessionID?
		// TODO: PK in SessID Col Dokument speichern?

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

		Document user = optUser.get();

		if(optPoll.isPresent())
		{
			Document poll = optPoll.get();
			poll.append("Session ID", user.getString("session ID"));	// Neue Session ID des Users wird mitgesendet und muss von FrontEnd ausgelesen und gespeichert werden

			// TODO: Decrypt JSON

			return Response.ok( poll ).build( );
		}

		// TODO: Decrypt JSON

		Document error = new Document("Session ID", user.getString("Session ID"));
		return Response.status(404).entity(error.toJson()).build();
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

		Document user = optUser.get();
		final Optional<ArrayList<Document>> optPolls = INSTANCE.getAllPollsOfUser(user.getString("name"));

		if(optPolls.isPresent())
		{
			ArrayList<Document> polls = optPolls.get();
			Document res = new Document("polls", polls).append("Session ID", user.getString("Session ID"));
			// TODO: encrypt JSON

			return Response.ok( res ).build( );
		}

		// TODO: encrypt JSON

		Document error = new Document("Session ID", user.getString("Session ID"));
		return Response.status(404).entity(error.toJson()).build();
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

		Document user = optUser.get();
		// TODO: Decrypt JSON

		// "accessible by" muss Array sein
		if(!json.contains("name") || !json.contains("accessible by") || !json.contains("created by") || !json.contains("questions") || !json.contains("emails"))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}

		Document poll = Document.parse(json);
		poll.put("created by", user.getString("name"));
		poll.append("Session ID", user.getString("Session ID"));	// s. getByID()

		ArrayList<String> emails = (ArrayList<String>) poll.get("emails");
		INSTANCE.saveLastUsedEmails(emails);

		ArrayList<String> tokens = INSTANCE.generateTokensOfPoll(emails.size());
		poll.append("tokens", tokens);
		INSTANCE.createPoll(poll);

		Map<String, String> emailsAndTokens = new HashMap<>();

		for(String email : emails)
		{
			emailsAndTokens.put(email, tokens.get(0));
			tokens.remove(0);
		}

		// TODO: Call corresponding method of the the distributor class to generate and send the links with


		// TODO: encrypt JSON

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

		Document user = optUser.get();

		Optional<Document> opt = this.INSTANCE.getPollAsOptDocumentByID(pollID);

		if(!opt.isPresent())
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(404).entity(error.toJson()).build();
		}

		this.INSTANCE.deletePollByID(pollID);

		Document newSessID = new Document().append("Session ID", user.getString("Session ID"));

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
		Document newUser = Document.parse(json);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());  	// Session ID doesn't exist
		}

		Document user = optUser.get();

		if((newUser.getString("role").equals("admin") && !user.getString("role").equals("admin")))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(401).entity(error.toJson()).build();
		}

		// TODO: Decrypt JSON

		if(!json.contains("email") ||!json.contains("name") || !json.contains("password") || !json.contains("role"))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}


		if(!INSTANCE.createUser(newUser))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(500).entity(error.toJson()).build();
		}

		newUser.append("Session ID", user.getString("Session ID")).append("_id", newUser.get("_id").toString());

		// TODO: encrypt Response?

		return Response.ok(newUser).build();
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
		String newUserPWHash = INSTANCE.generatePWHash(newUser.getString("password"), Base64.decodeBase64(user.getString("salt")));
		Document existingUser = user;

		if(!json.contains("password") || !json.contains("name"))	// || !existingUser.getString("name").equals(user.getString("name")
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}

			// User with already existing name is the user that needs to be updated
		if((existingUser.getString("name").equals(newUser.getString("name")) && !existingUser.getString("pwHash").equals(newUser.getString("pwHash"))) || (!existingUser.getString("name").equals(newUser.getString("name")) && existingUser.getString("pwHash").equals(newUserPWHash)))
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

		System.out.println("Either UserName already exists or you attempted to change userName and PW at the same time which is not allowed");
		Document error = new Document("Session ID", user.getString("Session ID"));
		return Response.status(404).entity(error.toJson()).build();
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
		String newSessID = user.getString("Session ID");

		if(userToDeleteByName.equals(user.getString("name")))
		{
			System.out.println("An User can not delete his own account");
			Document error = new Document("Session ID", newSessID);
			return Response.status(401).entity(error.toJson()).build();
		}

		if(!user.getString("role").equals("admin"))
		{
			System.out.println("User does not have the neccessary permissions to delete another user");
			Document error = new Document("Session ID", newSessID);
			return Response.status(401).entity(error.toJson()).build();
		}

		optUser = INSTANCE.getUserAsOptDocumentByName(userToDeleteByName);

		if(!optUser.isPresent())
		{
			Document error = new Document("Session ID", newSessID);
			return Response.status(404).entity(error.toJson()).build();
		}

		Document userToDelete = optUser.get();

		if(userToDelete.getString("role").equals("admin") && !INSTANCE.checkIfMoreThanOneAdminsExist())
		{
			System.out.println("Delete Request denied. At least one admin has to exist at all times");
			Document error = new Document("Session ID", newSessID);
			return Response.status(404).entity(error.toJson()).build();
		}

		INSTANCE.deleteUserByID(userToDelete.get("_id").toString());
		return Response.ok(new Document().append("Session ID", newSessID).toJson()).build();
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
		String email = doc.getString("email");
		String password = doc.getString("password");

		final Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByEmail(email);

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

		Document res = new Document().append("Session ID", user.getString("Session ID")).append("userName", user.getString("name"));
		String unencryptedJSON = res.toJson();

		// TODO: Encrypt JSON before sending back

		String encryptedJSON = "Placeholder";

		return Response.ok(unencryptedJSON).build();

	}

	@GET
	@Path ("/answers")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getALlAnswersOfPoll(@DefaultValue("") @QueryParam("sessionID") final String sessID, @DefaultValue("") @QueryParam("pollID") final String pollID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();
		final Optional<Document> optAnswers = INSTANCE.getAnswersOfPollByID(pollID);

		if(!optAnswers.isPresent())
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(404).entity(error.toJson()).build();
		}

		Document answers = optAnswers.get();
		answers.append("Session ID", user.getString("Session ID"));

		// TODO: encrypt JSON

		return Response.ok( answers ).build( );
	}


	@POST
	@Path("/answers")
	@Consumes( MediaType.APPLICATION_JSON )
	public Response postAnswer(final String json, @DefaultValue("") @QueryParam("pollID") final String pollID, @DefaultValue("") @QueryParam("token") final String token)
	{

		// TODO: Decrypt JSON

		if(!json.contains("poll_id") || !json.contains("token") || !json.contains("question_id"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		Document answer = Document.parse(json);
		Optional<Document> poll = INSTANCE.getPollAsOptDocumentByID(answer.getString("pollID"));

		if(!poll.isPresent() || !this.INSTANCE.createAnswer(answer))
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		// TODO: encrypt JSON

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
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(404).entity(error.toJson()).build();
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

		Document user = optUser.get();
		// TODO: Decrypt JSON

		if(!json.contains("title") || !json.contains("description") || !json.contains("type") || !json.contains("poll ID"))	//TODO: Evtl. abaendern --> FrontEnd
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}

		Document question = Document.parse(json);

		if(!this.INSTANCE.createQuestion(question))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(404).entity(error.toJson()).build();
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
	public Response saveLastUsedEmails(final String json, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();

		if(!json.contains("emails"))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}

		Document emails = Document.parse(json);
		INSTANCE.saveLastUsedEmails( (ArrayList<String>) emails.get("emails"));

		return Response.ok(new Document("Session ID", user.getString("Session ID"))).build();

	}

}

