var schemaConf = require('./collection');
var mongoose = require('mongoose');

var InformationSchema = new mongoose.Schema({
	...(schemaConf['informations'])
	},{ _id: true})


module.exports = InformationSchema;