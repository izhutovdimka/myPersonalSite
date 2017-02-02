//_index.js
var express = require('express');
var app = express();
var port = 8080;
var socket = require('socket.io');
//
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine("jade", require("jade").__express);
app.use(express.static(__dirname + '/public'));
//
app.get('/', function(req, res){
	res.render('page');
});
//var io = require('socket.io').listen(app.listen(port));
var io = socket.listen(app.listen(port));

var users = {};
function getUsers(obj){
	var tmp = [];
	for(var i in obj)
		tmp.push(obj[i]);
	return tmp.join(', ');
}
io.sockets.on('connection', function(client){
	//client.emit('message', {message: 'Добро пожаловать в чат!'});
	client.on('send', function(data){
		io.sockets.emit('message', {message:data.message});
	});


	client.on('hello', function(data){
		//у версии старше 0.9 отсутствует метод set, мы в дерьме!!!
		//client.set('nickname', data.name); //МЫ В ДЕРЬМЕ КАРЛ!!!!
		client.emit('message', {message: '---Добро пожаловать в чат, ' + data.name + '!---'});
		client.broadcast.emit('message', {message:'---' + data.name + ' ,присоединился к чату!'});
		//
		if(Object.keys(users).length > 0){
			var userList = getUsers(users);
			client.emit('message', {message: '---Уже в чате: ' + userList + '---'});
		}
		else{
			client.emit('message', {message: '---Кроме вас в чате никого нет :( ---'});
		}

		users[client.id] = data.name;
	});

	/*client.on('disconnect', function(data){
		if(Object.keys(users).length > 1){
			client.get('nickname', function(err, name){
				client.broadcast.emit('message', {message:'---' + name + ' ,покинул чат'});
			});
		}
		delete users[client.id];
	});*/
});