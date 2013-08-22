var http   = require('http');
var logger = require('../logger');
var Q      = require('q');

exports.inspect = function(service){
	//try to GET service.path
	//if it returns with a status code in the range [200, 300), then resolve
	//reject otherwise.
	//some possible causes of rejection: bad status code, timeout, host not found, closed connection

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

	req.once('error', function(err){
		deferred.reject(err);
	});

	deferred.promise
		.catch(function(err){
			if(err.timeout){
				req.abort();
			}
		});

	return deferred.promise;
};