import JSONAPISerializer from '@ember-data/serializer/json-api';
import { Serializer } from 'ember-graphql-adapter'

export default class ApplicationSerializer extends Serializer {

	normalizeResponse(store, primaryModelClass, payload, id, requestType) {
		if(payload.errorMessage){
			let response = JSON.stringify(payload.errorMessage)
			throw payload.errorMessage
		}
		else{
			return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
		}
  }
	
	serializeBelongsTo(snapshot, json, relationship) {
		let { key, kind, options } = relationship;
		let embeddedSnapshot = snapshot.belongsTo(key);
		// if (options.async) {
		let serializedKey = this.keyForRelationship(key, kind, options);
		if (!embeddedSnapshot) {
			json[serializedKey] = null;
		} else {
			json[serializedKey] = embeddedSnapshot.id;
			if (options.polymorphic) {
				this.serializePolymorphicType(snapshot, json, relationship);
			}
		}
		// } else {
		// 	this._serializeEmbeddedBelongsTo(snapshot, json, relationship);
		// }
	}
}