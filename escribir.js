// importamos la libreria
const fs = require('fs');

exports.pintar_venta =  function(cliente, objeto){
    var texto = "";
    texto +=  pintar_separacion();
    texto += '---------------------- Resumen de cliente -----------------------';
    texto +=  pintar_espacio_sencillo();
    texto +=  pintar_separacion();
    texto += 'Cliente: ' + objeto.ventas[0].comprador.nombre + ' ' + objeto.ventas[0].comprador.apellido;
    texto +=  pintar_espacio_sencillo();
    texto += 'Fecha reporte: ' + date(new Date());
    texto +=  pintar_espacio_sencillo();
    texto +=  pintar_derecha(50,'Subtotal =>');
    texto +=  pintar_derecha(15, currency(objeto.resumen.total));
    texto +=  pintar_espacio_sencillo();
    texto +=  pintar_derecha(50,'Abonos =>');
    texto +=  pintar_derecha(15, currency(objeto.resumen.pagado));
    texto +=  pintar_espacio_sencillo();
    texto +=  pintar_derecha(50,'Total a pagar =>');
    texto +=  pintar_derecha(15, currency(objeto.resumen.saldos));
    texto +=  pintar_espacio_sencillo();
    texto +=  pintar_separacion();
    texto +=  pintar_espacio_doble();

    texto +=  pintar_separacion();
    texto += '---------------------- Listado de ventas- -----------------------';
    texto +=  pintar_espacio_sencillo();
    texto +=  pintar_separacion();
    texto +=  pintar_espacio_sencillo();

    objeto.ventas.forEach(function(element) {
        texto +=  pintar_separacion();
        texto += 'Cod venta: ' + element._id;
        texto +=  pintar_espacio_sencillo();
        texto += 'Fecha: ' + date(element.at);
        texto +=  pintar_espacio_sencillo();
        texto +=  pintar_separacion();
        texto += '--------------------- Listado de productos ----------------------';
        texto +=  pintar_espacio_sencillo();
        texto +=  pintar_separacion();
        texto +=  pintar_izquierda(15,'Cantidad');
        texto +=  pintar_izquierda(20,'Nombre Producto');
        texto +=  pintar_derecha(15,'Vlr Unidad');
        texto +=  pintar_derecha(15,'Subtotal');
        texto +=  pintar_espacio_sencillo();
        texto +=  pintar_separacion();
        element.detalles.forEach(function(ele) {
            texto +=  pintar_izquierda(15, ele.cantidad + "");
            texto +=  pintar_izquierda(20, ele.producto.nombre);
            texto +=  pintar_derecha(15, currency(ele.producto.valorvnt)+ "");
            texto +=  pintar_derecha(15, currency(ele.subtotal)+ "");
            texto +=  pintar_espacio_sencillo();
        });
        texto +=  pintar_separacion();
        texto +=  pintar_derecha(50,'Total =>');
        texto +=  pintar_derecha(15, currency(element.total));
        texto +=  pintar_espacio_sencillo();
        texto +=  pintar_derecha(50,'Pagado =>');
        texto +=  pintar_derecha(15, currency(element.vlrpagado));
        texto +=  pintar_espacio_sencillo();
        texto +=  pintar_derecha(50,'Saldo =>');
        texto +=  pintar_derecha(15, currency(element.saldo));
        texto +=  pintar_espacio_sencillo();
        texto +=  pintar_separacion();
        texto +=  pintar_espacio_doble();
    });

    fs.writeFile('config//client//documents//'+cliente+'.txt', texto, function(err){
        if(err){
            throw err;
        }

        console.log('informe creado');
    })
};

exports.pintar_productos =  function(objeto){
    var texto = "";
    objeto.forEach(function(element) {
        texto +=  element.nombre + ";" + element.valorvnt;
        texto +=  pintar_espacio_sencillo();
    });

    fs.writeFile('config//client//documents//productos.txt', texto, function(err){
        if(err){
            throw err;
        }

        console.log('informe creado');
    })
};

function pintar_separacion(){
    return '-----------------------------------------------------------------\n';
}

function pintar_espacio_doble(){
    return '\n\n';
}
function pintar_espacio_sencillo(){
    return '\n';
}

function pintar_derecha(tamanio, palabra){
    var texto = "";
    if(palabra.length > tamanio){
        var v_palabra = palabra.split('');
        for(var i=0; i < tamanio; i++){
            texto += v_palabra[i];
        }
    }else{
        var espacios = tamanio - palabra.length;
        for(var i=0; i < espacios; i++){
            texto += ' ';
        }
        texto += palabra;
    }
    return texto;
}

function pintar_izquierda(tamanio, palabra){
    var texto = "";
    if(palabra.length > tamanio){
        var v_palabra = palabra.split('');
        for(var i=0; i < tamanio; i++){
            texto += v_palabra[i];
        }
    }else{
        texto += palabra;
        var espacios = tamanio - palabra.length;
        for(var i=0; i < espacios; i++){
            texto += ' ';
        }
    }
    return texto;
}

function date(dd) {
    var d = new Date();
    if(dd!==null){
        d = new Date(dd);
    }
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = year + "-" + month + "-" + day;

    return date;
};


function currency(num){
    num = num.toString().replace(/$|,/g, '');
    if (isNaN(num))
        num = "0";

    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();

    if (cents < 10)
        cents = "0" + cents;

    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + '.' +
                num.substring(num.length - (4 * i + 3));

    return (((sign) ? '' : '-') + '' + num);
}


