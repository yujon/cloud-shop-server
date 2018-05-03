var schemaConf = require('./collection');
var mongoose = require('mongoose');

var settingSchema = new mongoose.Schema({
	...(schemaConf['settings']),
	},{ _id: true})


module.exports = settingSchema;