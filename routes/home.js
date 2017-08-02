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
    return route
}
module.exports=retreive()