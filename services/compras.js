
var mongoose = require('mongoose');  
var Compras = mongoose.model('Compras');  
var Cliente = mongoose.model('Clientes');
var Products = mongoose.model('Products');

exports.RegistrarCompra = function(req, res) {  
    
    var compras = new Compras({
        detalles: req.body.detalles,
        total: req.body.total,
        at : new Date(req.body.fecha),
        nota : req.body.nota
    });

    compras.save(function(err){
        if(err){        
            return res
                .status(500)
                .jsonp(err);
        }else{
            req.body.detalles.forEach(element => {
                Products.findById(element.producto, function(err, product) {
                    var stock = 0;
                    var enstock = false;
                    var valorcom = 0;
                    
                    stock = parseInt(product.cantstock) + parseInt(element.cantidad);
                    valorcom = parseInt(element.subtotal) / parseInt(element.cantidad);
            
                    if(stock > 0){
                        enstock = true;
                    }
            
                    product.cantstock = stock;
                    product.stock = enstock;
                    product.valorcom = valorcom;
                    product.ultstock = new Date(req.body.fecha);
            
                    product.save(function(err) {
                        if(err)res.status(500).send({mensaje: err});
                    });
                });
            });
            res
            .status(200)
            .send({mensaje: "OK"});   
        }
    });
};

exports.BuscarCompras = function(req, res) {  
    Compras.find().sort( { at: -1 } )
    .populate('detalles.producto')
    .exec(function(err, compras) {
        res.json(compras);
    });
};

exports.BorrarCompra = function(req, res){
    Compras.remove({_id: req.body._id}, function(err){
        if(err)res.status(500).send({mensaje: err});
        
        res
        .status(200)
        .send({mensaje: "OK"});   
    });
};