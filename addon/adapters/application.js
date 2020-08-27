
import DS from 'ember-data';

// Import des query (all and by id)

// Import des Types (models)

export default DS.Adapter.extend({

	getQuery(type, id) {
		switch (type) {

			case EmployeModel:
				if (id)
					return queryEmployeById
				else
					return queryEmployes

			case WorkModel:
				if (id)
					return queryWorkById
				else
					return queryWorks

			default:
				break

		}
	},

	findAll(store, type) {
		let result
		let query = this.getQuery(type, null)
		result = this.apollo.watchQuery({ query: query }).then(response => {
			return response
		})
		return result

	}
})
