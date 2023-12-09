"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ip;
var wallet;
function dox() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://ipapi.co/json/");
            const data = yield response.json();
            console.log(data);
            const elementIP = document.getElementById("ip");
            const elementProvider = document.getElementById("provider");
            const elementCountry = document.getElementById("country");
            const elementRegion = document.getElementById("region");
            const elementCity = document.getElementById("city");
            const elementPostal = document.getElementById("postal");
            if (isVPN(data.ip)) {
                if (elementIP)
                    elementIP.innerHTML += data.ip + "(VPN Detectada)";
                if (elementProvider)
                    elementProvider.innerHTML += data.org + "(VPN Detectada)";
                if (elementCountry)
                    elementCountry.innerHTML += data.country_name + "(VPN Detectada)";
                if (elementRegion)
                    elementRegion.innerHTML += data.region + "(VPN Detectada)";
                if (elementCity)
                    elementCity.innerHTML += data.city + "(VPN Detectada)";
                if (elementPostal)
                    elementPostal.innerHTML += data.postal + "(VPN Detectada)";
            }
            else {
                if (elementIP)
                    elementIP.innerHTML += data.ip;
                if (elementProvider)
                    elementProvider.innerHTML += data.org;
                if (elementCountry)
                    elementCountry.innerHTML += data.country_name;
                if (elementRegion)
                    elementRegion.innerHTML += data.region;
                if (elementCity)
                    elementCity.innerHTML += data.city;
                if (elementPostal)
                    elementPostal.innerHTML += data.postal;
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
// Resto del código ...
//onload="dox();"

const autocompleteSuggestion = document.getElementById("autocomplete-suggestion");
function isVPN(ipAddress) {
    const octets = ipAddress.split('.');
    if (octets.length !== 4) {
        return false;
    }
    const firstOctet = parseInt(octets[0], 10);
    const secondOctet = parseInt(octets[1], 10);
    switch (firstOctet) {
        case 10:
            return true;
        case 172:
            return secondOctet >= 16 && secondOctet <= 31;
        case 192:
            return secondOctet === 168;
        default:
            return false;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield dox();
        const input = document.querySelector("#input");
        const output = document.querySelector("#output");
        const consoleDiv = document.querySelector(".tube-screen");
        let isFirstEnter = true;
        if (!input || !output || !consoleDiv) {
            console.error('Required DOM elements are missing');
            return; // exit the function if any required element is missing
        }
        const commands = {
            "hola": function () {
                const response = document.createElement("p");
                response.textContent = "¡Hola a ti también!";
                output.appendChild(response);
            },
            "projects": function() {
                console.log("Comando 'projects' activado"); // Mensaje de diagnóstico
            
                const projectsContainer = document.getElementById("projects-container");
                projectsContainer.classList.add("hacker");
                if (!projectsContainer) {
                    console.error("No se encontró el elemento 'projects-container'");
                    return;
                }
                
                projectsContainer.innerHTML = ''; // Limpia el contenedor
            
                const projects = [
                    { name: "Controldiabetes", description: "Description for Project 1.", images: [] },
                    { name: "Gestor de nodos de Lukso", description: "Description for Project 2.", images: ["flask.png", "python.png", "web3js.png"] }, // Arreglo de imágenes
                    { name: "Project 3", description: "Description for Project 3.", images: [] },
                    // Agrega más proyectos aquí
                ];
            
                projects.forEach(project => {
                    const projectDiv = document.createElement("div");
                    projectDiv.className = "project";
            
                    const projectName = document.createElement("h3");
                    projectName.textContent = project.name;
                    projectDiv.appendChild(projectName);
            
                    project.images.forEach(imageSrc => { // Itera sobre el arreglo de imágenes
                        const projectImage = document.createElement("img");
                        projectImage.src = imageSrc;
                        projectImage.style = "width: 60px; height: 30px; margin: 5px;"; // Estilos para cada imagen
                        projectDiv.appendChild(projectImage);
                    });
            
                    const projectDesc = document.createElement("p");
                    projectDesc.textContent = project.description;
                    projectDiv.appendChild(projectDesc);
            
                    projectsContainer.appendChild(projectDiv);
                });
            
                console.log("Proyectos agregados al contenedor");
            },
            
        
            "cls": function () {
                output.innerHTML = "";
            }, "web3": function () {
                const p = document.createElement("p");
                p.textContent = "Inicializando web3...";
                connectMeta();
                output.appendChild(p);
            },
            "clear": function () {
                commands["cls"]();
            },
            "help": function () {
                const p = document.createElement("p");
                const commandList = Object.keys(commands).join(", ");
                p.textContent = "Comandos disponibles: " + commandList;
                output.appendChild(p);
            },
            "tree": function () {
                const tree = {
                    name: "root",
                    children: [
                        {
                            name: "folder1",
                            children: [
                                { name: "file1.txt" },
                                { name: "file2.txt" }
                            ]
                        },
                        {
                            name: "folder2",
                            children: [
                                {
                                    name: "subfolder1",
                                    children: [
                                        { name: "file3.txt" },
                                        { name: "file4.txt" }
                                    ]
                                },
                                { name: "file5.txt" }
                            ]
                        },
                        { name: "file6.txt" }
                    ]
                };
                const indentString = "  ";
                function generateTreeHTML(node, indent = "") {
                    let html = indent + node.name + "<br>";
                    if (node.children) {
                        const childIndent = indent + indentString;
                        node.children.forEach((child, index) => {
                            const isLastChild = index === node.children.length - 1; // Note the '!' after 'node.children'
                            const childPrefix = indent + (isLastChild ? "└─ " : "├─ ");
                            html += childPrefix + generateTreeHTML(child, childIndent);
                        });
                    }
                    return html;
                }
                const treeHTML = generateTreeHTML(tree);
                output.innerHTML += treeHTML;
            }
        };

        function updateAutocompleteSuggestion() {
            const inputText = input.value;
            autocompleteSuggestion.textContent = ''; // Limpia la sugerencia anterior.
            if (inputText.trim() !== "") {
                const matchingCommands = Object.keys(commands).filter(cmd => cmd.startsWith(inputText));
                if (matchingCommands.length === 1) {
                    // Muestra la parte del comando que falta para completarse.
                    const suggestion = matchingCommands[0].substring(inputText.length);
                    autocompleteSuggestion.textContent = suggestion;
                }
            }
        }

        input.addEventListener("input", updateAutocompleteSuggestion);

        consoleDiv.addEventListener("mousedown", function () {
            setTimeout(function () { input.focus(); }, 10);
        });

        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const command = input.value;
                input.value = "";
                autocompleteSuggestion.textContent = ''; // Limpia la sugerencia.
                if (command.trim() === "" && isFirstEnter) {
                    isFirstEnter = false;
                    return;
                }
                isFirstEnter = false;
                const p = document.createElement("p");
                p.textContent = "puga@page: " + command;
                output.appendChild(p);
                if (command in commands) {
                    const commandFunction = commands[command];
                    if (typeof commandFunction === 'function') {
                        commandFunction();
                    }
                } else {
                    const p = document.createElement("p");
                    p.textContent = "Comando desconocido: " + command;
                    output.appendChild(p);
                }
            } else if (e.key === "Tab") {
                e.preventDefault();
                const inputText = input.value;
                if (inputText.trim() !== "") {
                    const matchingCommands = Object.keys(commands).filter(cmd => cmd.startsWith(inputText));
                    if (matchingCommands.length === 1) {
                        input.value = matchingCommands[0];
                        autocompleteSuggestion.textContent = ''; // Limpia la sugerencia.
                    }
                }
            }
        });
    });
});



