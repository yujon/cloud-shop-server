var CommodityModel = require('../models/commodity');
var ShopModel = require('../models/shop');
var {sendJson} = require('../utils/response')
class CommodityController {

  // 分销树操作
  _addDistributor(commodityId,fromShopId,toShopId,callback,errorCb){
    CommodityModel.findById(commodityId,(commodity)=>{
      let distributionTree = commodity['distributionTree'];
      if(!distributionTree){
         distributionTree = [];
      } 

      //如果克隆商品所在的当前店铺便是供货商
      if(commodity.shopId.toString() == fromShopId.toString()){
         distributionTree.push({shopId:toShopId,fromShopId:0,children:[]});
      }else{
        this._addNodeToNode(distributionTree,fromShopId,toShopId);
      }
      CommodityModel.updateData({_id:commodityId},{$set:{distributionTree:distributionTree}},(docs)=>{
            callback && callback();
      },errorCb)
    },errorCb)
  }

  _addNodeToNode(rootArr,fromShopId,toShopId){
    if(!rootArr || !(rootArr instanceof Array) || rootArr.length ===0){
      return;
    }
    for(let i=0,len=rootArr.length;i<len;i++){
      if(rootArr[i] instanceof Object && rootArr[i].shopId == fromShopId){
        rootArr[i].children.push({shopId:toShopId,fromShopId:rootArr[i].shopId,children:[]});
        break;
      }else{
        this._addNodeToNode(rootArr[i].children,fromShopId,toShopId);
      }
    }
  }
  // 判断节点是否存在
  _isExistedOnDistribution(commodityId,shopId,callback,errorCb){
    CommodityModel.findById({_id:commodityId},(docs)=>{
      let distributionTree = docs.distributionTree;
      if(!distributionLevel){
        distributionTree = [];
      }
      let stack = distributionTree.slice();
      let isExisted = false;
      while(stack.length > 0){  
        let node = stack.shift(0,1);
        if(node.shopId && node.shopId.toString() == shopId.toString()){
          isExisted = true;
          break;
        }else{
          for(let i=0; i < node.children.length; i++)  {  
            stack.push(node.children[i]);  
          }  
        }
      } 
      callback && callback(isExisted);
    })
  }
  
  // 移除某个节点，将后面的接上
  _removeNodeFromDistributionTree(commodityId,shopId,callback,errorCb){
    CommodityModel.findById(commodityId,(commodity)=>{
      if(!commodity){
        callback && callback();
        return;
      }
      let distributionTree = commodity['distributionTree'];
      if(!distributionTree){
         distributionTree = [];
      } 
      this._removeNodeFromNode(distributionTree,0,shopId);
      CommodityModel.updateData({_id:commodityId},{$set:{distributionTree:distributionTree}},(docs)=>{
            callback && callback();
      },errorCb)
    },errorCb)
  }
  
  _removeNodeFromNode(rootArr,fromShopId,shopId){
    if(!rootArr || !(rootArr instanceof Array) || rootArr.length ===0){
      return;
    }
    for(let i=0,len=rootArr.length;i<len;i++){
      if(rootArr[i] instanceof Object && rootArr[i].shopId == shopId){
        rootArr[i].children.forEach((item) => {
          item.fromShopId = fromShopId;
        })
        break;
      }else{
        this._removeNodeFromNode(rootArr[i].children,rootArr[i].shopId,shopId);
      }
    }
  }

  
  
  create(req,res,next,errorCb){
      let {shopId,shopCommodityInfo,commodityInfo} = req.body

      
      //添加创建者和创建时间
      commodityInfo['createTime'] = Date.now();
      commodityInfo['shopId'] = shopId;
      commodityInfo['distributionTree'] = [];
      CommodityModel.save(commodityInfo,(commodityInfo)=>{

          //添加文档id
          shopCommodityInfo['commodityId'] = commodityInfo._id;
          ShopModel.updateData({_id:shopId},{$push:{createdCommodities:shopCommodityInfo}},(docs)=>{
            //获取最新列表
            this._getListByShopId(shopId,(commodityList)=>{  
              sendJson(res,{
                 code:0,
                 msg:'add commodity success',
                 data:{
                  commodityList
                 }
              })
            },errorCb);
          },errorCb);

         // },errorCb)
         
      },errorCb)
   }

