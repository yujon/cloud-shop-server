var errorController = require('./error');
var uploadController = require('./upload');
var userController = require('./user');
var commodityController = require('./commodity');
var orderController = require('./order');
var informationController = require('./information');
var messageController = require('./message');
var shopController= require('./shop');
var categoryController= require('./category');
var marketController= require('./market');
var settingController = require('./setting')

module.exports = {
	error:errorController,
	upload:uploadController,
    user:userController,
    commodity:commodityController,
    order:orderController,
    information:informationController,
    message:messageController,
    shop:shopController,
    category:categoryController,
    market:marketController,
    setting:settingController
}