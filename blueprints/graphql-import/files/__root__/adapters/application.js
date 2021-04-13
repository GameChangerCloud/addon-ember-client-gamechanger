import Adapter from '@ember-data/adapter';
import GraphQLAdapter from 'ember-graphql-adapter';
import ENV from '<%=appName%>/config/environment';
import Params from '../params'
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends GraphQLAdapter {
  @service session
  endpoint = Params.getApi()
  dataType = 'json'
  httpMethod = 'POST'
  headers = {
    'Authorization': this.session.data.authenticated.access_token,
  };
  request(store, type, options) {
    if(ENV["ember-cli-mirage"].enabled){
      this.endpoint = "/mirage"
    }
    let compiledQuery = this.compile(store, type, options);
    let url = this.endpoint;
    let ajaxOpts = this.ajaxOptions({ query: compiledQuery });
    ajaxOpts.contentType = 'application/json; charset=utf-8';
    return this.ajax(url, ajaxOpts);
  }
}
