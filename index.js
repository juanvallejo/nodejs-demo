var fs   = require('fs');
var io 	 = require('socket.io');
var http = require('http');

var mimes = {
	'css' 	: 'text/css' 				,
	'html' 	: 'text/html' 				,
	'ico' 	: 'image/x-icon'			,
	'jpg' 	: 'image/jpeg'				,
	'jpeg' 	: 'image/jpeg' 				,
	'js' 	: 'application/javascript' 	,
	'map' 	: 'application/x-navimap'	,
	'pdf' 	: 'application/pdf' 		,
	'png' 	: 'image/png'				,
	'ttf'	: 'application/octet-stream',
	'txt' 	: 'text/plain'				,
	'woff'	: 'application/x-font-woff'
};

var endpoints = {
	'/': handleIndex,
};

var app = http.createServer(function(req, res) {
	handler = endpoints[req.url];
	if (handler) {
		console.log('found endpoint handler for ' + req.url);
		handler(req, res);
		return;
	}

	// serve static file (if any) by default
	readFile(__dirname + req.url, readFileHandler(res));

}).listen(8080);

io.listen(app).on('connection', function(client) {
	console.log('client with id "' + client.id + '" has connected.');

	client.on('message', function(data) {
		client.emit('message', data);
		client.broadcast.emit('message', data);
	});
});

function readFile(filePath, callback) {
	fs.readFile(filePath, function(err, data) {
		callback(err, data, filePath);
	});
}

function handleIndex(req, res) {
	readFile(__dirname + '/index.html', readFileHandler(res));
};

// handlers
function readFileHandler(res) {
	return function(err, data, filePath) {
		if (err) {
			res.writeHead(404);
			return res.end('404. File "' + filePath + '" not found: ' + err);
		}

		var ext = filePath.split('.');
		var mime = mimes[ext[ext.length - 1]];
		if (!mime) {
			mime = mime['txt'];
		}

		res.writeHead(200, {'Content-Type': mime});
		res.end(data);
	}
}