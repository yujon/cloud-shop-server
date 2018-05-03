var UserModel = require('../models/user');
var ShopModel = require('../models/shop');
var CommodityModel = require('../models/commodity');
var {sendJson} = require('../utils/response');
var uuidV1 = require('uuid/v1');
class UserController {
   
   /** 基本信息操作 **/
   loginUp(req,res,next,errorCb){
      var params = req.body;
      UserModel.save({
         phoneCode:params.phoneCode,
         phoneNumber:params.phoneNumber,
         password:params.password
      },(docs)=>{
         sendJson(res,{
            code:0,
            msg:'loginUp success',
            data:{
               userId:docs._id
            }
         })
      },errorCb);
   }

   loginIn(req,res,next,errorCb){
      var params = req.body;
      var phoneCode = params.phoneCode;
      var phoneNumber = params.phoneNumber;
      var password = params.password;
      UserModel.findOne({phoneNumber:phoneNumber},{phoneNumber:true,password:true},(docs)=>{
         //验证密码
         if(docs && (docs.phoneNumber == params.phoneNumber) && (docs.password == params.password)){
            //修改登录状态
            UserModel.updateData({_id:docs._id},{$set:{login:true,latestLoginInTime:Date.now()}},(docs)=>{
               sendJson(res,{
                  code:0,
                  msg:'loginIn success',
                  data:{
                     userInfo:docs
                  }
               })
            },errorCb)
         }else{
            errorCb(400,-2,'账号或密码有误')
         }
      },errorCb)
   }

   loginOut(req,res,next,errorCb){
      //修改登录状态
      var params = req.body;
      UserModel.updateData({_id:params.userId},{$set:{login:false}},()=>{
         sendJson(res,{
            code:0,
            msg:'loginOut success',
            data:{
               userId:params._id
            }
         })
      },errorCb)
   }

   get(req,res,next,errorCb){
      var params = req.params;
      UserModel.findById(params.userId,(docs)=>{
          sendJson(res,{
            code:0,
            msg:'get user info success',
            data:{
               userInfo:docs
            }
         })
      },errorCb);
   }

   update(req,res,next,errorCb){
      var params = req.body;
      var userId = params.userId;
      var userInfo = params.userInfo;
      userInfo['_id'] = userId;
      
      UserModel.updateData({_id:userId},{$set:userInfo},(info)=>{
          sendJson(res,{
            code:0,
            msg:'update user info success',
            data:{
               userInfo:{
                  ...info,
                  ...params
               }
            }
         })
      },errorCb);
   }

