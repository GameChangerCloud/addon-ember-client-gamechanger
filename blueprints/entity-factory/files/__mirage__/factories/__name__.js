import {Factory, association} from 'ember-cli-mirage'
import faker from 'faker'

const NUMBER_RELATION = 5

export default Factory.extend({
<% fields.forEach(field => { if (field.isScalar) { %>   <%= field.name %>() {
        return <%= field.faker %>
    },
<% } else { if (field.relationType === 'belongs-to') { %>   <%= field.name %>: association(),   
<% } else { %>    afterCreate(<%=field.type.toLowerCase() %>, server) {
    if (!<%=field.type.toLowerCase() %>.<%= field.name %>) {
        <%=field.type.toLowerCase() %>.update({
            <%= field.name %>: server.createList('<%=entityName.lowercase %>', NUMBER_RELATION)
        })
    }
},
<% } } }); %>   
})