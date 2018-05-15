exports.sendJson = function(res,data){
	console.log('return data ---------------');
	console.log(data)
	// res.header("Access-Control-Allow-Origin", "*");
	res.json(data);
}