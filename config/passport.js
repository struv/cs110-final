const mongoose = require('mongoose');
const User = require("../models/User");
const Chatroom = require("../models/chatroom");
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
      clientID:     process.env.GOOGLE_CLIENT_ID_ENV,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_ENV,
      callbackURL: "http://localhost:8080/auth/google/callback",
      passReqToCallback   : true
    },
    async function(request, accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });      
      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value
      }

      try {

        let user = await User.findOne({ googleID: profile.id });
        if(user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user.id); //user.id is the id from Mongo
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
}