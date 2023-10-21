// Suponiendo que tenemos un conjunto de preguntas básicas
const preguntas = [
    {
        pregunta: "Las cuestiones que se responden en la estrategia de servicio son:",
        opciones: [
            "¿Qué servicios deberíamos ofrecer y a quién?",
            "¿Cómo nos diferenciamos de la competencia?",
            "¿Cómo creamos valor para nuestros clientes?",
            "Todas son ciertas"
        ],
        respuesta: 3 // La opción 'd' es la correcta, y como el índice comienza en 0, entonces es 3.
    },
    {
        pregunta: "El servicio de actualización de un sistema operativo es de tipo:",
        opciones: [
            "Base",
            "Mejorado-Complementario",
            "Homologado-Habilitante",
            "Crítico"
        ],
        respuesta: 1 // La opción 'b' es la correcta.
    },
    {
        pregunta: "El análisis DAFO se emplea:",
        opciones: [
            "En la fase de estrategia para analizar la situación actual",
            "Se emplea en la fase de transición para planificar los cambios",
            "Tiene en cuenta factores externos a la empresa e internos",
            "a y c son ciertas"
        ],
        respuesta: 3 // La opción 'd' es la correcta.
    },
    {
        pregunta: "La cartera de servicios incluye:",
        opciones: [
            "Servicios en estudio(proyecto), servicios retirados y servicios en producción",
            "Servicios en producción",
            "Servicios críticos y servicios de alto valor",
            "Servicios personalizados a cada perfil de cliente"
        ],
        respuesta: 0 // La opción 'a' es la correcta.
    },
    {
        pregunta: "Los procesos asociados directamente a la fase de Estrategia son:",
        opciones: [
            "Gestión Financiera, Gestión de Relaciones con el Negocio, Gestión del Portfolio de Servicios y Gestión de la Demanda",
            "Gestión Financiera, Gestión de Niveles de Servicio y Gestión del Portfolio de Servicios",
            "En la fase de estrategia sólo se contemplan funciones",
            "Gestión del cambio, Gestión de la disponibilidad y Gestión de la Cartera de Servicios"
        ],
        respuesta: 0 // La opción 'a' es la correcta.
    },
    {
        pregunta: "¿Cómo se describen MEJOR las Funciones?",
        opciones: [
            "Una recopilación de conocimientos",
            "Sistemas de circuito cerrado",
            "Son unidades autogestionadas dentro de las organizaciones",
            "Proyectos enfocados a la transformación"
        ],
        respuesta: 2 // La opción 'c' es la correcta.
    },
    {
        pregunta: "¿Cuál de las siguientes afirmaciones es CORRECTA para todos los servicios TI?",
        opciones: [
            "Proporcionan recursos y capacidades a los clientes",
            "Proporcionan costos y riesgos a los clientes",
            "Proporcionan soluciones de negocio a los clientes",
            "Proporcionan valor a los clientes (es mas correcta que la c)"
        ],
        respuesta: 3 // La opción 'd' es la correcta.
    },

    {
        pregunta: "¿Qué, de entre lo siguiente, debería estar contenido en un Catálogo de Servicios?",
        opciones: [
            "La información de versiones de todo el software",
            "La estructura organizativa de la compañía",
            "Información de activos",
            "Detalles de todos los servicios operacionales"
        ],
        respuesta: 3 // d
    },
    {
        pregunta: "¿Qué significa 'Garantía de un Servicio'?",
        opciones: [
            "El servicio es adecuado para un propósito",
            "No habrá fallos en las aplicaciones ni en la infraestructura asociada al servicio",
            "Todos los problemas relacionados con el servicio se arreglan sin coste durante un cierto período de tiempo",
            "Garantizar al cliente un determinado nivel de disponibilidad, capacidad, continuidad y seguridad"
        ],
        respuesta: 3 // d
    },
    {
        pregunta: "La implementación de la Gestión de Servicio ITIL requiere preparar y planificar el uso efectivo y eficiente de:",
        opciones: [
            "Personas, Procesos, Asociados, Suministradores",
            "Personas, Procesos, Productos, Tecnología",
            "Personas, Procesos, Productos, Asociados (Partner)",
            "Personas, Productos, Tecnología, Asociados (Partner)"
        ],
        respuesta: 2 // c
    },
    {
        pregunta: "¿Cuál de las siguientes afirmaciones es CORRECTA?: 1 Sólo una persona puede ser el propietario de un proceso. 2 Sólo una persona puede ser la encargada de una actividad.",
        opciones: [
            "Las dos anteriores",
            "1 solo",
            "2 solo",
            "Ninguna de las anteriores"
        ],
        // Especificaciones previas: 
        respuesta: 1 // b
    },
    {
        pregunta: "¿Cuáles de las siguientes son características de todos los procesos?: 1 Es medible. 2 Se realiza en cualquier momento. 3 Proporciona un resultado específico. 4 Proporciona su resultado principal a un cliente o interesado.",
        opciones: [
            "Sólo 1, 2 y 3",
            "Sólo 1, 2 y 4",
            "Sólo 1, 3 y 4",
            "Todas las anteriores"
        ],
        // Especificaciones previas: 
        respuesta: 2 // c
    },
    {
        pregunta: "¿Cuál de las siguientes NO forma parte del núcleo de publicaciones de ITIL?",
        opciones: [
            "Optimización del Servicio",
            "Transición del Servicio",
            "Diseño del Servicio",
            "Estrategia del Servicio"
        ],
        respuesta: 0 // a
    },

    {
        pregunta: "¿En qué libro de la publicación principal puede encontrar descripción detallada de Gestión de Demanda y Gestión Financiera?",
        opciones: [
            "Operación de Servicio",
            "Estrategia del Servicio",
            "Transición del Servicio",
            "Mejora Continua del Servicio"
        ],
        respuesta: 1 // b
    },
    {
        pregunta: "¿En cuál fase del Ciclo de Vida del Servicio se decide qué servicios deberíamos de ofertar y a quién se los vamos a ofrecer?",
        opciones: [
            "Mejora Continua del Servicio",
            "Operación del Servicio",
            "Diseño del Servicio",
            "Estrategia del Servicio"
        ],
        respuesta: 3 // d
    },
    {
        pregunta: "Las principales tareas del proceso gestión financiera son:",
        opciones: [
            "Presupuestar, gestionar acuerdos de nivel de servicio y facturar",
            "Presupuestar, contabilizar y gestionar recursos",
            "Presupuestar, contabilizar y facturar",
            "Gestionar las relaciones con los proveedores, gestionar las relaciones con los clientes y facturar"
        ],
        respuesta: 2 // c
    },
    {
        pregunta: "La gestión de relaciones con el negocio:",
        opciones: [
            "Es una función de la Estrategia del Servicio",
            "Estable y mantiene relaciones entre el servicio y los proveedores",
            "Es un proceso de Operación del Servicio",
            "Es un proceso de la Estrategia del Servicio"
        ],
        respuesta: 3 // d
    },
    {
        pregunta: "¿Cuál afirmación es CORRECTA en referencia a la Creación de Valor por medio de servicios?",
        opciones: [
            "La percepción del cliente respecto del servicio es un factor importante en la Creación de Valor",
            "El valor de un servicio solo puede medirse en términos financieros",
            "Entregar los resultados esperados del cliente no resulta importante en el valor de un servicio",
            "Las preferencias no son un factor a tener en cuenta en la Creación de Valor"
        ],
        respuesta: 0 // a
    },
    {
        pregunta: "¿Cuáles de los siguientes roles asegura el modelo RACI para los procesos?",
        opciones: [
            "Responsable, Autorizador, Consultado, Informado",
            "Responsable, Factible, Consultado, Informado",
            "Realístico, Autorizador, Consultado, Informado",
            "Responsable, Autorizador, Correcto, Informado"
        ],
        respuesta: 0 // a
    },
    {
        pregunta: "¿Cuál de las siguientes afirmaciones sobre ITIL no es cierta?",
        opciones: [
            "Facilita la gestión de la calidad de los servicios TI",
            "Establece un vínculo entre el departamento de TI y el departamento de Negocio",
            "Es un estándar",
            "Mejora la eficacia, la eficiencia y reduce los riesgos"
        ],
        respuesta: 2 // c
    }
];