   remove(req,res,next,errorCb){
      var params = req.body;
      UserModel.remove({_id:params.userId},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'remove user success',
            data:{
               userList:[]
            }
         })
      },errorCb);
   }

   getCollectionList(req,res,next,errorCb){
      const {type,userId} = req.params;
      let op = {};
      let populationItem = "";
      if(type == 'shop'){
        op['shopCollections'] = 1;
        populationItem = 'shopCollections.shopId';
      }else{
        op['commodityCollections'] = 1;
        populationItem = 'commodityCollections.shopId commodityCollections.commodityId';
      }
      UserModel.findOneAndPopulate({_id:userId},op,populationItem,null,(doc)=>{
        let collectionList= doc? type=='shop'?doc.shopCollections:doc.commodityCollections:[];
        sendJson(res,{
          code: 0,
          msg:'get collection list success',
          data: {
            collectionList
          }
        })
      },errorCb);
   }

   addCollection(req,res,next,errorCb){
      const {type,userId,shopId,commodityId} = req.body;
      let op = {
        $push:{}
      };
      if(type == 'shop'){
        op['$push']['shopCollections'] = {
          shopId
        };
      }else{
        op['$push']['commodityCollections'] = {
          shopId,
          commodityId
        };
      }
      
      function callback(){
        UserModel.findOne({_id:userId},{},(userItem)=>{
          let collectionList= userItem? type=='shop'?userItem.shopCollections:userItem.commodityCollections:[];
          sendJson(res,{
            code:0,
            msg:'add collections success',
            data:{
               collectionList
            }
          })
        },errorCb)
      }

      UserModel.updateData({_id:userId},op,()=>{
        if(type == 'shop'){
          ShopModel.updateData({_id:shopId},{$inc:{collectionSum:1}},(shopItem)=>{
            callback()
          },errorCb)
        }else{
          CommodityModel.updateData({_id:commodityId},{$inc:{collectionSum:1}},(shopItem)=>{
            callback()
          },errorCb)
        }
        
      },errorCb);
   }


   removeCollection(req,res,next,errorCb){
      const {type,userId,shopId,commodityId} = req.body;
      let op = {
        $pull:{}
      };
      if(type == 'shop'){
        op['$pull']['shopCollections'] = {
          shopId
        };
      }else{
        op['$pull']['commodityCollections'] = {
          shopId,
          commodityId
        };
      }

      function callback(){
        UserModel.findOne({_id:userId},{},(userItem)=>{
          let collectionList= userItem? type=='shop'?userItem.shopCollections:userItem.commodityCollections:[];
          sendJson(res,{
            code:0,
            msg:'remove collections success',
            data:{
               collectionList
            }
          })
        },errorCb)
      }
      
      UserModel.updateData({_id:userId},op,(userItem)=>{
         if(type == 'shop'){
          ShopModel.updateData({_id:shopId},{$inc:{collectionSum:-1}},(shopItem)=>{
            callback()
          },errorCb)
        }else{
          CommodityModel.updateData({_id:commodityId},{$inc:{collectionSum:-1}},(shopItem)=>{
            callback()
          },errorCb)
        }
      },errorCb);
   }



   getAddressList(req,res,next,errorCb){
      var params = req.params;
      var userId = params.userId;
      UserModel.findOne({_id:userId},{address:1},(doc)=>{
        let addressList = doc? doc.address:[];
        sendJson(res,{
          code: 0,
          msg:'get address list success',
          data: {
            addressList
          }
        })
      },errorCb);
   }

   getAddress(req,res,next,errorCb){
      var params = req.params;
      var userId = params.userId;
      var addressId = params.addressId;
      UserModel.findOne({_id:userId,"address._id":addressId},{address:1},(docs)=>{
        let addressInfo= docs? docs.address:{};
        sendJson(res,{
          code: 0,
          msg:'get address success',
          data: {
            addressInfo
          }
        })
      },errorCb);
   }

   addAddress(req,res,next,errorCb){
      var params = req.body;
      var {userId,addressInfo} = req.body;
      var uuid = uuidV1();
      addressInfo['uuid'] = uuid;
      UserModel.updateData({_id:userId},{$push:{address:addressInfo}},(docs)=>{

        if(addressInfo['isDefault']){

          UserModel.findOne({_id:userId},{address:1},(doc)=>{
            let addressList =[];
            doc.address && doc.address.forEach((item) => {
              let temp = item.toObject();
              if(temp.uuid !== uuid){
                temp['isDefault'] = false;
              }
              addressList.push(temp)
            })
            UserModel.updateData({_id:userId},{$set:{address:addressList}},()=>{
              UserModel.findOne({_id:userId},{address:1},(doc)=>{
                sendJson(res,{
                    code:0,
                    msg:'add address success',
                    data:{
                       addressList:doc.address
                    }
                 })
              },errorCb)
            },errorCb)         
          },errorCb)

        }else{
          UserModel.findOne({_id:userId},{address:1},(doc)=>{
            sendJson(res,{
              code:0,
              msg:'add address success',
              data:{
                 addressList:doc.address
              }
            })
          },errorCb)
          
        }
          
      },errorCb);
   }


   updateAddress(req,res,next,errorCb){
      const {userId,addressId,addressInfo} = req.body;
      var updateOp = {}
      if(addressInfo['_id']) delete addressInfo['_id'];
      for(var key in addressInfo){
          updateOp["address.$."+ key] = addressInfo[key];
      }
      UserModel.updateData({_id:userId,"address._id":addressId},{$set:updateOp},(doc)=>{

        if(addressInfo['isDefault']){

          UserModel.findOne({_id:userId},{address:1},(doc)=>{
            let addressList =[];
            doc.address && doc.address.forEach((item) => {
              let temp = item.toObject();

              if(temp._id.toString() !== addressId.toString()){
                temp['isDefault'] = false;
              }
              addressList.push(temp)
            })
            UserModel.updateData({_id:userId},{$set:{address:addressList}},()=>{
              UserModel.findOne({_id:userId},{address:1},(doc)=>{
                sendJson(res,{
                    code:0,
                    msg:'update address success',
                    data:{
                       addressList:doc.address
                    }
                 })
              },errorCb)      
            },errorCb)         
          },errorCb)

        }else{

          UserModel.findOne({_id:userId},{address:1},(doc)=>{
            sendJson(res,{
              code:0,
              msg:'update address success',
              data:{
                 addressList:doc.address
              }
            })
          },errorCb)

        }

      },errorCb);
  }


   removeAddress(req,res,next,errorCb){
      var params = req.body;
      var userId = params.userId;
      var addressId = params.addressId;
      UserModel.updateData({_id:userId},{$pull:{address:{_id:addressId}}},(docs)=>{
        UserModel.findOne({_id:userId},{address:1},(doc)=>{
          sendJson(res,{
            code:0,
            msg:'remove address success',
            data:{
               addressList:doc.address
            }
          })
        },errorCb);
      },errorCb);
   }

   _getShopCarCommodityList(userId,callback,errorCb){
    UserModel.findOneAndPopulate({_id:userId},{shopCar:1},
       "shopCar.shopId shopCar.commodityId",null,
       (doc)=>{
         let shopCarCommodityList = doc? doc.shopCar : [];
        
         //更新商品的配送费信息
         let tempList = [];
         let finishedSum = 0;
         if(!shopCarCommodityList || !shopCarCommodityList.length){
             sendJson(res,{
               code:0,
               msg:'empty commodity list',
               data:{
                 shopCarCommodityList:[]
               }
             })
         }
         shopCarCommodityList.forEach((item) => {
            let tempItem = item.toObject();
            let creatorId = tempItem.commodityId.shopId;
            ShopModel.findOne({_id:creatorId},{carryCate:1},(shopDoc)=>{
          
              shopDoc.carryCate && shopDoc.carryCate.forEach((shopCarryCateItem) => {
                 if(shopCarryCateItem._id.toString() === tempItem.commodityId.carryCateId.toString()){
                    tempItem['commodityId']['carryCateId'] = shopCarryCateItem;
                 }
              })
              finishedSum++;
              tempList.push(tempItem);
              if(finishedSum == shopCarCommodityList.length){
                callback(tempList)
              }
            },errorCb)

         })
    },errorCb)
   }

  getShopCarCommodityList(req,res,next,errorCb){
    let params = req.params;
    let userId = params.userId;
    this._getShopCarCommodityList(userId,(tempList)=>{
      sendJson(res,{
           code:0,
           msg:'get commodity list success',
           data:{
             shopCarCommodityList:tempList
           }
       })
    })
  }

  addCommodityToShopCar(req,res,next,errorCb){
    const {userId,shopId,commodityId,modelId,buySum} = req.body;
    UserModel.updateData({_id:userId},{$push:{shopCar:{shopId,commodityId,modelId,buySum}}},(docs)=>{
      this._getShopCarCommodityList(userId,(tempList)=>{
        sendJson(res,{
            code:0,
            msg:'add commodity to car success',
            data:{
              shopCarCommodityList:tempList
           }
        })
      },errorCb)
    },errorCb)
  }

  removeCommodityFromShopCar(req,res,next,errorCb){
    const {userId,shopCarItemId} = req.body;
    UserModel.updateData({_id:userId},{$pull:{shopCar:{_Id:shopCarItemId}}},(docs)=>{
      this._getShopCarCommodityList(userId,(tempList)=>{
        sendJson(res,{
            code:0,
            msg:'remove commodity to car success',
            data:{
              shopCarCommodityList:tempList
            }
        })
      },errorCb)
    },errorCb)
  }

  removeCommodityListFromShopCar(req,res,next,errorCb){
    const {userId,shopCarItemIdList} = req.body;
    UserModel.updateData({_id:userId},{$pull:{shopCar:{_Id:{$in:[shopCarItemIdList]}}}},(docs)=>{
      this._getShopCarCommodityList(userId,(tempList)=>{
        sendJson(res,{
            code:0,
            msg:'remove commodity to car success',
            data:{
              shopCarCommodityList:tempList
            }
        })
      },errorCb)
    },errorCb)
  }


}

module.exports = new UserController();
