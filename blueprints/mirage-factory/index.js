'use strict';

const matching = require('./utils/matching')
const easygraphqlparser = require('easygraphql-parser')
const fs = require('fs')
const pluralize = require('pluralize')
const inflection = require('inflection')
const stringUtils = require('ember-cli-string-utils')




module.exports = {
  description: '',
  fileName: '',
  entities: [],
  entityNames: [],
  configMirage: "",
  importScenarios: '',
  defaultScenario: '',

  normalizeEntityName(entityName) {
    this.fileName = entityName
  },

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


  beforeInstall(options) {

    // Reset mirage directories and files (set by default when installing mirage addons )

    // Scenarios
    if (this.isDirSync("./mirage/scenarios")) {
      fs.rmdir("./mirage/scenarios", { recursive: true }, (err) => {
        if (err) throw err
      })
    }

    // Serializers
    if (this.isDirSync("./mirage/serializers")) {
      fs.rmdir("./mirage/serializers", { recursive: true }, (err) => {
        if (err) throw err
      })
    }

    // Config
    if (this.isFileSync("./mirage/config.js")) {
      fs.unlinkSync("./mirage/config.js")
    }

    // Factories
    if (!this.isDirSync("./mirage/factories")) {
      fs.mkdirSync("./mirage/factories")
    }
    for (let index = 0; index < this.entityNames.length; index++) {
      let entityName = this.entityNames[index].toLowerCase()
      let entityNameSingular = pluralize.singular(entityName)
      fs.writeFileSync("./mirage/factories/" + entityNameSingular + ".js", this.getFactory(this.entities[index]))
    }
  },

  getFactory(entity) {
    let s = ""
    s += "import { Factory, association } from 'ember-cli-mirage'\n"
    s += "import faker from 'faker'\n"
    s += "export default Factory.extend({\n"
    entity.fields.map(field => {
      if (field.type !== "ID") {
        if (field.type === "String" || field.type === "Int" || field.type === "Boolean") {
          s += field.name + "() {\n"
          switch (field.type) {
            case "String":
              s += "return " + matching.matchString(field.name)
              break
            case "Int":
              s += "return faker.random.number()"
              break
            default:
              break
          }
        }
        else {
          s += field.name + "(" + field.name + ") {\n"
          s += "return " + field.name
        }
        s += "},\n"
      }
    })
    s += "})"
    return s
  },


  getImportScenario(entityNames) {
    let s = ""
    entityNames.map(entityName => {
      s += "import " + entityName.toLowerCase() + " from ../factories/" + entityName.toLowerCase() + "\n"
    })
    return s
  },

  // getDefaultScenario(entities, entityNames) {
  //   let s = ""
  //   for (let index = 0; index < entityNames.length; index++) {
  //     s += "server.createList('" + entityNames[index].toLowerCase() + "', NUMBER_ENTITY, {"
  //     let fieldCount = 0
  //     entities[index].fields.map(field => {
  //       if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean") {
  //         let entityField = this.getEntityFromField(field.type, entityNames, entities)
  //         if (field.isArray) {
  //           s += field.name + ": server.createList('" + field.type.toLowerCase() + "', NUMBER_RELATION_ENTITY, {" + this.createFieldsRelationNull(entityField) + "})"
  //           if (fieldCount < entities[index].fields.length - 1) {
  //             s += ", "
  //           }
  //         }
  //         else {
  //           s += field.name + ": server.create('" + field.type.toLowerCase() + "', {" + this.createFieldsRelationNull(entityField) + "})"
  //           if (fieldCount < entities[index].fields.length - 1) {
  //             s += ", "
  //           }
  //         }
  //       }
  //       fieldCount++
  //     })
  //     s += "})\n"
  //   }

  //   return s
  // },

  createFieldsRelationNull(entityField) {
    let s = ''
    for (let index = 0; index < entityField.fields.length; index++) {
      let field = entityField.fields[index]
      if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean") {
        s += field.name + ": null"
        if (index < entityField.fields.length - 1) {
          s += ", "
        }
      }
    }
    return s
  },


  getEntityFromField(fieldType, entityNames, entities) {
    let result
    for (let index = 0; index < entityNames.length; index++) {
      if (entityNames[index] === fieldType) {
        result = entities[index]
      }
    }
    return result
  },

  getNumberNonScalarField(entity) {
    let result = 0
    entity.fields.map(field => {
      if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean") {
        result++
      }
    })
    return result
  },


  // getConfigMirage(entities, entityNames) {
  //   let s = ""
  //   for (let index = 0; index < entityNames.length; index++) {
  //     const queryName = entityNames[index].toLowerCase()
  //     const queryNamePlural = pluralize.plural(queryName)
  //     const queryNameSingular = pluralize.singular(queryName)

  //     // First case is plural query field (e.g employes)
  //     if (index === 0) {
  //       s += "if (/query " + queryNamePlural + "/.test(body)) {\n"
  //     }
  //     else {
  //       s += "else if (/query " + queryNamePlural + "/.test(body)) {\n"
  //     }
  //     s += "\tlet results" + stringUtils.classify(queryNamePlural) + " = []\n"
  //     s += "schema.db." + queryNamePlural + ".map(" + queryNameSingular + " => {\n"
  //     s += "results" + stringUtils.classify(queryNamePlural) + ".push(\n"
  //     s += "{\n"
  //     entities[index].fields.map(field => {
  //       if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean") {
  //         s += "\"" + field.name + "\": " + queryNameSingular + "." + field.name.toLowerCase() + ",\n"
  //       }
  //       else {
  //         let relationFieldName = field.name.toLowerCase()
  //         let relationFieldType = pluralize.plural(field.type).toLowerCase()
  //         if (field.isArray) {
  //           s += "\"" + field.name + "\": schema.db." + relationFieldType + ".find(" + queryNameSingular + "." + relationFieldName + "Ids),\n"
  //         }
  //         else {
  //           s += "\"" + field.name + "\": schema.db." + relationFieldType + ".findBy({id: " + queryNameSingular + "." + relationFieldName + "Id}),\n"
  //         }
  //       }
  //     })
  //     s += "}\n"
  //     s += ")\n"
  //     s += "})\n"
  //     s += "return {\"data\": {\"" + queryNamePlural + "\": results" + stringUtils.classify(queryNamePlural) + "}}"
  //     s += "}\n"

  //     // Then  singular query field (e.g employe)
  //     s += "else if (/query " + queryNameSingular + "/.test(body)) {\n"
  //     s += "const paramId = bodyJSON.variables.id ? bodyJSON.variables.id : 1\n"
  //     s += "const " + queryNameSingular + " = schema.db." + queryNamePlural + ".find(paramId)\n"
  //     s += "return {\n"
  //     s += "\"data\": {\n"
  //     s += queryName + ": {\n"
  //     entities[index].fields.map(field => {
  //       if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean") {
  //         s += "\"" + field.name + "\": " + queryName + "." + field.name + ",\n"
  //       }
  //       else {
  //         let relationFieldName = field.name.toLowerCase()
  //         let relationFieldType = pluralize.plural(field.type).toLowerCase()
  //         if (field.isArray) {
  //           s += "\"" + field.name + "\": schema.db." + relationFieldType + ".find(" + queryName + "." + relationFieldName + "Ids),\n"
  //         }
  //         else {
  //           s += "\"" + field.name + "\": schema.db." + relationFieldType + ".findBy({id: " + queryName + "." + relationFieldName + "Id}),\n"
  //         }
  //       }
  //     })
  //     s += "}\n"
  //     s += "}\n"
  //     s += "}\n"
  //     s += "}\n"
  //   }
  //   return s

  // },


  locals(options) {

    const schema = fs.readFileSync(this.fileName, 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      else {
        return data
      }
    })
    const schemaJSON = easygraphqlparser(schema)

    // Fetch all the types (except query) and types name
    for (const type in schemaJSON) {
      if (type !== "Query") {
        this.entities.push(schemaJSON[type])
        this.entityNames.push(type)
      }
    }
    this.importScenarios += this.getImportScenario(this.entityNames)
    // this.configMirage += this.getConfigMirage(this.entities, this.entityNames)
    // this.defaultScenario += this.getDefaultScenario(this.entities, this.entityNames)

    // Return custom template variables here.
    return {
      importScenarios: this.importScenarios,
      // configMirage: this.configMirage,
      // defaultScenario: this.defaultScenario
    };
  },

  // afterInstall(options) {
  //   // Perform extra work here.
  //   return this.addPackagesToProject([
  //       { name: 'faker' }
  //   ])
  // }
};
