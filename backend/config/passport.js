const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await User.findOne({ email });

          if (user) {
            if (user.provider !== 'google') {
              return done(null, false, { message: 'Account exists with different method' });
            }
            return done(null, user);
          } else {
            const newUser = new User({
              name: profile.displayName,
              email,
              provider: 'google',
              image: profile.photos?.[0]?.value,
            });

            await newUser.save();
            return done(null, newUser);
          }
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Serialize and deserialize user (required for session management)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};