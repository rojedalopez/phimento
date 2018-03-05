var mongoose = require('mongoose');  
var Schema = mongoose.Schema;
var Cliente = mongoose.model('Clientes');
var Products = mongoose.model('Products');


// create a schema
var ventaSchema = new Schema({
  comprador: { type: String, ref: "Clientes" },
  detalles: [
    {
      producto: { type: String, ref: "Products" },
      cantidad: { type: Number, required: true }, 
      subtotal: { type: Number, required: true }
    }
  ],
  activa: { type: Boolean, default: true},
  total: { type: Number, required: true },
  vlrpagado: { type: Number, default: 0 },
  saldo: { type: Number, default: 0 },
  pagado: { type: Boolean, default: false},
  nota: { type: String },
  at: Date,
  created_at: Date,
  inactived_at: Date,
}, {versionKey: false});

ventaSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

   // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});


// the schema is useless so far
// we need to create a model using it
var venta = mongoose.model('Ventas', ventaSchema);

// make this available to our ventas in our Node applications
module.exports = venta;
