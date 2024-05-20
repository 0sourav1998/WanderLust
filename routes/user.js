const express = require("express");
const router = express.Router() ;
const User = require('../models/user.js');
const passport = require("passport");

router.get('/signup',(req,res)=>{
    res.render("user/signup.ejs")
});

router.post('/signup',async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    let newUser = new User({username,email});
    let registeredUser =await User.register(newUser , password);
    console.log(registeredUser);
    req.flash('success',"Welcome to WanderLust");
    res.redirect('/listings')
    }catch(e){
        req.flash('error','Username already exists');
        res.redirect('/signup')
    }
}) ;

router.get('/login',(req,res)=>{
    res.render("user/login.ejs")
});

router.post('/login', passport.authenticate('local',{ failureRedirect : '/login' , failureFlash : true
}), async(req,res)=>{
    req.flash('success','Welcome back to WanderLust');
    res.redirect('/listings')
})

module.exports = router ;