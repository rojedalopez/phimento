
var mongoose = require('mongoose');  
var Cliente = mongoose.model('Clientes');  

exports.RegistrarCliente = function(req, res) {  
    var cliente = new Cliente({
        _id:req.body._id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        celular: req.body.celular,
        tipodoc: req.body.tipodoc,
        doc: req.body.doc,
        tipopers: req.body.tipopers
    });

    cliente.save(function(err){
        if(err)
        return res.status(500).send({mensaje: err});

        return res
        .status(200)
        .send({mensaje: "OK"});            
    });
};

exports.Infocliente = function(req, res) {
    Cliente.findOne({_id: req.cliente}, function(err, cliente) {
        if(err)res.status(500).send({mensaje: err});
        
        res.status(200).jsonp(cliente);
    });
};

exports.BuscarClientes = function(req, res) {
    Cliente.find( function(err, clientes) {
        if(err)res.status(500).send({mensaje: err});

        res.status(200).jsonp(clientes);
    }).sort({nombre:1, apellido:1});
};

exports.Modifycliente = function(req, res) {
    var id = req.body._id;
    Cliente.findById(id, function(err, cliente) {
        cliente.nombre = req.body.nombre;
        cliente.apellido = req.body.apellido;
        cliente.correo = req.body.correo;
        cliente.celular = req.body.celular;
        cliente.doc = req.body.doc;
        cliente.tipodoc = req.body.tipodoc;
        cliente.tipopers = req.body.tipopers;
        
        cliente.save(function(err) {
            if(err)res.status(500).send({mensaje: err});

            res
            .status(200)
            .send({mensaje: "OK"});
        });
    });
};


exports.ModifyPasswordBycliente = function(req, res) {
    cliente.findById(req.cliente, function(err, cliente) {
        var tkn = auth.generarToken(25);
        var passEncriptada = auth.encriptar(req.body.password, tkn);

        cliente.password = passEncriptada;
        cliente.token = tkn;
        
        cliente.save(function(err) {
            if(err)res.status(500).send({mensaje: err});

            res.status(200).jsonp(cliente);
        });
    });
};


exports.ModifyclienteByAdmin = function(req, res) {
    cliente.findById(req.body._id, function(err, cliente) {
        if(req.body.reset){
            var tkn = auth.generarToken(25);
            var passEncriptada = auth.encriptar(req.body._id, tkn);

            cliente.password = passEncriptada;
            cliente.token = tkn;
        }
        cliente.correo = req.body.correo;
        cliente.nombre = req.body.nombre;
        cliente.apellido = req.body.apellido;
        cliente.celular = req.body.celular;
        cliente.location = req.body.location;
        cliente.tipodoc = req.body.tipodoc;
        cliente.tipopers = req.body.tipopers;
        cliente.admin = req.body.admin;
        cliente.rol = req.body.idrol,

        cliente.save(function(err) {
            if(err)res.status(500).send({mensaje: err});

            res.status(200).jsonp(cliente);
        });
    });
};

exports.DeleteclienteByAdmin = function(req, res) {
    cliente.findById(req.params.id, function(err, cliente) {
        cliente.activo = false;

        cliente.save(function(err) {
            if(err)res.status(500).send({mensaje: err});

            res.status(200).jsonp(cliente);
        });
    });
};