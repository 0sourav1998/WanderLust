const User = require('../models/user')

module.exports.renderSignUpFrom = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.createUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    // req.login -> when user signup he automatically logged-in
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    console.error(e); 
    req.flash("error", "Username already exists");
    res.redirect("/signup");
  }
};

module.exports.renderLoginFrom = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  const url = res.locals.originalUrl || "/listings";
  req.flash("success", "Welcome back to WanderLust");
  res.redirect(url);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out");
    res.redirect("/login");
  });
};
