/**
 * Created by harshitbisht96 on 1/8/17.
 */

const express=require('express');
console.log("Login route")
const route=require('express').Router();
route.get('/',function(req,res){
    res.render('login');
})
module.exports=route