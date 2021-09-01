const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const initializePassport = require('../passport')(passport);
const jwt = require("jsonwebtoken");
 
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

exports.register = (req,res) =>{
    const { name, email, password, mobile, confirmpassword } = req.body;
    db.query('SELECT email FROM users WHERE email = ?',[email],async (error,results) => {
        if(results.length > 0){
            return res.render('register',{
                message:'email exists'
            })
        }
        else if(password !== confirmpassword){
            return res.render('register',{
                message:'Password do not match'
            })
        } 

        let hashpassword  = await bcrypt.hash(password,8); 

        db.query('INSERT INTO  users SET ?',{ 
            name:name,
            email:email,
            mobile:mobile,
            password:hashpassword },(error,results) => {
            if(error){
                console.log(error);
            }  
            else{
                return res.render('dashboard',{
                    message:'Registered successfully'
                }) 
            } 
        });
    });

}

exports.login = (req,res,next) => {
    
    passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
  
}

exports.checklogin = (req,res,next) => {
    if(!req.isAuthenticated()){
        return res.render('login') 
    }
    next();
}

exports.dashboard = (req,res) => {
    return res.render("dashboard");
}

exports.members = (req,res) => {
    return res.render("members");
}