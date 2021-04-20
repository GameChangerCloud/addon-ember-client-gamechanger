import Component from '@ember/component';

export default Component.extend({
      classNames: ['<%= entityName.lowercase %>'],
      columns: [ {propertyName: "id",
        title: "id"},
<% fields.forEach(field => { if (field.isScalar) { %>       {
            propertyName: "<%= field.name %>",
            title: "<%= field.name %>"
        },
    <% } else { if (field.relationType === 'belongs-to') { %>        {
        propertyName: "<%= field.name %>",
        title: "<%= field.name %>",
        tobechecked: true
    },
    <% } else { %>      {
        propertyName: "<%= field.name %>",
        title: "<%= field.name %>",
        component: 'display-list-field',
        editable: false
    },
    <% } } }); %>           
      {
          title: 'Edit',
          component: 'edit-row-comp',
          editable: false
        },{
          title: 'Delete',
          component: 'delete-row'
        }
    ]
    });
    