var jwt = require('jwt-simple');  
var moment = require('moment');  
var config = require('./../config/config');

exports.createToken = function(user) {  
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(7, "days").unix(),
    admin: user.admin,
    rol: user.rol
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

exports.encriptar = function(password, tkn) {  
   var crypto = require('crypto')
   // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
   var hmac = crypto.createHmac('sha1', password).update(tkn).digest('hex')
   return hmac
}

exports.generarToken = function(longitud)
{
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<longitud; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}