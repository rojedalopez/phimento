const express = require('express');
const router = express.Router();
const authCtrl = require('./../services/user');  
const productCtrl = require('./../services/productos');  
const clientCtrl = require('./../services/clientes'); 
const salesCtrl = require('./../services/ventas'); 
const purchasesCtrl = require('./../services/compras'); 
const middleware = require('./../methods/middleware');


router.get('/', function(req, res){
  res.sendfile(__dirname + '/client/index.html');
});
router.get('/login', function(req, res){
  res.sendfile(__dirname + '/client/login.html');
});
router.get('/clients', function(req, res){
  res.sendfile(__dirname + '/client/client.html');
});
router.get('/products', function(req, res){
  res.sendfile(__dirname + '/client/product.html');
});
router.get('/purchase', function(req, res){
  res.sendfile(__dirname + '/client/compras.html');
});
router.get('/list-sale', function(req, res){
  res.sendfile(__dirname + '/client/list-ventas.html');
});
router.get('/list-purchase', function(req, res){
  res.sendfile(__dirname + '/client/list-compras.html');
});

router.post('/auth/login', authCtrl.emailLogin);
router.post('/auth/signup', authCtrl.emailSignup);

router.post('/admin/user',middleware.ensureAuthenticated, authCtrl.emailSignup);  
router.get('/admin/user',middleware.ensureAuthenticated, authCtrl.listUsers);
router.put('/admin/user',middleware.ensureAuthenticated, authCtrl.ModifyUserByAdmin);
router.delete('/admin/user/:id',middleware.ensureAuthenticated, authCtrl.DeleteUserByAdmin);



router.get('/user',middleware.ensureAuthenticated, function(req, res) {
  authCtrl.InfoUser(req, res);
} ).put('/user',middleware.ensureAuthenticated, function(req, res) {
  authCtrl.ModifyUser(req, res);
} ).post('/user',middleware.ensureAuthenticated, function(req, res) {
  authCtrl.ModifyPasswordByUser(req, res);
});

router.post('/product',/*middleware.ensureAuthenticated, */productCtrl.CreateProduct);  
router.put('/product',/*middleware.ensureAuthenticated, */productCtrl.ModifyProduct);  
router.put('/product/stock',/*middleware.ensureAuthenticated, */productCtrl.ModifyStock);
router.get('/product/',/*middleware.ensureAuthenticated, */productCtrl.BuscarProducts);
router.get('/product/:id/:stand/:stock',/*middleware.ensureAuthenticated, */productCtrl.ModifyProductXX);
router.get('/product/:type',/*middleware.ensureAuthenticated, */productCtrl.BuscarProducts);
router.get('/product/:type/:id',/*middleware.ensureAuthenticated, */productCtrl.BuscarProducts);  
router.delete('/product/:id',/*middleware.ensureAuthenticated, */productCtrl.DeleteProducts);  

router.post('/client',/*middleware.ensureAuthenticated, */clientCtrl.RegistrarCliente);  
router.put('/client',/*middleware.ensureAuthenticated, */clientCtrl.Modifycliente);  
router.get('/client',/*middleware.ensureAuthenticated, */clientCtrl.BuscarClientes);  


router.post('/sales',/*middleware.ensureAuthenticated, */salesCtrl.RegistrarVenta);  
router.delete('/sales',/*middleware.ensureAuthenticated, */salesCtrl.DevolverVenta);  
router.get('/sales',/*middleware.ensureAuthenticated, */salesCtrl.BuscarVentas); 
router.get('/sales/resumen',/*middleware.ensureAuthenticated, */salesCtrl.ResumenVentas); 
router.get('/sales/resumen/:ident',/*middleware.ensureAuthenticated, */salesCtrl.BuscarVentasXCliente); 
router.put('/sales/pagar',/*middleware.ensureAuthenticated, */salesCtrl.SaldarVenta);
router.get('/sales/deudores',/*middleware.ensureAuthenticated, */salesCtrl.ClientesDeudores);

router.post('/nojoda',/*middleware.ensureAuthenticated, */salesCtrl.CCCCCC);


router.post('/purchases',/*middleware.ensureAuthenticated, */purchasesCtrl.RegistrarCompra); 
router.get('/purchases',/*middleware.ensureAuthenticated, */purchasesCtrl.BuscarCompras); 
router.delete('/purchases',/*middleware.ensureAuthenticated, */purchasesCtrl.BorrarCompra); 
 





module.exports = router;