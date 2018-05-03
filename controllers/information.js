var InformatioModel = require('../models/information');
var {sendJson} = require('../utils/response')

class InformatioController {
   
   /** 基本信息操作 **/
   add(req,res,next,errorCb){
      var params = req.body;
      var messageInfo = {
         ...params,
         createTime:Date.now()
      }
      InformatioModel.save(messageInfo,(docs)=>{
         sendJson(res,{
            code:0,
            msg:'add information success',
            data:{}
         })
      },errorCb);
   }

   
   getList(req,res,next,errorCb){
      const {toShopId,skip} = req.params;
      const conditions = {$or:[{toShopId:toShopId},{toShopId:{$exists:false}}]};
      const options = {
         sort: {time: -1},
         limit:20,
         skip:skip
      }
      InformatioModel.where(conditions,options,(docs)=>{
          sendJson(res,{
            code:0,
            msg:'get information success',
            data:{
               messages:docs
            }
         })
      },errorCb);
   }

}

module.exports = new InformatioController();
