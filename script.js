document.addEventListener('DOMContentLoaded',()=>{
    const BOTON = document.querySelector('#buttonCalc');
    const TABLE = document.querySelector('#tableCalc');
    const TBODY  =  document.querySelector('#tableCalc tbody');
    const TABLESC = document.querySelector('#tableSc')
    const TBODYSC =  document.querySelector('#tableSc tbody');
    const TITULO = document.querySelector('#tituloTable');
    const INPUT = document.querySelector('#inputWeight');
    INPUT.focus();
    TABLE.style = 'display:none';
    TABLESC.style = 'display:none';
    BOTON.setAttribute('disabled',true);
});



    // Insertar los datos en la fila de la tabla de Superficie corporal
    function insertRowDataSc(opcion1, opcion2, weight){
        let data = [weight,`${parseInt(Math.round(opcion1)/24)}`,`${parseInt(Math.round(opcion2)/24)}`];
        let fila = TBODYSC.insertRow();
        for(let i in data){
            dataRow = data[i] == weight ? `${weight} kg`: `${data[i]} cc/h`
            fila.insertCell().innerHTML = dataRow;
            fila.style = 'color:#FF416C;'
        };
        TITULO.innerHTML = 'Metodo Superficie Corporal'
        TABLESC.style = 'display:block';  
        document.querySelector('#holliday').style = 'display:none;'
        document.querySelector('#metodo').style = 'display:none;'
        document.querySelector('#superficieCorporal').style = 'display:block;'
    }
    // Vamoas a calcular la superfiecie corporal
    function calcularSuperficieCorporal(pesoCorporal){
        let superfiecieCorporal = ((pesoCorporal * 4) + 7) / (pesoCorporal + 90);
        return superfiecieCorporal 
    }

    // Vamos a insetar los datos en la fila 
    function insertRowData(weight, dailyVolume, hourlyFlow, flowPlusHalfFlow){
        let data = [weight, dailyVolume,hourlyFlow,flowPlusHalfFlow];
        let fila = TBODY.insertRow();
        for(let i in data){
            let dataRow = parseInt(Math.round(data[i]));
            fila.insertCell().innerHTML = `${dataRow}`;
        };
        TITULO.innerHTML = 'Metodo Holliday-Segar'
        TABLE.style = 'display:block';  
        fila.style = 'color:#FF416C;'
        document.querySelector('#superficieCorporal').style = 'display:none;'
        document.querySelector('#metodo').style = 'display:none;'
        document.querySelector('#holliday').style = 'display:block;'
    }

    // con esta funcion calcularemos el flujo + medio flujo divido 2
    function calculateFlowPlusHalfFlow(dailyVolume){
        let result = dailyVolume + (dailyVolume / 2);
        return result;
    }

    // con esta funcion vamos a calcular el mantenimiento o flujo horario necesario
    function calculateHourlyFlow(dailyVolume){
        let result = dailyVolume / 24;
        return result;
    }

    // funcion que calculara la hidratacion que necesita el nino dependiendo de su peso
    function calculateDailyVolume(weight){
        let hydrationLessThan10 = weight <= 10 ? weight * 100 : 10 * 100;
        let hydrationAbove10UpTo20 = weight > 10 & weight <=20 ? (weight - 10) * 50 : 10 * 50;
        let hydrationMoreThan20 = (weight - 20) * 20;
        let result;

        if(weight > 20){
            //se suman 20cc por cada kilo adicional
            result = hydrationLessThan10 + hydrationAbove10UpTo20 + hydrationMoreThan20;
        }else if (weight > 10 & weight <= 20){
            // Se suman 50cc por cada kilo de peso por arriba de 10kg, hasta 20kg
            result = hydrationLessThan10 + hydrationAbove10UpTo20;
        }else{
            // De 0kg a 10kg, se calcula 100cc por cada kilo.
            result = hydrationLessThan10 > 0 ? hydrationLessThan10 : 100 ;
        }
        return result
    };

    // Con esta funcion decidimos con que metodo vamos a calcular la hidratacion necesaria
    function calcHydratation(weight){
        if(weight <= 30 && weight >= 0){
            // valumen diario
            let dailyVolume = calculateDailyVolume(weight);
            // mantenimiento o flujo horario necesario
            let hourlyFlow = calculateHourlyFlow(dailyVolume);
            // mantenimiento un poco superior al calculado
            let flowPlusHalfFlow = calculateFlowPlusHalfFlow(hourlyFlow);
            insertRowData(weight, dailyVolume,hourlyFlow,flowPlusHalfFlow);
        }else{
            let superficieCorporal = calcularSuperficieCorporal(weight);
            let option1 = superficieCorporal * 1500;
            let option2 = superficieCorporal * 2000;
            insertRowDataSc(option1,option2, weight);
        };
    }

    // Verifica de la tabla esta con el display block, es decir que se ha realizado previamente un calculo, para borrarlo en caso que se quiera hacer otro calculo
    function verificarTablaExistente(){
        if(TABLE.style.display == 'block' || TABLESC.style.display == 'block'){
            TABLE.style = 'display:none';
            TABLESC.style = 'display:none';
            TBODY.innerHTML = '';
            TBODYSC.innerHTML = '';
            return true;
        }else{
            return false;
        }
    }

    // Arrojamos el error cuando se ingresa un dato que no es un numero
    function mensajeDeError(weight){
        if(weight.length > 0){
            TITULO.innerHTML = 'Ingresa correctamente los datos!'
            TITULO.style.color = 'red';
            document.querySelector('#holliday').style = 'display:none;'
            document.querySelector('#superficieCorporal').style = 'display:none;'
            document.querySelector('#metodo').style = 'display:block;'
        }else{
            TITULO.innerHTML = ''
            BOTON.setAttribute('disabled',true);
            TITULO.style.color = 'black';
        }
    }

    // Escuha al boton calcular, para enviar el dato del input para que se procese
    BOTON.addEventListener('click',(event)=>{
        event.preventDefault();
        let weight = parseInt(INPUT.value);
        INPUT.value = '';
        calcHydratation(weight);
        BOTON.setAttribute('disabled',true);
        TITULO.style.color = 'black';
    })

    // Captura el envento en el input, y determino si corresponde a numeros u otro tipo de datos
    INPUT.addEventListener('input', (event)=>{
        event.preventDefault();
        let weight = INPUT.value;
        TITULO.innerHTML = ''
        if(/^[0-9]+$/.test(weight)){
            BOTON.removeAttribute('disabled');
            verificarTablaExistente();
        }else{
            BOTON.setAttribute('disabled',true);
            verificarTablaExistente()
            mensajeDeError(weight);
        }   
    });
