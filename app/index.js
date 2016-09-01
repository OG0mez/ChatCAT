'use strict';

const config = require('./config');
const redis = require('redis').createClient; // cresting an instance of client interface, which can be used with redis
const adapter = require('socket.io-redis');

// Social Authentication logic -- auto invoking
require('./auth')();

// Create an IO Server instance
let ioServer = app => { // bind the express app instance here
	app.locals.chatrooms = [];
	const server = require('http').Server(app); // bind the express app to newly created server instance
	const io = require('socket.io')(server);
	io.set('transports', ['websocket']); // session affinity
	//  we want socket.io to send and recieve its buffer from redis
	
	let pubClient = redis(config.redis.port, config.redis.host, {
		auth_pass: config.redis.password
	}); // interface for sending or publishing data buffers
	
	let subClient = redis(config.redis.port, config.redis.host, {
		return_buffers: true, // returning data in its original buffer state, not a string
		auth_pass: config.redis.password
	}); // subscribe or get data back from redis

	io.adapter(adapter({ // io.adapter = interfacing socket.io with redis
		pubClient,
		subClient
	}));

	io.use((socket, next) => {
		require('./session')(socket.request, {}, next); //  accessing socket.request
	});
	
	require('./socket')(io, app); // event handling
	return server; // io is already locked on to server
}


module.exports = { // exporting the router instance, turning router into module
	router: require('./routes')(), // router, auto invoking 
	session: require('./session'),
	ioServer,
	logger: require('./logger')
}