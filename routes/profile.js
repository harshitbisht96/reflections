/**
 * Created by harshitbisht96 on 2/8/17.
 */

var db=require('../database.js');
const express=require('express');
const route=require('express').Router();

<<<<<<< HEAD


=======
>>>>>>> 5434919c53998583315743a14392babaf008b54a
route.get('/all', function (req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    db.then(function (data) {
        var usersDb=data.collection("users")
        // console.log(usersDb)
        usersDb.find({}).toArray().then(function (data) {
            data.sort(function (a, b) {
                return parseFloat(b.followers.length) - parseFloat(a.followers.length);
            });
            // console.log(data[0].followers.length);
            res.render('users', {data:data,currentUser:req.user.username,userImage:req.user.image});
        });
    });
});

route.get('/:id', function (req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    db.then(function (udata) {
        var username = req.params.id;
        var usersDb = udata.collection('users');
        var imagesDb= udata.collection('images');
        var image,userdata;
        var data;
        var isUser,isFollowing,userPosts;
        usersDb.findOne({username: username}).then(function (data) {
            userdata=data;
            image = data.image;

            if(req.user.username==data.username)
            {
                isUser=true;
            }
            else{
                isUser=false;
            }
            if (data.followers.indexOf(req.user.username) > -1) {
                isFollowing = true;
            }
            else {
                isFollowing = false;
            }
        }).then(function(){
            imagesDb.find({}).toArray().then(function (imageData) {
                userPosts=imageData.filter(function(singlePost){
                    if(singlePost.postedBy==username){
                        return true;
                    }
                    return false;
                })
        }).then(function(){
            // console.log(userPosts.length)
<<<<<<< HEAD
                res.render('userprofile', {data: userdata,profileof:username, image: image, isFollowing: isFollowing,isUser:isUser,userPosts:userPosts,currentUser:req.user.username,userImage:req.user.image});
=======
                res.render('userprofile', {data: userdata, image: image, isFollowing: isFollowing,isUser:isUser,userPosts:userPosts,currentUser:req.user.username,userImage:req.user.image});
>>>>>>> 5434919c53998583315743a14392babaf008b54a
            })



            });



    });
});

route.get('/:id/followers', function (req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    db.then(function (udata) {
        var username = req.params.id;
        var usersDb = udata.collection('users');
        usersDb.findOne({username: username}).then(function (data) {
            res.render('followers',{followersArray:data.followers,userImage:data.image,userName:data.username})
        })



    });
});

route.get('/:id/following', function (req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    db.then(function (udata) {
        var username = req.params.id;
        var usersDb = udata.collection('users');
        usersDb.findOne({username: username}).then(function (data) {
            res.render('following',{followingArray:data.following,userImage:data.image,userName:username})
        })



    });
});
<<<<<<< HEAD

=======
>>>>>>> 5434919c53998583315743a14392babaf008b54a
route.use('/',function(req,res){
    res.render("notfound");
})




module.exports=route