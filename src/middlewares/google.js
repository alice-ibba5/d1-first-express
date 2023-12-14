import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Author } from "../models/authors.js";

// 2 - Creiamo una nuova strategia di autenticazione con Google
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3030/api/authors/google-callback",
  },
  async function (_, __, profile, cb) {
    console.log(profile);

    // qui dentro abbiamo i dati dell'utenza di Google,
    // ma noi vogliamo creare un utente nel nostro database.

    let author = await Author.findOne({ googleId: profile.id });

    if (!author) {
      //2B - se non esiste, lo creiamo
      // Ci assicuriamo che lo schema consenta un campo dove salviamo l'id di Google
      // e che la password non sia richiesta se questo è il metodo di autenticazione
      author = await Author.create({
        googleId: profile.id,
        name: profile.name.givenName + " " + profile.name.familyName,
        email: profile.emails[0].value,
      });
    }

    // dopo aver creato l'utente, lo passiamo a passport che lo inserisce
    // in req.user

    cb(null, author);

    // se volessimo per qualsiasi motivo bloccare l'accesso a questo utente,
    // o sollevare un errore, possiamo farlo passando un errore come primo
    // parametro di cb

    // cb(new Error("User not allowed"))
  }
);

export default googleStrategy;
