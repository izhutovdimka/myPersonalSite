//chat.js
//сокетное соединие
var socket;

window.onunload = function(){
	socket.disconnect();
}

window.onload = function(){
	socket = io.connect('http://localhost:7000');
	var field = document.getElementById('field');
	var form = document.getElementById('form');
	var content =  document.getElementById('content');//это div OR label элеметнт
	//

	var name = prompt('Как вас зовут?', 'Гость');
	if(name)
		socket.emit('hello', {name:name});
	var html = '<br>';

	form.onsubmit = function(){
		var text = field.value;
		socket.emit('send', {message : text, name : name});
		field.value = '';
		return false;
	}
	//массив сообщений
	var messages = [];
	socket.on('hello_msg', function(dataHello){
		
		if(dataHello){
			//content.append('<p>Welcome  </p>' + dataHello.name + '<p> ! </p>');
			var div = document.createElement('div');
			var txtNode = document.createTextNode('Добро пожаловать в чат, ' + dataHello.name + ' : !');
			div.appendChild(txtNode);
			content.appendChild(div);
		}
		else
			console.log('Что-то пошло не так (1)');
	});
	socket.on('message', function(data){
		console.log('message пришло');
		if (data.message && data.name) {
			messages.push(data);
			socket.emit('setDateOnServer', messages);
			$('#content').append(data.name + ' : ' + data.message + html);
			/*for(var i=0; i < messages.length; i++){
				//content.append('<div>' + '<strong>' + data.name + '</strong>' + ' : ' + data.message + '</div>');
				html += messages[i] + '<br>';
				$('#content').append(html);
			}
			console.log('tuc-tuc');*/
		}
		else if(data.message){
			$('#content').append(data.message + html);
		}
		else
			console.log('Что-то пошло не так (2)');
	});	


}
