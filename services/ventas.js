
var mongoose = require('mongoose');  
mongoose.Promise = require('bluebird');
var Ventas = mongoose.model('Ventas');  
var Compras = mongoose.model('Compras');  
var Cliente = mongoose.model('Clientes');
var Products = mongoose.model('Products');
var Printer = require('../escribir');

exports.RegistrarVenta = function(req, res) {  
    var saldo = 0;
    var pago = false;
    var valor_pagado = 0;
    if(req.body.vlrpagado!=null){
        saldo = parseInt(req.body.total) - parseInt(req.body.vlrpagado);
        if(saldo<=0){
            pago = true;
        }
        valor_pagado = req.body.vlrpagado;
    }
    
    var ventas = new Ventas({
        comprador: req.body.comprador,
        detalles: req.body.detalles,
        total: req.body.total,
        vlrpagado: valor_pagado,
        saldo: saldo,
        pagado: pago,
        at : new Date(req.body.fecha),
        nota : req.body.nota
    });

    ventas.save(function(err){
        if(err){        
            res.status(500).send({mensaje: err});
        }else{
            req.body.detalles.forEach(element => {
                Products.findById(element.producto, function(err, product) {
                    var stand = 0;
                    var enstand = false;
                    
                    stand = parseInt(product.cantstand) - parseInt(element.cantidad);
            
                    if(stand > 0){
                        enstand = true;
                    }
            
                    product.cantstand = stand;
                    product.stand = enstand;
            
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

exports.DevolverVenta = function(req, res) {  
    Ventas.findById(req.body._id , function(err, ventas) {
        
        ventas.activa = false;
        ventas.nota = req.body.nota;
        ventas.inactived_at = new Date();

        ventas.save(function(err){
            if(err){        
                res.status(500).send({mensaje: err});
            }else{
                ventas.detalles.forEach(element => {
                    Products.findById(element.producto, function(err, product) {
                        var stand = 0;
                        var enstand = false;
                        
                        stand = parseInt(product.cantstand) + parseInt(element.cantidad);
                
                        if(stand > 0){
                            enstand = true;
                        }
                        
                        product.cantstand = stand;
                        product.stand = enstand;
                        
                        product.save(function(err) {
                            if(err)res.status(500).send({mensaje: err});
                        });
                    });
                });
                return res
                    .status(200)
                    .send({mensaje: "OK"});   
            }
        });
    });
    /*Ventas.remove({_id: req.body._id}, function(err){
        if(err) return false;
        return res
                .status(200)
                .send({mensaje: "OK"});   
    });*/
};

exports.SaldarVenta = function(req, res) {  
    var paga = req.body.paga;
    Ventas.find({comprador: req.body.cliente, pagado: false, activa: true}, function(err, lst_ventas) {
        
        for(var i = 0; i < lst_ventas.length; i++ ){
            var element = lst_ventas[i];
            if(paga > element.saldo){
                paga -= element.saldo;
                element.vlrpagado = parseInt(element.vlrpagado===undefined||element.vlrpagado===null?0:element.vlrpagado) + parseInt(element.saldo);
                element.saldo = 0;
                element.pagado = true;
            }else{
                element.vlrpagado = parseInt(element.vlrpagado===undefined||element.vlrpagado===null?0:element.vlrpagado) + parseInt(paga);
                element.saldo = element.saldo - paga;
                if(element.saldo<=0){
                    element.pagado = true;
                }
                paga = 0;
            }

            element.save(function(err) {
                if(err)res.status(500).send({mensaje: err});
            });

            if(paga<=0){
                break;
            }
        }

        res.status(200)
            .send({mensaje: "OK"}); 
    });
        
};

exports.BuscarVentas = function(req, res) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = year + "-" + month + "-" + day + "T00:00:00.000Z";
    console.log(date);
    Ventas.find({ activa: true/*, at: date */}).sort( { created_at: -1 } )
    .populate({path :'comprador  detalles.producto'})
    .exec(function(err, ventas) {
        console.log(ventas[0]);
        res.json(ventas);
    });
};

exports.BuscarVentasXCliente = function(req, res) {
    var ident = req.params.ident;
    if(ident !== ''){
        var retorno = {ventas: [],resumen:{}};
        Ventas.find({comprador: ident, pagado: false, activa: true}).sort( { at: -1 } )
                .populate('comprador detalles.producto')
                .exec(function(err, lst_venta) {
                    retorno.ventas = lst_venta;
                    Ventas
                    .aggregate([{ $match: {comprador: ident, activa: true, pagado: false}}, {$group:{ _id:'resumen', total: {$sum:'$total'}, pagado: {$sum:'$vlrpagado'}, saldos: {$sum:'$saldo'}}}])
                    .exec(function(err, resumen) {
                        retorno.resumen = resumen[0];
                        Printer.pintar_venta(ident, retorno);
                        res.json(retorno);
                    });
        });

    }
};


exports.ResumenVentas = function(req, res) {
    //resumen de la venta, consulta mongo
    //db.ventas.aggregate([{$group:{ _id:'resumen', total: {$sum:'$total'}, pagado: {$sum:'$vlrpagado'}, saldos: {$sum:'$saldo'}}}])

    //db.ventas.aggregate([{ $match: {comprador: 'evizcaino'        }}, {$group:{ _id:'resumen', total: {$sum:'$total'}, pagado: {$sum:'$vlrpagado'}, saldos: {$sum:'$saldo'}}}])
    Ventas
    .aggregate([{$group:{ _id:'resumen', total: {$sum:'$total'}, pagado: {$sum:'$vlrpagado'}, saldos: {$sum:'$saldo'}}}])
    .exec(function(err, posts) {
        res.json(posts);
    });
};

exports.ResumenVentas = function(req, res) {
    //resumen de la venta, consulta mongo
    //db.ventas.aggregate([{$group:{ _id:'resumen', total: {$sum:'$total'}, pagado: {$sum:'$vlrpagado'}, saldos: {$sum:'$saldo'}}}])

    //db.ventas.aggregate([{ $match: {comprador: 'evizcaino'        }}, {$group:{ _id:'resumen', total: {$sum:'$total'}, pagado: {$sum:'$vlrpagado'}, saldos: {$sum:'$saldo'}}}])
    Ventas
    .aggregate([{$group:{ _id:'resumen', total: {$sum:'$total'}, pagado: {$sum:'$vlrpagado'}, saldos: {$sum:'$saldo'}}}])
    .exec(function(err, ventas) {
        Compras
        .aggregate([{ $match: {activa: true }}, {$group:{ _id:'resumen', comprado: {$sum:'$total'}}}])
        .exec(function(err, compras) {
            Products
            .aggregate([{$group:{ _id:'resumen', proyectado: {$sum: { $sum: [ {$multiply: ["$cantstock", "$valorvnt" ]}, {$multiply: [ "$cantstand", "$valorvnt" ]}]}},inversion: {$sum: { $sum: [ {$multiply: [ "$cantstock", "$valorcom" ]}, {$multiply: [ "$cantstand", "$valorcom" ]} ] } }, ganancia: {$sum: {$subtract:[ {$sum: [ {$multiply: ["$cantstock", "$valorvnt" ]}, {$multiply: [ "$cantstand", "$valorvnt" ]	} ] },{ $sum: [ {$multiply: [ "$cantstock", "$valorcom" ]}, {$multiply: [ "$cantstand", "$valorcom" ]} 	]}]}} }}])
            .exec(function(err, productos) {
                var resumen = {ventas: ventas[0].total, recaudado: ventas[0].pagado, credito: ventas[0].saldos, invertido: compras[0].comprado, proyectado : productos[0].proyectado};
                res.json(resumen);
            });
        });
    });
};

exports.ClientesDeudores = function(req, res) {
      Ventas.aggregate([ { $match : {pagado:false, activa: true}}, { $group: {_id: "$comprador", debe: { $sum: "$saldo" }} }, {$lookup:{from: "clientes", localField: "_id", foreignField: "_id", as: "comprador"}}, { $sort : { _id : 1}} ])
      .exec(function(err, posts) {
            res.json(posts);
        });
      
};

