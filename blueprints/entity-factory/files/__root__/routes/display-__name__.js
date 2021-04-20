import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default class Display<%=entityName.singular%>Route extends Route {
  @service router;
  @service flashMessages;

  displayNotification(msg){
    get(this, 'flashMessages').clearMessages();
    get(this, 'flashMessages').add({message: msg, timeout: 15000});
  }

  model(params) {
    this.displayNotification('Loading ...')
    return this.store.findAll('<%=entityName.singular%>').then(data => {
      this.displayNotification('Datas load !')
      return data
    }).catch(error => {
      console.log(error)
      this.displayNotification('Error : ' + error.errors[0].message)
      this.router.transitionTo('tables')
    })
  }

}
