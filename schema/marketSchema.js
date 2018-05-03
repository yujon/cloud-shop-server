var schemaConf = require('./collection');
var mongoose = require('mongoose');

var MarketSchema = new mongoose.Schema({
	...(schemaConf['markets'])
	},{ _id: true})


module.exports = MarketSchema;