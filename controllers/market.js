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
      MarketModel.findOne({},{"hotCase":1},(docs)=>{
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
      MarketModel.updateData({},{$set:{hotCase:hotCaseList}},(doc)=>{
           sendJson(res,{
              code:0,
              msg:'update hotCase success',
              data:{
                hotCaseList:doc.hotCase
              }
           })
         
      },errorCb);
    }

   getSpecialActivityList(req,res,next,errorCb){
      MarketModel.findOne({},{"specialActivities":1},(doc)=>{
        if(doc){
          sendJson(res,{
            code: 0,
            msg:'get activity list success',
            data:{
              specialActivityList:doc.specialActivities
            }
          })
        }else{
          errorCb(200,-1,'get specialActivities fail')
        }
      },errorCb);
   }

   addSpecialActivityListItem(req,res,next,errorCb){
      var {specialActivityListItem} = req.body;
      MarketModel.updateData({},{$push:{specialActivities:specialActivityListItem}},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'add specialActivity success',
            data:{
              specialActivityList:docs.specialActivities
            }
         })
      },errorCb);
   }

    updateSpecialActivityListItem(req,res,next,errorCb){
      const {specialActivityListItemId,specialActivityListItem} = req.body;
      MarketModel.updateData({"specialActivities._id":specialActivityListItemId},{$set:{"specialActivities.$":specialActivityListItem}},(docs)=>{
           sendJson(res,{
              code:0,
              msg:'update specialActivityListItem success',
              data:{
                specialActivityList:docs.specialActivities
              }
           })
         
      },errorCb);
    }

   removeSpecialActivityListItem(req,res,next,errorCb){
      var params = req.body;
      var specialActivityListItemId = params.specialActivityListItemId;
      MarketModel.updateData({},{$pull:{specialActivities:{_id:specialActivityListItemId}}},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'remove specialActivityListItem success',
            data:{
              specialActivityList:docs.specialActivities
            }
         })
      },errorCb);
   }
}

module.exports = new MarketController();
