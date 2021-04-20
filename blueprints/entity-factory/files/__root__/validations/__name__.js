import {
  validatePresence,
  validateLength,
  validateInclusion
} from "ember-changeset-validations/validators";

export default {

<% fields.filter(f => f.noNull && f.isScalar && f.type != 'ID').forEach(field => { %> <%=field.name%>: [validatePresence(true), validateLength({ min: 3, max: 40 })],
<% }); %>
<% fields.filter(f => f.noNull && !f.isScalar).forEach(field => { %> <%=field.name%>: [validatePresence(true)],
<% }); %>};
