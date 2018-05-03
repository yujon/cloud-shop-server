var DB = require('./db');
var informationSchema = require('../schema/informationSchema');

class InformationModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'informations';
        //创建schema
        informationSchema = this.wrapperUserSchema(informationSchema);
        
        //创建相关model
        this.model = InformationModel.mongoose.model(this.modelName, informationSchema);
    }

    wrapperUserSchema(schema){
        // 在Schema里添加自定义方法
        schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
          
        };
        return schema;

    }
}

module.exports = new InformationModel();