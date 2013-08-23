var Q                 = require('q');
var _                 = require('lodash');
var assert            = require('assert-plus');
var config            = require('../config');
var inspectors        = require('./inspectors');
var logger            = require('./logger');
var mediator          = require('./mediator');
var serviceCollection = require('./serviceCollection');

var scheduleInterval = null;

exports.inquireAll = function(){
	serviceCollection.forEach(exports.inquireOne);
};

exports.inquireOne = function(service){
	var inquiryPromise;
	var wasWorking = service.isWorking;

	var inspector = inspectors[service.protocol];
	if(inspector){
		inquiryPromise = inspector.inspect(service);
	} else {
		inquiryPromise = Q.reject("unknown service protocol "+service.protocol+', try ' + _.keys(inspectors).join(' or '));
	}

	var timeout = setTimeout(function(){
		var err = new Error("timed out");
		err.timeout = true;
		logger.warn(service, "service timed out");
		inquiryPromise.reject(err);
	}, 0.9 * config.pingInterval);

	inquiryPromise
		.then(function(){
			service.isWorking = true;
		})
		.catch(function(){
			service.isWorking = false;
		})
		.finally(function(){
			clearTimeout(timeout);
			if((service.isWorking !== wasWorking)){
				logger.info(service, "%s.isWorking changed to %s", service.id, service.isWorking);
				
				var isStartup = (wasWorking === undefined && service.isWorking);
				mediator.publish("service:isWorking:change", service, service.isWorking, { isStartup: isStartup });
			}
		})
		.done();

	return inquiryPromise;
};

exports.scheduleInquisition = function(){
	exports.unscheduleInquisition();

	scheduleInterval = setInterval(exports.inquireAll, config.pingInterval);
	logger.info("Scheduled period check of all services every %d ms.", config.pingInterval);
	_.defer(exports.inquireAll);
};

exports.unscheduleInquisition = function(){
	if(scheduleInterval){
		clearInterval(scheduleInterval);
		scheduleInterval = null;
		logger.info("Disabled scheduled checks of all services.");
	}
}