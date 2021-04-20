
export default function (schema, bodyJSON, isPlural) {

	if (isPlural) {
        let results<%= entityName.pluralcap %> = []
        schema.db.<%= entityName.lowerplural %>.map(<%= entityName.lowercase %> => {
            results<%= entityName.pluralcap %>.push({
<% fields.forEach(field => { if (field.isScalar) {%>			"<%= field.name %>": <%= entityName.lowercase %>.<%= field.name %>,
<% } else { if (field.relationType === 'has-many') { %>			"<%= field.name %>": schema.db.<%= field.pluralType.toLowerCase() %>.find(<%= entityName.lowercase %>.<%= field.name %>Ids),
<% } else { %> 			"<%= field.name %>": schema.db.<%= field.pluralType.toLowerCase() %>.findById({id: <%= entityName.lowercase %>.<%= field.name %>)Id},
<% } } }); %>
            })
        })
        return results<%= entityName.pluralcap %>
    } else {
        const paramId = bodyJSON.variables.id ? bodyJSON.variables.id : 1
        const <%= entityName.lowercase %> = schema.db.<%= entityName.lowerplural %>.find(paramId)
        return {
            "data": {
                <%= entityName.lowercase %>: {
	<% fields.forEach(field => { if (field.isScalar) {%>			"<%= field.name %>": <%= entityName.lowercase %>.<%= field.name %>,
	<% } else { if (field.relationType === 'has-many') { %>			"<%= field.name %>": schema.db.<%= field.pluralType.toLowerCase() %>.find(<%= entityName.lowercase %>.<%= field.name %>Ids),
	<% } else { %> 			"<%= field.name %>": schema.db.<%= field.pluralType.toLowerCase() %>.findById({id: <%= entityName.lowercase %>.<%= field.name %>)Id},
	<% } } }); %>
                }
            }
        }
    }

}
