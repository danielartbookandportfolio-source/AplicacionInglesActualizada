let words = [];

let leftCol;
let rightCol;

let scoreEl;
let streakEl;
let levelEl;
let timerEl;

let timer = 0;
let timerInterval = null;

// SOLO los botones usados en este ciclo
let cycleButtons = [];

let score = 0;
let streak = 0;
let level = 1;
let matchCount = 0;

let selectedLeft = null;
let selectedRight = null;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

    leftCol = document.getElementById("leftAnswers");
    rightCol = document.getElementById("rightAnswers");

    scoreEl = document.getElementById("score");
    streakEl = document.getElementById("streak");
    levelEl = document.getElementById("level");
    timerEl = document.getElementById("timer");

    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) restartBtn.onclick = restartGame;

    const menuBtn = document.getElementById("menuBtn");
    if (menuBtn) menuBtn.onclick = () => {
        window.location.href = "/perfil";
    };

    loadWords();
});

// =========================
// LOAD WORDS
// =========================
function loadWords() {

    console.log("loadWords ejecutándose...");

    fetch("/static/data/words.json")
        .then(res => {

            if (!res.ok) {
                throw new Error("HTTP error: " + res.status);
            }

            return res.json();
        })
        .then(data => {

            words = data;

            buildBoard();   // primero tablero
            startTimer();   // luego timer (UNA sola vez)

            console.log("Juego iniciado correctamente");

        })
        .catch(err => {
            console.error("Error cargando palabras:", err);
        });
}

// =========================
// BUILD BOARD
// =========================
function buildBoard() {

    leftCol.innerHTML = "";
    rightCol.innerHTML = "";

    cycleButtons = [];
    matchCount = 0;

    const pairs = shuffle([...words]).slice(0, 6);

    let allButtons = [];

    pairs.forEach(pair => {

        const leftBtn = createBtn(pair.en, pair.id, "en");
        const rightBtn = createBtn(pair.es, pair.id, "es");

        allButtons.push(leftBtn, rightBtn);
    });

    shuffle(allButtons);

    allButtons.forEach(btn => {

        cycleButtons.push(btn);

        if (btn.dataset.lang === "en") {
            leftCol.appendChild(btn);
        } else {
            rightCol.appendChild(btn);
        }
    });
}

// =========================
// CREATE BUTTON
// =========================
function createBtn(text, id, lang) {

    const btn = document.createElement("button");

    btn.className = "answer-btn";
    btn.textContent = text;

    btn.dataset.id = id;
    btn.dataset.lang = lang;

    btn.onclick = () => handle(btn);

    return btn;
}

// =========================
// MATCH CHECK
// =========================
function isSameMeaning(a, b) {
    return a.dataset.id === b.dataset.id;
}

