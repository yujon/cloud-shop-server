var schemaConf = require('./collection');
var mongoose = require('mongoose');

var shopSchema = new mongoose.Schema({
	...(schemaConf['shops']),
	},{ _id: true})


module.exports = shopSchema;