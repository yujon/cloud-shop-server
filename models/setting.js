var DB = require('./db');
var settingSchema = require('../schema/settingSchema');

class SettingModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'settings';
        //创建schema
        settingSchema = this.wrapperUserSchema(settingSchema);
        
        //创建相关model
        this.model = SettingModel.mongoose.model(this.modelName, settingSchema);
    }

    wrapperUserSchema(schema){
		// 在Schema里添加自定义方法
		schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
		  
		};
		return schema;

    }


}

module.exports = new SettingModel();