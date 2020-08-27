import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Route.reopen({
  // By default, all routes are authenticated. i.e. they will need to be signed in
  // To make a route non authenticated, set authenticated to false.
  //
  // If a user tries entering an non authenticated route and they are authenticated,
  // they will be redirected to the route which is displayed after authentication.
  // This is useful for login pages and pages you don't want the user to see when they
  // are signed in.
  //
  // This creates a strict dichotomy of pages which the user can see when they are
  // signed in and signed out which may not be appropriate. It might be worth separating
  // out unauthenticated route into its own flag.

  session: service(),

  beforeModel(transition) {
    // TODO Double check this

    this._super(transition);
    if(this.session.isAuthenticated === false)
      this.transitionTo('login');
  }
});
