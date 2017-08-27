/**
 * Created by harshitbisht96 on 25/7/17.
 */

var db=require('../database.js');
const express=require('express');
const route=require('express').Router();


    route.get('/', function (req, res) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        // console.log(req.user)
        db.then(function (data) {
            var imagesDb = data.collection('images');
            imagesDb.find({}).toArray().then(function (data) {
                var havingFriends;

                var following=req.user.following;
                // console.log(following.length+" following")
                var userFollowing=data.filter(function(singlepost){
                    var postby=singlepost.postedBy;

                    if (following.indexOf(postby)>-1)
                    {

                        return true;
                    }
                    if(postby==req.user.username)
                    {
                        return true;
                    }
                    // if (following.postby==1){
                    //     return true;
                    // }
                    return false;
                })

                if(userFollowing.length==0)
                {
                    havingFriends=false;
                }
                else{
                    havingFriends=true;
                }
                userFollowing.reverse();

                res.render('homepage',{data:userFollowing,currentUser:req.user.username,havingFriends:havingFriends,userImage:req.user.image});
            })
        });
    });
route.get('/:id', function (req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    db.then(function (data) {
        var postId= req.params.id;
        var imagesDb = data.collection('images');
        var commentsDb=data.collection('comments');
        var ObjectID=require('mongodb').ObjectID;
        imagesDb.findOne({ _id : new ObjectID(postId)}).then(function (data) {
            var numberOfLikes=data.likes.length;
            var isLiked;
            if (data.likes.indexOf(req.user.username)>-1)
            {

                isLiked=true;
            }
            else{
                isLiked=false;
            }
            commentsDb.find({post:postId}).toArray().then(function(commentsData){
                res.render('postpage',{data:data,commentsData:commentsData,currentUser:req.user.username,isLiked:isLiked,numberOfLikes:numberOfLikes});
            })

        })
    });
});
route.use('/',function(req,res){
    res.render("notfound");
})

module.exports=route