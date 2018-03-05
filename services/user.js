
var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var auth = require('./../methods/auth');

exports.emailSignup = function(req, res) {  
    var tkn = auth.generarToken(25);
    var passEncriptada = auth.encriptar(req.body._id, tkn);
    var user = new User({
        _id:req.body._id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        username: req.body.username,
        password: passEncriptada,
        correo: req.body.correo,
        celular: req.body.celular,
        token: tkn,
        rol:req.body.idrol,
        admin:req.body.admin,
        location: req.body.location,
        tipodoc: req.body.tipodoc,
        tipopers: req.body.tipopers
    });

    user.save(function(err){
        if(err){        
            return res
                .status(500)
                .jsonp(err);
        }else{
            return res
                .status(200)
                .send({mensaje: "OK"});            
        }
    });
};

exports.emailLogin = function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        var passEncriptada = auth.encriptar(req.body.password, user.token);
        if(!user.activo){
            return res
                .status(401)
                .send("Usuario inactivo");
        }
        else if(passEncriptada === user.password){
            return res
                .status(200)
                .send({token: auth.createToken(user)});
        }else{
            return res
                .status(401)
                .send("Error de autenticacion");
        }
    });
};

exports.InfoUser = function(req, res) {
    User.findOne({_id: req.user}, function(err, user) {
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(user);
    });
};

exports.listUsers = function(req, res) {
    User.find( function(err, users) {
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(users);
    });
};

exports.ModifyUser = function(req, res) {
    User.findById(req.user, function(err, user) {
        user.nombre = req.body.nombre;
        user.apellido = req.body.apellido;
        user.celular = req.body.celular;
        user.location = req.body.location;
        user.tipodoc = req.body.tipodoc;
        user.tipopers = req.body.tipopers;
        user.admin = req.body.admin;
        user.rol = req.body.idrol,

        user.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(user);
        });
    });
};


exports.ModifyPasswordByUser = function(req, res) {
    User.findById(req.user, function(err, user) {
        var tkn = auth.generarToken(25);
        var passEncriptada = auth.encriptar(req.body.password, tkn);

        user.password = passEncriptada;
        user.token = tkn;
        
        user.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(user);
        });
    });
};


exports.ModifyUserByAdmin = function(req, res) {
    User.findById(req.body._id, function(err, user) {
        if(req.body.reset){
            var tkn = auth.generarToken(25);
            var passEncriptada = auth.encriptar(req.body._id, tkn);

            user.password = passEncriptada;
            user.token = tkn;
        }
        user.correo = req.body.correo;
        user.nombre = req.body.nombre;
        user.apellido = req.body.apellido;
        user.celular = req.body.celular;
        user.location = req.body.location;
        user.tipodoc = req.body.tipodoc;
        user.tipopers = req.body.tipopers;
        user.admin = req.body.admin;
        user.rol = req.body.idrol,

        user.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(user);
        });
    });
};

exports.DeleteUserByAdmin = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        user.activo = false;

        user.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(user);
        });
    });
};