import EmberRouter from '@ember/routing/router';
    import config from './config/environment';

    export default class Router extends EmberRouter {
      location = config.locationType;
      rootURL = config.rootURL;
    }

    Router.map(function() {
      this.route('home', function() {});

			// If entities are created individually, add the corresponding routes with this syntax :

			/** this.route('display-<entity-name>', function(){}); */
});
