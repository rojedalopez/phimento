
var mongoose = require('mongoose');  
var Products = mongoose.model('Products');  
var Printer = require('../escribir');

exports.CreateProduct = function(req, res) { 
    if(req.body.productos!==undefined){
        req.body.productos.forEach(element => {
            var minstock = 0;
            var minstand = 0;
            if(element.minstock!==undefined){
                minstock = element.minstock;
            }
            if(element.minstand!==undefined){
                minstand = element.minstand;
            }
            var product = new Products({
                _id: element._id,
                nombre: element.nombre,
                descripcion: element.descripcion,
                valorcom: element.valorcom,
                valorvnt: element.valorvnt,
                valorpromo: element.valorpromo,
                minstock: minstock,
                minstand: minstand
            });
        
            product.save(function(err){
                if(err)res.status(500).send({mensaje: err});
            });
        });
        res
        .status(200)
        .send({mensaje: "OK"});
    }else{
        var element = req.body;
        var product = new Products({
            _id: element._id,
            nombre: element.nombre,
            descripcion: element.descripcion,
            valorcom: element.valorcom,
            valorvnt: element.valorvnt,
            valorpromo: element.valorpromo,
            minstock: element.minstock,
            minstand: element.minstand
        });
    
        product.save(function(err){
            if(err)res.status(500).send({mensaje: err});

            res
            .status(200)
            .send({mensaje: "OK"});
        });
    }
    
};

exports.InfoProduct = function(req, res) {
    Products.findOne({_id: req.body._id}, function(err, product) {
        if(err)res.status(500).send({mensaje: err});

        res.status(200).jsonp(product);
    });
};

exports.ModifyProduct = function(req, res) {
    Products.findById(req.body._id, function(err, product) {
        product.nombre = req.body.nombre;
        product.descripcion = req.body.descripcion;
        product.valorcom = req.body.valorcom;
        product.valorvnt = req.body.valorvnt;
        product.valorpromo = req.body.valorpromo;
        product.minstand = req.body.minstand;
        product.minstock = req.body.minstock;

        product.save(function(err) {
            if(err)res.status(500).send({mensaje: err});
            
            res
            .status(200)
            .send({mensaje: "OK"});
        });
    });
};

exports.ModifyStock = function(req, res) {
    var producto = req.body.producto;
    var cantidad = req.body.cantidad;
    Products.findById(producto, function(err, product) {
        var stock = 0;
        var stand = 0;
        var enstand = false;
        var enstock = false;
        if(product.cantstock >= cantidad){
            stock = parseInt(product.cantstock) - parseInt(cantidad);
            stand = parseInt(product.cantstand) + parseInt(cantidad);
            
            if(stock > 0){
                enstock = true;
            }
            if(stand > 0){
                enstand = true;
            }

            product.cantstock = stock;
            product.stock = enstock;
            product.cantstand = stand;
            product.stand = enstand;

            product.save(function(err) {
                if(err)res.status(500).send({mensaje: err});
                
                res.status(200).jsonp({mensaje: "OK"});
            });
        }else{
            res.status(200).jsonp({mensaje: "No hay demasiado stock"});
        }        
    }); 
};

exports.BuscarProducts = function(req, res) {
    var ident = "";
    var busqueda = {};
    if(req.params.id!==null){
        ident = req.params.id;
    }
    if(req.params.type!==null){
        var type = req.params.type;
        if(type === '1'){
            busqueda = {_id: ident};
        }else if(type === '2'){
            busqueda = {stand: true};            
        }else if(type === '3'){
            busqueda = {stand: false};            
        }
    }
    
    Products.find(busqueda, function(err, products) {
        if(err)res.status(500).send({mensaje: err});
        //Printer.pintar_productos(products);
        res.status(200).jsonp(products);
     }).sort({_id:1});
};

exports.DeleteProducts = function(req, res) {
    Products.remove({ _id: req.params.id }, function(err) {
        if(err)res.status(500).send({mensaje: err});
        
        res
        .status(200)
        .send({mensaje: "OK"});            
    });
};

exports.ModifyProductXX = function(req, res) {
    var id = req.params.id;
    var stand = req.params.stand;
    var stock = req.params.stock;
    Products.findById(id, function(err, product) {
        product.cantstand = stand;
        product.cantstock = stock;

        product.save(function(err) {
            if(err)res.status(500).send({mensaje: err});
            
            res
            .status(200)
            .send({mensaje: "OK"});
        });
    });
};