'use strict';

const inflection = require('inflection')
const matching = require('./utils/matching')
const fs = require('fs')
const stringUtils = require('ember-cli-string-utils')

module.exports = {
  description: '',
  entityName: '',

  normalizeEntityName(entityName) {
    this.entityName = entityName //entity.name
  },

  fileMapTokens(options) {
    return {
      __name__(options) {
        return options.locals.entityName.toLowerCase()
      },
      __mirage__() {
        return "./mirage"
      }
    }
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
  },

  jsonFieldsForCreate(entity) {
    let s = "{";
    s += "id : this.nextId++, "
    for (const fieldName in entity) {
      const formatedFieldName = fieldName
      let toArray = ''
      if(entity[fieldName].includes('has-many')){
        toArray = '.toArray()'
      }
      if(formatedFieldName.length >= 4 && formatedFieldName.toLowerCase().endsWith("date")){
        s += formatedFieldName + " : formatDate(fields[\"" + formatedFieldName + "\"]"+ toArray +"), "

      }
      else{
        s += formatedFieldName + " : fields[\"" + formatedFieldName + "\"]"+ toArray +", "

      }

    }
    s = s.substring(0, s.length - 2)
    s += "}"
    return s;
  },

  upperFirstLetter(entityName){
    return entityName.charAt(0).toUpperCase() + entityName.slice(1);
  },

  fieldsForValidation(entity){
    let s = ""

    for (const fieldName in entity) {
      if(entity[fieldName].includes("!")) {
        if (entity[fieldName].includes('belongs-to') || entity[fieldName].includes('has-many')) {
          s += `${fieldName}: [validatePresence(true)],\n`
        } else {
          s += `${fieldName}: [validatePresence(true), validateLength({ min: 3, max: 40 })],\n`
        }
      }
    }
    return s
  },

  initFunction(entity, entityName){
    let entityFirstLetter =  entityName.charAt(0).toUpperCase() + entityName.slice(1);
    let s = `init() {
    this._super(...arguments);\n`

    for (const fieldName in entity) {
      if (entity[fieldName].includes('belongs-to') || entity[fieldName].includes('has-many')) {
        let field = entity[fieldName].split(':')[1]

        s += `this.findAll${field}()\n`

      }
    }
    s += `this.initNextId()\n`
    s += `
       },\n`


    s += `  initNextId: action(async function() {
   this.store.query('${entityName}', {}).then(
      x => {
        x.forEach(y => {
          this.nextId++
        })
      })
  }),
`
    return s
  },

  oneFunction(type){
    return `
    findAll${type}: action(async function() {
    this.store.query('${type}', {}).then(
      x => {
        x.forEach(y => {
          this.all${type}.push(y)
        })
        let fields = []
        this.all${type}[0].eachAttribute(x => fields.push(x))
        this.first${type} = fields[0]
         this.set('${type}IsLoad', true);
        return this.all${type};
      }
    )
  }),`

  },

  allFunctions(entity){
    let s = "";
    for (const fieldName in entity) {
      if (entity[fieldName].includes('belongs-to') || entity[fieldName].includes('has-many')) {
        let field = entity[fieldName].split(':')[1]
        s += this.oneFunction(field)
      }
    }
    return s

  },

  otherFields(entity) {

    let s = "";
    for (const fieldName in entity) {
      if (entity[fieldName].includes('belongs-to') || entity[fieldName].includes('has-many')) {
        let field = entity[fieldName].split(':')[1]
        s += `  all${field} : [],
                first${field} : "",
                ${field}IsLoad : false,
                `
      }
    }
    s += "nextId : 0,\n"
    return s
  },

  updateFields(entity, entityName){
    let s = "";
    s += entityName + ".id = fields[\"id\"]\n"
    for (const fieldName in entity) {
      const formatedFieldName = fieldName
      let toArray = ''
      if(entity[fieldName].includes('has-many')){
        toArray = '.toArray()'
      }
      if(formatedFieldName.length >= 4 && formatedFieldName.toLowerCase().endsWith("date")){
        s += entityName + '.' + formatedFieldName + " = formatDate(fields[\"" + formatedFieldName + "\"]"+ toArray + ");\n"

      }
    else{
        s += entityName + '.' + formatedFieldName + " = fields[\"" + formatedFieldName + "\"]"+ toArray + ";\n"

      }
    }
    s += `await `+entityName+`.save().then(() => {
      console.log("saved")
      notif.add({message: "Saved", timeout: 15000})
      rout.transitionTo('display-${entityName}')
    }).catch(error => {
      console.log(error)
       notif.add({message: error, timeout: 15000})
    })`
    return s;
  },


  listColumnsTableFilled(entity) {
    let s = "";
    s += " {{f.input label=\"id\" name=\"id\" required=true value=model.id disabled=true}}\n"
    for (const fieldName in entity) {
      const formatedFieldName = fieldName
      let type = entity[fieldName].toLowerCase()
      let req = " "
      if(type.includes("!")){
        req = " required=true "
      }
      if (entity[fieldName].includes('belongs-to')
        || entity[fieldName].includes('has-many')
      ) {
        let field = entity[fieldName].split(':')[1]
        s += `{{#if this.${field}IsLoad}}
        {{f.input
           type         = "select"
           label        = "${fieldName}"
           name         = "${fieldName}"
           includeBlank = "Select a ${field}"
           optionValuePath="id"
           optionLabelPath=first${field}
           options      = all${field}
         `
        s+= req

        if(entity[fieldName].includes('has-many')){
          s += `\n           multiple     = true`
        }

        s +=  `
   }}`
        s += `{{else}}
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <br/>


    {{/if}}`

      } else {
        if(formatedFieldName.length >= 4 && formatedFieldName.toLowerCase().endsWith("date")){
          s += "<label>"
          s += formatedFieldName
          s += "<br/>"
          s += "{{pikaday-input format=\"YYYY-MM-DD\" value=model." + formatedFieldName + " onSelection=(action (mut f.model." + formatedFieldName + "))}}"
          s += "</label>"
        }
        else if(type === "boolean"){
          s += " <label class=\"check\">\n" +
            "   taille\n" +
            "   {{f.input type=\"checkbox\" name=\"" + formatedFieldName + "\"" + req + " value=model." + formatedFieldName + "}}\n" +
            " </label>\n" +
            " <br/>"
        }
        else{
          s += "  {{f.input label=\"" + formatedFieldName + "\" name=\"" + formatedFieldName + "\"" + req + " value=model." + formatedFieldName + "}}\n"
        }
      }
    }
    return s;
  },

  listColumnsTable(entity) {
    let s = "";
    for (const fieldName in entity) {
      let type = entity[fieldName].toLowerCase()
      let req = " "
      if(type.includes("!")){
        req = " required=true "
      }
      if(entity[fieldName].includes('belongs-to')
        || entity[fieldName].includes('has-many')
      ){
        let field = entity[fieldName].split(':')[1]
        s += `
        {{#if this.${field}IsLoad}}
        {{f.input
           type         = "select"
           label        = "${fieldName}"
           name         = "${fieldName}"
           includeBlank = "Select a ${field}"
           optionValuePath="id"
           optionLabelPath=first${field}
           options      = all${field}
           `
        s += req
        if(entity[fieldName].includes('has-many')){
          s += `\n           multiple     = true`
        }
        s +=  `
   }}`
        s += `{{else}}
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <br/>


    {{/if}}`
      }
      else{
        const formatedFieldName = fieldName

        if(formatedFieldName.length >= 4 && formatedFieldName.toLowerCase().endsWith("date")){
          s += "<label>"
          s += formatedFieldName
          s += "<br/>"
          s += "{{pikaday-input format=\"YYYY-MM-DD\" onSelection=(action (mut f.model." + formatedFieldName + "))}}"
          s += "</label>"
        }
        else if(type === "boolean"){
          s += " <label class=\"check\">\n" +
            "   taille\n" +
            "   {{f.input type=\"checkbox\" name=\"" + formatedFieldName + "\"" + req + "}}\n" +
            " </label>\n" +
            " <br/>"
        }
        else{
          s += "  {{f.input label=\"" + formatedFieldName + "\" name=\"" + formatedFieldName + "\"" + req + "}}\n"
        }

      }
    }
    return s;
  },

  entityModel(entity, entityName) {

    const entityNameCapitalize = inflection.capitalize(entityName)

    let s = "import Model, { attr, hasMany, belongsTo } from '@ember-data/model';\n"
    s += "export default class " + entityNameCapitalize + "Model extends Model  {\n"

    for (const fieldName in entity) {
      let type = entity[fieldName].toLowerCase()
      if(type.includes("!")) {
        let tmp = type.split("!")
        type = tmp[0]
      }
      const formatedFieldName = fieldName
      if (type !== "ID") {
        if (type === "string" || type === "int" || type === "boolean") {
          if (type === "int")
            s += "@attr('number') " + formatedFieldName + ";\n"
          else
            s += "@attr('" + type + "') " + formatedFieldName + ";\n"
        }
        else if (type.includes(':')) {
          const relationDescription = type.split(':')
          const relationsType = inflection.camelize(relationDescription[0], true)
          const relationEntity = inflection.camelize(relationDescription[1], true)
          switch (relationsType) {
            case "belongs-to":
              s += "@belongsTo('" + relationEntity + "') " + formatedFieldName + ";\n"
              break
            case "has-many":
              s += "@hasMany('" + relationEntity + "') " + formatedFieldName + ";\n"
              break
            default:
              break
          }
        }
        else {
          console.log("Invalid format type")
        }
      }
    }
    s += "}"
    return s
  },

  entityFactory(entity, entityName) {
    let s = "import { Factory, association } from 'ember-cli-mirage'\n"
    s += "import faker from 'faker'\n"
    s += "const NUMBER_RELATION = 5\n"
    s += "export default Factory.extend({\n"

    for (const fieldName in entity) {
      let type = entity[fieldName].toLowerCase()
      if(type.includes("!")) {
        let tmp = type.split("!")
        type = tmp[0]
      }
      const formatedFieldName = fieldName
      if (type !== "ID") {
        if (type === "string" || type === "int" || type === "boolean") {
          s += formatedFieldName + "() {\n"
          switch (type) {
            case "string":
              s += "return " + matching.matchString(formatedFieldName) + "},\n"
              break
            case "int":
              s += "return faker.random.number()},\n"
              break
            case "boolean":
              s += "return Math.random() >= 0.5},\n"
              break
            default:
              break
          }
        }
        else if (type.includes(':')) {
          const relationDescription = type.split(':')
          const relationEntity = inflection.camelize(relationDescription[1], true)
          const relationsType = inflection.camelize(relationDescription[0], true)
          // s += formatedFieldName + "(" + relationEntity + ") {\n"
          // s += "const regEx = /[0-9]/\n"
          // s += "if(regEx.test(" + relationEntity + ")){\n"
          // s += "return null\n"
          // s += "}\n"
          // s += "else {\n"
          // s += "return " + relationEntity + "\n"
          // s += "}\n"
          // s += "},\n"
          switch (relationsType) {
            case "belongs-to":
              s += formatedFieldName + ": association(), "
              break
            case "has-many":
              s += "afterCreate(" + relationEntity + ", server) {\n"
              s += "if(!" + relationEntity + "." + formatedFieldName + ") {\n"
              s += relationEntity + ".update({\n"
              s += formatedFieldName + ": server.createList('" + entityName.toLowerCase() + "', NUMBER_RELATION)\n"
              s += "})\n"
              s += "}\n"
              s += "}\n"
              break
            default:
              break
          }
        }
        else {
          console.log("Invalid format type for " + type)
        }
      }
    }
    s += "})"
    return s
  },

  getTable() {

    return `<ModelsTable
        @data={{this.model}}
        @columns={{this.columns}}
        />`
  },

  getComponent(entity, entityName) {
    let s = `import Component from '@ember/component';

    export default Component.extend({
      classNames: ['`;
    s += entityName + `'],
      columns: [ {propertyName: "id",
        title: "id"},\n`;
    for (const fieldName in entity) {
      if(entity[fieldName].includes('belongs-to')) {
        s += `{
        propertyName: "${fieldName}.id",
        title: "${fieldName}"
        },
      `
      }
      else if (entity[fieldName].includes('has-many')){
        s += `{
        propertyName: "${fieldName}",
        title: "${fieldName}",
        component: 'display-list-field',
        editable: false
        },
      `
      }
      else {
        s += `{
        propertyName: "${fieldName}",
        title: "${fieldName}"
        },
      `
      }
    }
    s += `{
          title: 'Edit',
          component: 'edit-row-comp',
          editable: false
        },`
    s += `{
          title: 'Delete',
          component: 'delete-row'
        }`
    s += `\n]

    });
    `
    return s;

  },

  getConfigMirage(entity, entityName) {
    // First case is plural query field (e.g employes)
    let s = "if(isPlural) {\n"
    const queryName = entityName.toLowerCase()
    const queryNamePlural = inflection.pluralize(queryName)
    const queryNameSingular = inflection.singularize(queryName)
    s += "\tlet results" + inflection.capitalize(queryNamePlural) + " = []\n"
    s += "schema.db." + queryNamePlural + ".map(" + queryNameSingular + " => {\n"
    s += "results" + inflection.capitalize(queryNamePlural) + ".push(\n"
    s += "{\n"
    s += "\"id\": " + queryNameSingular + ".id,\n"
    for (const fieldName in entity) {
      let type = entity[fieldName].toLowerCase()
      if(type.includes("!")) {
        let tmp = type.split("!")
        type = tmp[0]
      }
      const formatedFieldName = fieldName
      if (type !== "id") {
        if (type === "string" || type === "int" || type === "boolean") {
          s += "\"" + formatedFieldName + "\": " + queryNameSingular + "." + formatedFieldName + ",\n"
        }
        else if (type.includes(':')) {
          const relationDescription = type.split(':')
          const relationsType = inflection.camelize(relationDescription[0], true)
          const relationEntity = inflection.camelize(relationDescription[1], true)
          switch (relationsType) {
            case "belongs-to":
              s += "\"" + formatedFieldName + "\": schema.db." + inflection.pluralize(relationEntity) + ".findBy({id: " + queryNameSingular + "." + formatedFieldName + "Id}),\n"
              break
            case "has-many":
              s += "\"" + fieldName + "\": schema.db." + inflection.pluralize(relationEntity) + ".find(" + queryNameSingular + "." + formatedFieldName + "Ids),\n"
              break
            default:
              break
          }
        }
      }
    }
    s += "})\n"
    s += "})\n"
    s += "return results" + inflection.capitalize(queryNamePlural)
    s += "}\n"

    // Then  singular query field (e.g employe)
    s += "else {\n"
    s += "const paramId = bodyJSON.variables.id ? bodyJSON.variables.id : 1\n"
    s += "const " + queryNameSingular + " = schema.db." + queryNamePlural + ".find(paramId)\n"
    s += "return {\n"
    s += "\"data\": {\n"
    s += queryName + ": {\n"
    s += "\"id\": " + queryNameSingular + ".id,\n"
    for (const fieldName in entity) {
      let type = entity[fieldName].toLowerCase()
      if(type.includes("!")) {
        let tmp = type.split("!")
        type = tmp[0]
      }
      const formatedFieldName = fieldName
      if (type !== "id") {
        if (type === "string" || type === "int" || type === "boolean") {
          s += "\"" + formatedFieldName + "\": " + queryNameSingular + "." + formatedFieldName + ",\n"
        }
        else if (type.includes(':')) {
          const relationDescription = type.split(':')
          const relationsType = inflection.camelize(relationDescription[0], true)
          const relationFieldType = inflection.pluralize(relationsType).toLowerCase()
          const relationEntity = inflection.camelize(relationDescription[1], true)
          switch (relationsType) {
            case "belongs-to":
              s += "\"" + formatedFieldName + "\": schema.db." + inflection.pluralize(relationEntity) + ".findBy({id: " + queryNameSingular + "." + formatedFieldName + "Id}),\n"
              break
            case "has-many":
              s += "\"" + fieldName + "\": schema.db." + inflection.pluralize(relationEntity) + ".find(" + queryNameSingular + "." + formatedFieldName + "Ids),\n"
              break
            default:
              break
          }
        }
      }

    }
    s += "}\n"
    s += "}\n"
    s += "}\n"
    s += "}\n"
    return s
  },

  getScenarioMirage(entity, entityName) {
    const formatedEntityName = entityName.toLowerCase()
    const formatedEntityNameSingular = inflection.singularize(formatedEntityName)
    let s = "server.createList('" + formatedEntityNameSingular + "', number)"
    // for (const fieldName in entity) {
    //   const type = entity[fieldName].toLowerCase()
    //   const formatedFieldName = fieldName.toLowerCase()
    //   if (type !== "id" && type !== "string" && type !== "int" && type !== "boolean") {
    //     const relationDescription = type.split(':')
    //     const relationsType = inflection.camelize(relationDescription[0], true)
    //     const relationEntity = inflection.camelize(relationDescription[1], true)

    //     switch (relationsType) {
    //       case "belongs-to":
    //         s += formatedFieldName + ": server.create('" + relationEntity + "'),"
    //         break
    //       case "has-many":
    //         s += formatedFieldName + ": server.createList('" + relationEntity + "', number),"
    //         break
    //       default:
    //         break
    //     }
    //   }
    // }
    // s += "})"
    return s
  },

  locals(options) {
    // Return custom template variables here.
    return {
      upperFirstLetter : this.upperFirstLetter(this.entityName),
      fieldsForValidation : this.fieldsForValidation(options.entity.options),
      initFunction : this.initFunction(options.entity.options, this.entityName),
      allFunctions : this.allFunctions(options.entity.options),
      otherFields : this.otherFields(options.entity.options),
      jsonFieldsForCreate : this.jsonFieldsForCreate(options.entity.options),
      updateFields : this.updateFields(options.entity.options, this.entityName),
      listColumnsTableFilled : this.listColumnsTableFilled(options.entity.options),
      listColumnsTable : this.listColumnsTable(options.entity.options),
      entityName: this.entityName,
      entityNameUpperCase: inflection.capitalize(this.entityName),
      entityModel: this.entityModel(options.entity.options, this.entityName),
      entityFactory: this.entityFactory(options.entity.options, this.entityName),
      componentEntity: this.getComponent(options.entity.options, this.entityName),
      templateComponent: this.getTable(),
      configEntityMirage: this.getConfigMirage(options.entity.options, this.entityName),
      scenarioEntityMirage: this.getScenarioMirage(options.entity.options, this.entityName)
    };
  }

  // afterInstall(options) {
  //   // Perform extra work here.
  // }
};
