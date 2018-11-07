module.exports = {
  validateUsers(req, res, next) {
    // console.log('in validate users');
    if (req.method === 'POST') {
      // console.log('in validate POST');
      req.checkBody('email', 'email must be valid').isEmail();
      req
        .checkBody('password', 'must be at least 6 characters in length')
        .isLength({ min: 6 });
      req
        .checkBody('passwordConfirmation', 'must match password provided')
        .optional()
        .matches(req.body.password);
    }
    const errors = req.validationErrors();
    if (errors) {
      req.flash('error', errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  },

  validateWikis(req, res, next) {
    if (req.method === 'POST') {
      req
        .checkBody('title', 'must be at least 3 characters in length')
        .isLength({ min: 3 });
      req
        .checkBody('body', 'must be at least 5 characters in length')
        .isLength({ min: 5 });
    }

    const errors = req.validationErrors();
    if (errors) {
      req.flash('error', errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  }
};
