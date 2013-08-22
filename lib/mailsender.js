var _            = require('lodash');
var config       = require('../config');
var logger       = require('./logger');
var MailComposer = require("mailcomposer").MailComposer;
var mediator     = require('./mediator');
var Q            = require('q');
var smtpc        = require('smtpc');
var util = require('util');

require('d8');
require('d8/locale/en-US');

var EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+(?:[A-Za-z]{2}|aero|asia|biz|com|coop|edu|gov|info|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)$/;

mediator.subscribe('service:isWorking:change', function(service, isWorking, opts){
	if(!opts.isStartup){
		exports.sendMail(service);
	}
});

exports.sendMail = function(service){
	if(config.smtp.to.length && config.smtp.host && config.smtp.from){
		return Q
			.try(function(){
				return buildMessageSource(service);
			})
			.then(function(messageSource){
				return sendMessageToServer(messageSource);
			})
			.fail(function(err){
				logger.error(err, "Could not send mail");
			});
	}
};

function buildMessageSource(service){
	var mailComposer = new MailComposer();
	var now = new Date();

	var isWorking = service.isWorking;
	var subject = util.format("%s, %s is %s", (isWorking ? "Yay" : "Aww"), service.id, (isWorking ? "up!" : "down."));

	var textBody = util.format("At %s, %s (%s://%s:%d) %s working.", now.toLocaleString(), service.protocol, service.id, service.host, service.port, (isWorking ? "started" : "stopped"));

	mailComposer.setMessageOption({
		from    : config.smtp.from,
		to      : config.smtp.to,
		subject : subject,
		body    : textBody
	});

	mailComposer.addHeader('date', now.format(Date.formats.RFC_2822));

	return Q.ninvoke(mailComposer, "buildMessage");
};

function sendMessageToServer(messageSource){
	var deferred = Q.defer();

	var payload = {
		host    : config.smtp.host,
		port    : config.smtp.port,
		from    : config.smtp.from,
		to      : config.smtp.to,
		content : messageSource,
		success : deferred.resolve,
		failure : deferred.reject
	};

	smtpc.sendmail(payload);
	logger.debug(payload, "Sent mail.");

	return deferred.promise;
}