module.exports = {
	http: require('./httpInspector'),
	https: require('./httpInspector'),
	tcp: require('./tcpInspector'),
	ping: require('./pingInspector')
};
