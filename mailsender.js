var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(objeto){
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'emarkkwik@gmail.com',
            pass: 'tesoro22'
        }
    });

    var texto = "<div style='width:800px;font-family:Lucida Console;'>";
        texto += "<table style='font-family:Lucida Console;'>";
            texto += "<tr>";
                texto += "<th colspan='2'><h2>Holas has acabados de cumprar</h2></th>";
            texto += "</tr>";
            texto += "<tr>";
                texto += "<td rowspan='3'><img src='https://fiture-3f393.firebaseapp.com/css/images/apu.png' style='width:250px;'/></td>";
                texto += "<td style='background-image: url(https://vignette.wikia.nocookie.net/inciclopedia/images/9/94/Post-It.png/revision/latest?cb=20100719151648); width: 250px; height:250px;background-repeat: no-repeat; background-size: 250px 250px;padding: 0px 18px;'>";
                    texto += "<table style='width:210px;font-family:Lucida Console;font-size:13px;font-weight:bold;'>";
                        objeto.detalles.forEach(function(element) {
                            texto += "<tr><td>"+element.cantidad + ""+"</td><td>"+element.nombre.split('-')[1]+"</td><td style='text-align:right;'>"+currency(element.subtotal)+"</td></tr>	";
                        });
                    texto += "</table>";
                texto += "</td>";
            texto += "</tr>";
            texto += "<tr>";
                texto += "<td>";
                    var adicional = "";
                    if(parseInt(objeto.vlrpagado)>0){
                        adicional = " y abonaste <b>$" + currency(objeto.vlrpagado) + "</b>, asi que me quedas debiendos <b>$" + currency(parseInt(objeto.total) - parseInt(objeto.vlrpagado)) + "</b>.";
                    }
                    texto += "<p style='width:210px;font-family:Lucida Console;font-size:14px;'>El total de esta compras es <b>$"+currency(objeto.total)+"</b>"+adicional+"</p>";
                texto += "</td>";
            texto += "<tr>";
                texto += "<td>";
                    texto += "<p style='width:210px;font-family:Lucida Console;font-size:14px;'>Vuelves prontos!</p>";
                texto += "</td>";
            texto += "</tr>";
        texto += "</table>";
        texto += "</div>";
    // Definimos el email
    var mailOptions = {
        from: 'Kwik-e-mark',
        to: objeto.correo,
        subject: 'Compra',
        html: texto
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        } else {
            console.log("Correo enviado a " + objeto.correo);
        }
    });
};

exports.sendEmailResumen = function(objeto){

    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'emarkkwik@gmail.com',
            pass: 'tesoro22'
        }
    });

    var texto = "<div style='width:800px;font-family:Lucida Console;'>";
        texto += "<table style='font-family:Lucida Console;'>";
            texto += "<tr>";
                texto += "<th colspan='2'><h2>Holas me has pedidos tu estadus de cuenta</h2></th>";
            texto += "</tr>";
            texto += "<tr>";
                texto += "<td rowspan='3'><img src='https://fiture-3f393.firebaseapp.com/css/images/apu.png' style='width:250px;'/></td>";
                texto += "<td style='background-image: url(https://vignette.wikia.nocookie.net/inciclopedia/images/9/94/Post-It.png/revision/latest?cb=20100719151648); width: 250px; height:250px;background-repeat: no-repeat; background-size: 250px 250px;padding: 0px 18px;'>";
                    texto += "<p style='width:210px;font-family:Lucida Console;font-size:14px;'>Me has pedidos tu estadu de cuentas, adjuntos un archivos con los detalles, pero aquis te digos un resumen: <br/><br/>Me debes <b>$"+currency(objeto.saldo)+" pesitus</b></p>";
                texto += "</td>";
            texto += "</tr>";
            texto += "<tr>";
                texto += "<td>";
                    
                texto += "</td>";
            texto += "<tr>";
                texto += "<td>";
                    texto += "<p style='width:210px;font-family:Lucida Console;font-size:14px;'>Vuelves prontos!</p>";
                texto += "</td>";
            texto += "</tr>";
        texto += "</table>";
        texto += "</div>";

    // Definimos el email
    var mailOptions = {
        from: 'Kwik-e-mark',
        to: objeto.correo,
        subject: 'Estado de cuenta',
        html: texto,
        attachments: [
            {   // file on disk as an attachment
                filename: 'resumen.txt',
                path: __dirname + '/config/client/documents/'+objeto.usuario+'.txt' // stream this file
            }
        ]
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        } else {
            console.log("Correo enviado a " + objeto.correo);
        }
    });
};

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


