var mongoose = require('mongoose');  
var Schema = mongoose.Schema;
var Products = mongoose.model('Products');

var detalleSchema = new Schema({
  producto: { type: String, ref: "Products" },
  cantidad: { type: Number, required: true }, 
  subtotal: { type: Number, required: true } 
}, {versionKey: false});


// the schema is useless so far
// we need to create a model using it
var detalle = mongoose.model('Detalles', detalleSchema);

// make this available to our ventas in our Node applications
module.exports = detalle;