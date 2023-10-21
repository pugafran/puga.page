var ip;
var wallet;
async function dox() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    console.log(data);

    const elementIP = document.getElementById("ip");
    const elementProvider = document.getElementById("provider");
    const elementCountry = document.getElementById("country");
    const elementRegion = document.getElementById("region");
    const elementCity = document.getElementById("city");
    const elementPostal = document.getElementById("postal");

    if (isVPN(data.ip)) {
      if (elementIP) elementIP.innerHTML += data.ip + "(VPN Detectada)";
      if (elementProvider) elementProvider.innerHTML += data.org + "(VPN Detectada)";
      if (elementCountry) elementCountry.innerHTML += data.country_name + "(VPN Detectada)";
      if (elementRegion) elementRegion.innerHTML += data.region + "(VPN Detectada)";
      if (elementCity) elementCity.innerHTML += data.city + "(VPN Detectada)";
      if (elementPostal) elementPostal.innerHTML += data.postal + "(VPN Detectada)";
    } else {
      if (elementIP) elementIP.innerHTML += data.ip;
      if (elementProvider) elementProvider.innerHTML += data.org;
      if (elementCountry) elementCountry.innerHTML += data.country_name;
      if (elementRegion) elementRegion.innerHTML += data.region;
      if (elementCity) elementCity.innerHTML += data.city;
      if (elementPostal) elementPostal.innerHTML += data.postal;
    }
  } catch (error) {
    console.error(error);
  }
}


// Resto del código ...



//onload="dox();"

function isVPN(ipAddress: string) {
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


  document.addEventListener("DOMContentLoaded", async function () {
    await dox();
  
    const input = document.querySelector("#input") as HTMLInputElement;
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
      "cls": function () {
        output.innerHTML = "";
      },      "web3": function () {
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
        
        interface Node {
          name: string;
          children?: Node[];
        }
        
        interface Node {
          name: string;
          children?: Node[];
        }
        
        function generateTreeHTML(node: Node, indent = "") {
          let html = indent + node.name + "<br>";
          
          if (node.children) {
            const childIndent = indent + indentString;
          
            node.children!.forEach((child: Node, index: number) => { // Note the '!' after 'node.children'
              const isLastChild = index === node.children!.length - 1; // Note the '!' after 'node.children'
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
  
    consoleDiv.addEventListener("mousedown", function () {
      setTimeout(function () {
        input.focus();
      }, 10);
    });
  
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const command = input.value;
        input.value = "";
    
        if (command.trim() === "" && isFirstEnter) {
          isFirstEnter = false;
          return;
        }
    
        isFirstEnter = false;
    
        const p = document.createElement("p");
        p.textContent = "puga@page: " + command;
        output.appendChild(p);
    
        if (command in commands) {
          const commandFunction = commands[command as keyof typeof commands];
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
          }
        }
      }
    });
    
  });
  
  
  
  function obtenerSegundoArgumento(input: string) {
    const palabras = input.split(' ');
    
    if (palabras.length >= 2) {
      return palabras[1];
    } else {
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
async function connectMeta() {
  try {
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
  } catch (error) {
    console.error("Error al conectar con MetaMask:", error);
    
    // Mostrar mensaje de error en la página
    const addressContainer = document.getElementById("output");
    if (addressContainer) {
      
      const p = document.createElement("p");
     p.textContent = "Error al conectar con MetaMask ❌";
     addressContainer.appendChild(p);
    }
  }
}
