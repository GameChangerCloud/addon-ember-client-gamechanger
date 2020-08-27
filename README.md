# addon-ember-client-gamechanger


Generator based on [Yeoman](https://yeoman.io/) in a [Ember](https://emberjs.com/) project based on a graphQL schema.

## Requirement

- yeoman 
```
npm install -g yeoman
```
- ember
```
npm install -g ember
```
- A valid graphQL schema (see supported graphQL featured [here](http://google.com))
- [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- An AWS Account set up and configured on your machine ( best if you use the [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) to configure with `aws configure` command)
- A Cognito User group set up (see [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-as-user-directory.html))

## Installation
### Locally
Get the project and install its dependencies
```
git clone https://gitlab.ippon.fr/abenhamida/generator-graphql-ember
```
```
cd generator-graphql-ember
```
```
npm install
```
Link the project to your local node_modules folder
```
npm link
```
### Using npm 
Not available yet

## Usage
Generate your Ember application
```
ember new <your-app-name>
```
[FIX Form Bug] : Change version in package.json of "ember-source" as follow :
```
"ember-source": "~3.14.1"
```

Put "ember-client-gamechanger" in devDependencies of package.json file.
```
"ember-client-gamechanger": "*"
```
Delete package-lock.json file.

Install dependencies with the option offline :
```
npm install --prefer-offline
```
Run the addon default blueprint
```
ember g ember-client-gamechanger
```
Generate the application for your GraphQL schema
```
ember g graphql-import <directory>/yourSchema.graphql
```
Now we need to do some setup to connect our client app to the AWS cloud services

### API Gateway
* If you set up your graphQL server using out generator-aws-server-gamechanger tool, you can use the URL obtained in your constants file.   
`<your-app-name>/app/constant.js`  
* If you want to go into the mirage mode, in project/app/config/environment.js, change the statement on line 27 like : 
`ENV['ember-cli-mirage'] = {enabled: true};`
* Else, just use your own API endpoint. You must use the same graphQL schema in your server than the one you used here.

### Cognito Service 
Fill up the file `<your-app-name>/config/environnement.js` : 

* If you set up your graphQL server using out generator-aws-server-gamechanger tool, you can use the URL obtained in your cognito file.   
* Else, use the following info from your Cognito User Pool :
* `poolId` : General settings > Pool Id
* `clientId` : App integration > App client settings > ID

Now we can run the app

```
ember serve
```

See the result on http://loacalhost:4200

### (Optional) Adding some entities

Generate the entity with the following syntax
```
ember g entity-factory <entityName> fieldSimple:<type> fieldRelation:<relation-type>:typeRelation
```

fieldSimple : the name of your field with a simple type.
With type that can be : `string`, `int`, `boolean`

fieldRelation : the name of your field with a relation type.
With relation-type that can be : `belongs-to`, `has-many`
typeRelation : the name of the other entity which is link by this relation.

Modify some files by adding some lines:  

- mirage/scenarios/default.js
```
import create<EntityName> from './<entity-name>'
create<EntityName>(server, NUMBER_ENTITY, NUMBER_RELATION_ENTITY)
```

- mirage/config.js
```
import config<EntityName> from "./config-<entity-name>"

else if (/query <entitiesName>/.test(body)) {
  return { "data": { <entitiesName>: config<EntityName>(schema, null, isPlural) } }
}
else if (/query <entityName>/.test(body)) {
  return { "data": { <entityName>: config<EntityName>(schema, bodyJSON, !isPlural) } }
}
```
- app/templates/display-models.hbs
```
<li class="rr-list-item">
  <LinkTo @route="display-<entity-name>" class="rr-header-link">EntityName</LinkTo>
</li>
```
- app/router.js
```
this.route('display-<entity-name>', function() {});
```

## Notes 
### How to use it

When you launch your application, you need to connect with Cognito.
By default, the account is : 
login : admin@admin.fr
pasword : password

You can create users on AWS console.

When you are connected, you have a sidebar on the left with 3 parts :
* Home : Home page (display the graphQL schema)
* Tables : Page which manage table (create tables in database and create fake data)
* Models : In this part it will have all entities of your graphQL schema. 

Before accessing to models you need to create tables.
On the Tables page you have a button for create Tables. 
If he doesn't appear, you haven't put the endpoint. See section "Usage" -> "From a graphql Schema" -> 3.

### Deployment on AWS

1. Go in terraform folder and execute :
```
terraform init
terraform apply
```
It will create Bucket S3.

2. Go in the file .env and put 

- AWS_KEY and AWS_SECRET (which are your ids of connection) 

- PRODUCTION_DISTRIBUTION and STAGING_DISTRIBUTION (find it in terraform/s3.txt)

3. Execute the command :
```
ember deploy staging --verbose
```
4. Now you can access to staging app or production app with URLs in terraform/ids.txt
If there isn't any url in terraform/ids.txt, follow these steps :
- Go on the AWS console for CloudFront
- Find your deployment (with ID for example)
- Get the URL in the column "Origin"

## License
[MIT](https://choosealicense.com/licenses/mit/)
