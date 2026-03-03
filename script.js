// Configuración de Firebase (Tus llaves personales)
const firebaseConfig = {
  apiKey: "AIzaSyCFIGS8e776cqxFf5JTc5z13lhEFOPy1UY",
  authDomain: "lotto-flash-global.firebaseapp.com",
  projectId: "lotto-flash-global",
  storageBucket: "lotto-flash-global.firebasestorage.app",
  messagingSenderId: "246189515919",
  appId: "1:246189515919:web:7b44fafe769180c12bbcfa",
  databaseURL: "https://lotto-flash-global-default-rtdb.firebaseio.com/"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Selección de elementos del DOM
const resultForm = document.getElementById('result-form');
const adminAuth = document.getElementById('admin-auth');
const authBtn = document.getElementById('auth-btn');
const passInput = document.getElementById('admin-pass');
const adminPanel = document.getElementById('admin-panel');
const statusMsg = document.getElementById('status-msg');

// Clave de administración
const ADMIN_KEY = "19Bc*.Ks*9";

// Función para autenticar
authBtn.addEventListener('click', () => {
    if (passInput.value === ADMIN_KEY) {
        adminPanel.classList.remove('hidden');
        adminAuth.classList.add('hidden');
    } else {
        alert("Clave incorrecta");
    }
});

// Función para subir resultados a la nube
resultForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const lottery = document.getElementById('lottery-select').value;
    const time = document.getElementById('time-select').value;
    const result = document.getElementById('result-input').value;

    if (result) {
        // Guardar en Firebase (Para que todos lo vean)
        database.ref('results/' + lottery + '/' + time).set({
            value: result,
            timestamp: Date.now()
        }).then(() => {
            statusMsg.innerText = "¡Resultado publicado para todo el mundo!";
            resultForm.reset();
            lanzarConfeti();
            setTimeout(() => statusMsg.innerText = "", 3000);
        });
    }
});

// Escuchar cambios en tiempo real (Para los usuarios)
database.ref('results').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        for (let lottery in data) {
            for (let time in data[lottery]) {
                const cellId = `res-${lottery}-${time}`;
                const cell = document.getElementById(cellId);
                if (cell) {
                    cell.innerText = data[lottery][time].value;
                    cell.classList.add('new-result');
                }
            }
        }
    }
});

// Función visual de confeti
function lanzarConfeti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}
