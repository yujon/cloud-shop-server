var {sendJson} = require('../utils/response')
class ErrorController {

   noFind(req,res,next){
      var err = new Error('Not Found');
      err.status = 404;
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      
      res.status(err.status || 404);
      sendJson(res,{
        code:-1,
        msg:'no find'
      })
   }

   other(req,res,next,status,code,msg){
      var err = new Error(msg);
      err.status = status;
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      
      res.status(err.status || 500);
      sendJson(res,{
        code:code,
        msg:msg
      })
   }
}

module.exports = new ErrorController();
