var schemaConf = require('./collection');
var mongoose = require('mongoose');

var commoditySchema = new mongoose.Schema({
	...(schemaConf['commodities']),
	},{ _id: true})


module.exports = commoditySchema;