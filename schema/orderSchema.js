var schemaConf = require('./collection');
var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
	...(schemaConf['orders'])
	},{ _id: true})


module.exports = orderSchema;