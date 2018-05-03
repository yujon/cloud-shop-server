var DB = require('./db');
var marketSchema = require('../schema/marketSchema');

class MarketModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'markets';
        //创建schema
        marketSchema = this.wrapperUserSchema(marketSchema);
        
        //创建相关model
        this.model = MarketModel.mongoose.model(this.modelName, marketSchema);
    }

    wrapperUserSchema(schema){
        // 在Schema里添加自定义方法
        schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
          
        };
        return schema;

    }
}

module.exports = new MarketModel();