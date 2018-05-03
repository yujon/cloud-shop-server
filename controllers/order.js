var OrderModel = require('../models/order');
var SettingModel = require('../models/setting')
var ShopModel = require('../models/shop')
var CommodityModel = require('../models/commodity')
var {sendJson} = require('../utils/response')
class OrderController {

   getListByUserId(req,res,next,errorCb){
      var params = req.params;
      var userId = params.userId;
      OrderModel.findAndPopulate({userId:userId},{},"shopId commodityId",null,(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get order list success',
          data: {
            orderList:docs
          }
        })
      },errorCb);
  }

  getListByUserIdAndStatus(req,res,next,errorCb){
    const {userId,status} = req.params;
    OrderModel.findAndPopulate({userId:userId,status:parseInt(status)},null,"shopId commodityId",null,(docs)=>{
      sendJson(res,{
        code: 0,
        msg:'get order list success',
        data: {
          orderList:docs
        }
      })
    },errorCb);
  }

  getListByShopId(req,res,next,errorCb){ //直接销售
      var params = req.params;
      var shopId = params.shopId;
      OrderModel.findAndPopulate({shopId:shopId},{},"shopId commodityId",null,(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get order list success',
          data: {
            orderList:docs
          }
        })
      },errorCb);
  }
 
  getListByShopIdAndStatus(req,res,next,errorCb){ //直接销售
      var {shopId,status} = req.params;
      var statusArr = status.split('|');
      statusArr.map((item)=>{
        return parseInt(item);
      });
      OrderModel.findAndPopulate({shopId:shopId,status:{$in:statusArr}},{},"shopId commodityId",null,(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get order list success',
          data: {
            orderList:docs
          }
        })
      },errorCb);
  }

  getListByClonedShopIdAndStatus(req,res,next,errorCb){
      var {clonedShopId,status} = req.params;
      var statusArr = status.split('|');
      let orderList = [];
      statusArr.map((item)=>{
        return parseInt(item);
      });

      ShopModel.findOneAndPopulate({_id:clonedShopId},{clonedCommodities:1},
         "clonedCommodities.commodityId",null,(docs)=>{
           docs.clonedCommodities.forEach((commodityItem)=>{
            const commodity = commodityItem.commodityId.toObject();
            const contributors = {
              next:[],
              nextToNext:[]
            }
            this._findNextTwoLevel(commodity.distributionTree,contributors,clonedShopId,false);
            console.log(contributors)

            // 组装三级的shopId
            const shopIdArr = contributors['next'].concat(contributors['nextToNext']);
            shopIdArr.push(clonedShopId);
            //查找三级相关的所有订单
            OrderModel.findAndPopulate({status:{$in:statusArr},shopId:{$in:shopIdArr}},{},"shopId commodityId",null,(docs)=>{
              docs && docs.forEach((orderItem) => {
                let tempItem = orderItem.toObject();
                let realShopId = tempItem.shopId._id.toString();
                //判断当前店铺所在的层级
                if(realShopId === clonedShopId.toString()){
                  tempItem['myLevel'] = 1;
                }else if(contributors['next'].indexOf(realShopId)!== -1){
                  tempItem['myLevel'] = 2;
                }else if(contributors['nextToNext'].indexOf(realShopId)!== -1){
                  tempItem['myLevel'] = 3;
                }
                orderList.push(tempItem)
              })
              sendJson(res,{
                code: 0,
                msg:'get order list success',
                data: {
                  orderList
                }
              })
            },errorCb);

          })
      },errorCb)
  }

  //找下俩级代理
  _findNextTwoLevel(rootArr,contributors,curShopId,finished){  
    if(!rootArr || !(rootArr instanceof Array) || rootArr.length ===0){ //没有代理商或者说供货商直销
        return;
    }
    for(let i=0,len=rootArr.length;i<len;i++){
      if(finished){
        break;
      }
      if(rootArr[i].shopId.toString() == curShopId.toString()){
        rootArr[i].children.forEach((item) => {
          contributors['next'].push(item.shopId.toString());
          (item.children || []).forEach((subItem) => {
            subItem && contributors['nextToNext'].push(subItem.shopId.toString())
          })
        })
        finished = true;
      }else{
        finished = false;
        this._findNextTwoLevel(rootArr[i].children,contributors,curShopId,finished);
     }
    }
  }
  

  getListByCreatedShopIdAndStatus(req,res,next,errorCb){
      var {createdShopId,status} = req.params;
      var statusArr = status.split('|');
      statusArr.map((item)=>{
        return parseInt(item);
      });
      let orderList = [];
      OrderModel.findAndPopulate({status:{$in:statusArr}},{},"shopId commodityId",null,(docs)=>{
        docs && docs.forEach((orderItem) => {

          if(orderItem.commodityId && orderItem.commodityId.shopId.toString() === createdShopId.toString()){
            let tempItem = orderItem.toObject();
            orderList.push(orderItem)
          }
        })
        sendJson(res,{
          code: 0,
          msg:'get order list success',
          data: {
            orderList
          }
        })
      },errorCb);
  }
  
  
  getListByCommodityId(req,res,next,errorCb){
      var params = req.params;
      var commodityId = params.commodityId;
      OrderModel.findAndPopulate({commodityId:commodityId},{},"shopId commodityId",null,(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get order list success',
          data: {
            orderList:docs
          }
        })
      },errorCb);
  }

  getListByCommodityIdAndStatus(req,res,next,errorCb){
      const {commodityId,status} = req.params;
      OrderModel.findAndPopulate({commodityId:commodityId,status:status},{},"shopId commodityId",null,(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get order list success',
          data: {
            orderList:docs
          }
        })
      },errorCb);
  }

  get(req,res,next,errorCb){
      var params = req.params;
      var orderId = params.orderId;
      OrderModel.findOneAndPopulate({_id:orderId},{},"shopId commodityId",null,(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get order success',
          data: {
            orderInfo:docs
          }
        })
      },errorCb);
  }

  add(req,res,next,errorCb){
      var params = req.body;
      var orderInfo = params.orderInfo;
      OrderModel.save(orderInfo,(docs)=>{
          sendJson(res,{
            code:0,
            msg:'add order success',
            data:{}
         })
      },errorCb);
  }

  addList(req,res,next,errorCb){
      var params = req.body;
      var orderList = params.orderList || [];
      OrderModel.saveMany(orderList,(docs)=>{
        let toPaidOrderList = [];
        docs && docs.forEach((item) => {
          toPaidOrderList.push({
            orderId:item._id,
            shopId:item.shopId,
            commodityId:item.commodityId,
            modelId:item.modelId,
            buySum:item.buySum,
            payMoney:item.payMoney
          })
        })
        sendJson(res,{
          code:0,
          msg:'add order list success',
          data:{
            toPaidOrderList
          }
       })
      },errorCb);
  }

  remove(req,res,next,errorCb){
      const params = req.body;
      const orderId = params.orderId;
      OrderModel.remove({_id:orderId},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'remove order success',
            data:{}
         })
      },errorCb);
  }

  getStatus(req,res,next,errorCb){
     var {orderId} = params;
      OrderModel.findById(orderId,(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get order status success',
          data: {
            orderStatus:docs.status
          }
        })
      },errorCb);
  }

  pay(req,res,next,errorCb){
      const {payList} = req.body;
      const now = Date.now();
      let finishedSum = 0;

      SettingModel.findOne({},{distributionLevel:1,distributionRatio:1},(setting)=>{
        let distributionLevel = setting.distributionLevel;
        let distributionRatio = setting.distributionRatio;

        console.log('---------distributionLevel------------')
        console.log(distributionLevel)
        console.log(distributionRatio)
        console.log('-----------distributionLevel end----------')

        //批量修改订单信息
        payList.forEach((payItem) => {
            const {allCommodityPrice,carryPrice} = payItem.payMoney;
            const buySum = payItem.buySum;
            const curShopId = payItem.shopId;
            OrderModel.updateData({_id:payItem.orderId},{$set:{payMoney:payItem.payMoney,status:1,payTime:now,
              curDistributionLevel:distributionLevel,curDistributionRatio:distributionRatio}},(orderDoc)=>{

              //批量修改商品信息
                CommodityModel.updateData({_id:payItem.commodityId,'models._id':payItem.modelId},
                  {$inc:{saleQuantity:buySum,saleAmount:allCommodityPrice,"models.$.modelRest":-buySum}},
                    (commodityDoc) =>{

                      let commodityInfo = commodityDoc.toObject();
                      let creatorId = commodityInfo.shopId;  // 找出商品所有者
                      let distributionTree = commodityInfo.distributionTree; //分销树
                      let profit = 0;  //商品利润
                      let contributors = [];
                      
                      commodityInfo.models && commodityInfo.models.forEach((modelItem,modelIndex) => {
                        if(modelItem._id == payItem.modelId){
                          profit = modelItem.modelProfit;  //获取到利润
                        }
                      })
                      if(creatorId.toString() === curShopId.toString()){
                        contributors  = [];
                      }else{
                        this._findPrevTwo(distributionTree,contributors,creatorId,curShopId,0,0,false);
                      }
                      //分配利润
                      console.log('------contributors---------------------------')
                      console.log(contributors)
                      console.log('------contributors end---------------------------')
                      console.log('-----------------------profit---------------')
                      console.log(buySum)
                      console.log(profit)
                      console.log('-----------------------profit end---------------')
                      this._calculateContributorIncome(creatorId,contributors,payItem.commodityId,allCommodityPrice,carryPrice,buySum*profit,distributionLevel,distributionRatio,
                        (creatorIncome,oneLevelIncome,twoLevelIncome,threeLevelIncome)=>{
                          //保存各级收入信息
                          OrderModel.updateData({_id:payItem.orderId},{$set:{creatorIncome,oneLevelIncome,twoLevelIncome,threeLevelIncome}},()=>{ 
                            finishedSum++ ;
                            //全部更新完成
                            if(finishedSum == payList.length){
                              sendJson(res,{
                                code:0,
                                msg:'update order status and calculate income success',
                                data:{}
                              },errorCb)
                            }
                          },errorCb)  
                      },errorCb)

                },errorCb) //find commodity

          },errorCb);  //update order

        }) //froEach payList

      },errorCb)  //setting 
      
  }
  
  _findPrevTwo(rootArr,contributors,creatorId,curShopId,prev,prevOfPrev,finished){  
    if(!rootArr || !(rootArr instanceof Array) || rootArr.length ===0){ //没有代理商或者说供货商直销
        return;
    }
    for(let i=0,len=rootArr.length;i<len;i++){
      if(finished){
        break;
      }
      if(rootArr[i].shopId.toString() == curShopId.toString()){
        prevOfPrev && contributors.unshift(prevOfPrev); 
        prev && contributors.unshift(prev); 
        contributors.unshift(curShopId) 
        finished = true;
      }else{
        finished = false;
        prevOfPrev = prev;
        prev = rootArr[i].shopId;
        this._findPrevTwo(rootArr[i].children,contributors,creatorId,curShopId,prev,prevOfPrev,finished);
     }
    }
  }

  _calculateContributorIncome(creatorId,contributors,commodityId,allCommodityPrice,carryPrice,allProfit,buySum,distributionLevel,distributionRatio,callback,errorCb){
    let creatorIncome = oneLevelIncome = twoLevelIncome = threeLevelIncome = 0;
    if(!contributors || contributors.length === 0){  //供货商直销，没有代理商
       creatorIncome = allCommodityPrice + carryPrice;
       ShopModel.updateData({_id:creatorId,"createdCommodities.commodityId":commodityId},
          {$inc:{income:creatorIncome,"createdCommodities.$.saleQuantity":buySum,"createdCommodities.$.saleAmount":allCommodityPrice}},()=>{
          callback && callback()
       },errorCb)
       return;
    }
    
    if(distributionLevel == 1){  //一级分润，销售方直接获取所有佣金
        creatorIncome = allCommodityPrice - allProfit + carryPrice;
        oneLevelIncome = allProfit;
        //供应商收入
        ShopModel.updateData({_id:creatorId},{$inc:{income:creatorIncome}},()=>{
          //分销商收入
          contributors[0] && ShopModel.updateData({_id:contributors[0],"clonedCommodities.commodityId":commodityId},
            {$inc:{income:oneLevelIncome,"clonedCommodities.$.saleQuantity":buySum,"clonedCommodities.$.saleAmount":allCommodityPrice}},()=>{
            callback && callback();
          },errorCb)
        },errorCb)
    }else if(distributionLevel == 2){ //二级分润，达不到分级数量多余利润归创建者
        if(contributors.length == 1){
            oneLevelIncome = allProfit * (distributionRatio[0] / 10) ;
            creatorIncome = allCommodityPrice - oneLevelIncome + carryPrice;
             //供应商收入
            ShopModel.updateData({_id:creatorId},{$inc:{income:creatorIncome}},()=>{
                //分销商收入
                contributors[0] && ShopModel.updateData({_id:contributors[0],"clonedCommodities.commodityId":commodityId},
                  {$inc:{income:oneLevelIncome,"clonedCommodities.$.saleQuantity":buySum,"clonedCommodities.$.saleAmount":allCommodityPrice}},()=>{
                  callback && callback();
                },errorCb)
            },errorCb)
        }else if(contributors.length == 2){
            oneLevelIncome = allProfit * (distributionRatio[0] / 10);
            twoLevelIncome = allProfit * (distributionRatio[1] / 10);
            creatorIncome = allCommodityPrice - oneLevelIncome - twoLevelIncome + carryPrice;
            //供应商收入
            ShopModel.updateData({_id:creatorId},{$inc:{income:creatorIncome}},()=>{
                //分销商收入和直销商的商品营业量营业额
                contributors[0] && ShopModel.updateData({_id:contributors[0],"clonedCommodities.commodityId":commodityId},
                  {$inc:{income:oneLevelIncome,"clonedCommodities.$.saleQuantity":buySum,"clonedCommodities.$.saleAmount":allCommodityPrice}},()=>{
                  contributors[1] && ShopModel.updateData({_id:contributors[1]},{$inc:{income:twoLevelIncome}},()=>{
                    callback && callback();
                  },errorCb)
                },errorCb)
            },errorCb)
        }

    }else if(distributionLevel == 3){ //三级分润，达不到分级数量多余利润归创建者
        if(contributors.length == 1){
          console.log(allProfit)
          console.log(distributionRatio[0])
            oneLevelIncome = allProfit * (distributionRatio[0] / 10);
            creatorIncome = allCommodityPrice - oneLevelIncome + carryPrice;
            console.log('---------------income-------------------')
            console.log(oneLevelIncome)
            console.log(contributors[0])
            console.log(creatorIncome)
            console.log(creatorId)
            console.log('---------------income end-------------------')
             //分销商收入
            ShopModel.updateData({_id:creatorId},{$inc:{income:creatorIncome}},()=>{
                //供应商收入
                contributors[0] && ShopModel.updateData({_id:contributors[0],"clonedCommodities.commodityId":commodityId},
                  {$inc:{income:oneLevelIncome,"clonedCommodities.$.saleQuantity":buySum,"clonedCommodities.$.saleAmount":allCommodityPrice}},()=>{
                    callback && callback();
                },errorCb)
            },errorCb)
        }else if(contributors.length == 2){
            oneLevelIncome = allProfit * (distributionRatio[0] / 10);
            twoLevelIncome = allProfit * (distributionRatio[1] / 10);
            creatorIncome = allCommodityPrice - oneLevelIncome - twoLevelIncome + carryPrice;
            //分销商收入
            ShopModel.updateData({_id:creatorId},{$inc:{income:creatorIncome}},()=>{
                //供应商收入
                contributors[0] && ShopModel.updateData({_id:contributors[0],"clonedCommodities.commodityId":commodityId},
                  {$inc:{income:oneLevelIncome,"clonedCommodities.$.saleQuantity":buySum,"clonedCommodities.$.saleAmount":allCommodityPrice}},()=>{
                  contributors[1] && ShopModel.updateData({_id:contributors[1]},{$inc:{income:twoLevelIncome}},()=>{
                    callback && callback();
                  },errorCb)
                },errorCb)
            })
        }else if(contributors.length == 3){
            oneLevelIncome = allProfit * (distributionRatio[0] / 10);
            twoLevelIncome = allProfit * (distributionRatio[1] / 10);
            threeLevelIncome = allProfit * (distributionRatio[2] / 10)
            creatorIncome = allCommodityPrice - allProfit + carryPrice;
           //供应商收入
            ShopModel.updateData({_id:creatorId},{$inc:{income:creatorIncome}},()=>{
                //分销商收入，除了直销商多加销售量和销售额外，其他只加收入
                contributors[0] && ShopModel.updateData({_id:contributors[0],"clonedCommodities.commodityId":commodityId},
                  {$inc:{income:oneLevelIncome,"clonedCommodities.$.saleQuantity":buySum,"clonedCommodities.$.saleAmount":allCommodityPrice}},()=>{
                    contributors[1] && ShopModel.updateData({_id:contributors[1]},{$inc:{income:twoLevelIncome}},()=>{
                        contributors[1] && ShopModel.updateData({_id:contributors[2]},{$inc:{income:threeLevelIncome}},()=>{
                            callback && callback(creatorIncome,oneLevelIncome,twoLevelIncome,threeLevelIncome);
                        },errorCb)
                    },errorCb)
                },errorCb)
            })
        }
    }
  }

  hadSendCommodity(req,res,next,errorCb){
      const {orderId,courierType,courierNumber} = req.body;
      const sendCommodityTime = Date.now();
      OrderModel.updateData({_id:orderId},{$set:{status:2,sendCommodityTime,courierType,courierNumber}},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'send commodity success',
            data:{}
         })
      },errorCb);
  }

  hadReceivedCommodity(req,res,next,errorCb){
      const {orderId} = req.body;
      const receiveCommodityTime = Date.now();
      OrderModel.updateData({_id:orderId},{$set:{status:3,receiveCommodityTime}},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'receive commodity success',
            data:{}
         })
      },errorCb);
  }

  addComment(req,res,next,errorCb){
    const {orderId,commentContent,commentGrade} = req.body;
    const commentCreateTime = Date.now();
      OrderModel.updateData({_id:orderId},{$set:{commentContent,commentGrade,commentCreateTime,status:4}},(docs)=>{
          sendJson(res,{
            code:0,
            msg:'add order comment success',
            data:{}
         })
      },errorCb);
  }
  
  //获取某个商品的所有评论，无论是代理商还是供应商创建的订单
    getCommentList(req,res,next,errorCb){
      const {commodityId} = req.params;
      OrderModel.findAndPopulate({commodityId,status:4},{},"commodityId userId",null,(docs)=>{
        let commentList = [];
        docs && docs.forEach((item) => {
          let orderItem = item.toObject();
          let model = null;
          orderItem.commodityId.models.forEach((modelItem) => {
            if(modelItem._id.toString() === orderItem.modelId.toString()){
              model = modelItem;
            }
          })  
          commentList.push({
            userName: orderItem.userId.name,
            modelType:model['modelType'],
            modelImg:model['modelImg'],
            payTime:orderItem.payTime,
            commentContent: orderItem.commentContent,
            commentGrade: orderItem.commentGrade,
          })
        })
        sendJson(res,{
          code: 0,
          msg:'get comment list success',
          data: {
            commentList
          }
        })
      },errorCb);
  }

}

module.exports = new OrderController();
