require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./src/models/userModel");
const { encryptText } = require("./src/utils/encryption");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const encryptedEmail = await encryptText(profile.emails[0].value);
        const encryptedGoogleId = await encryptText(profile.id);

        let existingUser = await User.findOne({ googleId: encryptedGoogleId });

        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = new User({
          googleId: encryptedGoogleId,
          email: encryptedEmail,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
