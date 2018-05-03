var UserModel = require('../models/user');
var fs = require('fs');
var {sendJson} = require('../utils/response')
class UploadController {

   uploadFile(req,res,next,errorCb){
        fs.rename(req.file.path, req.file.destination + req.file.originalname, function(err) {
	        if (err) {
	            errorCb(500,-1,'文件保存失败');
	        }
	        sendJson(res,{
	        	code:0,
	        	data:{
	        		tmpImg:'/public/upload/'+ req.file.originalname
	        	}
	        })
	       
       })
   }
}

module.exports = new UploadController();
