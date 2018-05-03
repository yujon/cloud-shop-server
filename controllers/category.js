var CategoryModel = require('../models/category');
var {sendJson} = require('../utils/response');

class CategoryController {
   
   getListByPid(req,res,next,errorCb){
      var params = req.params;
      var pid = params.pid;
      CategoryModel.find({pid:pid},{},(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get Category list success',
          data: {
            categoryList:docs
          }
        })
      },errorCb);
   }

   get(req,res,next,errorCb){
      var params = req.params;
      var categoryId = params.categoryId;
      CategoryModel.findOne({_id:categoryId},{},(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get Category success',
          data: {
            CategoryInfo:docs
          }
        })
      },errorCb);
   }

   add(req,res,next,errorCb){
      var params = req.body;
      var categoryInfo = params.categoryInfo;
      CategoryModel.save(categoryInfo,()=>{
        CategoryModel.find({},{},(categoryList)=>{
          sendJson(res,{
            code:0,
            msg:'add Category success',
            data:{
               categoryList
            }
          })
        },errorCb);
      },errorCb);
   }

   remove(req,res,next,errorCb){
      var params = req.body;
      var categoryId = params.categoryId;
      CategoryModel.remove({_id:categoryId},(docs)=>{
        CategoryModel.find({},{},(categoryList)=>{
          sendJson(res,{
            code:0,
            msg:'remove Category success',
            data:{
               CategoryList
            }
         })
        },errorCb);  
      },errorCb);
   }

   update(req,res,next,errorCb){
      const {categoryId,categoryInfo} = req.body;
      CategoryModel.updateData({_id:categoryId},{$set:categoryInfo},(docs)=>{
        CategoryModel.find({},{},(categoryList)=>{
           sendJson(res,{
             code:0,
             msg:'update Category success',
             data:{
                 categoryList
             }
           })   
        },errorCb);
      },errorCb);
   }


}

module.exports = new CategoryController();
