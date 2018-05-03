var DB = require('./db');
var userSchema = require('../schema/userSchema');

class UserModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'users';
        //创建schema
        userSchema = this.wrapperUserSchema(userSchema);
        
        //创建相关model
        this.model = UserModel.mongoose.model(this.modelName, userSchema);
    }

    wrapperUserSchema(schema){
		// 在Schema里添加自定义方法
		schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
		  
		};
		return schema;

    }


}

module.exports = new UserModel();