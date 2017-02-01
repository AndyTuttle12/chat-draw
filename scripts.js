var socketio = io.connect('http://35.165.246.93:8080');
// 10.150.51.32
socketio.on('users',(socketUsers)=>{
	var newHTML = "";
	socketUsers.map((currSocket, index) =>{
		newHTML += '<li class="user" id="' + currSocket.name + '">' + currSocket.name + '</li>';
		if(currSocket.name == userName){
			console.log(document.getElementById(userName))
			// document.getElementById(userName).addClass('currName');
		}
	});
	document.getElementById('userNames').innerHTML = newHTML;
})

socketio.on('messageToClient',(messageObject)=>{
	// console.log(messageObject);
	document.getElementById('userChats').innerHTML += '<div class="message"><strong>' + messageObject.name + '</strong>: ' + messageObject.message + ' -- ' + messageObject.date + '</div>';
	updateScroll();
});

var userName;
function getNames(){
	while(!userName){
		userName = prompt("Your Name Here");
	}
	socketio.emit('userNameToServer',{
		name: userName
	})
}

function updateScroll(){
	var chatScroll = document.getElementById('userChats');
	chatScroll.scrollTop = chatScroll.scrollHeight;
}

function sendChatMessage(){
	event.preventDefault();
	var messageToSend = document.getElementById('chat-message').value;
	socketio.emit('messageToServer',{
		message: messageToSend,
		name: userName
	});
	document.getElementById("chatForm").reset();
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var color = '#000';
var thickness = 10;
var mouseDown = false;
var mousePosition = {};
var lastMousePosition = null;
var colorPick = document.getElementById('color-picker');
var thicknessPicker = document.getElementById('thickness');

colorPick.addEventListener('change', (event)=>{
	color = colorPick.value;
});

thicknessPicker.addEventListener('change', (event)=>{
	thickness = thicknessPicker.value;
});

canvas.addEventListener('mousedown', (event)=>{
	// console.log(event);
	mouseDown = true;
});

canvas.addEventListener('mouseup', (event)=>{
	// console.log(event);
	mouseDown = false;
	lastMousePosition = null;
});

canvas.addEventListener('mousemove', (event)=>{
	// console.log(event);
	if(mouseDown){
		var magicBrushX = event.pageX - canvas.offsetLeft;
		var magicBrushY = event.pageY - canvas.offsetTop;
		mousePosition = {
			x: magicBrushX,
			y: magicBrushY
		}
		// console.log(mousePosition);
		if(lastMousePosition !== null){
			context.strokeStyle = color;
			context.lineJoin = 'round';
			context.lineCap = 'round';
			context.lineWidth = thickness;
			context.beginPath();
			context.moveTo(lastMousePosition.x, lastMousePosition.y);
			context.lineTo(mousePosition.x, mousePosition.y);
			context.stroke();
			context.closePath();
		}
		lastMousePosition = {
				x: mousePosition.x,
				y: mousePosition.y
			}

		var drawingDataForServer = {
			mousePosition: mousePosition,
			lastMousePosition: lastMousePosition,
			color: color,
			thickness: thickness
		}

		// updateLastMousePosition
		

		socketio.emit('drawingToServer', drawingDataForServer);

		socketio.on('drawingToClients',(drawingData)=>{
			context.strokeStyle = drawingData.color;
			context.lineJoin = 'round';
			context.lineCap = 'round';
			context.lineWidth = drawingData.thickness;
			context.beginPath();
			context.moveTo(drawingData.lastMousePosition.x, drawingData.lastMousePosition.y);
			context.lineTo(drawingData.mousePosition.x, drawingData.mousePosition.y);
			context.stroke();
			context.closePath();
		});
	}
});