  clone(req,res,next,errorCb){
       let {myShopId,shopId,commodityId} = req.body;
       let shopCommodityInfo = {
          commodityId
       }

       ShopModel.updateData({_id:myShopId},{$push:{clonedCommodities:shopCommodityInfo}},(docs)=>{
          this._addDistributor(commodityId,shopId,myShopId,()=>{
            this._getListByShopId(shopId,(commodityList)=>{
              sendJson(res,{
                 code:0,
                 msg:'clone commodity success',
                 data:{
                  commodityList
                 }
              })
             },errorCb)
          },errorCb)
       },errorCb);
  }

  update(req,res,next,errorCb){
    const {isCreator,shopId} = req.body;
    if(isCreator){
      this._updateCreated(req,res,()=>{
        this._getListByShopId(shopId,(commodityList)=>{
          sendJson(res,{
              code:0,
              msg:'update created commodity success',
              data:{
                commodityList
              }
          })
        },errorCb);
      },errorCb);
    }else{
      this._updateCloned(req,res,()=>{
        this._getListByShopId(shopId,(commodityList)=>{
          sendJson(res,{
              code:0,
              msg:'update cloned commodity success',
              data:{
                commodityList
              }
           })
        },errorCb);
      },errorCb);
    }
  }


  _updateCreated(req,res,callback,errorCb){
      const {commodityId,commodityInfo,shopId,shopCommodityInfo}= req.body;
      var updateShopCommodityOp = {}
      for(var key in shopCommodityInfo){
         if(key !== '_id')
            updateShopCommodityOp["createdCommodities.$."+ key] = shopCommodityInfo[key];
      }
      commodityInfo && CommodityModel.updateData({_id:commodityId},{$set:commodityInfo},(docs)=>{
        shopCommodityInfo && ShopModel.updateData({_id:shopId,"createdCommodities.commodityId":commodityId},{$set:updateShopCommodityOp},(docs)=>{
            callback && callback()
        },errorCb);

      },errorCb);
   }

   _updateCloned(req,res,callback,errorCb){
      const {commodityId,shopId,shopCommodityInfo}= req.body;
      var updateShopCommodityOp = {}
      for(var key in shopCommodityInfo){
          updateShopCommodityOp["clonedCommodities.$."+ key] = shopCommodityInfo[key];
      }
      shopCommodityInfo && ShopModel.updateData({_id:shopId,"clonedCommodities.commodityId":commodityId},{$set:updateShopCommodityOp},(docs)=>{
        callback && callback()
      },errorCb);
   }


  remove(req,res,next,errorCb){
    const {isCreator,shopId} = req.body;
    if(isCreator){
      this._removeCreated(req,res,()=>{
        this._getListByShopId(shopId,(commodityList)=>{
          sendJson(res,{
            code:0,
            msg:'remove created commodity success',
            data:{
              commodityList
            }
          })
        },errorCb)
        
      },errorCb);
    }else{
      this._removeCloned(req,res,()=>{
        this._getListByShopId(shopId,(commodityList)=>{
          sendJson(res,{
              code:0,
              msg:'remove cloned commodity success',
              data:{
                commodityList
              }
           })
        },errorCb);
      },errorCb);
    }
  }

  _removeCreated(req,res,callback,errorCb){
      var params = req.body;
      var shopId = params.shopId;
      var commodityId = params.commodityId;
      //在已创建的商品列表里面移除
      ShopModel.updateData({_id:shopId},{$pull:{createdCommodities:{commodityId:commodityId}}},(docs)=>{
        //更改克隆了该商品的所有店铺的商品信息
        CommodityModel.findById(commodityId,(commodity)=>{
          let distributionTree = commodity['distributionTree'];
          if(!distributionTree){
            distributionTree = [];
          }
          let stack = distributionTree.slice();
          while(stack.length > 0){  
            let node = stack.splice(0,1);
            ShopModel.find({_id:node.shopId,"createdCommodities.commodityId":commodityId},
                  {$set:{"createdCommodities.$.originCommodityRemoved":true}},()=>{
                    //do nothing
            })
            for(let i=0; i < node.children.length; i++)  {  
              stack.push(node.children[i]);  
            }  
          } 
          //移除商品信息
          CommodityModel.remove({_id:commodityId},()=>{
             callback && callback();
           },errorCb)
        },errorCb)
      },errorCb)
  }

  _removeCloned(req,res,callback,errorCb){
      var params = req.body;
      var shopId = params.shopId;
      var commodityId = params.commodityId;
      //从已克隆的商品里面移除
      ShopModel.updateData({_id:shopId},{$pull:{clonedCommodities:{commodityId:commodityId}}},(docs)=>{
        // 在分销树里移除
        this._removeNodeFromDistributionTree(commodityId,shopId,()=>{
          callback && callback();
        },errorCb)
      },errorCb);
  }

