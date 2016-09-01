'use strict';
const express = require("express");
const app = express();
const letschat = require('./app'); // importing the app module
const passport = require('passport');

app.set('port', process.env.port || 3000);
app.use(express.static('public')); // rendering css files, make all files in public folder global access
app.set('view engine','ejs');

app.use(letschat.session); // accessing the sesssion module; before the router, otherwise not able to use session functionality
app.use(passport.initialize()); // bringing passport's middleware function for integration with express
app.use(passport.session()); // connecting to session mechanism in express 
app.use(require('morgan')('combined', {
	stream: {
		write: message => {
			// Write to logs
			letschat.logger.log('info', message);
		}
	}
}));// mouting the morgan middleware
app.use('/', letschat.router);


//relacing app with letschat.ioServer and injecting the express app in it
letschat.ioServer(app).listen(app.get('port'),() => {
	console.log("chat running on",app.get('port'));
}); 