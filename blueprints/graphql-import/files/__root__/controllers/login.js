import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  router: service(),
  flashMessages: service(),


  actions: {
    async authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      let username = identification
      const credentials = { username, password };
      try {
        await this.session.authenticate('authenticator:cognito', credentials);
      } catch (error) {
        this.flashMessages.clearMessages();
        this.flashMessages.add({message: error.message, timeout: 15000});
        console.log("err : ", error)
      }

      if (this.session.isAuthenticated) {
        this.router.transitionTo('home')
        // What to do with all this success?
      }
    }
  }
});
