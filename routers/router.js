module.exports = {
	user: [
    	{
    	   	action:'loginUp',
    	   	type:'post'
    	},
    	{
    	   	action:'loginIn',
    	   	type:'post'
    	},
    	{
    	   	action:'loginOut',
    	   	type:'post'
    	},
    	{	
            	action:'get/:userId',
            	type:'get'
    	},
        {
        	action:'update',
        	type:'post'
        },
        {
        	action:'remove',
        	type:'post'
        },
        {
            action:'getCollectionList/:userId/:type',
            type:'get'
        },
        {
            action:'addCollection',
            type:'post'
        },
        {
            action:'removeCollection',
            type:'post'
        },
        {
            action:'getAddressList/:userId',
            type:'get'
        },
        {
            action:'getAddress/:userId/:addressId',
            type:'get'
        },
        {
            action:'addAddress',
            type:'post'
        },
        {
            action:'updateAddress',
            type:'post'
        },
        {
            action:'removeAddress',
            type:'post'
        },
        {
            action:'getShopCarCommodityList/:userId',
            type:'get'
        },
        {
            action:'addCommodityToShopCar',
            type:'post'
        },
        {
            action:'removeCommodityFromShopCar',
            type:'post'
        },
        {
            action:'removeCommodityListFromShopCar',
            type:'post'
        },
	],

    shop:[
        {
            action:'getListByUserId/:userId',
            type:'get'
        },
        {
            action:'getList',
            type:'get'
        },
        {
            action:'getAgentListByCreatedShopIdAndLevel/:createdShopId/:curLevel',
            type:'get'
        },
        {
            action:'getAgentListByClonedShopIdAndLevel/:clonedShopId/:curLevel',
            type:'get'
        },
        {
            action:'get/:shopId',
            type:'get'
        },
        {
            action:'add',
            type:'post'
        },
        {
            action:'update',
            type:'post'
        },
        {
            action:'remove',
            type:'post'
        },
        {
            action:'checkHaveCommodity',
            type:'post'
        },
        {
            action:'getCommodityCateList/:shopId',
            type:'get'
        },
        {
            action:'getCommodityCate/:shopId/:commodityCateId',
            type:'get'
        },
        {
            action:'addCommodityCate',
            type:'post'
        },
        {
            action:'removeCommodityCate',
            type:'post'
        },
        {
            action:'updateCommodityCate',
            type:'post'
        },
        {
            action:'getCarryCateList/:shopId',
            type:'get'
        },
        {
            action:'getCarryCate/:shopId/:carryCateId',
            type:'get'
        },
        {
            action:'addCarryCate',
            type:'post'
        },
        {
            action:'removeCarryCate',
            type:'post'
        },
        {
            action:'updateCarryCate',
            type:'post'
        },
    ],
    
  
    commodity: [
        {
               action:'create' ,
               type:'post'
        },
        {
               action:'clone' ,
               type:'post'
        },
        {
               action:'update',
               type:'post'
        },
        {
               action:'remove',
               type:'post'
        },
        {
            action:'getListByShopId/:shopId',
            type:'get'
        },
        {
            action:'getUpCarriageListByShopId/:shopId',
            type:'get'
        },
        {
            action:'get/:shopId/:commodityId',
            type:'get'
        },
        {
               action:'getCreatedListByShopId/:shopId',
               type:'get'
        },
        {
               action:'getClonedListByShopId/:shopId',
               type:'get'
        },
        {
            action:'getUpCarriageList',
            type:'get'
        },
        {
               action:'getListByCategoryId/:categoryId',
               type:'get'
        },
    ],

    category:[
        {
            action:'getListByPid/:pid',
            type:'get'
        },
        {
            action:'get/:categoryId',
            type:'get'
        },
        {
            action:'add',
            type:'post'
        },
        {
            action:'update',
            type:'post'
        },
        {
            action:'remove',
            type:'post'
        },
    ],

    market:[
        {
            action:'add',
            type:'post'
        },
        {
            action:'getSwiperImgList',
            type:'get'
        },
        {
            action:'updateSwiperImgList',
            type:'post'
        },
        {
            action:'getHotCaseList',
            type:'get'
        },
        {
            action:'updateHotCaseList',
            type:'post'
        },
        {
            action:'getSpecialActivityList',
            type:'get'
        },
        {
            action:'addSpecialActivityListItem',
            type:'post'
        },
         {
            action:'updateSpecialActivityListItem',
            type:'post'
        },
         {
            action:'removeSpecialActivityListItem',
            type:'post'
        }
    ],

    order:[
        {
            action:'getListByUserId/:userId',
            type:'get'
        },
        {
            action:'getListByUserIdAndStatus/:userId/:status',
            type:'get'
        },
        {
            action:'getListByShopId/:shopId',
            type:'get'
        },
        {
            action:'getListByShopIdAndStatus/:shopId/:status',
            type:'get'
        },
        {
            action:'getListByClonedShopIdAndStatus/:clonedShopId/:status',
            type:'get'
        },
        {
            action:'getListByCreatedShopIdAndStatus/:createdShopId/:status',
            type:'get'
        },
        {
            action:'getListByCommodityId/:commodityId',
            type:'get'
        },
        {
            action:'getListByCommodityIdAndStatus/:commodityId/:status',
            type:'get'
        },
        {
            action:'getStatus/:orderId',
            type:'get'
        },
        {
                action:'addList',
                type:'post'
        },
        {
                action:'add',
                type:'post'
        },
        {
                action:'update',
                type:'post'
        },
        {
                action:'remove',
                type:'post'
        },
        {
            action:'hadSendCommodity',
            type:'post'
        },
        {
            action:'pay',
            type:'post'
        },
        {
            action:'hadReceivedCommodity',
            type:'post'
        },
        {
            action:'addComment',
            type:'post'
        },
        {
            action:'getCommentList/:commodityId',
            type:'get'
        },
    ],

    message:[
        {
            action:'getList/:fromUserId/:toUserId/:skip',
            type:'get'
        },
        {
                action:'add',
                type:'post'
        }
    ],

    information:[
        {
            action:'getList/:toShopId/:skip',
            type:'get'
        },
        {
                action:'add',
                type:'post'
        },
        {
                action:'update',
                type:'post'
        },
        {
                action:'remove',
                type:'post'
        },
    ],

    setting:[
        {
            action:'get',
            type:'get'
        },
        {
            action:'update',
            type:'post'
        },
    ]
     
}
