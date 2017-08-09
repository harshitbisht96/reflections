/**
 * Created by harshitbisht96 on 30/7/17.
 */
var mongodb=require('mongodb');
var MongoClient=mongodb.MongoClient;
var url='mongodb://localhost:27017/imageDatabase';

function getDb(){
     return MongoClient.connect(url).then(function (db) {
        // console.log(MongoClient.connect(url));
        return db;
    })
}




module.exports=getDb();

