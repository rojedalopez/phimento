
var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

// create a schema
var productSchema = new Schema({
  _id: String,  
  nombre: { type: String, required: true },
  descripcion: String,
  valorcom: { type: Number, required: true },
  valorvnt: { type: Number, required: true },
  valorpromo: { type: Number },
  imagen: { type: String },
  stock: { type: Boolean, default: false},
  stand: { type: Boolean, default: false},
  cantstock: { type: Number, default: 0 },
  cantstand: { type: Number, default: 0 },
  minstock: { type: Number, required: true },
  minstand: { type: Number, required: true },
  meta: {
    age: Number,
    website: String
  },
  ultstock: Date,
  created_at: Date,
  updated_at: Date
}, {versionKey: false});


productSchema.pre('save', function(next) {
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
var Product = mongoose.model('Products', productSchema);

// make this available to our users in our Node applications
module.exports = Product;