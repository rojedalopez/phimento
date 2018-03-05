var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

// create a schema
var clienteSchema = new Schema({
  _id: String,
  nombre: { type: String, required: true },
  apellido: String,
  correo: { type: String },
  celular: { type: String },
  activo: { type: Boolean, default: true},
  meta: {
    age: Number,
    website: String
  },
  tipodoc:    { type: String, enum:
  ['CC', 'CE', 'PS',  'NT']
        },
  doc: {type: String, unique: true},
  tipopers:    { type: String, enum:
  ['NAT', 'JUD']
        },
  created_at: Date,
  updated_at: Date
}, {versionKey: false});

clienteSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});


// the schema is useless so far
// we need to create a model using it
var cliente = mongoose.model('Clientes', clienteSchema);

// make this available to our clientes in our Node applications
module.exports = cliente;