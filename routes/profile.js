/**
 * Created by harshitbisht96 on 2/8/17.
 */
const express=require('express');
var db=require('../database.js');
const route=require('express').Router();
function retreive() {
    route.get('/:username', function (req, res) {
        console.log("profile")
        db.then(function (data) {
            var username=req.params.username;
            console.log(username)
            var userCollection = data.collection('users');
            userCollection.find({username:username}).toArray().then(function (data) {
                console.log(data)
                res.render('profile', {data: data});
            })
        });
    });

    return route
}
module.exports=retreive()