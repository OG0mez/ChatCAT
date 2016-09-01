'use strict';
const h = require('../helpers'); // bringing in the helpers module
const passport = require ('passport');
const config = require('../config');

module.exports = () => {
	let routes = { // key is route, value is route handler function
		'get': {
			'/': (req, res, next) => {
				res.render('login');
			},
			'/rooms': [h.isAuthenticated,(req, res, next) => { // express allows us to define multiple route handling functions for a given route
				res.render('rooms',{
					user: req.user, // injecting the user's profile into the page
					host: config.host //// injecting the host from the config onto the page
				});
			}],
			'/chat/:id':[h.isAuthenticated,(req, res, next) => {
			    // Find a chatroom with the given id
				// Render it if the id is found
				let getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id); // extracting the id in /chat/:id
				if(getRoom === undefined) {
					return next(); // going to 'N/A'
				}else{
				    res.render('chatroom',{
					user: req.user,
					host: config.host,
					room: getRoom.room,
					roomID: getRoom.roomID
				    });
                 }
			}],
			'/auth/facebook': passport.authenticate('facebook'),
			'/auth/facebook/callback': passport.authenticate('facebook', {
				successRedirect: '/rooms',
				failureRedirect: '/'
			}),
			'/auth/twitter': passport.authenticate('twitter'),
			'/auth/twitter/callback': passport.authenticate('twitter', {
				successRedirect: '/rooms',
				failureRedirect: '/'
			}),
			'/logout': (req, res, next) => {
				req.logout(); // given by passport, clearing the session so that no further user data is available and req.user variable is removed
				res.redirect('/'); // redirecting user to login screen
			}
		},
		'post': {

		},
		'NA': (req, res, next) => {
			res.status(404).sendFile(process.cwd() + '/views/404.htm');
		}
   }

    return h.route(routes); // we get router(return statement) from helper.js, // also passing routes object to rout function of helper.js
}