var config = require('../../config');
var http   = require('http');
var logger = require('../logger');
var ping   = require('ping');
var Q      = require('q');

exports.inspect = function(service){
	var deferred = Q.defer();

	logger.debug(service, "Pinging %s...", service.id);

	ping.sys.probe(service.host, function(isWorking){
		if(isWorking){
			deferred.resolve();
		} else {
			deferred.reject();
		}
	});

	return deferred.promise;
};