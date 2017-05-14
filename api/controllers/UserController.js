/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// loading the sign-up page(new.ejs)
	'new': function(req, res){
		res.view();
	},

	// Create a User account
	create: function (req, res, next) {
		User.create(req.params.all(), function userCreated(err, user){
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				};

				// redirect back to sign-up page
				return res.redirect('/user/new');
			}
			// log user in
			req.session.authenticated = true;
			req.session.User = user;

			// set online status
			user.online = true;
			user.save(function(err){
				if (err) return next(err);
				res.redirect('/user/show/' + user.id);
			});
		});
	},

	// render the profile view (show.ejs)
	show: function(req, res){
		User.findOne(req.param('id'), function foundUser(err, user){
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	// render all users profiles
	index: function(req, res, next){

		User.find(function foundUser(err, users){
			if (err) return next(err);
			res.view({
				users: users
			});
		});
	},

	// render the edit view(edit.ejs)
	edit: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if (err) return next(err);
			if (!user) return next('用户不存在');

			res.view({
				user: user
			});
		});
	},

	// process the info from edit view
	update: function(req, res, next){
		User.update(req.param('id'), req.params.all(), function userUpdated (err){
			if (err) {
				return res.redirect('/user/edit' + req.param('id'));
			}

			res.redirect('/user/show/' + req.param('id'));
		});
	},

	// delete a user accounts
	destroy: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if (err) return next(err);

			if(!user) return next('用户不存在');

			User.destroy(req.param('id'), function userDestroyed(err) {
				if (err) return next(err);
			});

			res.redirect('/user');
		});
	},
}
