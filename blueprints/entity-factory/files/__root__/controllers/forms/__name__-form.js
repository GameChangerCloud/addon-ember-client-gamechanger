import Controller from '@ember/controller';
import { action } from '@ember/object';
import <%=upperFirstLetter%>Validations from '../../validations/<%=entityName%>'

import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Controller.extend({
  router: service(),
  flashMessages: service(),



  <%=otherFields%>
<%=upperFirstLetter%>Validations,
  <%=initFunction%>

  <%=allFunctions%>

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
    let data = this.store.createRecord('<%=entityName%>', <%=jsonFieldsForCreate%>);
    data.save().then(success => {
      this.displayNotification('Saved !')
      rout.transitionTo('display-<%=entityName%>')
    }).catch(error => {
      this.displayNotification("ERROR  : " + error.errors[0].message)
    })

  })

});
