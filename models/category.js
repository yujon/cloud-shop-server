var DB = require('./db');
var categorySchema = require('../schema/categorySchema');

class CategoryModel extends DB{

    constructor(){
        super();
        //声明modelName
        this.modelName = 'categories';
        //创建schema
        categorySchema = this.wrapperUserSchema(categorySchema);
        
        //创建相关model
        this.model = CategoryModel.mongoose.model(this.modelName, categorySchema);
    }

    wrapperUserSchema(schema){
        // 在Schema里添加自定义方法
        schema.methods.addAddress = (conditions, fields, callback,errorCb) =>{
          
        };
        return schema;

    }
}

module.exports = new CategoryModel();