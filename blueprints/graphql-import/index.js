'use strict';
const easygraphqlparser = require('easygraphql-parser')
const fs = require('fs')
const pluralize = require('pluralize')
const shell = require('shelljs')
const inflection = require('inflection')

module.exports = {
  name: 'graphqlimporter',
  description: '',
  fileName: '',
  entities: [],
  entitiesName: [],
  appName: '',
  schemaGraphql: '',


  isDirSync(aPath) {
    try {
      return fs.statSync(aPath).isDirectory();
    } catch (e) {
      if (e.code === 'ENOENT') {
        return false;
      } else {
        throw e;
      }
    }
  },

  isFileSync(aFile) {
    try {
      return fs.statSync(aFile).isFile();
    } catch (e) {
      if (e.code === 'ENOENT') {
        return false;
      } else {
        throw e;
      }
    }
  },

  normalizeEntityName(entityName) {
    this.fileName = entityName
  },

  beforeInstall(options) {



    // Reset files
    if (this.isFileSync("./app/router.js")) {
      fs.unlinkSync("./app/router.js")
    }

    if(this.isDirSync("./mirage")) {
      fs.rmdirSync("./mirage", {recursive: true})
    }
    if(this.isDirSync("./app/models")) {
      fs.rmdirSync("./app/models", {recursive: true})
    }
    if(this.isDirSync("./app/components")) {
      fs.rmdirSync("./app/components", {recursive: true})
    }
    if(this.isDirSync("./app/routes")) {
      fs.rmdirSync("./app/routes", {recursive: true})
    }
    if(this.isDirSync("./app/templates")) {
      fs.rmdirSync("./app/templates", {recursive: true})
    }
    if(this.isDirSync("./app/templates/components")) {
      fs.rmdirSync("./app/templates/components", {recursive: true})
    }
    if(this.isDirSync("./app/controllers")) {
      fs.rmdirSync("./app/controllers", {recursive: true})
    }



    // Call on blueprint entity-factory
    for (let index = 0; index < this.entitiesName.length; index++) {
      shell.exec("ember g entity-factory "+this.getParsedInlineEntity(this.entities[index], this.entitiesName[index]))
      // shell.exec("ember g entity-factory "+this.getParsedInlineEntity(this.entities[index], this.entitiesName[index]) + " " + JSON.stringify(this.entities[index]))
    }
    fs.writeFileSync("./app/router.js", this.getRouter(this.entitiesName))
  },


  /**
   * Take an entity and its content and return the inline equivalent in string
   * Output format : entityName field1:type field2:type field3:typeRelation:entityRelation ...
   *
   * @param {Content of the entity} entity
   * @param {Name of the entity} entityName
   */
  getParsedInlineEntity(entity, entityName){
    const entityNameFormated = entityName.toLowerCase()
    let s = entityNameFormated + " "
    entity.fields.map(field => {
      const fieldTypeFormated = field.type.toLowerCase()
      const fieldNameFormated = field.name
      if(fieldTypeFormated !== "id") {
        if(fieldTypeFormated === "string" || fieldTypeFormated === "int" || fieldTypeFormated === "boolean"){
          s += fieldNameFormated + ":" + fieldTypeFormated
          if(field.noNull){
            s += "!"
          }
          s += " "
        }
        else {
          if(field.isArray) {
            s += fieldNameFormated + ":has-many"
            if(field.noNull){
              s += "!"
            }
            s += ":" + fieldTypeFormated + " "
          }
          else {
            s += fieldNameFormated + ":belongs-to"
            if(field.noNull){
              s += "!"
            }
            s += ":" + fieldTypeFormated + " "
          }
        }
      }
    })
    return s
  },

  getRouter(entities) {
    let s = `import EmberRouter from '@ember/routing/router';
    import config from './config/environment';

    export default class Router extends EmberRouter {
      location = config.locationType;
      rootURL = config.rootURL;
    }

    Router.map(function() {
      this.route('login');
      this.route('tables', function() {});
      this.route('home', function() {});\n`

    entities.forEach(field => {
      s += `this.route('display-` + field.toLowerCase() + `', function() {});\n`
      s += `this.route('forms.` + field.toLowerCase() + `-form', function() {});\n`
    })

    s += `this.route('update', function() {`

    entities.forEach(field => {
      s += `  this.route('` + field.toLowerCase() + `', { path:'/` + field.toLowerCase() + `/:` + field.toLowerCase() + `_id'});\n`
    })

    s += "});"

    s += "\n});"

    return s
  },

  /*getListModels(entities) {
    let s = `<div>
    Available models :
    <ul>`

      entities.forEach(field => {
        s += `<li class="rr-list-item">
      <LinkTo @route="display-` + field.toLowerCase() + `" class="rr-header-link">`
        + field + `</LinkTo>
      </li>`

    })

    s += 	`</ul>
    </div>`
    return s
  },*/

  getAppName(options) {
    let path = options.target
    const path2 = require('path');
    let separator = path2.sep
    let pathArray = path.split(separator)

    let appName = inflection.dasherize(inflection.underscore(pathArray[pathArray.length - 1]))

    return appName
  },

  listNavLinks(entitiesName){
    let s = "<ul class=\"nav flex-column mb-2\">"
    for (let index = 0; index < entitiesName.length; index++) {
      const queryName = entitiesName[index].toLowerCase()
      s += `<li class="nav-item">
        <LinkTo @route="display-${queryName}" class="nav-link">${entitiesName[index]}</LinkTo>
        </li>`
    }
    s += "</ul>"
    return s;
  },

  urlAPI(){
    return "Not available"
  },

  schemaGraphqlHTML(entities, entitiesName){
    let s = "";
    let tab = this.schemaGraphql.split("\n")
    for(let i = 0; i < tab.length; i++){
      s += "<br>" + tab[i]
    }

    return s;


  },


  getConfigMirage(entities, entitiesName) {
    let s = ""
    for (let index = 0; index < entitiesName.length; index++) {
      const queryName = entitiesName[index].toLowerCase()
      const queryNamePlural = pluralize.plural(queryName)
      const queryNameSingular = pluralize.singular(queryName)
      const queryNameCapitalize = inflection.capitalize(queryName)
      // First case is plural query field (e.g employes)
      if (index === 0) {
        s += "if (/query " + queryNamePlural + "/.test(body)) {\n"
      }
      else {
        s += "else if (/query " + queryNamePlural + "/.test(body)) {\n"
      }
      s += "return { \"data\": { " + queryNamePlural + ": config" + queryNameCapitalize + "(schema, null, isPlural) } }\n"
      s += "}\n"

      // Then singular query field (e.g employe)
      s += "else if (/query " + queryNameSingular + "/.test(body)) {\n"
      s += "return { \"data\": { " + queryNameSingular + ": config" + queryNameCapitalize + "(schema, bodyJSON, !isPlural) } }\n"
      s += "}\n"
    }
    return s
  },

  getImportConfigMirage(entitiesName) {
    let s = ""
    for (let index = 0; index < entitiesName.length; index++) {
      const queryName = entitiesName[index].toLowerCase()
      const queryNameSingular = pluralize.singular(queryName)
      const queryNameCapitalize = inflection.capitalize(queryName)

      s += "import config"+queryNameCapitalize+" from \"./config-"+queryNameSingular+"\"\n"
    }
    return s
  },

  getDefaultScenario(entities, entitiesName) {
    let s = ""
    for (let index = 0; index < entitiesName.length; index++) {
      const queryName = entitiesName[index].toLowerCase()
      const queryNameCapitalize = inflection.capitalize(queryName)
      s += "create" + queryNameCapitalize + "(server, NUMBER_ENTITY)\n"
    }
    return s
  },

  getImportScenarioMirage(entitiesName) {
    let s = ""
    for (let index = 0; index < entitiesName.length; index++) {
      const queryName = entitiesName[index].toLowerCase()
      const queryNameSingular = pluralize.singular(queryName)
      const queryNameCapitalize = inflection.capitalize(queryName)
      s += "import create"+queryNameCapitalize+" from './"+queryNameSingular+"'\n"
    }
    return s
  },



  locals(options) {

    const schema = fs.readFileSync(this.fileName, 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      else {
        return data
      }
    })

    this.schemaGraphql = schema

    const schemaJSON = easygraphqlparser(schema)

    // Fetch all the types (except query) and types name
    for (const type in schemaJSON) {
      if (type !== "Query" && type !== "Mutation" && schemaJSON[type].type !== "ScalarTypeDefinition") {
        this.entities.push(schemaJSON[type])
        this.entitiesName.push(type)
      }
    }

    // Return custom template variables here.
    this.appName = this.getAppName(options)

    return {
      appName: this.appName,
      //displayModel: this.getListModels(this.entitiesName),
      configMirage: this.getConfigMirage(this.entities, this.entitiesName),
      importConfig: this.getImportConfigMirage(this.entitiesName),
      defaultScenarioMirage: this.getDefaultScenario(this.entities, this.entitiesName),
      importDefaultScenarioMirage: this.getImportScenarioMirage(this.entitiesName),
      listNavLinks: this.listNavLinks(this.entitiesName),
      schemaGraphqlHTML: this.schemaGraphqlHTML(this.entities, this.entitiesName),
      urlAPI: this.urlAPI()
    };
  },

  // afterInstall(options) {
  //   // Perform extra work here.
  // }
};
