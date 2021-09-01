const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
const passport = require("passport");

const flash = require("express-flash");
const session = require("express-session");

dotenv.config({ path: './.env'});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

const publicDirectory = path.join(__dirname, 'public')
app.use(express.static(publicDirectory));


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(session({
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: true,
  }))
  
  app.use(passport.initialize());
  app.use(passport.session());

app.set('view engine', 'hbs');

db.connect((error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log('connected');
    }
});

app.use('/',require('./routes/route'));

app.listen(9000,() => {
    console.log('started server')
});
