var config = require('../config');
var bunyan            = require('bunyan');

module.exports = new bunyan({
	name: 'Bricked',
	level: config.logLevel
});