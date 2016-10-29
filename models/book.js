var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Book', new Schema({ 
	title: 		{type: String },
  subTitle: {type: String },
  url:      {type: String },
	googleId: {type: String }, 
	author:   {type: String },
	thumbnail:{type: String },
	owner: 		{type: String },
	tradeReq: {type: String },
	traded:   {type: Boolean },
}));