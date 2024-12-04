let mysql = require("mysql2"); //libreria de mysql

//Variable para acceder la conexion
let conexion = mysql.createConnection({
    host: "localhost",
    database: "datosmy",
    user: "root",
    password: "123456789"
});

//Comprueba que la conexion fue exitosa
conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("Conexion exitosa");
    }
});

conexion.end();