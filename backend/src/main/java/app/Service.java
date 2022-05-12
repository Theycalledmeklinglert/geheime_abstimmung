package main.java.app;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import main.java.app.database.DBInstance;
import org.bson.Document;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import java.net.URI;
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
	@Produces( MediaType.APPLICATION_JSON )
	public Response getPollsByUser( @DefaultValue( "" ) @QueryParam( "userName" ) final String userName)
	{
		final Optional<ArrayList<Document>> optPolls = INSTANCE.getAllPollsOfUser(userName);

		if(optPolls.isPresent())
		{
			Collection<Document> polls = optPolls.get();
			return Response.ok( polls ).build( );
		}
		return Response.status(404).build();
	}


	// TODO: Evtl. getAllUsersBesideSysAdmin() implementieren

	@POST
	@Consumes( MediaType.APPLICATION_JSON )
	public Response createPoll(final String json, @DefaultValue("") @QueryParam("userName") final String userName, @DefaultValue("0") @QueryParam("sessionID") final int sessID)
	{
		//TODO: Kommen der UserName und SessionID als QueryParam oder als PathParam?
		// TODO: Checks für UserName und SessionID einbauen
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
		return Response.status(201).build(); // Soll hier die "Location" URI mitgegeben werden? Wir haben ja schließlich keine getSingle() Methode
	}


}

