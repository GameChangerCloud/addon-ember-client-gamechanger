<%=importDefaultScenarioMirage%>

const NUMBER_ENTITY = 10

export default function(server) {

	/*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

// server.createList('employe', NUMBER_ENTITY, {work: server.create('work', {person: null})})
// server.createList('work', NUMBER_ENTITY, {person: server.createList('employe', NUMBER_RELATION_ENTITY, {work: null})})
// server.createList('service', NUMBER_ENTITY, {workfield: server.createList('work', NUMBER_RELATION_ENTITY, {person: null})})

<%=defaultScenarioMirage%>


}