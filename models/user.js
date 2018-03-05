var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  _id: String,  
  nombre: { type: String, required: true },
  apellido: String,
  correo: { type: String, required: true },
  celular: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  rol: Number,
  activo: { type: Boolean, default: true},
  nuevo: { type: Boolean, default: true},
  admin: { type: Boolean, default: false},
  location: String,
  meta: {
    age: Number,
    website: String
  },
  tipodoc:    { type: String, enum:
  ['CC', 'CE', 'PS',  'NT']
        },
  tipopers:    { type: String, enum:
  ['NAT', 'JUD']
        },
  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', function(next) {
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
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;