  get(req,res,next,errorCb){
      const {shopId,commodityId} = req.params;
      CommodityModel.findOneAndPopulate({_id:commodityId},null,"shopId categoryId",null,(commodityInfoItem)=>{
        let commodityInfo = commodityInfoItem.toObject();
        let carryCateList  = commodityInfoItem.shopId.carryCate;
        ShopModel.findOne({_id:shopId,$or:[{"createdCommodities.commodityId":commodityId},{"clonedCommodities.commodityId":commodityId}]},
          {createdCommodities:1,clonedCommodities:1},(docs)=>{
            let shopCommodityInfo = {};
            if(docs.createdCommodities && docs.createdCommodities.length){
              docs.createdCommodities.forEach((item) => {
                 if(item.commodityId.toString() === commodityId){
                    shopCommodityInfo = item.toObject();
                 }
              })
            }
            if(docs.clonedCommodities && docs.clonedCommodities.length){
               docs.createdCommodities.forEach((item) => {
                 if(item.commodityId.toString() === commodityId){
                    shopCommodityInfo = item.toObject();
                 }
              })
            }
            delete shopCommodityInfo['_id'];
            delete shopCommodityInfo['commodityId'];
            //更新配送费用信息
            if(carryCateList && carryCateList.length){
              carryCateList.forEach((item) => {
                if(item._id.toString() == commodityInfo.carryCateId.toString()){
                  commodityInfo.carryCateId = item;
                }
              })
            }
            commodityInfo = Object.assign(commodityInfo,shopCommodityInfo)
            sendJson(res,{
              code: 0,
              msg:'get commodity success',
              data: {
                commodityInfo
              }
            })
        },errorCb)
      },errorCb);
  }

  //获取店铺下的所有商品
  getListByShopId(req,res,next,errorCb){
      let {shopId} = req.params;
      this._getListByShopId(shopId,(commodityList)=>{
        sendJson(res,{
            code:0,
            msg:'get commodity list success',
            data:{
               commodityList
            }
         })
      },errorCb)
   }
  
  _getListByShopId(shopId,callback,errorCb){
    ShopModel.findOneAndPopulate({_id:shopId},{createdCommodities:1,clonedCommodities:1},
         "createdCommodities.commodityId clonedCommodities.commodityId clonedCommodities.commodityId.categoryId",null,(docs)=>{
            if(docs){
              let commodityList = [],commodity = {};
              docs.createdCommodities.forEach((commodityItem)=>{
                  commodity = commodityItem.commodityId.toObject();
                  commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                  commodity['upcarriage'] = commodityItem['upcarriage'];
                  commodity['commodityCateId'] = commodityItem['commodityCateId'];
                  commodity['isCreator'] = true;
                  commodityList.push(commodity);
              })
              docs.clonedCommodities.forEach((commodityItem)=>{
                 commodity = commodityItem.commodityId.toObject();
                  commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                  commodity['upcarriage'] = commodityItem['upcarriage'];
                  commodity['commodityCateId'] = commodityItem['commodityCateId'];
                  commodity['isCreator'] = false;
                  commodityList.push(commodity);
              })
              callback(commodityList)
            }
      },errorCb)
   }
   
   //获取店铺自己创建的商品
   getCreatedListByShopId(req,res,next,errorCb){
      let params = req.params;
      let shopId = params.shopId;
      ShopModel.findOneAndPopulate({_id:shopId},{createdCommodities:1},
         "createdCommodities.commodityId",null,
         (docs)=>{
            let commodityList = [],commodity = {};
            docs.createdCommodities.forEach((commodityItem)=>{
                commodity = commodityItem.commodityId.toObject();
                commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                commodity['upcarriage'] = commodityItem['upcarriage'];
                commodity['isCreator'] = true;
                commodityList.push(commodity);
            })
             sendJson(res,{
               code:0,
               msg:'get commodity list success',
               data:{
                  commodityList
               }
            })
      },errorCb)
   }
   
   // 获取店铺下代理的所有商品
   getClonedListByShopId(req,res,next,errorCb){
      let params = req.params;
      let shopId = params.shopId;
      ShopModel.findOneAndPopulate({_id:shopId},{clonedCommodities:1},
         "clonedCommodities.commodityId",null,
         (docs)=>{
            let commodityList = [],commodity = {};
            docs.clonedCommodities.forEach((commodityItem)=>{
                commodity = commodityItem.commodityId.toObject();
                commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                commodity['upcarriage'] = commodityItem['upcarriage'];
                commodity['isCreator'] = false;
                commodityList.push(commodity);
            })
             sendJson(res,{
               code:0,
               msg:'get commodity list success',
               data:{
                  commodityList:docs.clonedCommodities
               }
            })
      },errorCb)
   }

