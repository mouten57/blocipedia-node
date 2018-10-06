const userQueries = require("../db/queries.users.js");
const wikiQueries = require('../db/queries.wikis.js');
const passport = require("passport");
const testKey = process.env.STRIPE_TEST_KEY;
//const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
const stripe = require('stripe')(testKey);


module.exports = {
  signUpForm(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    let newUser = {
      name: req.body.name,
      username: (req.body.username).toLowerCase(),
      email: (req.body.email).toLowerCase(),
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash('notice', `${Object.values(err.fields)} has already been used.`);
        res.redirect("/users/sign_up");

      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
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

  show(req, res, next) {
    res.render("users/show");
  },

  upgradeForm(req, res, next){
    res.render('users/upgrade');
  },

  upgrade(req, res, next){
      stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
        .then((customer) => {
          stripe.charges.create({
            amount: 1500,
            currency: "usd",
            customer: customer.id,
            description: "Premium membership"
          })
        })
        .then((charge) => {
          userQueries.upgradeUser(req.user.dataValues.id);
          res.render("users/upgrade_success");
        })
  },

  seeUpgradeSuccess(req, res, next){
    res.render('users/upgrade_success');
  },

  downgrade(req, res, next) {
    userQueries.downgradeUser(req.user.dataValues.id);
    wikiQueries.makePrivate(req.user.dataValues.id);
    req.flash("notice", "You've successfully downgraded your account!");
    res.redirect("/");
  },

  showCollaborations(req, res, next) {
    userQueries.getUser(req.user.id, (err, result) => {
      user = result["user"];
      collaborations = result["collaborations"];
      if (err || user == null) {
        res.redirect(404, "/");
      } else {
        res.render("users/collaborations", { user, collaborations });
      }
    });
  }

}