const isLoggedIn = (req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        console.log(req.session.redirectUrl)
        req.flash('error','Please login to continue')
       return res.redirect('/login')
    }
    next();
}

const sameUrlRedirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.originalUrl = req.session.redirectUrl;
    }
    next();
}

module.exports = {isLoggedIn , sameUrlRedirect}
