import { layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from '../templates/components/delete-row';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';


export default
@templateLayout(layout)
class EditRowComponent extends Component {

  @service router;

  @service flashMessages;

  record = null;

  displayNotification(msg){
    get(this, 'flashMessages').clearMessages();
    get(this, 'flashMessages').add({message: msg, timeout: 15000});
  }

  click(event) {
    this.displayNotification("Deleting...")
    this.record.destroyRecord().then((data) => {
      console.log("Record destroyed")
      this.displayNotification("Record destroyed")
    })
      .catch((error) => {
        console.log("Error deleting")
        this.record.transitionTo('loaded.saved');
        this.record.rollbackAttributes()
        console.log(error)
        this.displayNotification(error)
      })
  }

}
