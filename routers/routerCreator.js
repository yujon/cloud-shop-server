var express = require('express');
var multer = require('multer')
var path = require('path');
const upload = multer({ dest: path.join(path.dirname(__dirname),'public/upload/')});
var controllers = require('../controllers/index');
var controllersCof = require('./router')

var createRouters = function(){
	var routers = {};
	var temparr,controller,action,errorRouter;

	for(var controllerName in controllersCof){
		var actions = controllersCof[controllerName];
		var router = express.Router();
		controller = controllers[controllerName];

        actions.forEach((item)=>{
            temparr = item.action.split('/');
            (function(curController,curAction,actionWithParams){
				router[item.type](`/${actionWithParams}`,(req,res,next) =>{
					curController[curAction](req,res,next,function(status,code,msg){
					    controllers['error'].other(req,res,next,status,code,msg);
					})
				}) 
			})(controller,temparr[0],item.action)
        })
        routers[controllerName] = router;
	}
	// 添加上传
	uploadRouter = express.Router().use('/uploadFile',upload.single('myfile'),(req,res,next) =>{
		controllers['upload'].uploadFile(req,res,next,function(status,code,msg){
		       controllers['error'].other(req,res,next,status,code,msg);
		});
	})
	routers['upload'] = uploadRouter;
    //添加no find
	errorRouter = express.Router().use('/',(req,res,next) => {
		controllers['error'].noFind(req,res,next);
	})
	return [routers,errorRouter];
}

module.exports = {
    createRouters
};