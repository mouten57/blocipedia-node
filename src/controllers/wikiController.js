const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        console.log(err);
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },

  private(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if(err){
        res.redirect(500, 'static/index');
      } else {
        res.render('wikis/private', {wikis});
      }
    })
  },

  new(req, res, next) {
    res.render("wikis/new");
  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
        let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
        };
        wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
            res.redirect(500, "/wikis/new");
        } else {
            res.redirect(303, `/wikis/${wiki.id}`);
        }
        });
    } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis"); 
    }
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", { wiki });
      }
    });
  },

  destroy(req, res, next) {
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if (err) {
              res.redirect(500, `/wikis/${req.params.id}`);
            } else {
                req.flash("notice", "Wiki deleted.");
                res.redirect(303, '/wikis')
              }
        });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user).edit();
        if(authorized){
            res.render("wikis/edit", { wiki });
        } else {
        req.flash("notice","You are not authorized to do that.")
        res.redirect(`/wikis/${req.params.id}`)
      }
    }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
        if (err || wiki == null) {
            res.redirect(404, `/wikis/${req.params.id}`);
        } else {
            req.flash('notice', 'Wiki updated!')
            res.redirect(`/wikis/${req.params.id}`);
        } 
    });
  }
};
