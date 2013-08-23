var _                 = require('lodash');
var assert            = require('assert-plus');
var config            = require('../config');
var lessMiddleware    = require('less-middleware');
var restify           = require('restify');
var serviceCollection = require('./serviceCollection');

_.defaults(config, {
	smtp            : {},
	logLevel        : "warn",
	pingInterval    : 5*60*1000,
	port            : 3000,
	services        : []
});

_.defaults(config.smtp, {
	to: [],
	port: 25
});

assert.object(config);
assert.number(config.port);
assert.number(config.pingInterval);
assert.string(config.logLevel);

assert.object(config.smtp);
assert.string(config.smtp.host);
assert.number(config.smtp.port);
assert.string(config.smtp.from);
assert.arrayOfString(config.smtp.to);

assert.arrayOfObject(config.services);
config.services.forEach(function(service){
	
	_.defaults(service, {
		protocol: 'http',
		path: '/',
		port: 80
	});

	assert.object(service);
	assert.string(service.id);
	assert.string(service.host);
	assert.string(service.protocol);
	assert.number(service.port);
});

var logger = require('./logger');
Array.prototype.push.apply(serviceCollection, config.services);

var server = module.exports = restify.createServer({
	name: "Bricked",
	log: logger
});

require('./serviceApi');

server.use(lessMiddleware({
	src: './public',
	debug: false
}));

server.get(/\/.*/, restify.serveStatic({
	directory: './public',
	default: 'index.html',
	maxAge: 0
}));

server.listen(config.port, function(){
	server.log.info("%s listening on %s", server.name, server.url);
});

var inquisitor = require('./inquisitor');
inquisitor.scheduleInquisition();

require('./mailsender');