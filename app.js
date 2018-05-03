var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var polyfill = require('./utils/polyfill');

var routerCreator = require('./routers/routerCreator');

var app = express();
var[routers,errorRouter] = routerCreator.createRouters();

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req,res,next){
	console.log(req.params)
	console.log(req.body)
	next();
})

app.use('/public',express.static(path.join(__dirname, 'public')));

for(var routerName in routers){
	app.use(`/${routerName}`, routers[routerName]);
}

// no find
app.use(errorRouter);


module.exports = app;
