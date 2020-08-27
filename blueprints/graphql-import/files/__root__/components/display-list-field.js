import {layout as templateLayout} from '@ember-decorators/component';
import Component from '@ember/component';
import layout from '../templates/components/edit-row-comp';
import { inject as service } from '@ember/service';


export default
@templateLayout(layout)

class DisplayListFieldComponent extends Component {

  @service router;

  record = null;


  lst = "[]";

  init() {
    super.init(...arguments);
    this.lst = this.getList();
  }

  getList(){
    let lst = this.record[this.column.propertyName]
    let s = "["
    lst.forEach(x => {
      s += x.id + ", "
    })
    s = s.substring(0, s.length-2)
    if(s.length == 0)
      s += "["
    s += "]"
    return s;
  }

}
