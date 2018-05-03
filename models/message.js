var DB = require('./db');
var messageSchema = require('../schema/messageSchema');

class MessageModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'messages';
        //创建schema
        messageSchema = this.wrapperUserSchema(messageSchema);
        
        //创建相关model
        this.model = MessageModel.mongoose.model(this.modelName, messageSchema);
    }

    wrapperUserSchema(schema){
        // 在Schema里添加自定义方法
        schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
          
        };
        return schema;

    }


}

module.exports = new MessageModel();