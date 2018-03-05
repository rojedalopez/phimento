function llenarProductos(control, option){
    $.ajax({
        method: "GET",
        url: "product"+(option!==undefined?'/'+option:''),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function( msg ) {
        var lista = msg;
        $(control).empty();
        $(control).append("<option value='' ganancia='0' precio='0'>Seleccione producto</option>");
        for(var i = 0; i < lista.length; i++){
            $(control).append("<option value='"+lista[i]._id+"' ganancia='"+ (parseInt(lista[i].valorvnt) - parseInt(lista[i].valorcom)) +"' precio='"+ lista[i].valorvnt +"' stock='"+lista[i].cantstand+"'>"+lista[i]._id+" - "+lista[i].nombre +"</option>");
        }
    });
}

function llenarClientes(control){
    $.ajax({
        method: "GET",
        url: "client",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function( msg ) {
        var lista = msg;
        $(control).empty();
        $(control).append("<option value=''>Seleccione comprador</option>");
        for(var i = 0; i < lista.length; i++){
            $(control).append("<option value='"+lista[i]._id+"'>"+lista[i].nombre + " " +  lista[i].apellido +"</option>");
        }
    });
}

function llenarClientesDeudores(control){
    $.ajax({
        method: "GET",
        url: "sales/deudores",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function( msg ) {
        var lista = msg;
        $(control).empty();
        $(control).append("<option value=''>Seleccione cliente</option>");
        for(var i = 0; i < lista.length; i++){
            $(control).append("<option value='"+lista[i]._id+"'>"+lista[i].comprador[0].nombre + " " +  lista[i].comprador[0].apellido +"</option>");
        }
    });
}

$.date = function(dd) {
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

$.dateT = function(dd) {
    var t = dd.split('T');
    return t[0];
};

$.currency = function(num){
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

$.round = function(num){
    if(num === null || num === undefined){
        return 0;
    }

    if(num <= 50){
        return 50; 
    }else{
        var cociente = 0;
        cociente = num % 50;
        if(cociente < 25){
            return num - cociente;
        }else{
            return (num - cociente) + 50; 
        }

    }
}