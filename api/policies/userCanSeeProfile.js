/**
 * Allow ordinary user to only see his own profile
 * Allow admins to see everyone
 */

module.exports = function(req, res, ok){
    var sessionUserMatchesId = req.session.User.id === req.param('id');
    var isAdmin = req.session.User.admin;

    if(!(sessionUserMatchesId || isAdmin)){
        var noRightsError = {name: 'noRights', message: '需要管理员身份。'};
        req.session.flash = {
            err:noRightsError
        };
        res.redirect('/session/new');
        return;
    }

    ok();
}
