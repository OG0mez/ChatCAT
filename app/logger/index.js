'use strict';

const winston = require('winston');
const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			level: 'debug',
			json: true,
			handleExceptions: true // catching uncaught exceptions
		})
	],
	exitOnError: false// if an uncught exception or error is recieved, winston will not stop reporting and will not exist
});// new (winston.Logger)(..) => invoking and configuring

module.exports = logger;