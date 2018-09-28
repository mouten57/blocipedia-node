const userQueries = require("../db/queries.users.js");
const passport = require("passport");


module.exports = {
  signUpForm(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    let newUser = {
      name: req.body.name,
      email: (req.body.email).toLowerCase(),
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    
    userQueries.createUser(newUser, (err, user) => {
      if(err) {
          req.flash("notice", "Email already registered!");
          res.redirect("/users/sign_up");
        } else {
          passport.authenticate("local")(req, res, () => {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          })
        }
    });
  },

  signInForm(req, res, next) {
    res.render('users/sign_in');
  },
  
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        console.log('userController line 37')
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash('notice', "You've successfully signed out!");
    res.redirect('/');
  },

}