package main.java.app;

import main.java.app.database.DBInstance;
import org.bson.Document;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import java.util.ArrayList;
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



	@POST	//TODO
	@Path("/user")
	@Consumes( MediaType.APPLICATION_JSON )
	public Response createUser(final String json, @DefaultValue("") @QueryParam("userName") final String userName, @DefaultValue("-1") @QueryParam("sessionID") final int sessID)
	{
		if(!json.contains("name") || !json.contains("role") || !json.contains("password-hash"))
		{
			throw new WebApplicationException(Response.status(422).build());
		}

		//TODO

		Optional<Document> user = INSTANCE.getUserAsOptDocumentByName(userName);

		if(!user.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}

		Document userDoc = user.get();
		Document poll = Document.parse(json);
		poll.put("created by", userDoc.getString("name"));

		INSTANCE.createPoll(poll);
		return Response.ok().build();
	}




	// Session ID of user lasts for 30 Minutes
	@GET	// TODO: Check if pwHash is too long for URI
	@Path("/session")
	@Produces( MediaType.APPLICATION_JSON )
	public Response getSessIDForUser( @DefaultValue( "" ) @QueryParam( "userName" ) final String userName, @DefaultValue("") @QueryParam("pwHash") final String pwHash)
	{

		// TODO: Decryption
		System.out.println(userName);
		System.out.println(pwHash);
		final Optional<Document> optUser = INSTANCE.getUserAsOptDocumentByNameWithoutID(userName);

		if(!optUser.isPresent())
		{
			throw new WebApplicationException(Response.status(404).build());
		}
		Document user = optUser.get();

		if(!pwHash.equals(user.getString("pwHash")))
		{
			System.out.println("Incorrect Password");
			throw new WebApplicationException(Response.status(404).build());
		}
		System.out.println("Not fucked yet");
		INSTANCE.generateAndSetSessID(user);

		// TODO: Encrypt before sending back

		return Response.ok(user).build();

	}


	@POST
	@Path("/answer")		// TODO: Funktioniert das so?
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






}