let preguntaActual = 0;
let correctas = 0;

function iniciarCuestionario() {
    // Si hemos llegado al final del cuestionario, mostramos el resultado
    if (preguntaActual >= preguntas.length) {
        mostrarResultado();
        return;
    }

    const preguntaObj = preguntas[preguntaActual];
    const preguntaDiv = document.getElementById("pregunta");
    const opcionesDiv = document.getElementById("opciones");

    preguntaDiv.textContent = preguntaObj.pregunta;

    // Limpiar opciones anteriores primero
    opcionesDiv.innerHTML = "";

    preguntaObj.opciones.forEach((opcion, index) => {
        const boton = document.createElement("button");
        boton.textContent = opcion;
        boton.onclick = () => verificarRespuesta(index);
        opcionesDiv.appendChild(boton);
    });
}

function verificarRespuesta(indice) {
    const preguntaObj = preguntas[preguntaActual];
    const mensajeError = document.getElementById("mensaje-error");

    mensajeError.textContent = ""; // Limpiar mensajes de error anteriores
    mensajeError.style = "";

    // Chequear si la respuesta es correcta
    if (indice === preguntaObj.respuesta) {
        correctas++;
    } else {
        // Construir mensaje de error legible
        let mensaje = "Incorrecto. La respuesta correcta es: '" + preguntaObj.opciones[preguntaObj.respuesta] + "'.";

        // Añadir un poco de formato al mensaje de error
        mensajeError.innerHTML = `
            <strong>Pregunta:</strong> ${preguntaObj.pregunta} <br/>
            <strong>Tu selección:</strong> ${preguntaObj.opciones[indice]} <br/>
            <strong>${mensaje}</strong>
        `;

        // Aplicar estilo al mensaje si es necesario
        mensajeError.style.color = "red";
        mensajeError.style.padding = "10px";
        mensajeError.style.margin = "10px 0";
        mensajeError.style.border = "1px solid red";
        mensajeError.style.backgroundColor = "#fee";
    }

    // Avanzar a la siguiente pregunta o finalizar si es la última
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        iniciarCuestionario(); // Siguiente pregunta
    } else {
        mostrarResultado(); // Mostrar resultados al finalizar
    }
}

function mostrarResultado() {
    
    const mensajeError = document.getElementById("mensaje-error");
    mensajeError.textContent = ""; // Limpiar mensajes de error anteriores
    mensajeError.style = "";

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = "<p>Tu nota es: " + (correctas / preguntas.length) * 10 + "</p>";

    const reiniciarBtn = document.createElement("button");
    reiniciarBtn.textContent = "Reiniciar Cuestionario";
    reiniciarBtn.onclick = reiniciarCuestionario;
    resultadoDiv.appendChild(reiniciarBtn);
}

function reiniciarCuestionario() {
    // Reiniciar las variables
    correctas = 0;
    preguntaActual = 0;

    // Mezclar las preguntas
    preguntas.sort(() => Math.random() - 0.5);

    // Reiniciar la interfaz del cuestionario
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.textContent = "";

    iniciarCuestionario(); // Reiniciar el cuestionario
}

// Cuando se carga la página, iniciamos el cuestionario
window.onload = reiniciarCuestionario;
