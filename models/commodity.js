var DB = require('./db');
var commoditySchema = require('../schema/commoditySchema');

class commodityModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'commodities';
        //创建schema
        commoditySchema = this.wrapperUserSchema(commoditySchema);
        
        //创建相关model
        this.model = commodityModel.mongoose.model(this.modelName, commoditySchema);
    }

    wrapperUserSchema(schema){
        // 在Schema里添加自定义方法
        schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
          
        };
        return schema;

    }


}

module.exports = new commodityModel();