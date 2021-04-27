'use strict';
const inflection = require('inflection')
const fs = require ('fs')
const stringUtils = require('ember-cli-string-utils')

module.exports = {
  description: 'my blueprints',
  normalizeEntityName() { }, // no argument

  fileMapTokens: function (options) {
    return {
      __root__() {
        if (options.inDummy) {
          return 'test/dummy/app'
        }
        else {
          return 'app'
        }
      },
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
    fs.writeFileSync("./app/styles/app.css", this.getCSS())
    if (this.isFileSync("./app/router.js")) {
      fs.unlinkSync("./app/router.js")
    }
    if (this.isFileSync("./app/templates/application.hbs")) {
      fs.unlinkSync("./app/templates/application.hbs")
    }

  },

  getCSS() {
    return `@import 'ember-aws-graphql.css';

      label{
        width: 100%;
        font-weight: bold;
        text-transform: capitalize;
        margin-top: 15px;
        margin-bottom: 0px;
      }

      input{
        width: 30%;
        height: 30px;
      }

      label.check{
        width: 20%;
      }

      select{
        width: 30%;
      }

      button.valid-form{
        margin-top: 40px;
        width: 30%;
      }

      .notification {
        position: fixed;
        bottom : 0px;
        right : 5px;
      }

      .login{
        left:35%;
        width: 30%;
        padding: 50px;
        position: absolute;
        top: 25%;
        text-align: center;
      }

      .logout{
        cursor: pointer;
      }

      `
  },

  getAppName(options) {
    let path = options.target
    const path2 = require('path');
    let separator = path2.sep
    let pathArray = path.split(separator)

    let appName = stringUtils.dasherize(inflection.underscore(pathArray[pathArray.length - 1]))

    return appName
  },

  locals(options) {
    // Return custom template variables here.
    // Return custom template variables here.
    this.appName = this.getAppName(options)
    return {
      appName : this.appName
    };
  },

  afterInstall(options) {
    return this.addAddonsToProject({
      packages: [
        { name: 'ember-ajax' },
        { name: 'ember-graphql-adapter' },
        { name: 'ember-cli-mirage' },
        { name: '@ember/jquery' },
        { name: 'ember-models-table' },
        { name: 'ember-bootstrap' },
        { name: 'ember-validated-form' },
        { name: 'ember-changeset' },
        { name: 'ember-models-table' },
        { name: 'ember-changeset-validations' },
        { name: 'ember-pikaday'},
        { name: 'ember-cli-flash'},
        { name: 'ember-simple-auth'},
        { name: 'ember-cognito'},
        { name: 'ember-cli-deploy'},
        { name: 'ember-cli-deploy-aws-pack'}

      ]
    }).then(() => {
      return this.addPackagesToProject([
        { name: 'faker' }
      ])
    })
  }
};
