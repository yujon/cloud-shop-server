var SettingModel = require('../models/setting');
var {sendJson} = require('../utils/response')
class SettingController {
   
   get(req,res,next,errorCb){
      SettingModel.findOne({},{},(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get setting success',
          data: {
            settingInfo:docs
          }
        })
      },errorCb);
   }

   update(req,res,next,errorCb){
      const {settingInfo} = req.body;
      SettingModel.updateData({},{$set:settingInfo},(docs)=>{
        SettingModel.findOne({},{},(setting)=>{
          sendJson(res,{
             code:0,
             msg:'update setting success',
             data:{
                settingInfo:setting
             }
          }) 
        },errorCb);  
      },errorCb);
   }


}

module.exports = new SettingController();
