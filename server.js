/**
 * Created by harshitbisht96 on 26/7/17.
 */


// const http = require('http');
// setInterval(function(){
//     http.get('https://picbookapp.herokuapp.com');
// },300000);

const express=require('express');
const fs=require('fs');
const path=require('path');
const bp = require('body-parser');
const session = require('express-session')
const cp = require('cookie-parser');
var hbs = require('hbs');
var ejs = require('ejs');
var db=require('./database.js');
var flash = require('connect-flash');
var port = process.env.PORT || 8800;
var mongodb=require('mongodb');
var MongoClient=mongodb.MongoClient;
var url='mongodb://localhost:27017/imageDatabase';

function getDb(){
    // console.log('shimla')
    return MongoClient.connect(url).then(function (db) {
        // console.log(MongoClient.connect(url));
        return db;
    })
}

const app=express();
const multer=require('multer');
const mongo=require('mongodb');
const homeRoute=require('./routes/home');
const loginRoute=require('./routes/login');
const registerRoute=require('./routes/register');
const passport=require('./passport')
const profileRoute=require('./routes/profile');
const aboutRoute=require('./routes/about');
// const editProfileRoute=require('./routes/editProfile');
// const usersRoute=require('./routes/users')
app.use(flash());
app.use(cp('somesecret'));
app.use(session({
    secret: 'somesecret',
    resave: false,
    saveUninitialized: true,

}));
app.use(bp.urlencoded({extended: true}))
app.use(bp.json());
app.use(cp())

app.set('view engine', 'hbs');
// app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
app.use('/posts/',express.static(__dirname + '/userImages'));
app.use('/posts/',express.static(__dirname + '/uploads'));
app.use('/profile/',express.static(__dirname + '/userImages'));
app.use('/about',express.static(__dirname + '/userImages'));
app.use('/profile/',express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/static_images'));
app.use('/posts/',express.static(__dirname + '/static_images'));
app.use(express.static(__dirname + '/js_frontend'));
app.use(express.static(__dirname + '/bootstrap'));




app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



console.log(__dirname + '/uploads/');

// const Grid=require('gridfs-stream');
var file2upload,fileName,filePath;
var userImageFileName;
// const db = new mongo.Db('gridDb', new mongo.Server("127.0.0.1", 27017));
// const gfs = Grid(db, mongo);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var actualFileType=file.mimetype.toString();
        var actualFileName=file.originalname.toString();
        actualFileName.toLowerCase();
        actualFileType.toLowerCase();
        console.log(file)
        console.log(actualFileType);
        console.log(actualFileName);
        if(actualFileType.toLowerCase()=='image/jpeg' || actualFileType.toLowerCase()=='image/png' || actualFileType.toLowerCase()=='image/jpg')
        {
            if(actualFileName.slice(-4).toLowerCase()=='jpeg' || actualFileName.slice(-3).toLowerCase()=='png' || actualFileName.slice(-3).toLowerCase()=='jpg') {
                console.log("Yipee")
                file2upload = file.originalname;
                fileName = file.fieldname + req.user.username + '-' + Date.now() + '.' + file.mimetype.toString().split("/")[1];
                cb(null, fileName);
                filePath = path.join(__dirname, 'uploads/');
                filePath += fileName;
            }
        }


    }
});
var userImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './userImages/');
    },
    filename: function (req, file, cb) {
        var actualFileType=file.mimetype.toString();
        console.log(actualFileType)
        if(actualFileType=='image/jpeg' || actualFileType=='image/png' || actualFileType=='image/jpg') {
            file2upload = file.originalname;
            userImageFileName = file.fieldname + '-' + Date.now() + '.' + file.mimetype.toString().split("/")[1];
            cb(null, userImageFileName);
            filePath = path.join(__dirname, 'userImages/');
            filePath += fileName;
        }
    }
});
filePath=path.join(__dirname,'uploads/');
filePath+=fileName;
var upload = multer({ storage: storage }).single('avatar')
var uploadUserImage = multer({ storage: userImageStorage }).single('avatar');


;

// gfs.files.find({ aliases: 2 }).toArray(function (err, files) {
//     if (err) {
//         console.log(err);
//
//     }
//     console.log(files);
//
// });


function checkLoggedIn(req, res, next) {

    if (req.user) {
        // res.redirect('/posts');
        next();
    } else {

        res.redirect('/')

    }
}
app.get('/', function(req,res,next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(req.user){
        res.redirect('/posts');
    }
    else{
        next();
    }
});
app.use('/about',checkLoggedIn,aboutRoute);
app.use('/',loginRoute);
app.use('/profile/',checkLoggedIn,profileRoute)
// app.use('/users',usersRoute);
app.use('/posts',checkLoggedIn,homeRoute);
app.use('/register',registerRoute);
app.get('/exists',function(req,res){
    res.send("Username not available.Please create an account under different username.");
})
app.post('/upload', function (req, res) {
    console.log(req.body);
    // console.log(req.body.avatar)
    // if(req.body.avatar==undefined)
    // {
    //     console.log(req.body.avatar)
    //    res.redirect('/posts');
    //    return;
    // }

    upload(req, res, function (err) {

        if (err) {

            // An error occurred when uploading
            console.log(err);
            return;
        }

        db.then(function(data){
           var postStory=req.body.story;
            var imageCollection=data.collection('images');
           imageCollection.insert({"image":fileName,"story":postStory,"postedBy":req.user.username,"postedByImage":req.user.image,"likes":[]}).then(function(){
                console.log("Success");
            })
        });
        res.redirect('/posts');

    })


});

