var schemaConf = require('./collection');
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	...(schemaConf['messages'])
	},{ _id: true})


module.exports = MessageSchema;