exports.sendJson = function(res,data){
	console.log('return data ---------------');
	console.log(data)
	res.json(data);
}