app.post('/users', function (req, res) {

    uploadUserImage(req, res, function (err) {

        if (err) {
            // An error occurred when uploading
            console.log(err);
            return;
        }

        db.then(function(data){
            var userCollection=data.collection('users');
            userCollection.findOne({'username': req.body.username}, function(err, user) {
                if(user)
                {
                    res.redirect('/exists');
                }
                else{
                    userCollection.insert({"firstname": req.body.firstname, "lastname": req.body.lastname, "age":req.body.age, "city":req.body.city, "username":req.body.username, "password":req.body.password, "description":req.body.description, "image":userImageFileName,"followers":[],"following":[]}).then(function(){
                        res.redirect('/');
                    })
                }
            })



        });


    })


});

app.post('/updateprofile',function(req,res){

    uploadUserImage(req, res, function (err) {

        if (err) {
            // An error occurred when uploading
            console.log(err);
            return;
        }
        db.then(function(data){
            var userCollection=data.collection('users');
            userCollection.update({"username":req.user.username}, {"$set":{"firstname":req.body.firstname,"lastname":req.body.lastname,"age":req.body.age,"city":req.body.city,"description":req.body.description,"image":userImageFileName}},
                function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                // console.log("User followed");
                // console.log(req.user);
                res.redirect('/profile/'+req.user.username);
            })
        })
    });
});


app.post('/like',function(req,res){
    var postId=req.body.postId;
    console.log(postId)
    var ObjectId=require('mongodb').ObjectId;
    postId=new ObjectId(postId);
    db.then(function(data){
        var imageCollection=data.collection('images');

        imageCollection.update({"_id":postId},{$addToSet:{"likes":req.user.username}},function(err,res){
            if(err){
                console.log(err)
            }
        })
        res.redirect('/posts/'+postId);

    });

});



app.post('/comment',function(req,res){
    // console.log(req.body.postId);
    // console.log(req.body.comment)
    db.then(function(data){
         var commentsCollection=data.collection('comments');
         var newComment=({body:req.body.comment,post:req.body.postId,by:req.user.username});
         commentsCollection.insert(newComment).then(function(){
             // console.log("comment added");
            commentsCollection.find({}).toArray().then(function(data){
                // console.log(data.length)
            })
         })
    });
    res.redirect('/posts/'+req.body.postId);
});


//Problem in this part of the code
app.post('/addFollower',function(req,res){
    db.then(function(data){
           var userCollection=data.collection('users');
           userCollection.update({"username":req.user.username},{$addToSet:{"following":req.body.followWho}},function(err,result){
               if(err){
                   console.log(err);
                   return;
               }
               userCollection.update({"username":req.body.followWho},{$addToSet:{"followers":req.user.username}},function(err,result){
                   if(err){
                       console.log(err);
                       return;
                   }
                   // console.log("User followed");
                   // console.log(req.user);
                   res.redirect('/profile/'+req.body.followWho)
//                    user.save(function(err) {
//                        if (err) return next(err)
// // What's happening in passport's session? Check a specific field...
//                        console.log("Before relogin: "+req.session.passport.user.changedField)
//
//                        req.login(user, function(err) {
//                            if (err) return next(err)
//
//                            console.log("After relogin: "+req.session.passport.user.changedField)
//                            res.send(200)
//                        })
//                    })



               });
           });
           // userCollection.findOne({"username":req.user.username}).then(function(data){
           //     {"$set":{"G":1}},
           //         console.log(req.user),
           //         res.redirect('/')
           //
           // })


        //     var followWho=req.body.followWho;
        //     var username=req.user.username;
        // userCollection.update(
        //     { "username" :username},
        //     {
        //        " $push" :{
        //             { followWho : 1}
        //         }
        //     },
        // );

    });

});



    // res.send("Yo")
app.post('/login', passport.authenticate('local', {

        successRedirect: '/posts',
        failureRedirect: '/',
        badRequestMessage : 'Missing username or password.',
        failureFlash: true

    })

);
app.post('/editProfile',function(req,res){
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var age=req.body.age;
    var city=req.body.city;
    var description=req.body.description;
    console.log(description)
    res.render('editprofile',{firstname:firstname,lastname:lastname,age:age,city:city,description:description});
})

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        console.log("Successfully logged out")
        res.redirect('/');
    })
})


app.use('/',function(req,res){
    res.render("notfound");
});
// passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
// passport.authenticate('local', { successFlash: 'Welcome!' });
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

