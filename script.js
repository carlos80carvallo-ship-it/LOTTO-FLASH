// 1. CONFIGURACIÓN DE TU BASE DE DATOS (Verifica que sea tu URL)
const firebaseConfig = {
    databaseURL: "https://lotto-flash-carlosc-default-rtdb.firebaseio.com" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. OBTENER FECHA ACTUAL PARA EL SISTEMA
const getFechaHoy = () => new Date().toISOString().split('T')[0];

// 3. ACCESO ADMIN
document.getElementById('auth-btn').addEventListener('click', () => {
    const pass = document.getElementById('admin-pass').value;
    if (pass === "19Bc*.Ks*9") {
        document.getElementById('admin-panel').classList.remove('hidden');
        alert("¡Bienvenido, Carlos! Panel Activo.");
    } else {
        alert("Clave incorrecta");
    }
});

// 4. PUBLICAR RESULTADO (Se guarda por Fecha y Hora)
document.getElementById('result-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const loteria = document.getElementById('lottery-select').value;
    const hora = document.getElementById('time-select').value;
    const resultado = document.getElementById('result-input').value.toUpperCase();
    const fecha = getFechaHoy();

    // Guardamos en la ruta: resultados/2026-03-02/08
    db.ref('resultados/' + fecha + '/' + hora).set({
        loteria: loteria,
        valor: resultado
    }).then(() => {
        alert("Resultado de las " + hora + ":00 subido con éxito");
        document.getElementById('result-input').value = "";
    });
});

// 5. BUSCADOR DE HISTORIAL (Para los clientes)
document.getElementById('busqueda-fecha').addEventListener('change', (e) => {
    const fechaSeleccionada = e.target.value;
    cargarResultados(fechaSeleccionada);
});

// 6. FUNCIÓN PARA MOSTRAR LOS DATOS EN LOS CÍRCULOS
function cargarResultados(fecha) {
    db.ref('resultados/' + fecha).on('value', (snapshot) => {
        const datos = snapshot.val();
        
        // Primero limpiamos la tabla para que no se vea lo del día anterior
        document.querySelectorAll('.circle-result').forEach(c => c.innerText = '--');
        document.querySelectorAll('.text-yellow-500.text-sm').forEach(s => s.innerText = 'ESPERANDO...');

        if (datos) {
            for (let hora en datos) {
                const circulo = document.getElementById('res-' + hora);
                const etiqueta = document.getElementById('name-' + hora);
                
                if (circulo) circulo.innerText = datos[hora].valor;
                if (etiqueta) etiqueta.innerText = "SORTEO OK";
            }
        }
    });
}

// AL CARGAR LA PÁGINA, MOSTRAR LO DE HOY AUTOMÁTICAMENTE
window.onload = () => {
    cargarResultados(getFechaHoy());
};
