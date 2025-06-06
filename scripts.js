"use strict";
const words = "Welcome to puga page";
const ANIMATION_DURATION = 4000;

words.split("").forEach((char, i) => {
  function createElement(offset) {
    const div = document.createElement("div");
    div.innerText = char;
    div.classList.add("character");
    div.style.animationDelay = `-${i * (ANIMATION_DURATION / 16) - offset}ms`;
    return div;
  }
  document.getElementById("spiral").append(createElement(0));
  document.getElementById("spiral2").append(createElement(-1 * (ANIMATION_DURATION / 2)));
});

const consoleOutput = document.getElementById("output");
const consoleInput = document.getElementById("input");
const autocompleteSuggestion = document.getElementById("autocomplete-suggestion");

const commands = {
  help: () => "Comandos disponibles:\nhelp, whoami, projects, clear, web3, date",
  whoami: () => "User: Francisco Gabriel Puga Lojo\nRole: Faltan cosas todavía",
  projects: () => "- controldiabet.es\n- gestor de nodos de lukso\n- prácticas solidity",
  clear: () => {
    consoleOutput.innerHTML = "";
    return "";
  },
  web3: () => {
    connectMeta();
    return "Inicializando Web3...";
  },
  date: () => new Date().toString()
};

function appendToConsole(text, isCommand = false) {
  const p = document.createElement("p");
  if (isCommand) {
    p.innerHTML = `<span class="text-green-500">puga@page:~$</span> ${text}`;
  } else {
    p.innerHTML = text.replace(/\n/g, "<br>");
  }
  consoleOutput.appendChild(p);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

consoleInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = consoleInput.value.trim();
    appendToConsole(command, true);
    consoleInput.value = "";
    autocompleteSuggestion.textContent = "";
    if (command in commands) {
      const out = commands[command]();
      if (out) appendToConsole(out);
    } else if (command !== "") {
      appendToConsole(`bash: command not found: ${command}`);
    }
    setTimeout(() => consoleInput.focus(), 0);
  } else if (e.key === "Tab") {
    e.preventDefault();
    const inputText = consoleInput.value.trim();
    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(inputText));
    if (matches.length === 1) {
      consoleInput.value = matches[0];
      autocompleteSuggestion.textContent = "";
    }
  }
});

consoleInput.addEventListener("input", () => {
  const text = consoleInput.value.trim();
  const match = Object.keys(commands).find(cmd => cmd.startsWith(text));
  autocompleteSuggestion.textContent = match ? match.substring(text.length) : "";
});

function connectMeta() {
  if (typeof ethereum !== 'undefined') {
    ethereum.request({ method: "eth_requestAccounts" })
      .then(accounts => {
        const walletAddress = accounts[0];
        appendToConsole("Wallet conectada: " + walletAddress);
        document.getElementById("wallet-value").textContent = walletAddress;
      })
      .catch(err => {
        appendToConsole("Error al conectar con MetaMask ❌");
        console.error(err);
      });
  } else {
    appendToConsole("MetaMask no está disponible.");
  }
}

function dox() {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      const isVpn = isVPN(data.ip);
      const suffix = isVpn ? " (VPN Detectada)" : "";

      document.getElementById("ip-value").textContent = data.ip + suffix;
      document.getElementById("provider-value").textContent = data.org + suffix;
      document.getElementById("country-value").textContent = data.country_name + suffix;
      document.getElementById("region-value").textContent = data.region + suffix;
      document.getElementById("city-value").textContent = data.city + suffix;
      document.getElementById("postal-value").textContent = data.postal + suffix;
    })
    .catch(err => {
      console.error("Error en dox:", err);
    });
}

function isVPN(ip) {
  return ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.");
}

function typeWriter(text, elementId, delay = 50, callback) {
  const element = document.getElementById(elementId);
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, delay);
    } else if (callback) {
      callback();
    }
  }
  typing();
}

document.addEventListener("DOMContentLoaded", () => {
  dox(); // Ejecuta tu función de IP como antes
  typeWriter(
    "Bienvenido, estás en la página web de Francisco Gabriel Puga Lojo.",
    "typewriter-text",
    40,
    () => {
      setTimeout(() => {
        typeWriter(
          "Escribe 'help' para ver comandos disponibles.",
          "typewriter-subtext",
          40
        );
      }, 400); // Pequeña pausa antes de escribir la segunda línea
    }
  );
});


consoleInput.addEventListener("input", () => {
  const text = consoleInput.value;
  const match = Object.keys(commands).find(cmd => cmd.startsWith(text));
  autocompleteSuggestion.textContent = match ? text + match.substring(text.length) : "";
});

