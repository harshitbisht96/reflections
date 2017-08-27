/**
 * Created by harshitbisht96 on 1/8/17.
 */

const express=require('express');
const route=require('express').Router();
route.get('/',function(req,res){
    res.render('login',{ message: req.flash('message')}) ;
})
module.exports=route