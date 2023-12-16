import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Author } from "../models/authors.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3030/api/authors/google-callback",
  },
  async function (_, __, profile, cb) {
    console.log(profile);

    let author = await Author.findOne({ googleId: profile.id });

    if (!author) {
      author = await Author.create({
        googleId: profile.id,
        name: profile.name.givenName + " " + profile.name.familyName,
        email: profile.emails[0].value,
      });
    }

    cb(null, author);

    // cb(new Error("User not allowed"))
  }
);

export default googleStrategy;
