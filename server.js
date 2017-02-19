var express = require('express');
var app = new express();
var fs = require("fs");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var booksRouter = express.Router();
var socket = require("socket.io");

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + "/tpl");
app.set('view engine', 'jade');
app.engine("jade", require("jade").__express);


app.get("/", function(req, res){
	res.sendFile("index.html");
});

var io = socket.listen(app.listen(7000, function(){
	console.log("Server listen...");
}));
//выдача книг
booksRouter.route("/it.pdf").get(function(req, res){
 	res.sendFile(__dirname + "/public/data-books/It.pdf");
 });
 booksRouter.route("/desyat_negrityat.pdf").get(function(req, res){
 	res.sendFile(__dirname + "/public/data-books/desyat_negrityat.pdf");
 });
 booksRouter.route("/master_i_margarita.pdf").get(function(req, res){
 	res.sendFile(__dirname + "/public/data-books/master_i_margarita.pdf");
 });
 app.use("/books", booksRouter);
 app.get('/books', function(req, res){
 	res.render('books');
 });

var dataUSER = [{
	login:"admin",
	password: 12345
 },
 {
    login: "dima",
    password: "komi"
 },
 {
 	login: "4morila",
 	password: "maxxxx"
 }];

app.post("/sign/user", jsonParser, function(req,res){
	if (!req.body)
		return res.sendStatus(400);
	var userLogin = req.body.login;
	var userPassword = req.body.password;
	var user = {login: userLogin, password: userPassword};
	//var data = fs.readFileSync("data.json", "utf-8");
	//var users = JSON.parse(data);
	var result;
	for(var i=0; i < dataUSER.length; i++){
		if(dataUSER[i].login == userLogin){
			res.send("Пользователь найден");
		}
		
	}
	console.log(user);
});


app.get("/chat", function(req, res){
	res.render("page");
});

var users = {};


function getUsers(obj){
	var tmp = [];
	for(var i in obj)
		tmp.push(obj[i]);
	return tmp.join(', ');
}

io.sockets.on('connection', function(client){
	//var id = client.id;
	//console.log(id);

	client.on('send', function(data){
		io.sockets.emit('message', {message: data.message, name: data.name});
	});

	client.on('hello', function(data){
		client.emit('hello_msg', {name: data.name});
		client.broadcast.emit('message', {message:data.name + ' ,присоединился к чату!'});
		if (Object.keys(users).length > 0) {
			var userList = getUsers(users);
			client.emit('message', {message:'Уже в чате ' + userList});
		}
		else{
			client.emit('message', {message: 'Кроме вас в чате никого нет'});
		}
		users[client.id] = data.name;
	});

	client.on('setDateOnServer', function(arr){
		for(var i = 0; i < arr.length; i++){
			var eachObject = JSON.stringify(arr[i]);
			fs.appendFile('messages.txt', eachObject);
		}
		//fs.appendFile('messages.txt', arr);
		//console.log(arr);
	});
});