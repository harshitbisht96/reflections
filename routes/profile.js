/**
 * Created by harshitbisht96 on 2/8/17.
 */

var db=require('../database.js');
const express=require('express');
const route=require('express').Router();
    route.get('/:id', function (req, res) {
        db.then(function (data) {
            var username=req.params.id;
            var usersDb = data.collection('users');
            usersDb.findOne({username:username}).then(function (data) {
                var image=data.image;
                res.render('userprofile', {data: data,image:image});
            })
        });
    });
module.exports=route