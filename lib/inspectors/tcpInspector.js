var logger = require('../logger');
var net    = require('net');
var Q      = require('q');

exports.inspect = function(service){
	var deferred = Q.defer();

	logger.debug(service, "Pinging %s...", service.id);

	var socket = net.connect({
		host: service.host,
		port: service.port
	}, function(){
		socket.end();
		deferred.resolve();
	});

	socket.once('error', deferred.reject);

	deferred.promise
		.fail(function(err){
			if(err.timeout){
				socket.destroy();
			}
		});

	return deferred.promise;
};