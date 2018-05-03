var ShopModel = require('../models/shop');
var CommodityModel = require('../models/commodity');
var {sendJson} = require('../utils/response');
class ShopController {
   
   getListByUserId(req,res,next,errorCb){
      var params = req.params;
      var userId = params.userId;
      ShopModel.find({userId:userId},{},(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get shop list success',
          data: {
            shopList:docs
          }
        })
      },errorCb);
   }

    getList(req,res,next,errorCb){
      var params = req.params;
      ShopModel.find({},{},(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get shop list success',
          data: {
            shopList:docs
          }
        })
      },errorCb);
   }

   getAgentListByCreatedShopIdAndLevel(req,res,next,errorCb){
      var {createdShopId,curLevel} = req.params;
      console.log(createdShopId,curLevel)
      CommodityModel.find({shopId:createdShopId},{_id:1,name:1,distributionTree:1,saleAmount:1,saleQuantity:1},(commodityList)=>{
        
        let agentList = [];
        let finished = 0;
        commodityList && commodityList.forEach((commodityItem) => {
          let temp = commodityItem.toObject();
          let nodeList = temp.distributionTree;
          let tempArr = temp.distributionTree;
          let idList = [];
          for(var i=0;i<curLevel;i++){
            nodeList = [];
            tempArr.forEach((item) => {
              nodeList = nodeList.concat(item.children);
            })
            tempArr = nodeList;
          }
      
          nodeList.forEach((item) => {
            idList.push(item.shopId)
          })

          //找出该商品当下层级的所有代理商
          ShopModel.find({_id:{$in:idList}},{createdCommodities:0,commodityCate:0,carryCate:0},(shopList)=>{

            shopList && shopList.forEach((temp) => {
              let shopItem = temp.toObject();
              shopItem.agentCommodities = [];
              shopItem && shopItem.clonedCommodities.forEach((clonedCommodityItem) => {
                if(clonedCommodityItem.commodityId.toString() == commodityItem._id.toString()){
                  shopItem.agentCommodities.push({
                    commoditySaleAmount:clonedCommodityItem['saleAmount'],
                    commoditySaleQuantity:clonedCommodityItem['saleQuantity'],
                    commodityName: commodityItem['name'],
                    commodityAllSaleQuantity: commodityItem['saleAmount'],
                    commodityAllSaleAmount:commodityItem['saleQuantity']
                  })
                }
              })
              delete shopItem.clonedCommodities;
              let isExist = false;
              agentList.map((agentItem) => {
                 if(agentItem._id.toString() == shopItem._id.toString()){
                  agentItem.agentCommodities = agentItem.agentCommodities.concat(shopItem.agentCommodities);
                  isExist = true;
                 }
              })
              if(!isExist){
                agentList.push(shopItem);
              }
            })
            finished ++;
            if(finished == commodityList.length){
              sendJson(res,{
                code: 0,
                msg:'get agent list success',
                data: {
                  agentList
                }
              })
            }
          },errorCb)
        })
        
      },errorCb);
   }

   getAgentListByClonedShopIdAndLevel(req,res,next,errorCb){
      var {clonedShopId,curLevel} = req.params;
      console.log(clonedShopId,curLevel)
      ShopModel.findOneAndPopulate({_id:clonedShopId},{createdCommodities:0,commodityCate:0,carryCate:0},
          "clonedCommodities.commodityId",null,(shopItem)=>{
        
        let agentList = [];
        let finished = 0;
        shopItem && shopItem.clonedCommodities.forEach((commodityItem) => {
          let temp = commodityItem.commodityId.toObject();
          let stack = temp.distributionTree;
          let idList = [];
          while(stack.length > 0){  
            let node = stack.shift(0,1);
            //找到店铺
            if(node.shopId && node.shopId.toString() == clonedShopId.toString()){
              let nodeList = [node];
              let tempArr = [node];
              for(var i=0;i<curLevel;i++){
                nodeList = [];
                tempArr.forEach((item) => {
                  nodeList = nodeList.concat(item.children);
                })
                tempArr = nodeList;
              }
      
              nodeList.forEach((item) => {
                idList.push(item.shopId)
              })

              console.log(idList)
              break;
            }else{
              for(let i=0; i < node.children.length; i++)  {  
                stack.push(node.children[i]);  
              }  
            }
          } 
        

          //找出该商品当下层级的所有代理商
          ShopModel.find({_id:{$in:idList}},{createdCommodities:0,commodityCate:0,carryCate:0},(shopList)=>{
            console.log(shopList)
            shopList && shopList.forEach((temp) => {
              let tempShopItem = temp.toObject();
              tempShopItem.agentCommodities = [];
              tempShopItem && tempShopItem.clonedCommodities.forEach((clonedCommodityItem) => {
                if(clonedCommodityItem.commodityId.toString() == commodityItem.commodityId._id.toString()){
                  tempShopItem.agentCommodities.push({
                    commoditySaleAmount:clonedCommodityItem['saleAmount'],
                    commoditySaleQuantity:clonedCommodityItem['saleQuantity'],
                    commodityName: commodityItem.commodityId['name'],
                    commodityAllSaleQuantity: commodityItem.commodityId['saleAmount'],
                    commodityAllSaleAmount:commodityItem.commodityId['saleQuantity']
                  })
                }
              })
              delete tempShopItem.clonedCommodities;
              let isExist = false;
              agentList.map((agentItem) => {
                 if(agentItem._id.toString() == tempShopItem._id.toString()){
                  agentItem.agentCommodities = shopItem.agentCommodities.concat(tempShopItem.agentCommodities);
                  isExist = true;
                 }
              })
              if(!isExist){
                agentList.push(tempShopItem);
              }
            })
            finished ++;
            if(finished == shopItem.clonedCommodities.length){
              sendJson(res,{
                code: 0,
                msg:'get agent list success',
                data: {
                  agentList
                }
              })
            }
          },errorCb)
        }) //foreach shop.cloneCommodities
        
      },errorCb);
   }

   get(req,res,next,errorCb){
      var params = req.params;
      var shopId = params.shopId;
      ShopModel.findOne({_id:shopId},{},(docs)=>{
        sendJson(res,{
          code: 0,
          msg:'get shop info success',
          data: {
            shopInfo:docs
          }
        })
      },errorCb);
   }

   add(req,res,next,errorCb){
      var params = req.body;
      var userId = params.userId;
      var shopInfo = params.shopInfo;
      ShopModel.save({userId,...shopInfo},()=>{
        ShopModel.find({userId:userId},{},(shopList)=>{
          sendJson(res,{
            code:0,
            msg:'add shop success',
            data:{
              shopList
            }
         })
         },errorCb); 
      },errorCb);
   }

   remove(req,res,next,errorCb){
      var params = req.body;
      var shopId = params.shopId;
      ShopModel.remove({_id:shopId},()=>{
         ShopModel.find({userId:userId},{},(shopList)=>{
          sendJson(res,{
            code:0,
            msg:'remove shop success',
            data:{
              shopList
            }
         })
        },errorCb);
      },errorCb);
   }

   update(req,res,next,errorCb){
      const {shopId,shopInfo} = req.body;
      ShopModel.updateData({_id:shopId},shopInfo,(doc)=>{
          ShopModel.findOne({_id:shopId},{},(shopInfo)=>{
           sendJson(res,{
              code:0,
              msg:'update shop success',
              data:{
                shopInfo
              }
           })
         },errorCb);
      },errorCb);
   }

   checkHaveCommodity(req,res,next,errorCb){
      const {shopId,commodityId} = req.body;
      ShopModel.find({_id:shopId,$or:[{"createdCommodities.commodityId":commodityId},{"clonedCommodities.commodityId":commodityId}]},{},(docs)=>{
           let shopHaveCommodity = false;
           if(docs && docs.length){
            shopHaveCommodity = true;
           }
           sendJson(res,{
              code:0,
              msg:'check success',
              data:{
                shopHaveCommodity
              }
           })
         
      },errorCb);
   }

   getCommodityCateList(req,res,next,errorCb){
      var params = req.params;
      var shopId = params.shopId;
      ShopModel.findById(shopId,(docs)=>{
        let commodityCateList = docs? docs.commodityCate:[]
        sendJson(res,{
          code: 0,
          msg:'get CommodityCateList list success',
          data: {
            commodityCateList
          }
        })
      },errorCb);
   }

  getCommodityCate(req,res,next,errorCb){
      var params = req.params;
      var shopId = params.shopId;
      var commodityCateId = params.commodityCateId;
      ShopModel.findOne({_id:shopId,"commodityCate._id":commodityCateId},{commodityCate:1},(docs)=>{
        let commodityCate = docs? docs.commodityCate:[];
        sendJson(res,{
          code: 0,
          msg:'get commodityCate success',
          data:{
            commodityCateInfo:commodityCate
          }
        })
      },errorCb);
  }

  addCommodityCate(req,res,next,errorCb){
      var params = req.body;
      var shopId = params.shopId;
      var commodityCateInfo = params.commodityCateInfo;
      ShopModel.updateData({_id:shopId},{$push:{commodityCate:commodityCateInfo}},(docs)=>{
        ShopModel.findById(shopId,(shop)=>{
          sendJson(res,{
            code:0,
            msg:'add commodityCate success',
            data:{
              commodityCateList:shop.commodityCate
            }
         })
        },errorCb);
      },errorCb);
   }

   removeCommodityCate(req,res,next,errorCb){
      var params = req.body;
      var shopId = params.shopId;
      var commodityCateId = params.commodityCateId;
      ShopModel.updateData({_id:shopId},{$pull:{commodityCate:{_id:commodityCateId}}},(docs)=>{
        ShopModel.findById(shopId,(shop)=>{
          sendJson(res,{
            code:0,
            msg:'remove commodityCate success',
            data:{
              commodityCateList:shop.commodityCate
            }
          })
        },errorCb);
      },errorCb);
   }

   updateCommodityCate(req,res,next,errorCb){
      const {shopId,commodityCateId,commodityCateInfo} = req.body;
      var updateOp = {}
      for(var key in commodityCateInfo){
          updateOp["commodityCate.$."+ key] = commodityCateInfo[key];
      }
      ShopModel.updateData({_id:shopId,"commodityCate._id":commodityCateId},updateOp,(docs)=>{
        ShopModel.findById(shopId,(shop)=>{
          sendJson(res,{
            code:0,
            msg:'update commodityCate success',
            data:{
              commodityCateList:shop.commodityCate
            }
          })
        },errorCb); 
     },errorCb);
   }


    getCarryCateList(req,res,next,errorCb){
      var params = req.params;
      var shopId = params.shopId;
      ShopModel.findById(shopId,(docs)=>{
        let carryCateList = docs? docs.carryCate:[]
        sendJson(res,{
          code: 0,
          msg:'get carryCate list success',
          data: {
            carryCateList
          }
        })
      },errorCb);
   }

    getCarryCate(req,res,next,errorCb){
      var params = req.params;
      var shopId = params.shopId;
      var carryCateId = params.carryCateId;
      ShopModel.findOne({_id:shopId,"carryCate._id":carryCateId},{carryCate:1},()=>{
        let carryCateList= docs? docs.carryCate:[];
        sendJson(res,{
          code: 0,
          msg:'get carryCate success',
          data: {
            carryCateInfo:carryCateList
          }
        })
      },errorCb);
   }

   addCarryCate(req,res,next,errorCb){
      var params = req.body;
      var shopId = params.shopId;
      var carryCateInfo = params.carryCateInfo;
      ShopModel.updateData({_id:shopId},{$push:{carryCate:carryCateInfo}},()=>{
        ShopModel.findById(shopId,(shop)=>{
          sendJson(res,{
            code:0,
            msg:'add carryCate success',
            data:{
              carryCateList:shop.carryCate
            }
          })
        },errorCb);
      },errorCb);
   }

   removeCarryCate(req,res,next,errorCb){
      var params = req.body;
      var shopId = params.shopId;
      var carryCateId = params.carryCateId;
      ShopModel.updateData({_id:shopId},{$pull:{carryCate:{_id:carryCateId}}},()=>{
        ShopModel.findById(shopId,(shop)=>{
          sendJson(res,{
            code:0,
            msg:'remove carryCate success',
            data:{
              carryCateList:shop.carryCate
            }
          })
        },errorCb);
      },errorCb);
   }

   updateCarryCate(req,res,next,errorCb){
      const {shopId,carryCateId,carryCateInfo} = req.body;
      var updateOp = {}
      for(var key in carryCateInfo){
          updateOp["carryCate.$."+ key] = carryCateInfo[key];
      }
      ShopModel.updateData({_id:shopId,"carryCate._id":carryCateId},updateOp,()=>{
        ShopModel.findById(shopId,(shop)=>{
          sendJson(res,{
            code:0,
            msg:'update carryCate success',
            data:{
              carryCateList:shop.carryCate
            }
          })
        },errorCb);  
     },errorCb);
   }
}

module.exports = new ShopController();
