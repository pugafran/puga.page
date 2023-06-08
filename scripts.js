var ip;

async function dox() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    console.log(data);

    if (isVPN(data.ip)) {
      document.getElementById("ip").innerHTML += data.ip + "(VPN Detectada)";
      document.getElementById("provider").innerHTML += data.org + "(VPN Detectada)";
      document.getElementById("country").innerHTML += data.country_name + "(VPN Detectada)";
      document.getElementById("region").innerHTML += data.region + "(VPN Detectada)";
      document.getElementById("city").innerHTML += data.city + "(VPN Detectada)";
      document.getElementById("postal").innerHTML += data.postal + "(VPN Detectada)";
    } else {
      document.getElementById("ip").innerHTML += data.ip;
      ip = data.ip;
      document.getElementById("provider").innerHTML += data.org;
      document.getElementById("country").innerHTML += data.country_name;
      document.getElementById("region").innerHTML += data.region;
      document.getElementById("city").innerHTML += data.city;
      document.getElementById("postal").innerHTML += data.postal;

    }
  } catch (error) {
    console.error(error);
  }
}

// Resto del código ...



//onload="dox();"

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


  document.addEventListener("DOMContentLoaded", async function () {
    await dox();
  
    const input = document.querySelector("#input");
    const output = document.querySelector("#output");
   
    const consoleDiv = document.querySelector(".tube-screen");

    
  
    const commands = {
      "hola": function () {
        const response = document.createElement("p");
        response.textContent = "¡Hola a ti también!";
        output.appendChild(response);
      },
      "cls": function () {
        output.innerHTML = "";
      },
      "clear": function () {
        commands["cls"]();
      },
      "help": function () {
        const p = document.createElement("p");
        const commandList = Object.keys(commands).join(', ');
        p.textContent = "Comandos disponibles: " + commandList;
        output.appendChild(p);
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
        const p = document.createElement("p");
        p.textContent = "@puga.page: " + command;
        output.appendChild(p);
  
        const commandFunction = commands[command];
  
        if (commandFunction) {
          commandFunction();
        } else {
          const p = document.createElement("p");
          p.textContent = "Comando desconocido: " + command;
          output.appendChild(p);
        }
  
        input.value = "";
      }
    });
  });
  
  
  

  
  
  