package app;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

@Path( "anfrage" )
public class Service
{

	@Context
	protected UriInfo uriInfo;

	@GET
	public Response getPersons( )
	{
		System.out.println("Server is running");
		return Response.ok().build( );
	}
}
