import Controller from '@ember/controller';
import { action } from '@ember/object';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Controller.extend({
  router: service(),
  flashMessages: service(),

  // OtherFields
  <% fields.filter(f => !f.isScalar).forEach(field => { %>  all<%= field.type.toLowerCase() %> : [],
    first<%= field.type.toLowerCase() %> : "<%= field.isScalar %>",
    <%= field.type.toLowerCase() %>IsLoad : false,
  <% }); %>
    nextId : 0,

  // InitFunctions
  init() {
    this._super(...arguments);
    this.initNextId()
<% fields.filter(f => !f.isScalar).forEach(field => { %>    this.findAll<%=field.type.toLowerCase()%>()
<% }); %>  },
  
  initNextId: action(async function() {
   this.store.query('<%=entityName.singular%>', {}).then(
      x => {
        x.forEach(y => {
          this.nextId++
        })
      })
  }),

    // AllFunctions
<% fields.filter(f => !f.isScalar).forEach(field => { %>  findAll<%=field.type.toLowerCase()%>: action(async function() {
      this.store.query('<%=field.type.toLowerCase()%>', {}).then(
        x => {
          x.forEach(y => {
            this.all<%=field.type.toLowerCase()%>.push(y)
          })
          let fields = []
          this.all<%=field.type.toLowerCase()%>[0].eachAttribute(x => fields.push(x))
          this.first<%=field.type.toLowerCase()%> = fields[0]
           this.set('<%=field.type.toLowerCase()%>IsLoad', true);
          return this.all<%=field.type.toLowerCase()%>;
        }
      )
    }),
<% }); %>

  formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
},

displayNotification(msg){
  this.flashMessages.clearMessages();
  this.flashMessages.add({message: msg, timeout: 15000});
},


  submit: action(async function(model, fields) {
    let notif = this.flashMessages
    this.displayNotification("Updating...")
    let rout = this.router
    let formatDate = this.formatDate
    this.store.findRecord('<%=entityName.singular%>', fields["id"]).then(async function(<%=entityName.singular%>) {
      // ...after the record has loaded
<% fields.filter(f => f.isScalar && !f.isDate).forEach(field => { %>       <%=entityName.singular%>.<%=field.name%> = formatDate(fields["<%=field.name%>"])
<% } ) %>
<% fields.filter(f => f.isScalar && f.isDate).forEach(field => { %>       <%=entityName.singular%>.<%=field.name%> = fields["<%=field.name%>"]
<% } ) %>
<% fields.filter(f => !f.isScalar && f.relationType == 'has-many').forEach(field => { %>       <%=entityName.singular%>.<%=field.name%> = fields["<%=field.name%>"].toArray()
<% } ) %>
      
      await <%=entityName.singular%>.save().then(() => {
          console.log("saved")
          notif.add({message: "Saved", timeout: 15000})
          rout.transitionTo('display-<%=entityName.singular%>')
      }).catch(error => {
        console.log(error)
        notif.add({message: error, timeout: 15000})
      })
    }).catch(error => {
      this.displayNotification("ERROR  : " + error)
    });
  })

});
