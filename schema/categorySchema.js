var schemaConf = require('./collection');
var mongoose = require('mongoose');

var CategoriesSchema = new mongoose.Schema({
	...(schemaConf['categories'])
	},{ _id: true})


module.exports = CategoriesSchema;