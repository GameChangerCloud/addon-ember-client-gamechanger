import {layout as templateLayout} from '@ember-decorators/component';
import Component from '@ember/component';
import layout from '../templates/components/edit-row-comp';
import { inject as service } from '@ember/service';


export default
@templateLayout(layout)
class EditRowComponent extends Component {

  @service router;

  record = null;

  click(event) {
    this.router.transitionTo('update.' + this.record._internalModel.modelName, this.record);
  }

}
