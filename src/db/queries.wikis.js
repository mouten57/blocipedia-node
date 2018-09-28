const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {
  getAllWikis(callback) {
    return Wiki.all()

      .then((wikis) => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },

  addWiki(newWiki, callback) {
    return Wiki.create({
        title: newWiki.title,
        body: newWiki.body,
        // private: newWiki.private,
        userId: newWiki.userId
    })
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  getWiki(id, callback) {
    return Wiki.findById(id)
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
      .then((wiki) => {
        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
          wiki.destroy()
          .then((deletedRecordsCount) => {
            callback(null, deletedRecordsCount);
          });
        } else {
            //error hits here
          req.flash("notice", "You are not authorized to do that....");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if (!wiki) {
        return callback(404);
      } else {
        wiki.update(updatedWiki, {
            fields: Object.keys(updatedWiki)
            })
            .then(() => {
            callback(null, wiki);
            })
        }
    })
    .catch(err => {
        callback(err);
    });
  }
};
