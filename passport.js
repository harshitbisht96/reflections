/**
 * Created by harshitbisht96 on 1/8/17.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db=require('./database.js');
var users;

passport.serializeUser(function (user, done) {

    done(null, user.username)

});
passport.deserializeUser(function (username, done) {
db.then(function(data){
    var Users=data.collection('users');

        Users.findOne({"username": username}, function(err, user) {
            done(err, user);
        });
    });
})


// const localStrategy = new LocalStrategy({
//         passReqToCallback : true
//     },
//     function (req,username, password, done) {
//         db.then(function(data){
//             var Users=data.collection('users');
//             Users.find({}).toArray().then(function(data){
//                 users=data;
//                 console.log(users.length)
//                 for (var i=0;i<users.length;i++) {
//                     if (users[i].username == username) {
//                         console.log('One of users')
//                         if (users[i].password == password) {
//                             console.log(i)
//                             console.log("Authentic User")
//                             users[i].pos= i;
//                             done(null, users[i])
//                         } else {
//                             console.log("wrong password")
//                             done(null, false, req.flash('loginMessage','Invalid username or password'))
//                         }
//                     }
//                 }
//                 done(null, false, req.flash('loginMessage','Invalid username or password'))
//             });
//         })
//     });
// console.log("Yo");



passport.use('local', new LocalStrategy({
        passReqToCallback : true
    },
    function(req,username, password,done) {
    process.nextTick(function() {
        db.then(function(data){
            var Users=data.collection('users');
            Users.findOne({'username': username}, function(err, user) {

                if (err) {
                    throw err;
                     done(null,false,req.flash('message','Invalid username or password'));
                }
                if (!user) {
                     done(null, false,req.flash('message','Invalid username or password'));
                }
                if(user!=null) {
                    if (user.password != password) {
                        done(null, false, req.flash('message', 'Wrong Password'));
                    }
                    done(null, user);
                }
                else{
                   return;
                }
            });

        })

    });
}));

// passport.use(localStrategy);
module.exports=passport;
