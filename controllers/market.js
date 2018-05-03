var MarketModel = require('../models/market');
var {sendJson} = require('../utils/response')
class MarketController {
  
   add(req,res,next,errorCb){
      var params = req.body;
      var marketInfo = params.marketInfo;
      MarketModel.save(marketInfo,(docs)=>{
          sendJson(res,{
            code:0,
            msg:'add market success',
            data:{}
         })
      },errorCb);
   }

   getSwiperImgList(req,res,next,errorCb){
      MarketModel.findOne({},{"swiperImgs":1},(docs)=>{
        if(docs){
          sendJson(res,{
            code: 0,
            msg:'get market swiper imgs success',
            data: {
              swiperImgList:docs.swiperImgs
            }
          })
        }else{
          errorCb(200,-1,'get market swiper imgs fail')
        }
        
      },errorCb);
   }

   updateSwiperImgList(req,res,next,errorCb){
      const {swiperImgList} = req.body;
      MarketModel.updateData({},{$set:{swiperImgs:swiperImgList}},(docs)=>{
           sendJson(res,{
              code:0,
              msg:'update SwiperImgs success',
              data:{
                swiperImgList:docs.swiperImgs
              }
           })
         
      },errorCb);
    }


  getHotCaseList(req,res,next,errorCb){
      MarketModel.findOneAndPopulate({},{"hotCase":1},"hotCase.shopId hotCase.commodityId",null,(docs)=>{
        if(docs){
          sendJson(res,{
            code: 0,
            msg:'get hotCase success',
            data: {
              hotCaseList:docs.hotCase
            }
          })
        }else{
          errorCb(200,-1,'get hotCase fail')
        }
        
      },errorCb);
   }

   updateHotCaseList(req,res,next,errorCb){
      const {hotCaseList} = req.body;
      MarketModel.updateData({},{$set:{hotCase:hotCaseList}},(docs)=>{
           sendJson(res,{
              code:0,
              msg:'update hotCase success',
              data:{
                hotCaseList:docs.hotCase
              }
           })
         
      },errorCb);
    }

   getSpecialActivityList(req,res,next,errorCb){
      MarketModel.findOneAndPopulate({},{"specialActivities":1},"specialActivities.commodities.commodityId",null,(docs)=>{
        if(docs){
          sendJson(res,{
            code: 0,
            msg:'get activity list success',
            data:{
              specialActivityList:docs.specialActivities
            }
          })
        }else{
          errorCb(200,-1,'get specialActivities fail')
        }
        
      },errorCb);
   }

   addSpecialActivity(req,res,next,errorCb){
      var params = req.body;
      var specialActivityInfo = params.specialActivityInfo;
      MarketModel.updateData({},{$push:{specialActivities:specialActivityInfo}},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'add specialActivity success',
            data:{
              specialActivityList:docs.specialActivities
            }
         })
      },errorCb);
   }

   removeSpecialActivity(req,res,next,errorCb){
      var params = req.body;
      var specialActivityId = params.specialActivityId;
      MarketModel.updateData({},{$pull:{specialActivities:{_id:specialActivityId}}},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'remove hotCase success',
            data:{
              specialActivityList:docs.specialActivities
            }
         })
      },errorCb);
   }

   updateSpecialActivity(req,res,next,errorCb){
      const {specialActivityId,specialActivityInfo} = req.body;
      MarketModel.updateData({"specialActivities._id":specialActivityId},specialActivityInfo,(docs)=>{
           sendJson(res,{
              code:0,
              msg:'update specialActivity success',
              data:{
                specialActivityList:docs.specialActivities
              }
           })
         
      },errorCb);
    }

   
}

module.exports = new MarketController();
