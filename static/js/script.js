console.log("SCRIPT CARGADO");

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupTopbar();

        setupDots();

    }
);

// ================= TOPBAR =================

function setupTopbar() {

    const buttons =
        document.querySelectorAll(".topbar a");

    console.log(
        "botones encontrados:",
        buttons.length
    );

    if (!buttons.length)
        return;

    buttons.forEach(btn => {

        // ================= HOVER =================
        btn.addEventListener(
            "mouseenter",
            () => {
                btn.classList.add("hover");
            }
        );

        btn.addEventListener(
            "mouseleave",
            () => {
                btn.classList.remove("hover");
            }
        );

        // ================= CLICK =================
        btn.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                setActive(btn);

                const action =
                    btn.dataset.action;

                if (!action) {

                    console.warn(
                        "Boton sin data-action"
                    );

                    return;
                }

                handleButton(action);

            }
        );

    });

}

// ================= UI STATE =================

function setActive(activeBtn) {

    const buttons =
        document.querySelectorAll(".topbar a");

    buttons.forEach(btn => {

        btn.classList.remove("selected");
        btn.classList.remove("hover");

    });

    activeBtn.classList.add("selected");

}

// ================= HANDLER =================

function handleButton(action) {

    console.log(
        "CLICK ACTION:",
        action
    );

    switch (action) {

        // ================= ABOUT =================
        case "about":

            window.location.href =
                "/about";

            break;

        // ================= LOGIN =================
        case "login":

            window.location.href =
                "/login";

            break;

        // ================= REGISTER =================
        case "register":

            window.location.href =
                "/register";

            break;

        // ================= USUARIOS =================
        case "usuarios":

            window.location.href =
                "/usuarios";

            break;

        // ================= DEFAULT =================
        default:

            console.warn(
                "Accion no definida:",
                action
            );

            break;

    }

}

// ================= DOT IMAGES =================

const imageList = [

    "/static/img/img1.jpg",
    "/static/img/img2.jpg",
    "/static/img/img3.jpg",
    "/static/img/img4.jpg",
    "/static/img/img5.jpg"

];

// ================= SETUP DOTS =================

function setupDots() {

    const dots =
        document.querySelectorAll(".nav-item");

    const displayImage =
        document.getElementById("displayImage");

    if (!dots.length || !displayImage)
        return;

    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                // ================= REMOVE ACTIVE =================
                dots.forEach(d => {
                    d.classList.remove("active");
                });

                // ================= NEW ACTIVE =================
                dot.classList.add("active");

                // ================= IMAGE ANIMATION =================
                displayImage.style.opacity = "0";

                setTimeout(() => {

                    displayImage.src =
                        imageList[index];

                    displayImage.style.opacity = "1";

                }, 200);

            }
        );

    });

    const words = [
    { en: "Dog", es: "Perro" },
    { en: "Cat", es: "Gato" },
    { en: "Water", es: "Agua" },
    { en: "House", es: "Casa" },
    { en: "Book", es: "Libro" }
];

let current = {};
let score = 0;

const mainWord = document.getElementById("mainWord");
const answers = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const langTag = document.getElementById("langTag");

function newRound() {

    answers.innerHTML = "";

    current = words[Math.floor(Math.random() * words.length)];

    mainWord.textContent = current.en;

    const options = shuffle([
        current.es,
        "Perro",
        "Casa",
        "Agua"
    ]);

    options.forEach(opt => {

        const btn = document.createElement("button");

        btn.classList.add("answer-btn");
        btn.textContent = opt;

        btn.onclick = () => checkAnswer(btn, opt);

        answers.appendChild(btn);

    });

}

function checkAnswer(btn, answer) {

    if (answer === current.es) {

        btn.classList.add("correct");

        score++;

        scoreEl.textContent = score;

        setTimeout(newRound, 500);

    } else {

        btn.classList.add("wrong");

    }

}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

newRound();

}