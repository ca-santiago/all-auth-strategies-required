# Hapi all auth strategies required

This Hapi plugin enables you to apply multiple strategies for a single route, ensuring that all strategies must pass before access is granted. By default, Hapi authorizes route access if at least one strategy passes. With this plugin, you can strengthen your application's security by requiring multiple successful authentication strategies for sensitive routes

## Install
``` bash
npm i @ca-santiago/hapi-all-strategies-required
```

## Usage

``` js
  
  // Create your Hapi app
  const server = Hapi.server({...});

  // register your auth strategies
  server.auth.strategy('USER-TOKEN', 'jwt', { secretKey: 'userJwtSecret' })
  server.auth.strategy('SERVICE-KEY', myCustomAppKeySchema)
  
  // Register a new strategy based on this plugin schema
  server.auth.strategy('FULL-AUTH', 'multiple-required-auth', {
    // Use as many registered strategies you need
    strategies: ['USER-TOKEN', 'SERVICE-KEY']
  });
 
```

Use in a route

``` js
  server.route({
    method: 'POST',
    path: `/users`,
    handler: (request, h) => 'Authorized',
    options: {
        auth: 'FULL-AUTH',
    }
  })
```

Now you can use `FULL-AUTH` as auth strategy and it will apply all desired verification passed down in the `strategies` argument.
You can create as many strategies based on this plugin schema and it will handle the validation for each one.


If any strategy fails you will get an `Unauthorized` response.
