import Controller from '@ember/controller';
import {inject as service} from '@ember/service';
import ENV from '../config/environment'

export default Controller.extend({
    session: service(),
    router: service(),
    flashMessages: service(),


    actions: {
        async authenticate() {
            let {identification, password} = this.getProperties('identification', 'password');
            let username = identification
            const credentials = {
                username,
                password
            };

            if (!ENV["ember-cli-mirage"].usingProxy) {
              if (username == password) {
                    console.log("development mode login OK if username = password");
                    // todo this not sufficient to get a 'real fake' authentication
                    this.session.isAuthenticated = true;
                    this.router.transitionTo('home');
                } else {
                    this.flashMessages.clearMessages();
                    this.flashMessages.add({message: "Incorrect password", timeout: 15000});
                }
            } else {
                try {
                    await this.session.authenticate('authenticator:cognito', credentials);
                } catch (error) {
                    this.flashMessages.clearMessages();
                    this.flashMessages.add({message: error.message, timeout: 15000});
                    console.log("err : ", error)
                }

                if (this.session.isAuthenticated) {
                    this.router.transitionTo('home')
                }
            }
        }
    }
});
