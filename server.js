/**
 * Created by harshitbisht96 on 26/7/17.
 */
const express=require('express');
const fs=require('fs');
const path=require('path');
const bp = require('body-parser');
const session = require('express-session')
const cp = require('cookie-parser');
var hbs = require('hbs');
var ejs = require('ejs');
const app=express();
const multer=require('multer');
const mongo=require('mongodb');
const homeRoute=require('./routes/home');
const loginRoute=require('./routes/login');
const registerRoute=require('./routes/register');
const passport=require('./passport')
const profileRoute=require('./routes/profile')
var db=require('./database.js');

app.use(cp('somesecret'));
app.use(session({
    secret: 'somesecret',
    resave: false,
    saveUninitialized: true
}));
app.use(bp.urlencoded({extended: true}))
app.use(bp.json())

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'hbs');
// app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
app.use('/posts/',express.static(__dirname + '/userImages'));
app.use('/posts/',express.static(__dirname + '/uploads'));
app.use('/profile/',express.static(__dirname + '/userImages'));
app.use(express.static(__dirname + '/uploads'));

app.use(express.static(__dirname + '/bootstrap'));



console.log(__dirname + '/uploads/');

// const Grid=require('gridfs-stream');
var file2upload,fileName,filePath;
var userImageFileName
// const db = new mongo.Db('gridDb', new mongo.Server("127.0.0.1", 27017));
// const gfs = Grid(db, mongo);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Working")
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        file2upload=file.originalname;
        fileName=file.fieldname + '-' + Date.now()+'.'+file.mimetype.toString().split("/")[1];
        cb(null, fileName);
        filePath=path.join(__dirname,'uploads/');
        filePath+=fileName;
    }
});
var userImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("ha");
        cb(null, './userImages/');
    },
    filename: function (req, file, cb) {
        console.log("he")
        file2upload=file.originalname;
        userImageFileName=file.fieldname + '-' + Date.now()+'.'+file.mimetype.toString().split("/")[1];
        cb(null, userImageFileName);
        filePath=path.join(__dirname,'userImages/');
        filePath+=fileName;
    }
});
filePath=path.join(__dirname,'uploads/');
filePath+=fileName;
var upload = multer({ storage: storage }).single('avatar')
var uploadUserImage = multer({ storage: userImageStorage }).single('avatar');


app.use(bp.json());
app.use(bp.urlencoded());
app.use(cp());

// gfs.files.find({ aliases: 2 }).toArray(function (err, files) {
//     if (err) {
//         console.log(err);
//
//     }
//     console.log(files);
//
// });


function checkLoggedIn(req, res, next) {
    console.log('check logged in 2');
    console.log(req.user)
    if (req.user) {
        console.log(req.user)
        console.log("User now logged in")
        // res.redirect('/posts');
        next();
    } else {

        res.status(404).send('Unauthorised')

    }
}
app.get('/', function(req,res,next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    console.log('check logged in 1');
    console.log(req.user)
    if(req.user){
        res.redirect('/posts');
    }
    else{
        next();
    }
});
app.use('/profile',profileRoute)
app.use('/posts',checkLoggedIn,homeRoute);
app.use('/register',registerRoute);
app.use('/',loginRoute);


app.post('/upload', function (req, res) {

    upload(req, res, function (err) {

        if (err) {
            // An error occurred when uploading
            console.log(err);
            return;
        }

        db.then(function(data){
           var postStory=req.body.story;
            var imageCollection=data.collection('images');
           imageCollection.insert({"image":fileName,"story":postStory,"postedBy":req.user.username,"postedByImage":req.user.image}).then(function(){
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
            userCollection.insert({"firstname": req.body.firstname, "lastname": req.body.lastname, "age":req.body.age, "city":req.body.city, "username":req.body.username, "password":req.body.password, "description":req.body.description, "image":userImageFileName}).then(function(){
                console.log("fucked");
            })
        });
        res.redirect('/');

    })


});

app.post('/comment',function(req,res){
    // console.log(req.body.postId);
    // console.log(req.body.comment)
    db.then(function(data){
         var commentsCollection=data.collection('comments');
         var newComment=({body:req.body.comment,post:req.body.postId,by:req.user.username})  ;
         commentsCollection.insert(newComment).then(function(){
             console.log("comment added");
         })
    });
    res.redirect('/posts/'+req.body.postId);
})

    // res.send("Yo")
app.post('/login', passport.authenticate('local', {
        failureRedirect: '/',
        successRedirect: '/posts',

    }),
);
// passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
// passport.authenticate('local', { successFlash: 'Welcome!' });
app.listen(1111,function(){
    console.log("app running at http://localhost:1111");
});

