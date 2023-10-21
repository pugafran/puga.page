const questions = [
    {
        question: "1. Las cuestiones que se responden en la estrategia de servicio son:",
        options: ["a) ¿Qué servicios deberíamos ofrecer y a quién?", "b) ¿Cómo nos diferenciamos de la competencia?", "c) ¿Cómo creamos valor para nuestros clientes?", "d) Todas son ciertas"],
    },
    {
        question: "2. El servicio de actualización de un sistema operativo es de tipo:",
        options: ["a) Base", "b) Mejorado-Complementario", "c) Homologado-Habilitante", "d) Crítico"],
    },
    // ...agregar más preguntas aquí
];

let currentQuestion = 0;

function showQuestion() {
    const questionText = document.getElementById("question");
    const optionsContainer = document.getElementById("options");

    questionText.textContent = questions[currentQuestion].question;
    optionsContainer.innerHTML = ""; // Limpiar opciones anteriores

    // Mostrar opciones para la pregunta actual
    questions[currentQuestion].options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = function () {
            // Lógica al seleccionar la opción
            // Aquí puedes verificar la respuesta o almacenar la elección del usuario
        };
        optionsContainer.appendChild(button);
    });
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        // Examen terminado, mostrar resultados o mensaje de finalización
        document.getElementById("quiz").innerHTML = "<h2>Examen completado</h2>"; // O mostrar resultados
    }
}

// Iniciar examen mostrando la primera pregunta
showQuestion();
