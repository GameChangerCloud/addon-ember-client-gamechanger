<% entityNames.forEach(function(entity){ %>import config<%=entity.singular.charAt(0).toUpperCase()+entity.singular.slice(1).toLowerCase()%> from './config-<%=entity.singular.toLowerCase()%>'
<% }) %>
import ENV from '../config/environment'

export default function () {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */
    // By pass Cognito Authentication in Mirage setup
    this.post('https://cognito-idp.'+ENV.cognito.poolId.substring(0,9)+'.amazonaws.com/',  async (db, request) => {
      console.log("Try to call Cognito Authentication")
      return {
        ChallengeName: "PASSWORD_VERIFIER", 
        ChallengeParameters: {
          USER_ID_FOR_SRP: "mockuser", 
          USERNAME: "moxkuser",
          SECRET_BLOCK: "fakes_secret_block",
          SRP_B: "fake_srp_p", 
          SALT: 'pepper'
        },
        AuthenticationResult: {IdToken: "jwt_1234567890", AccessToken:"access_123456789", RefreshToken:"refresh_123456789"}
      }
    });

<% entityNames.forEach(function(entity){ %>   this.get('/<%=entity.plural.toLowerCase()%>');
    this.post('/<%=entity.plural.toLowerCase()%>');
    this.get('/<%=entity.plural.toLowerCase()%>/:id');
    this.put('/<%=entity.plural.toLowerCase()%>/:id');
    this.patch('/<%=entity.plural.toLowerCase()%>/:id');
    this.del('/<%=entity.plural.toLowerCase()%>/:id');
<% }) %>	
  this.post('/mirage', (schema, request) => {
    const body = request.requestBody.replace(/\s+/g, ' ').trim();  // Remove excess whitespace
    const bodyJSON = JSON.parse(request.requestBody)

    // Checking which type is called with regex test

		let isPlural = true
    <% entityNames.forEach(function(entity){ %>if (/query <%=entity.singular.toLowerCase()%>/.test(body)) {
        return { "data": { <%=entity.singular.toLowerCase()%>: config<%=entity.singular.charAt(0).toUpperCase()+entity.singular.slice(1).toLowerCase()%>(schema, null, isPlural) } }
    }
    <% }) %>	

    <% entityNames.forEach(function(entity){ %>if (/query <%=entity.plural.toLowerCase()%>/.test(body)) {
      return { "data": { <%=entity.plural.toLowerCase()%>: config<%=entity.singular.charAt(0).toUpperCase()+entity.singular.slice(1).toLowerCase()%>(schema, null, !isPlural) } }
    }
     <% }) %>
	
	// If you add an entity manually, add these lines : 
	/*

	  if (/query <entitynameplural>/.test(body)) {
      return { "data": { "entitynameplural": config<EntityName>(schema, null, isPlural) } }
    }
    else if (/query <entityname>/.test(body)) {
      return { "data": { "<entityname>": config<EntityName>(schema, bodyJSON, !isPlural) } }
    }

	*/
  })
}
