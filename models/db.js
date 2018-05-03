/**
 * mongoose操作类(封装mongodb)
 */

var path = require('path');
var mongoose = require('mongoose');
var logger = require('pomelo-logger').getLogger('mongodb-log');

var databaseCof= require('../configs/database');

var options = databaseCof[databaseCof.type];


var dbURL = "mongodb://" + options.host + ":" + options.port + "/" + options.database;
mongoose.connect(dbURL);

mongoose.connection.on('connected', (err) => {
    if (err) 
        logger.error('Database connection failure');
    else
        logger.info('Database connection success');
});

mongoose.connection.on('error', (err) => {
    logger.error('Mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', () => {
    logger.error('Mongoose disconnected');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

 class DB {

    /**
     * 保存数据
     * @param fields 表数据
     * @param callback 回调方法
     */
    save(fields, callback,errorCb){
        if (!fields) {
            if (errorCb) errorCb(500,-1,'Field is not allowed for null');
            return false;
        }

        // var err_num = 0;
        // for (var i in fields) {
        //     if (!DB.schemaConf[this.modelName][i]) err_num ++;
        // }
        // if (err_num > 0) {
        //     if (errorCb) errorCb(500,-2,'Wrong field name');
        //     return false;
        // }

        var mongooseEntity = new this.model(fields);
        mongooseEntity.save((err, docs) => {
            if (err) {
                console.log(err)
                errorCb && errorCb(500,-3,err.message);
            } else {
                callback && callback(docs);
            }
        });
    };

    /**
     * 保存数据
     * @param fields 表数据
     * @param callback 回调方法
     */
    saveMany(array, callback,errorCb){
        if (!array || !array.length) {
            if (errorCb) errorCb(500,-1,'array to insert is null or empty');
            return false;
        }

        this.model.create(array,(err, docs) => {
            if (err) {
                console.log(err)
                errorCb && errorCb(500,-3,err.message);
            } else {
                callback && callback(docs);
            }
        });
    };


    /**
     * 更新数据
     * @param conditions 更新需要的条件 {_id: id, user_name: name}
     * @param update_fields 要更新的字段 {age: 21, sex: 1}
     * @param callback 回调方法
     */
    update(conditions, update_fields, callback,errorCb){
        if (!update_fields || !conditions) {
            errorCb && errorCb(500,-4 ,'Parameter error');
            return;
        }
        this.model.update(conditions, {$set: update_fields}, {multi: true, upsert: true}, (err, docs) => {
            if (err){
                console.log(err)
                errorCb &&  errorCb(500, -5, err.message);
            } else {
                callback && callback(docs);
            }
        });
    };

    /**
     * 更新数据方法(带操作符的)
     * @param conditions 更新条件 {_id: id, user_name: name}
     * @param update_fields 更新的操作符 {$set: {id: 123}}
     * @param callback 回调方法
     */
    updateData(conditions, update_fields, callback,errorCb){
        if (!update_fields || !conditions) {
            errorCb && errorCb(500,-4, 'Parameter error');
            return;
        }
        this.model.findOneAndUpdate(conditions, update_fields, {multi: true, upsert: true}, (err, docs) => {
            if (err){
                console.log(err)
                errorCb(500, -5, err.message);
            }else{
                callback(docs);
            }
        });
    };

    /**
     * 删除数据
     * @param conditions 删除需要的条件 {_id: id}
     * @param callback 回调方法
     */
    remove (conditions, callback,errorCb) {
        this.model.remove(conditions, (err, docs) => {
            if (err) {
                errorCb &&  errorCb(500, -5, err.message);
            } else {
                callback && callback(docs);
            }
        });
    };

    /**
     * 查询数据
     * @param conditions 查询条件
     * @param fields 待返回字段
     * @param callback 回调方法
     */
    find(conditions, fields, callback,errorCb){
        this.model.find(conditions, fields || null, {}, (err, docs) => {
            if (err || !docs) {
                console.log(err)
                errorCb(500, -5, err?err.message:'');
            } else {
                callback(docs);
            }
        });
    };

    /**
     * 查询单条数据
     * @param conditions 查询条件
     * @param callback 回调方法
     */
    findOne(conditions,fields, callback,errorCb){
        this.model.findOne(conditions,fields || null, (err, docs) => {
            if (err || !docs) {
                 errorCb(500, -5, err?err.message:'');
            } else {
                callback(docs);
            }
        });
    };

    /**
     * 根据_id查询指定的数据
     * @param _id 可以是字符串或 ObjectId 对象。
     * @param callback 回调方法
     */
    findById(_id, callback,errorCb){
        this.model.findById(_id, (err, docs) => {
            if (err || !docs) {
                console.log(err)
                errorCb(500, -5, err?err.message:'');
            } else {
                callback(docs);
            }
        });
    };

    /**
     * 查询数据
     * @param conditions 查询条件
     * @param fields 待返回字段
     * @param callback 回调方法
     */
    findOneAndPopulate(conditions, fields, populate, populateField, callback,errorCb){
        this.model.findOne(conditions, fields || null)
            .populate({path: populate, select:populateField || null})
            .exec((err, docs) => {
            if (err || !docs) {
                console.log(err)
                errorCb(500, -5, err?err.message:'');
            } else {
                callback(docs);
            }
        })
    };

    /**
     * 查询数据
     * @param conditions 查询条件
     * @param fields 待返回字段
     * @param callback 回调方法
     */
    findAndPopulate(conditions, fields, populate, populateField, callback,errorCb){
        this.model.find(conditions, fields || null)
            .populate({path: populate, select:populateField || null})
            .exec((err, docs) => {
            if (err || !docs) {
                console.log(err)
                errorCb(500, -5, err?err.message:'');
            } else {
                callback(docs);
            }
        })
    };

    /**
     * 返回符合条件的文档数
     * @param conditions 查询条件
     * @param callback 回调方法
     */
    count(conditions, callback,errorCb){
        this.model.count(conditions, (err, docs) => {
            if (err) {
                 errorCb(500, -5, err.message);
            } else {
                callback(docs);
            }
        });
    };

    /**
     * 查询符合条件的文档并返回根据键分组的结果
     * @param field 待返回的键值
     * @param conditions 查询条件
     * @param callback 回调方法
     */
    distinct(field, conditions, callback,errorCb){
        this.model.distinct(field, conditions, (err, docs) => {
            if (err) {
                 errorCb(500, -5, err.message);
            } else {
                callback(docs);
            }
        });
    };

    /**
     * 连写查询
     * @param conditions 查询条件 {a:1, b:2}
     * @param options 选项：{fields: "a b c", sort: {time: -1}, limit: 10}
     * @param callback 回调方法
     */
    where(conditions, options, callback,errorCb){
        this.model.find(conditions)
            .populate({path: options.populate, select:options.opulateField || null})
            .select(options.fields || '')
            .sort(options.sort || {})
            .limit(options.limit || {})
            .skip(options.skip || {})
            .exec((err, docs) => {
                if (err) {
                    errorCb(500, -5, err.message);
                } else {
                    callback(docs);
                }
            });
    };


};

 // 静态属性
DB.mongoose = mongoose;


module.exports = DB;