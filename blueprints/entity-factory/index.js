'use strict';

const inflection = require('inflection')
const matching = require('./utils/matching')
const scalars = require('./utils/scalar')

const fs = require('fs')
const stringUtils = require('ember-cli-string-utils')

module.exports = {
  description: '',
  entityName: '',

  normalizeEntityName(entityName) {
    this.entityName = entityName //entity.name
  },

  fileMapTokens(options) {
    console.log("**** fileMapTokens options.locals.entityName.lowercase="+options.locals.entityName.lowercase)
    return {
      __name__(options) {
        return options.locals.entityName.lowercase
      }, 
      __dashname__(options) {
        return options.locals.entityName.dasherize
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

  getEntityNamesAndPlurals(ent) {
    console.log("****** getEntityNamesAndPlurals for entity "+ent)
     console.log("****** getEntityNamesAndPlurals dasherized entity "+stringUtils.dasherize(ent))

      return {
        "singular": ent.toLowerCase(),                                                        // Asset,  Person, PageFragment
        "plural": inflection.pluralize(ent.toLowerCase()),                                        // Assets, People, PageFraments
        "lowercase": ent.toLowerCase(),                                         // asset,  person, pagefragment
        "lowerplural": inflection.pluralize(ent.toLowerCase()),             // assets,  persons, pagefragments
        "lowercap": stringUtils.capitalize(ent.toLowerCase()),                   // Asset,  Person, Pagefragment
        "pluralcap": stringUtils.capitalize(inflection.pluralize(ent).toLowerCase()), // Assets, People, Pagefragments
        "dasherize": stringUtils.dasherize(ent)                                  // asset,  person, page-fragment
      }
  },

  completeField(field, defaultScalars) {
    // Todo : determine if type is a known scalar or not
    if (field.type === "String" || field.type === "Int" || field.type === "Float" || field.type === "Boolean" || field.type === "ID" || defaultScalars.includes(field.type)) {
      // simple type
      field['isScalar']=true
      field['faker']= matching.matchString(field.name, field.type)
      field['input'] = matching.inputField(field.name, field.type, field.noNull, false)
      field['inputWithModel'] = matching.inputField(field.name, field.type, field.noNull,true)
      field['isDate'] = matching.classifyType(field.name, field.type)
      field['embertype'] = matching.matchType(field.type.toLowerCase())
      //field['validator'] = matching.findValidator(field.name, field.type)
    } else {
      // relationship
      field['isScalar']=false
      field['pluralType'] = inflection.pluralize(field.type)
      if (field.isArray) {
        field['relationType']='has-many'
      } else {
        field['relationType']='belongs-to'
      }
    }
    return field
  },

  completeFields(fields, defaultScalars) {
    return fields.map(field => this.completeField(field, defaultScalars))
  },

  locals(options) {
    let defaultScalars = []
		for (const scalarName in scalars) {
			if (scalars.hasOwnProperty(scalarName)) {
				defaultScalars.push(scalars[scalarName])
			}
		}
    let fields = this.completeFields(JSON.parse(options.taskOptions.args[2]), defaultScalars);
    //fields.forEach(field => console.log(field.name));

    return {
      entityName: this.getEntityNamesAndPlurals(this.entityName),
      fields: fields,
    };
  },

  afterInstall(options) {
   // Perform extra work here.
   console.log("Generation completed")
  }
};
