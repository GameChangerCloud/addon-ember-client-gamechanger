import Controller from '@ember/controller';
import { action } from '@ember/object';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Controller.extend({
  router: service(),
  flashMessages: service(),

<%=otherFields%>

<%=initFunction%>

<%=allFunctions%>

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
    let formatDate = this.formatDate;
    this.store.findRecord('<%=entityName%>', fields["id"]).then(async function(<%=entityName%>) {
      // ...after the record has loaded
      <%=updateFields%>

    }).catch(error => {
      this.displayNotification("ERROR  : " + error)
    });
  })

});