// =========================
// HANDLE CLICK
// =========================
function handle(btn) {

    // =========================
    // BLOQUEO DE BOTONES YA RESUELTOS
    // =========================
    if (btn.disabled) return;

    // Quita estado visual de error si existía
    btn.classList.remove("wrong");

    const isLeft = btn.dataset.lang === "en";

    // =========================
    // SELECCIÓN IZQUIERDA
    // =========================
    if (isLeft) {

        // Si clicas el mismo botón, lo deselecciona
        if (selectedLeft === btn) {
            selectedLeft.style.background = "#334155";
            selectedLeft = null;
            return;
        }

        // Si ya había uno seleccionado, lo resetea visualmente
        if (selectedLeft) selectedLeft.style.background = "#334155";

        selectedLeft = btn;
        btn.style.background = "#64748b";
    }

    // =========================
    // SELECCIÓN DERECHA
    // =========================
    else {

        // Toggle: si clicas el mismo botón, lo deselecciona
        if (selectedRight === btn) {
            selectedRight.style.background = "#334155";
            selectedRight = null;
            return;
        }

        // Si ya había uno seleccionado, lo resetea visualmente
        if (selectedRight) selectedRight.style.background = "#334155";

        selectedRight = btn;
        btn.style.background = "#64748b";
    }

    // =========================
    // SOLO CONTINÚA SI HAY AMBOS
    // =========================
    if (!selectedLeft || !selectedRight) return;

    // Guardamos referencias seguras (evita bugs con async/setTimeout)
    const left = selectedLeft;
    const right = selectedRight;

    // =========================
    // CHECK MATCH
    // =========================
    const isMatch = isSameMeaning(left, right);

    if (isMatch) {

        // Marca visualmente como correctos
        left.classList.add("correct");
        right.classList.add("correct");

        // Bloquea interacción futura
        left.disabled = true;
        right.disabled = true;

        // Reduce opacidad para indicar que ya están usados
        left.style.opacity = "0.4";
        right.style.opacity = "0.4";

        // Sistema de puntuación
        score++;
        streak++;

        // Subida de nivel cada 3 aciertos seguidos
        if (streak % 3 === 0) level++;

        // Guarda este match en el ciclo
        cycleButtons.push(left, right);
        matchCount++;

        // Lógica de rotación de pares
        checkCycle();

    } else {

        // Marca error visual
        left.classList.add("wrong");
        right.classList.add("wrong");

        // Reinicia racha
        streak = 0;

        // Limpia error después de un delay
        setTimeout(() => {

            left.classList.remove("wrong");
            right.classList.remove("wrong");

            // Restaura estilo base
            left.style.background = "#334155";
            right.style.background = "#334155";

        }, 400);
    }

    // =========================
    // ACTUALIZA UI
    // =========================
    updateUI();

    // =========================
    // RESET SELECCIÓN
    // =========================
    selectedLeft = null;
    selectedRight = null;
}

// =========================
// CYCLE RESET
// =========================
function checkCycle() {

    if (matchCount >= 4) {

        const usedButtons = cycleButtons.slice(-8);

        let pairsToReplace = [];

        for (let i = 0; i < usedButtons.length; i += 2) {
            pairsToReplace.push({
                enBtn: usedButtons[i],
                esBtn: usedButtons[i + 1]
            });
        }

        const newPairs = shuffle([...words]).slice(0, 4);

        pairsToReplace.forEach((slot, index) => {

            const pair = newPairs[index];

            slot.enBtn.classList.remove("correct", "wrong");
            slot.enBtn.disabled = false;
            slot.enBtn.style.opacity = "1";
            slot.enBtn.style.background = "#334155";
            slot.enBtn.textContent = pair.en;
            slot.enBtn.dataset.id = pair.id;

            slot.esBtn.classList.remove("correct", "wrong");
            slot.esBtn.disabled = false;
            slot.esBtn.style.opacity = "1";
            slot.esBtn.style.background = "#334155";
            slot.esBtn.textContent = pair.es;
            slot.esBtn.dataset.id = pair.id;
        });

        cycleButtons = cycleButtons.slice(0, -8);
        matchCount = 0;
    }
}

// =========================
// UI
// =========================
function updateUI() {
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    levelEl.textContent = level;
}

// =========================
// SHUFFLE
// =========================
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// =========================
// TIMER (FIXEADO)
// =========================
function startTimer() {

    if (!timerEl) {
        console.error("timerEl no existe");
        return;
    }

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    timer = 30;
    timerEl.textContent = timer;

    timerInterval = setInterval(() => {

        timer--;
        timerEl.textContent = timer;

        if (timer <= 0) {

            clearInterval(timerInterval);
            timerInterval = null;

            endGame();
        }

    }, 1000);
}

// =========================
// END GAME
// =========================
function endGame() {

    const panel = document.getElementById("gameOverScreen");
    if (panel) panel.style.display = "flex";

    const finalScore = document.getElementById("finalScore");
    if (finalScore) finalScore.textContent = score;

    cycleButtons.forEach(btn => btn.disabled = true);

    selectedLeft = null;
    selectedRight = null;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// =========================
// RESTART
// =========================
function restartGame() {

    document.getElementById("gameOverScreen").style.display = "none";

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    score = 0;
    streak = 0;
    level = 1;
    matchCount = 0;

    selectedLeft = null;
    selectedRight = null;

    updateUI();
    buildBoard();
    startTimer();
}