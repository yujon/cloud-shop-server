var MessageModel = require('../models/message');
var {sendJson} = require('../utils/response')

class MessageController {
   
   /** 基本信息操作 **/
   add(req,res,next,errorCb){
      var params = req.body;
      var messageInfo = {
         ...params,
         createTime:Date.now()
      }
      MessageModel.save(messageInfo,(docs)=>{
         sendJson(res,{
            code:0,
            msg:'add message success',
            data:{}
         })
      },errorCb);
   }

   
   getList(req,res,next,errorCb){
      const {fromId,toId,skip} = req.params;
      const conditions = {fromId:fromId,toId:toId};
      const options = {
         populate:'fromId toId',
         opulateField:{name:1,img:1},
         sort: {time: -1},
         limit:10,
         skip:skip
      }
      MessageModel.where(conditions,options,(docs)=>{
          sendJson(res,{
            code:0,
            msg:'get message success',
            data:{
               messages:docs
            }
         })
      },errorCb);
   }

}

module.exports = new MessageController();
