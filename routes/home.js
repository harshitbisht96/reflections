/**
 * Created by harshitbisht96 on 25/7/17.
 */

var db=require('../database.js');
const express=require('express');
const route=require('express').Router();
function retreive() {
    route.get('/', function (req, res) {
        db.then(function (data) {

            var imagesDb = data.collection('images');
            imagesDb.find({}).toArray().then(function (data) {

                console.log(data)
                res.render('homepage', {data: data});
            })
        });
    });
    route.get('/:id', function (req, res) {
        db.then(function (data) {
            var postId= req.params.id;
            var imagesDb = data.collection('images');
            var ObjectID=require('mongodb').ObjectID;
            console.log(postId)
            imagesDb.findOne({ _id : new ObjectID(postId)}).then(function (data) {
                console.log(data)
                res.render('postpage',{data:data});
            })
        });
    });
    return route
}
module.exports=retreive()