import Controller from '@ember/controller';
import { action } from '@ember/object';
import <%=entityName.lowercap%>Validations from '../../validations/<%=entityName.lowercase%>'

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

  <%=entityName.lowercap%>Validations,

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

  displayNotification(msg){
  get(this, 'flashMessages').clearMessages();
  get(this, 'flashMessages').add({message: msg, timeout: 15000});
},

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

  submit: action(async function(model, fields) {
    this.displayNotification('Saving...')
    let rout = this.router
    let formatDate = this.formatDate;
    let data = this.store.createRecord('<%=entityName%>',{
      <% fields.filter(f => f.isScalar && !f.isDate).forEach(field => { %>       <%=field.name%> : formatDate(fields["<%=field.name%>"]),
      <% } ) %>
      <% fields.filter(f => f.isScalar && f.isDate).forEach(field => { %>       <%=field.name%> : fields["<%=field.name%>"],
      <% } ) %>
      <% fields.filter(f => !f.isScalar && f.relationType == 'has-many').forEach(field => { %>       <%=field.name%> : fields["<%=field.name%>"].toArray(),
      <% } ) %>      
      id : this.nextId++
    });
    data.save().then(success => {
      this.displayNotification('Saved !')
      rout.transitionTo('display-<%=entityName%>')
    }).catch(error => {
      this.displayNotification("ERROR  : " + error.errors[0].message)
    })

  })

});
