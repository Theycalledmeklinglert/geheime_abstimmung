package main.java.app;

import main.java.app.database.DBInstance;
import main.java.app.email.classes.Distributor;
import main.java.app.email.classes.UserEmail;
import org.bson.Document;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import java.util.*;

import org.apache.commons.codec.binary.Base64;

import static main.java.app.database.DBInstance.*;

@Path( "polls" )
public class Service
{
	private final DBInstance INSTANCE = getDBInstance();

	@Context
	protected UriInfo uriInfo;

	@GET
	@Path("{pollID}")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSinglePollByUser(@DefaultValue("") @QueryParam("sessionID") final String sessID, @DefaultValue("") @PathParam("pollID") final String poll_id)
	{
		final Optional<Document> optPoll = INSTANCE.getPollAsOptDocumentByID(poll_id);
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();

		if(optPoll.isPresent())
		{
			Document poll = optPoll.get();
			poll.append("Session ID", user.getString("session ID"));

			return Response.ok( poll ).build( );
		}

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

			return Response.ok( res ).build( );
		}

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

		if(!json.contains("name")  || !json.contains("questions") || !json.contains("emails") || !json.contains("publicKey"))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}

		Document poll = Document.parse(json);
		poll.put("created by", user.getString("name"));

		ArrayList<String> emails = (ArrayList<String>) poll.get("emails");

		INSTANCE.saveLastUsedEmails(emails, user.getString("email"));

		ArrayList<String> tokens = INSTANCE.generateTokensOfPoll(emails.size());
		poll.append("tokens", tokens);

		INSTANCE.createPoll(poll);

		ArrayList<String[]> emailsAndLinks = new ArrayList<>();
		String baseUri = "http://localhost:4200/survey";		// TODO: BASE URI HAS TO BE CHANGED TO ACTUAL WEBSITE URI BEFORE RELEASE!!!!!!!!!!!!

		int counter = 0;
		for(String email : emails)
		{
			String answerLink = baseUri + "?pollID=" + poll.get("_id").toString() + "&token=" + tokens.get(counter);
			emailsAndLinks.add(new String[] {emails.get(counter), answerLink});
			counter++;
		}

		Distributor distributor = new Distributor();
		distributor.distribute(emailsAndLinks, poll.getString("name"));

		INSTANCE.removeEmailsFromPoll(poll);

		return Response.ok(new Document("Session ID", user.getString("Session ID")).toJson()).build();
	}

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

		return Response.ok(newSessID).build();
	}


	@GET
	@Path("/users")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getAllUsers(@DefaultValue("") @QueryParam("sessionID") final String sessID)
	{

		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();

		if(!user.getString("role").equals("admin"))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(403).entity(error.toJson()).build();
		}

		ArrayList<Document> users = INSTANCE.getAllUsers();
		Document res = new Document("users", users).append("Session ID", user.getString("Session ID"));

		return Response.ok(res).build();
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
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();

		if(!json.contains("email") ||!json.contains("name") || !json.contains("password") || !json.contains("role"))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}

		if((newUser.getString("role").equals("admin") && !user.getString("role").equals("admin")))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(403).entity(error.toJson()).build();
		}

		if(!INSTANCE.createUser(newUser))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(500).entity(error.toJson()).build();
		}

		UserEmail userEmail = new UserEmail();
		userEmail.sendUserEmail(newUser.getString("email"), newUser.getString("email"), newUser.getString("password"));		// sends the login data to the email account of the
																																			// newly created user
		newUser.append("Session ID", user.getString("Session ID")).append("_id", newUser.get("_id").toString());

		return Response.ok(newUser).build();
	}


	@PUT
	@Path("/users")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response updateUser(final String json, @DefaultValue("") @QueryParam("sessionID") final String sessID)
	{
		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();
		Document newUser = Document.parse(json);


		if(!json.contains("password") || !json.contains("name") || !json.contains("email"))
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(422).entity(error.toJson()).build();
		}

		String newUserPWHash = INSTANCE.generatePWHash(newUser.getString("password"), Base64.decodeBase64(user.getString("salt")));
		Optional<Document> opt = INSTANCE.getUserAsOptDocumentByEmail(newUser.getString("email"));

		if(!opt.isPresent())
		{
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(404).entity(error.toJson()).build();
		}

		Document existingUser = opt.get();

		if(existingUser.getString("email").equals(user.getString("email"))) {
			if (checkIfUserWantsToChangePW(existingUser, newUser) || checkIfUserWantsToChangeUserName(existingUser, newUser, newUserPWHash)) {
				String userID = user.get("_id").toString();
				Document update = new Document("_id", user.get("_id"))
						.append("name", newUser.getString("name"))
						.append("role", user.getString("role"));

				update.append("salt", user.getString("salt"))
						.append("pwHash", INSTANCE.generatePWHash(newUser.getString("password"), Base64.decodeBase64(user.getString("salt"))));

				INSTANCE.updateUserInPollCol(user.getString("name"), update.getString("name"));
				INSTANCE.updateUserInSessIDCol(user, update);
				INSTANCE.updateUserInUserCol(userID, update);

				return Response.ok(new Document().append("Session ID", user.getString("Session ID")).toJson()).build();
			}
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

	@GET
	@Path("/session")
	@Produces( MediaType.APPLICATION_JSON )
	public Response authSessionID(@DefaultValue("") @QueryParam("sessionID") final String sessID)
	{

		final Optional<Document> optUser = INSTANCE.authenticate(sessID);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());  	// Session ID doesn't exist
		}

		Document user = optUser.get();
		Document userWithOutOtherParams = new Document("Session ID", user.getString("Session ID"));

		return Response.ok(userWithOutOtherParams).build();
	}


	// Session ID of user lasts for 60 Minutes
	@POST
	@Path("/session")
	@Consumes( MediaType.APPLICATION_JSON )
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSessIDForUser(final String json)
	{

		Document doc = Document.parse(json);
		String email = doc.getString("email");
		String password = doc.getString("password");

		final Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByEmail(email);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(401).build());
		}

		Document user = optUser.get();

		long timeoutDur = INSTANCE.checkForTimeOut(email);
		if(timeoutDur != 0)
		{
			throw new WebApplicationException(Response.status(403).entity(new Document("Timeout Duration in Minutes", timeoutDur)).build()); 	// Return amount of remaining timeout duration
		}

		if(!INSTANCE.comparePWHash(user.getString("pwHash"), INSTANCE.generatePWHash(password, Base64.decodeBase64(user.getString("salt")))))
		{
			int curAttempt = INSTANCE.addLoginAttempt(email);
			System.out.println("Incorrect Password");
			throw new WebApplicationException(Response.status(401).entity(new Document("attempt", curAttempt)).build());
		}

		INSTANCE.removeFailedLoginHistory(email); 		// Clear failed login attempts upon successful login

		String sessID = INSTANCE.generateAndSetSessID(user);
		Document res = new Document("Session ID", user.getString("Session ID")).append("userName", user.getString("name")).append("role", user.getString("role"));

		return Response.ok(res).build();

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

		return Response.ok( answers ).build( );
	}

	@GET
	@Path("/answers/{pollID}")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSinglePollByID(@DefaultValue( "" ) @PathParam( "pollID" ) final String poll_id, @DefaultValue("") @QueryParam("token") final String token)
	{
		final Optional<Document> optPoll = INSTANCE.getPollAsOptDocumentByID(poll_id.substring(poll_id.indexOf("=")+1));	// removed "poll_id=" from the poll_id

		if(!optPoll.isPresent())
		{
			return Response.status(404).build();
		}

		Document poll = optPoll.get();
		ArrayList<String> tokens = (ArrayList<String>) poll.get("tokens");

		System.out.println(poll.getString("name"));

		if(!tokens.contains(token))
		{
			return Response.status(404).build();
		}

		System.out.println(poll);
		System.out.println();
		System.out.println(poll.toJson());

		return Response.ok(poll.toJson()).build();
	}


	@POST
	@Path("/answers/{pollID}")
	@Consumes( MediaType.APPLICATION_JSON )
	public Response postAnswer(final String json,@DefaultValue("") @PathParam("pollID") final String pollID ,@DefaultValue("") @QueryParam("token") final String token)
	{
		Document answer = Document.parse(json);

		Optional<Document> poll = INSTANCE.getPollAsOptDocumentByID(pollID);

		if(!poll.isPresent() || !json.contains("nonce") || !json.contains("ephemPubKey") || !json.contains("message"))
		{
			throw new WebApplicationException(Response.status(404).build());
		}
		else if(!this.INSTANCE.createAnswer(answer, pollID, token))
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
			Document error = new Document("Session ID", user.getString("Session ID"));
			return Response.status(404).entity(error.toJson()).build();
		}

		INSTANCE.deleteAnswersOfPollByPollID(pollID);
		return Response.ok(new Document().append("Session ID", user.getString("Session ID")).toJson()).build();
	}

	// Saves the Email adresses that were used in the last poll that was created by the user
	// The saved email adresses are overwritten with each new poll created by the user
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

		Document user = optUser.get();
		ArrayList<String> emails = INSTANCE.getLastUsedEmailsOfUser(user.getString("email"));
		Document result = new Document().append("E-Mails", emails).append("Session ID", user.getString("Session ID"));

		return Response.ok( result.toJson() ).build( );
	}
}
