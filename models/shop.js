var DB = require('./db');
var shopSchema = require('../schema/shopSchema');

class ShopModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'shops';
        //创建schema
        shopSchema = this.wrapperUserSchema(shopSchema);
        
        //创建相关model
        this.model = ShopModel.mongoose.model(this.modelName, shopSchema);
    }

    wrapperUserSchema(schema){
		// 在Schema里添加自定义方法
		schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
		  
		};
		return schema;

    }


}

module.exports = new ShopModel();