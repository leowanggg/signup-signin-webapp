/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');

module.exports = {
	'new': function(req, res){
		res.view('session/new');
	},

	// create a new session
	create: function(req, res, next){
		// check if both email and password are entered
		if(!req.param('email') || !req.param('password')) {
			var usernamePasswordRequiredError = {name: 'usernamePasswordRequiredError', message: '必须输入用户名和密码。'};

			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/session/new');
			return;
		}

		// try to find the user by his email address
		User.findOneByEmail(req.param('email'), function foundUser(err, user) {
			if (err) return next(err);

			if(!user){
				var noAccountError = {name: 'noAccount', message: '邮箱地址 ' + req.param('email') + ' 不存在。'};
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/session/new');
				return;
			}

			// compare password
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid){
				if (err) return next(err);

				if (!valid){
					var usernamePasswordMismatchError = {name: 'usernamePasswordMismatchError', message: '用户名或密码不正确。'};
					req.session.flash = {
						err: usernamePasswordMismatchError
					}
					res.redirect('/session/new');
					return;
				}

				// log user in
				req.session.authenticated = true;
				req.session.User = user;

				// set online status
				user.online = true;
				user.save(function(err){
					if (err) return next(err);

					// admin user
					if(req.session.User.admin){
						res.redirect('/user');
						return;
					}
					res.redirect('/user/show/' + user.id);
				});
			});
		});
	},

	// destroy the session
	destroy: function(req, res, next){
		User.findOne(req.session.User.id, function foundUser(err, user){
			var userId = req.session.User.id;

			User.update(userId, {
				online: false
			}, function(err){
				if (err) return next(err);
				req.session.destroy();
				res.redirect('/session/new');
			});
		});
	}
};
