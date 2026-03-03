// 1. CONFIGURACIÓN DE TU BASE DE DATOS (Asegúrate de que sean tus credenciales)
const firebaseConfig = {
    databaseURL: "https://TU-PROYECTO.firebaseio.com" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. VARIABLES DE TIEMPO
const fechaHoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
const busquedaInput = document.getElementById('busqueda-fecha');

// 3. FUNCIÓN PARA PUBLICAR (ADMIN)
const authBtn = document.getElementById('auth-btn');
authBtn.addEventListener('click', () => {
    const pass = document.getElementById('admin-pass').value;
    if (pass === "19Bc*.Ks*9") {
        document.getElementById('admin-panel').classList.remove('hidden');
        alert("Acceso Concedido, Carlos");
    } else {
        alert("Clave incorrecta");
    }
});

document.getElementById('result-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const hora = document.getElementById('time-select').value;
    const animalito = document.getElementById('result-input').value.toUpperCase();
    
    // Guarda en la carpeta de la fecha seleccionada
    db.ref('resultados/' + fechaHoy + '/' + hora).set({
        resultado: animalito,
        status: "PUBLICADO"
    }).then(() => {
        alert("¡Resultado Subido!");
        confetti();
    });
});

// 4. FUNCIÓN PARA BUSCAR POR FECHA (PÚBLICO)
busquedaInput.addEventListener('change', (e) => {
    const fechaSeleccionada = e.target.value;
    cargarResultados(fechaSeleccionada);
});

function cargarResultados(fecha) {
    db.ref('resultados/' + fecha).on('value', (snapshot) => {
        const datos = snapshot.val();
        // Limpiamos los círculos antes de mostrar nuevos
        document.querySelectorAll('.circle-result').forEach(c => c.innerText = '--');
        document.querySelectorAll('.text-yellow-500.text-sm').forEach(s => {
            if(s.innerText !== "LIVE") s.innerText = 'ESPERANDO...';
        });

        if (datos) {
            for (let hora in datos) {
                const resDiv = document.getElementById('res-' + hora);
                const nameDiv = document.getElementById('name-' + hora);
                if (resDiv) resDiv.innerText = datos[hora].resultado;
                if (nameDiv) nameDiv.innerText = "SORTEO OK";
            }
        }
    });
}

// 5. CARGAR HOY AL ENTRAR
cargarResultados(fechaHoy);
