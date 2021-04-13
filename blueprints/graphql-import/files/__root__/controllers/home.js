import Controller from '@ember/controller';
import Params from '../params'

export default Controller.extend({
  api : Params.getApi()
})