   //获取店铺下所有上架的商品
   getUpCarriageListByShopId(req,res,next,errorCb){
      let params = req.params;
      let shopId = params.shopId;

      ShopModel.findOneAndPopulate({_id:shopId},{createdCommodities:1,clonedCommodities:1},
         "createdCommodities.commodityId clonedCommodities.commodityId clonedCommodities.commodityId.categoryId",null,(docs)=>{
            if(docs){
              let commodityList = [],commodity = {};
              docs.createdCommodities.forEach((commodityItem)=>{
                if(commodityItem.upcarriage == 1){
                    commodity = commodityItem.commodityId.toObject();
                    commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                    commodity['upcarriage'] = commodityItem['upcarriage'];
                    commodity['commodityCateId'] = commodityItem['commodityCateId'];
                    commodity['isCreator'] = true;
                    commodityList.push(commodity);
                  }
              })
              docs.clonedCommodities.forEach((commodityItem)=>{
                if(commodityItem.upcarriage == 1){
                    commodity = commodityItem.commodityId.toObject();
                    commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                    commodity['upcarriage'] = commodityItem['upcarriage'];
                    commodity['commodityCateId'] = commodityItem['commodityCateId'];
                    commodity['isCreator'] = false;
                    commodityList.push(commodity);
                }
              })
              sendJson(res,{
                  code:0,
                  msg:'get commodity list success',
                  data:{
                     commodityList
                  }
               })
            }
      },errorCb)
   }


    // 获取所有店铺所有上架的商品
   getUpCarriageList(req,res,next,errorCb){
      ShopModel.findAndPopulate({},{_id:1,shopName:1,createdCommodities:1,clonedCommodities:1},
         "createdCommodities.commodityId clonedCommodities.commodityId",null,(docs)=>{
            if(docs){
              let commodityList = [],commodity = {};
              docs.forEach((doc) => {
                doc.createdCommodities && doc.createdCommodities.forEach((commodityItem)=>{
                  if(commodityItem.upcarriage == 1){
                    console.log(1111111)
                    console.log(commodityItem)
                      commodity = commodityItem.commodityId.toObject();
                      commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                      commodity['upcarriage'] = commodityItem['upcarriage'];
                      commodity['isCreator'] = true;
                      commodity['creatorId'] = commodity['shopId'];
                      commodity['shopName'] = doc['shopName'];
                      commodity['shopId'] = doc['_id'];
                      commodityList.push(commodity);
                    }
                })
                doc.clonedCommodities && doc.clonedCommodities.forEach((commodityItem)=>{
                  if(commodityItem.upcarriage == 1){
                      commodity = commodityItem.commodityId.toObject();
                      commodity['shopOwnerRecommodate'] = commodityItem['shopOwnerRecommodate'];
                      commodity['upcarriage'] = commodityItem['upcarriage'];
                      commodity['isCreator'] = false;
                      commodity['creatorId'] = commodity['shopId'];
                      commodity['shopName'] = doc['shopName'];
                      commodity['shopId'] = doc['_id'];
                      commodityList.push(commodity);
                  }
                })
              })
              sendJson(res,{
                    code:0,
                    msg:'get commodity list success',
                    data:{
                       commodityList
                    }
                 })
            }
      },errorCb)
   }
   
   //获取某类目下所有上架的商品
   getListByCategoryId(req,res,next,errorCb){
      let params = req.params;
      let categoryId = params.categoryId;
      CommodityModel.findAndPopulate({categoryId:categoryId},null,
         "categoryId shopId",null,(docs)=>{
              let categoryCommodityList = [];
              docs && docs.forEach((doc) => {
                let commodityInfo = doc.toObject();
                let {createdCommodities} = commodityInfo.shopId;
                createdCommodities.forEach((item) => {
                    if(item.commodityId.toString() === commodityInfo._id.toString() && item.upcarriage){
                      delete commodityInfo['distributionTree'];
                      categoryCommodityList.push(commodityInfo);
                    }
                })
              })
              sendJson(res,{
                code:0,
                msg:'get commodity list success',
                data:{
                   categoryCommodityList
                }
             })
      },errorCb)
   }


}

module.exports = new CommodityController();
