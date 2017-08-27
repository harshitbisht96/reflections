/**
 * Created by harshitbisht96 on 30/7/17.
 */
var mongodb=require('mongodb');
var MongoClient=mongodb.MongoClient;
<<<<<<< HEAD
var url=process.env.MONGOLAB_URI||'mongodb://localhost:27017/imageDatabase';
=======
var url='mongodb://localhost:27017/imageDatabase';
>>>>>>> 5434919c53998583315743a14392babaf008b54a

function getDb(){
     return MongoClient.connect(url).then(function (db) {
        // console.log(MongoClient.connect(url));
        return db;
    })
}




module.exports=getDb();

