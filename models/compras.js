var mongoose = require('mongoose');  
var Schema = mongoose.Schema;
var Products = mongoose.model('Products');


// create a schema
var compraSchema = new Schema({
  at: Date,
  detalles: [
    {
      producto: { type: String, ref: "Products" },
      cantidad: { type: Number, required: true }, 
      subtotal: { type: Number, required: true }
    }
  ],
  activa: { type: Boolean, default: true},
  total: { type: Number, required: true },
  nota: { type: String },
  created_at: Date,
}, {versionKey: false});

compraSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

   // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});


// the schema is useless so far
// we need to create a model using it
var compra = mongoose.model('Compras', compraSchema);

// make this available to our compras in our Node applications
module.exports = compra;
