/**
 * Created by harshitbisht96 on 1/8/17.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db=require('./database.js');
var users;

passport.serializeUser(function (user, done) {
    console.log('serialization started...');
    console.log(user.pos)
    done(null, user.pos)

});

passport.deserializeUser(function (userId, done) {
    console.log('deserialization started');
    done(null, users[userId]);
});

const localStrategy = new LocalStrategy(
    function (username, password, done) {
        db.then(function(data){
            var Users=data.collection('users');
            Users.find({}).toArray().then(function(data){
                users=data;
                console.log(users.length)
                for (var i=0;i<users.length;i++) {
                    if (users[i].username == username) {
                        console.log('One of users')
                        if (users[i].password == password) {
                            console.log(i)
                            console.log("Authentic User")
                            users[i].pos= i;
                            done(null, users[i])
                        } else {
                            console.log("wrong password")
                            done(null, false, {message: 'Wrong password'})
                        }
                    }
                }
                done(null, false, {message: 'User not found'})
            });
        })
    });
console.log("Yo");

passport.use(localStrategy);
module.exports=passport;
