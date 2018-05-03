var schemaConf = require('./collection');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	...(schemaConf['users']),
	},{ _id: true})


module.exports = userSchema;