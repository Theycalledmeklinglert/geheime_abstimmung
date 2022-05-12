package main.java.app;

import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath( "api" )
public class Application extends ResourceConfig
{
	public Application( )
	{
		super( );
		registerClasses( getServiceClasses( ) );
	}

	protected Set<Class<?>> getServiceClasses( )
	{
		final Set<Class<?>> returnValue = new HashSet<>( );

		returnValue.add( main.java.app.Service.class );

		return returnValue;
	}
}
