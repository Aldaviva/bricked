var http   = require('http');
var https  = require('https');
var logger = require('../logger');
var Q      = require('q');

exports.inspect = function(service){
	var deferred = Q.defer();

	logger.debug(service, "Pinging %s...", service.id);

	var isHttpsService = (service.port === 443) || (service.protocol === 'https');
	if(service.protocol === 'https' && service.port === 80){
		service.port = 443;
	}

	var client = (isHttpsService) ? https : http;

	var req = client.get({
		host: service.host,
		port: service.port,
		path: service.path,
		headers: {
			connection: 'close'
		}
	}, function(res){
		if(res.statusCode >= 200 && res.statusCode < 300){
			deferred.resolve();
		} else {
			deferred.reject({ statusCode: res.statusCode });
		}
		logger.debug({ service: service, statusCode: res.statusCode }, "ping returned status code");
	});

	req.once('error', deferred.reject);

	deferred.promise
		.catch(function(err){
			if(err.timeout){
				req.abort();
			}
		});

	return deferred;
};
