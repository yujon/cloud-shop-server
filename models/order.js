var DB = require('./db');
var orderSchema = require('../schema/orderSchema');

class OrderModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'orders';
        //创建schema
        orderSchema = this.wrapperUserSchema(orderSchema);
        
        //创建相关model
        this.model = OrderModel.mongoose.model(this.modelName, orderSchema);
    }

    wrapperUserSchema(schema){
        // 在Schema里添加自定义方法
        schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
          
        };
        return schema;

    }


}

module.exports = new OrderModel();