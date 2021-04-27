import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
    location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
    this.route('login');
    this.route('tables', function() {});
    this.route('home', function() {});
<% entityNames.forEach(elt => { %>    this.route('display-<%= elt.singular.toLowerCase() %>', function() {});
    this.route('forms.<%= elt.singular.toLowerCase() %>-form', function() {});
<% }); %>
    this.route('update', function() {  
<% entityNames.forEach(elt => { %>        this.route('<%= elt.singular.toLowerCase() %>', {path: '/<%= elt.singular.toLowerCase() %>/:<%= elt.singular.toLowerCase() %>_id'});
<% }); %>
    });
});