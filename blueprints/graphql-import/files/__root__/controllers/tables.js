import $ from 'jquery';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import Params from '../params'


export default Controller.extend({
  flashMessages: service(),
  session: service(),
  prefix : 'https://cors-anywhere.herokuapp.com/',
  api_endpoint : Params.getApi(),
  tables_exist : false,
  is_load : false,

  init() {
    this._super(...arguments);
    this.checkTables()
  },

  displayNotification(msg){
    get(this, 'flashMessages').clearMessages();
    get(this, 'flashMessages').add({message: msg, timeout: 15000});
  },


  checkTables: action(async function() {
    let notif = this.notify
    let endpoint_url = this.prefix + this.api_endpoint
    $.ajax({
      url: endpoint_url,
      type: "POST",
      headers: { "Authorization" : this.session.data.authenticated.access_token},
      data: JSON.stringify({
        existTable: 'ok'
      })
    }).then(resp => {
      this.set('tables_exist', (resp.body == 'true'));
      this.set('is_load', true);
      // handle your server response here
    }).catch(function(error){
      notif.info(error)
      // handle errors here
    });
  }),

  updateDatabase: action(async function() {
    let notif = this.notify
    let endpoint_url = this.prefix + this.api_endpoint
    $.ajax({
      url: endpoint_url,
      type: "POST",
      headers: { "Authorization" : this.session.data.authenticated.access_token},
      data: JSON.stringify({
        updateDatabase: 'ok'
      })
    }).then(resp => {
      this.displayNotification("Update done")
      // handle your server response here
    }).catch(function(error){
      notif.info(error)
      // handle errors here
    });
  }),


  checkTablesButton: action(async function() {
    this.displayNotification('Loading...')
    let endpoint_url = this.prefix + this.api_endpoint
    $.ajax({
      url: endpoint_url,
      type: "POST",
      headers: { "Authorization" : this.session.data.authenticated.access_token},
      data: JSON.stringify({
        existTable: 'ok'
      })
    }).then(resp => {
      this.displayNotification(this.tables_exist? 'Les tables sont déjà créées' : 'Les tables n\'existent pas')
      // handle your server response here
    }).catch(error => {
      this.displayNotification(error)
      // handle errors here
    });
  }),

  createTables: action(async function(model, fields) {
    this.displayNotification('Loading...')
    let endpoint_url = this.prefix + this.api_endpoint
    $.ajax({
      url: endpoint_url,
      type: "POST",
      headers: { "Authorization" : this.session.data.authenticated.access_token},
      data: JSON.stringify({
        initTable: 'ok'
      })
    }).then(resp => {
      window.location.reload(true);
      this.displayNotification('Created')
      // handle your server response here
    }).catch(error => {
      this.displayNotification(error)
      // handle errors here
    });
  }),

  fillTables: action(async function(model, fields) {
    this.displayNotification('Loading...')
    let endpoint_url = this.prefix + this.api_endpoint
    $.ajax({
      url: endpoint_url,
      type: "POST",
      headers: { "Authorization" : this.session.data.authenticated.access_token},
      data: JSON.stringify({
        fillTable: 'ok'
      })
    }).then(resp => {
      this.displayNotification(resp.body)
      // handle your server response here
    }).catch(error => {
      this.displayNotification(error)
      // handle errors here
    });
  }),

  cleanTables: action(async function(model, fields) {
    this.displayNotification('Loading...')
    let endpoint_url = this.prefix + this.api_endpoint
    $.ajax({
      url: endpoint_url,
      type: "POST",
      headers: { "Authorization" : this.session.data.authenticated.access_token},
      data: JSON.stringify({
        cleanTables: 'ok'
      })
    }).then(resp => {
      this.displayNotification(resp.body)
      // handle your server response here
    }).catch(error => {
      this.displayNotification(error)
      // handle errors here
    });
  }),

  dropTables: action(async function(model, fields) {
    this.displayNotification('Loading...')
    let endpoint_url = this.prefix + this.api_endpoint
    $.ajax({
      url: endpoint_url,
      type: "POST",
      headers: { "Authorization" : this.session.data.authenticated.access_token},
      data: JSON.stringify({
        dropTables: 'ok'
      })
    }).then(resp => {
      window.location.reload(true);
      this.displayNotification("Dropped")
      // handle your server response here
    }).catch(error => {
      this.displayNotification(error)
      // handle errors here
    });
  })

})
