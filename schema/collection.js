var Schema = require('mongoose').Schema;
module.exports = {

    //通用的信息配置
    settings:{
        logo:{type:String,default:'/public/images/28.jpg'},
        distributionLevel:{type:Number,default:3},  //默认三级分销，三级分润,最高三级
        distributionRatio:{type:[Number],default:[5,3,2]},  //分润比例
    },

    users:{
        role:{type:Number,default:2}, //0为超级管理员，1为普通管理员
        name:{type:String,unique: true },
        img:{type:String,default:'/public/images/28.jpg'},
        birthday:{type:Date,default:Date()},
        phoneNumber:{type:String,unique: true,default:""},
        phoneCode:{type:String,default:"86"},
        password:String,
        wx:String,
        qq:String,
        sex:{type:String,default:'男',enum:['男','女']},
        login:{type:Boolean,default:false},
        latestLoginInTime:{type:Date,default:Date()},

        shopCollections:[{
            shopId:{type:Schema.Types.ObjectId,ref:'shops'}
        }],

        commodityCollections:[{
            shopId:{type:Schema.Types.ObjectId,ref:'shops'},
            commodityId:{type:Schema.Types.ObjectId,ref:'commodities'}
        }],
        
        address:[{  
            receiver:String,
            phone:String,
            province:String,
            city:String,
            distinct:String,
            addressDetail:String,
            isDefault:false,
            uuid:String
        }],


        shopCar:[
            {   
                shopId:{type:Schema.Types.ObjectId,ref:'shops'},
                commodityId:{type:Schema.Types.ObjectId,ref:'commodities'},
                modelId:{type:Schema.Types.ObjectId},
                buySum:Number
            }
        ]

    },

    shops:{
        userId:{type:Schema.Types.ObjectId,ref:'users'},
        startTime:{type:Date,default: Date()},
        shopName:{type:String},
        shopDesc:{type:String},
        shopImg:{type:String,default:'/public/images/28.jpg'},
        shopInformation:{type:String},
        shopAddress:{type:String},
        shopPhoneNumber:{type:String},
        shopComfirm:{type:Boolean,default:false},
        shopCertificate:{type:String},  //证书
        income:{type:Number,default:0},  //收入
        shopLevel:{type:Number,default:0},
        collectionSum:{type:Number,default:0},//收藏数

        carryCate:[{
            name:String,
            exceptAreas:[String],  //不包邮地区，货到付款
            freeSum:{type:Number,default:1},  //多少件起免运费
            normalPrice:{type:Number,default:0}, //运费
        }],
        //商品分类，店主自定义分类，与商品类目不同
        commodityCate:[{
            name:String,
        }],
   
        //便于查找店铺所有商品
        createdCommodities:[
            {
                commodityId:{type:Schema.Types.ObjectId,ref:'commodities'},
                commodityCateId:{type:Schema.Types.ObjectId},
                upcarriage:{type:Number,default:0}, //1表示上架销售中，0表示下架
                shopOwnerRecommodate:{type:Boolean,default:false},
                saleQuantity:{type:Number,default:0},  //直销
                saleAmount:{type:Number,default:0}, //直销

            }
        ],
         //便于查找店铺所有商品
        clonedCommodities:[
            {
                commodityId:{type:Schema.Types.ObjectId,ref:'commodities'},
                commodityCateId:Schema.Types.ObjectId,
                upcarriage:{type:Number,default:0}, //1表示上架销售中，0表示下架
                shopOwnerRecommodate:{type:Boolean,default:false},
                saleQuantity:{type:Number,default:0},   //直销
                saleAmount:{type:Number,default:0}, //直销
            }
        ]

   },

    commodities:{
        shopId:{type:Schema.Types.ObjectId,ref:'shops'},
        createTime:{type:Date,default:Date()},
        name:String,
        showImgs:[],
        detail:String,
        carryCateId:{type:Schema.Types.ObjectId},
        categoryId:{type:Schema.Types.ObjectId,ref:'categories'},
        models:[{   //商品型号
             modelType:String,
             modelImg:String,
             modelPrice:Number,
             modelRest:Number, //无型号区分的时候
             modelProfit:Number,
        }],
        // 分销树
        distributionTree:Schema.Types.Mixed,
        saleQuantity:{type:Number,default:0}, //总销量，包括供应商直销和代理商销售的
        saleAmount:{type:Number,default:0},  //总销售额，包括供应商直销和代理商销售的
        collectionSum:Number//收藏数量
    },

    // 商品类目
    categories:{
       name:String,
       pid:{type:Number,default:0},
       swiperImgs:{type:[String]},  //只有pid为0的文档才有此字段
    },
    
    //首页
    markets:{         
        swiperImgs:{type:[String]},
        hotCase:[
            {
                shopId:{type:Schema.Types.ObjectId,ref:'shops'},
                commodityId:{type:Schema.Types.ObjectId,ref:'commodities'}
            }
        ],
        specialActivities:[
            {
                headImage:String,
                startTime:Date,
                endTime:Date,
                commodities:[
                    {
                        shopId:{type:Schema.Types.ObjectId,ref:'shops'},
                        commodityId:{type:Schema.Types.ObjectId,ref:'commodities'}
                    }
                ]
            }
        ]
    },

    orders:{
        shopId:{type:Schema.Types.ObjectId,ref:'shops'},
        commodityId:{type:Schema.Types.ObjectId,ref:'commodities'},
        modelId:{type:Schema.Types.ObjectId},
        carryCateId:{type:Schema.Types.ObjectId},
        userId:{type:Schema.Types.ObjectId,ref:'users'},
        addressInfo:{
            receiver:String,
            phone:String,
            province:String,
            city:String,
            distinct:String,
            addressDetail:String
        },
        buySum:Number,
        words:String,
        createTime:{type:Date,default:Date()},
        status:{type:Number,default:0}, //0未支付，1已支付未发货，2已支付已发货，3已收货，4已评论
        payMoney:{
            allCommodityPrice:{type:Number,default:0},
            carryPrice:{type:Number,default:0},
        },  //订单金额
        payTime:{type:Date},
        curDistributionLevel:{type:Number,default:3},
        curDistributionRatio:{type:[Number],default:[5,3,2]},  //分润比例
        creatorIncome:{type:Number},
        oneLevelIncome:{type:Number},
        twoLevelIncome:{type:Number},
        threeLevelIncome:{type:Number},  
        sendCommodityTime:{type:Date}, 
        courierType:{type:String}, //快递类型
        courierNumber:{type:String},//快递单号
        receiveCommodityTime:{type:Date}, 
        commentCreateTime:{type:Date},
        commentContent:String,
        commentGrade:{type:Number}
    },

    "messages":{
        fromId:{type:Schema.Types.ObjectId}, //可能是userId也可能是shopId
        toId:{type:Schema.Types.ObjectId}, //可能是userId也可能是shopId
        createTime:{type:Date,default:Date()},
        content:String,
    },

    Informations:{
        toShopId:{type:Schema.Types.ObjectId,ref:'shops'},
        createTime:{type:Date,default:Date()},
        content:String,
    },
}