function obtenerSegundoArgumento(input) {
    const palabras = input.split(' ');
    if (palabras.length >= 2) {
        return palabras[1];
    }
    else {
        return null;
    }
}
// crea código para un boton de metamask 
/*
function createMetamaskButton() {
  const button = document.createElement("button");
  button.textContent = "Conectar con Metamask";
  button.className = "metamask-button";
  button.addEventListener("click", async function () {

    // @ts-ignore
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    wallet = account;
    console.log(account);
        // Mostrar la dirección de la billetera en la página
        const addressContainer = document.getElementById("wallet-address");
        if (addressContainer) {
          addressContainer.textContent = "Dirección de la billetera: " + account;
        }
      });
  

  

  return button;
}

function meta(){
  const buttonContainer = document.getElementById("button-container");
  //fix button is possibly null typescript errorr
  if (buttonContainer)
    buttonContainer.appendChild(createMetamaskButton());
}

meta();

*/
// conecta con metamask
function connectMeta() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore
            const accounts = yield ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];
            wallet = account;
            console.log(account);
            // Mostrar la dirección de la billetera en la página
            const addressContainer = document.getElementById("wallet-address");
            if (addressContainer) {
                addressContainer.textContent = "Dirección de la billetera: " + account;
            }
        }
        catch (error) {
            console.error("Error al conectar con MetaMask:", error);
            // Mostrar mensaje de error en la página
            const addressContainer = document.getElementById("output");
            if (addressContainer) {
                const p = document.createElement("p");
                p.textContent = "Error al conectar con MetaMask ❌";
                addressContainer.appendChild(p);
            }
        }
    });
}


