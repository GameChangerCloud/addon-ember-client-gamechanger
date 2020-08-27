import Route from '@ember/routing/route';

export default class Display<%=entityName%>Route extends Route {

  model(params) {
    console.log(params)
    // return this.store.query('blog', {
    // 	skip: params.page,
    // 	sort_order: 1,
    // 	limit: 2
    // })
    return this.store.findRecord('<%=entityName%>', params.<%=entityName%>_id);
  }

}
