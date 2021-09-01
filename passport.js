let LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const passport = require('passport');
const initializePassport = require('./passport');

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {


    const db_user = db.query('SELECT * FROM users u WHERE u.email = ?', (email), async (error, results) => {
      const user = results[0];
      
      if (user == null) {
        return done(null, false, { message: 'No user with that email' })
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
         
          return done(null, user)
        } else {
         
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
    });
  
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users u WHERE u.id = ?', (id), async (error, results) => {
          const user = results[0];
           if(user){
            done(error,user)
           }
        })
    
  })
}



module.exports = initialize