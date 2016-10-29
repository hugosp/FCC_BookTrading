var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({ 
	name: 		{type: String },
	email: 		{type: String, unique: true}, 
	password: {type: String },
	admin: 		{type: Boolean }
}));