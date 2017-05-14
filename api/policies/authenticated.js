/**
 * Allow any authenticated user.
 */
 module.exports = function(req, res, ok){
    //  User is allowed, preceed to controller
    if (req.session.authenticated) {
        return ok();
    }

    // User is not allowed
    else {
        var requireLoginError = {name: 'requireLogin', message: '必须先登录'};
        req.session.flash = {
            err: requireLoginError
        }
        res.redirect('/session/new');
        return;
    }
  };
