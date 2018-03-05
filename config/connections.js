let mongoose = require('mongoose');  

mongoose.connect('mongodb://rojedalopez:R0b3rto@cluster0-shard-00-00-xb8k8.mongodb.net:27017,cluster0-shard-00-01-xb8k8.mongodb.net:27017,cluster0-shard-00-02-xb8k8.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', {useMongoClient:true});

module.exports = mongoose;