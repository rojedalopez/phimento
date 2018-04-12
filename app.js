// server.js
var express = require('express');  
var bodyParser = require('body-parser');  
var mongoose = require('./config/connections');  
var cors = require('cors');  
require('./models/user');
require('./models/productos');
require('./models/clientes');
require('./models/ventas');
require('./models/compras');
var router = require('./config/routers');  

// Configuramos Express
var app = express();  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended: true}));  
app.use(cors());  
app.set('port', 3000);
app.use(express.static(__dirname + '/config/client'));

app.use(router);

// Iniciamos el servidor y la base de datos
app.listen(app.get('port'), function(){
    console.log('Express corriendo en http://localhost');
});
