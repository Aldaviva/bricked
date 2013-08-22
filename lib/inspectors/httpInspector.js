var http   = require('http');
var logger = require('../logger');
var Q      = require('q');

exports.inspect = function(service){
	var deferred = Q.defer();

	logger.debug(service, "Pinging %s...", service.id);

	var req = http.get({
		host: service.host,
		port: service.port,
		path: service.path,
	}, function(res){
		if(res.statusCode >= 200 && res.statusCode < 300){
			deferred.resolve();
		}
	});

	req.once('error', deferred.reject);

	deferred.promise
		.catch(function(err){
			if(err.timeout){
				req.abort();
			}
		});

	return deferred.promise;
};