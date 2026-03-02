const ANIMALES = {"00":"Ballena","0":"Delfín","01":"Carnero","02":"Toro","03":"Ciempiés","04":"Alacrán","05":"León","06":"Rana","07":"Perico","08":"Ratón","09":"Águila","10":"Tigre","11":"Gato","12":"Caballo","13":"Mono","14":"Paloma","15":"Zorro","16":"Oso","17":"Pavo","18":"Burro","19":"Chivo","20":"Cochino","21":"Gallo","22":"Camello","23":"Cebra","24":"Iguana","25":"Gallina","26":"Vaca","27":"Perro","28":"Zamuro","29":"Elefante","30":"Caimán","31":"Lapa","32":"Ardilla","33":"Pescado","34":"Venado","35":"Jirafa","36":"Culebra","37":"Tortuga","38":"Búfalo","39":"Lechuza","40":"Avispa","41":"Canguro","42":"Tucán","43":"Mariposa","44":"Chigüire","45":"Garza","46":"Puma","47":"Pavo Real","48":"Puercoespín","49":"Pereza","50":"Canario","51":"Pelícano","52":"Pulpo","53":"Caracol","54":"Grillo","55":"Oso Hormiguero","56":"Tiburón","57":"Pato","58":"Hormiga","59":"Pantera","60":"Camaleón","61":"Panda","62":"Cachicamo","63":"Cangrejo","64":"Gavilán","65":"Araña","66":"Lobo","67":"Avestruz","68":"Jaguar","69":"Conejo","70":"Bisonte","71":"Guacamaya","72":"Gorila","73":"Hipopótamo","74":"Turpial","75":"Guácharo"};
const HORAS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

let db = JSON.parse(localStorage.getItem('CarlosC_V12')) || {};
let toques = 0;
let likes = parseInt(localStorage.getItem('CarlosC_Likes')) || 1920;

function sonarExito() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
}

function compartirWS(hora, num, animal) {
    const msg = `🔥 *LOTTO FLASH PRO* 🔥%0A🌟 Resultado: *${num} - ${animal.toUpperCase()}*%0A⏰ Hora: ${hora}%0A%0A📲 _Descarga la App de CarlosC aquí:_ [TU-LINK]`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function ejecutarPublicacion() {
    const j = document.getElementById('adm-juego').value;
    const h = document.getElementById('adm-hora').value;
    let n = document.getElementById('adm-num').value;
    if(n.length === 1 && n !== "0") n = "0" + n;
    
    if(!ANIMALES[n]) return alert("Código Inválido");
    if(!db[j]) db[j] = {};
    db[j][h] = { n: n, a: ANIMALES[n] };
    localStorage.setItem('CarlosC_V12', JSON.stringify(db));
    
    sonarExito();
    render();
    cerrarMaestro();
}

function render() {
    const j = document.getElementById('view-juego').value;
    const list = document.getElementById('listado');
    list.innerHTML = "";
    HORAS.forEach(h => {
        const r = (db[j] && db[j][h]) ? db[j][h] : { n: "--", a: "ESPERANDO..." };
        list.innerHTML += `
        <div class="fila-res">
            <div><small style="color:#777">HORARIO</small><br><b>${h}</b></div>
            <div style="display:flex; align-items:center">
                <span style="color:var(--oro); font-weight:bold; margin-right:10px">${r.a.toUpperCase()}</span>
                <div class="circulo-num">${r.n}</div>
                ${r.n !== "--" ? `<button class="btn-ws" onclick="compartirWS('${h}','${r.n}','${r.a}')"><i class="fab fa-whatsapp"></i></button>` : ''}
            </div>
        </div>`;
    });
}

function controlMaestro() {
    toques++;
    if(toques === 3) {
        let pass = prompt("SINTONIZAR FRECUENCIA:");
        if(pass === "19Bc*.Ks*9") {
            document.getElementById('panelAdmin').style.display = 'flex';
            const h = document.getElementById('adm-hora'); h.innerHTML = "";
            HORAS.forEach(hora => h.add(new Option(hora, hora)));
        }
        toques = 0;
    }
    setTimeout(() => { toques = 0; }, 2000);
}

function sumarLike() {
    likes++;
    localStorage.setItem('CarlosC_Likes', likes);
    document.getElementById('contador-votos').innerText = `${likes} personas apoyan esta innovación`;
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#fdbb2d', '#ffffff'] });
}

function cerrarMaestro() { document.getElementById('panelAdmin').style.display = 'none'; }
function previewAnimal() {
    let n = document.getElementById('adm-num').value;
    if(n.length === 1 && n !== "0") n = "0" + n;
    document.getElementById('res-name').innerText = ANIMALES[n] || "---";
}

window.onload = () => {
    document.getElementById('fecha-hoy').innerText = new Date().toLocaleDateString('es-VE');
    const sj = document.getElementById('view-juego');
    ["Lotto Activo", "La Granjita"].forEach(v => sj.add(new Option(v, v.toLowerCase().replace(" ","-"))));
    document.getElementById('contador-votos').innerText = `${likes} personas apoyan esta innovación`;
    render();
    setInterval(() => { document.getElementById('reloj').innerText = new Date().toLocaleTimeString(); }, 1000);
};
