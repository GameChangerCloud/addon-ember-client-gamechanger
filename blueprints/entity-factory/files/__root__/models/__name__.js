import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class <%=entityName.lowercap%>Model extends Model  {

// todo : processing of boolean has to be checked
// todo : Processing of scalar still to be implemented
<% fields.filter(f => f.isScalar && f.type != 'ID').forEach(field => { %>   @attr('<%=field.type.toLowerCase()%>') <%=field.name%>;
<% }); %>
<% fields.filter(f => f.relationType == 'has-many').forEach(field => { %>   @hasMany('<%=field.type.toLowerCase()%>') <%=field.name%>;
<% }); %>
<% fields.filter(f => f.relationType == 'belongs-to').forEach(field => { %> @belongsTo('<%=field.type.toLowerCase()%>') <%=field.name%>;
<% }); %>}
