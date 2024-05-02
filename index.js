require('dotenv').config()
const {leerInput, inquirerMenu, pausa, listarLugares} = require("./helpers/inquirer.js");
const Busquedas = require("./models/busqueda.js");


const main = async() =>{
    
    let opt; 

    const busqueda = new Busquedas();


    do {
        // Imprimir el menú
        opt = await inquirerMenu();

        switch(opt){
            case 1:
                //Mostrar mensaje 
                const termino = await leerInput('Ciudad:');
                //Buscar los lugares
                const lugares = await busqueda.ciudad(termino);
                //Seleccionar el lugar
                const id = await listarLugares(lugares)
                if(id === '0') continue;

                const lugarSelec = lugares.find(l => l.id === id)

                //Guardar en DB
                busqueda.agregarHistorial(lugarSelec.nombre)

                const {nombre, lat, lng} = lugarSelec;
                
                //clima 
                const clima = await busqueda.climaLugar(lat, lng)

                const {desc, min, max, temp} = clima;

                //mostrar resultados
                console.log('\nInformacion de la ciudad\n'.green)
                console.log('Ciudad:', nombre)
                console.log('Lat:', lat)
                console.log('Lng:', lng)
                console.log('Temperatura:', temp)
                console.log('Minima:', min)
                console.log('Maxima:', max )
                console.log('Como se ve el clima:', (desc).green)
            break;


            case 2:
                busqueda.historialCapitalizado  .forEach((lugar, i)=>{
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })
        }
     
        await pausa();

    } while( opt !== 0 );
}

main();