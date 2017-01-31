var http = require("http");
var fs = require("fs");


var server = http.createServer((req, res)=>{
	// console.log("Someone connected via HTTP");
	// fs.readFile('index.html', 'utf-8', (error, fileData)=>{
	// 	if(error){
	// 		// respond with 500
	// 		res.writeHead(500,{'content-type':'text/html'});
	// 		res.end(error);
	// 	}else{
	// 		res.writeHead(200,{'content-type':'text/html'});
	// 		res.end(fileData);
	// 	}
	// })
})
var socketIo = require('socket.io');
var io = socketIo.listen(server);

var socketUsers = [];

io.sockets.on('connect',(socket)=>{
	console.log('Someone connected via socket.');
	socketUsers.push({
		socketID: socket.id,
		name: 'Anonymous'
	});
	io.sockets.emit('users',socketUsers);

	socket.on('messageToServer', (messageObject)=>{
		console.log('Someone sent a message. It is',messageObject.message);
		io.sockets.emit("messageToClient",{
			message: messageObject.message,
			date: new Date()
		});
	});
	socket.on('drawingToServer',(drawingData)=>{
		if(drawingData.lastMousePosition !== null){
			io.sockets.emit('drawingToClients', drawingData);
		}
	})
});


server.listen(8080);
console.log("Listening on port 8080...");