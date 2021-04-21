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
    entityNames: [],
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

    beforeInstall(options) { // Reset files
        if (this.isFileSync("./app/router.js")) {
            fs.unlinkSync("./app/router.js")
        }

        if (this.isDirSync("./mirage")) {
            fs.rmdirSync("./mirage", {recursive: true})
        }
        if (this.isDirSync("./app/models")) {
            fs.rmdirSync("./app/models", {recursive: true})
        }
        if (this.isDirSync("./app/components")) {
            fs.rmdirSync("./app/components", {recursive: true})
        }
        if (this.isDirSync("./app/routes")) {
            fs.rmdirSync("./app/routes", {recursive: true})
        }
        if (this.isDirSync("./app/templates")) {
            fs.rmdirSync("./app/templates", {recursive: true})
        }
        if (this.isDirSync("./app/templates/components")) {
            fs.rmdirSync("./app/templates/components", {recursive: true})
        }
        if (this.isDirSync("./app/controllers")) {
            fs.rmdirSync("./app/controllers", {recursive: true})
        }

        // Call on blueprint entity-factory
        for (let index = 0; index < this.entityNames.length; index++) {
            console.log("Calling ember g entity-factory " +this.entityNames[index]+ " '"+ JSON.stringify(this.entities[index].fields)+"'")
            shell.exec("ember g entity-factory " +this.entityNames[index]+ " '"+ JSON.stringify(this.entities[index].fields)+"'")

            //shell.exec("ember g entity-factory " + this.getParsedInlineEntity(this.entities[index], this.entityNames[index]))
            // shell.exec("ember g entity-factory "+this.getParsedInlineEntity(this.entities[index], this.entityNames[index]) + " " + JSON.stringify(this.entities[index]))
        }
    },


    /**
   * Take an entity and its content and return the inline equivalent in string
   * Output format : entityName field1:type field2:type field3:typeRelation:entityRelation ...
   *
   * @param {Content of the entity} entity
   * @param {Name of the entity} entityName
   */
    getParsedInlineEntity(entity, entityName) {
        const entityNameFormated = entityName.toLowerCase()
        let s = entityNameFormated + " "
        entity.fields.map(field => {
            const fieldTypeFormated = field.type.toLowerCase()
            const fieldNameFormated = field.name
            if (fieldTypeFormated !== "id") {
                if (fieldTypeFormated === "string" || fieldTypeFormated === "int" || fieldTypeFormated === "boolean") {
                    s += fieldNameFormated + ":" + fieldTypeFormated
                    if (field.noNull) {
                        s += "!"
                    }
                    s += " "
                } else {
                    if (field.isArray) {
                        s += fieldNameFormated + ":has-many"
                        if (field.noNull) {
                            s += "!"
                        }
                        s += ":" + fieldTypeFormated + " "
                    } else {
                        s += fieldNameFormated + ":belongs-to"
                        if (field.noNull) {
                            s += "!"
                        }
                        s += ":" + fieldTypeFormated + " "
                    }
                }
            }
        })
        //console.log("Entity "+entityName+" parsed : "+s);
        return s
    },

    getAppName(options) {
        let path = options.target
        const path2 = require('path');
        let separator = path2.sep
        let pathArray = path.split(separator)

        let appName = inflection.dasherize(inflection.underscore(pathArray[pathArray.length - 1]))

        return appName
    },

    schemaGraphqlHTML(entities, entityNames) {
        let s = "";
        let tab = this.schemaGraphql.split("\n")
        for (let i = 0; i < tab.length; i++) {
            s += "<br>" + tab[i]
        }

        return s;
    },

    getEntityNamesAndPlurals(entityNames) {
        return entityNames.map(function(ent) { return {"singular": ent, "plural": pluralize.plural(ent)}});
    },

    locals(options) {

        const schema = fs.readFileSync(this.fileName, 'utf8', (err, data) => {
            if (err) {
                throw err
            } else {
                return data
            }
        })

        this.schemaGraphql = schema

        const schemaJSON = easygraphqlparser(schema)

        // Fetch all the types (except query) and types name
        for (const type in schemaJSON) {
            //console.log("Found Entity : "+type)
            //console.log(JSON.stringify(schemaJSON[type]))
            if (type !== "Query" && type !== "Mutation" && type !== "Subscription" && schemaJSON[type].type !== "ScalarTypeDefinition") {
                this.entities.push(schemaJSON[type])
                this.entityNames.push(type)
            }
        }

        // Return custom template variables here.
        this.appName = this.getAppName(options)

        return {
            appName: this.appName,
            entityNames: this.getEntityNamesAndPlurals(this.entityNames),
            schemaGraphqlHTML: this.schemaGraphqlHTML(this.entities, this.entityNames)
        };
    },
    
    afterInstall(options) {
        return this.addAddonsToProject({
          packages: [
            { name: 'ember-ajax' }, // to remove for Appolo ?
            { name: 'ember-graphql-adapter' }, // to remove for Appollo ?
            { name: 'ember-cli-mirage' },
            { name: 'ember-models-table' },
            { name: 'ember-bootstrap' },
            { name: 'ember-validated-form' },
            { name: 'ember-changeset' },
            { name: 'ember-changeset-validations' },
            { name: 'ember-pikaday'},
            { name: 'ember-cli-flash'},
            { name: 'ember-simple-auth'},
            { name: 'ember-cognito'},
            { name: 'ember-cli-deploy'},
            { name: 'ember-cli-deploy-aws-pack'},
            { name: 'ember-faker'}
          ]
        });
      }
      
};
