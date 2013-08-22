var logger            = require('./logger');
var server            = require('./server');
var serviceCollection = require('./serviceCollection');

server.get('/services', function(req, res){
	res.send(serviceCollection);
});