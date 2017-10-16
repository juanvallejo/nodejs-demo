var fs   = require('fs');
var io 	 = require('socket.io');
var http = require('http');

var app = http.createServer(function(req, res) {
	fs.readFile(__dirname + '/index.html', function(err, data) {
		if (err) {
			res.writeHead(404);
			return res.end('404. ./index.html not found.');
		}

		res.end(data);
	});


}).listen(8080);

io.listen(app).on('connection', function(client) {
	console.log('client has connected.');
});