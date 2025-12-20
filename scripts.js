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
  help: () => "Comandos disponibles:\nhelp, whoami, projects, clear, web3, date, chat, ls, cd, cat",
  whoami: () => "User: Francisco Gabriel Puga Lojo\nRole: Faltan cosas todavía",
  projects: () => {
    window.location.href = "projects.html";
    return "Cargando proyectos...";
  },
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
    const input = consoleInput.value.trim();
    if (!input) return; 

    consoleInput.value = "";
    autocompleteSuggestion.textContent = "";

    if (isChatMode) {
      handleChat(input);
    } else {
      appendToConsole(input, true);
      
      const parts = input.split(" ").filter(p => p.length > 0);
      const command = parts[0];
      const args = parts.slice(1);

      if (command in commands) {
        const out = commands[command](args);
        if (out) appendToConsole(out);
      } else {
        appendToConsole(`bash: command not found: ${command}`);
      }
    }
    
    setTimeout(() => consoleInput.focus(), 0);
  } else if (e.key === "Tab" && !isChatMode) { // Disable autocomplete in chat mode
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
  var _a;
  const provider = (_a = window) === null || _a === void 0 ? void 0 : _a.ethereum;
  const walletValue = document.getElementById("wallet-value");
  if (!provider) {
    appendToConsole("MetaMask no está disponible.");
    return;
  }
  provider
    .request({ method: "eth_requestAccounts" })
    .then(accounts => {
      if (!accounts || accounts.length === 0) {
        appendToConsole("No se recibió ninguna cuenta de MetaMask.");
        return;
      }
      const walletAddress = accounts[0];
      appendToConsole("Wallet conectada: " + walletAddress);
      if (walletValue) {
        walletValue.textContent = walletAddress;
      }
      const walletAddressContainer = document.getElementById("wallet-address");
      if (walletAddressContainer) {
        walletAddressContainer.textContent = "Dirección de la billetera: " + walletAddress;
      }
    })
    .catch(err => {
      appendToConsole("Error al conectar con MetaMask ❌");
      console.error(err);
    });
}

// CHAT MODE VARIABLES
let isChatMode = false;
let chatSessionId = crypto.randomUUID();

// FILE SYSTEM VARIABLES
const fileSystem = {
  type: "dir",
  children: {
    "projects": {
      type: "dir",
      children: {
        "readme.txt": { type: "file", content: "Mis proyectos están en construction..." },
        "portfolio.md": { type: "file", content: "# Portfolio\n- Neonao\n- Puga Page" }
      }
    },
    "about.txt": { type: "file", content: "Soy Francisco Gabriel Puga Lojo.\nDesarrollador y entusiasta de la tecnología." },
    "contact.txt": { type: "file", content: "Email: contacto@puga.page\nGitHub: github.com/pugafran" },
    "secret_key": { type: "file", content: "0x1234..." }
  }
};

let currentPath = []; // Root is empty array
let currentDir = fileSystem;

// HELPERS
function getDir(pathArray) {
  let dir = fileSystem;
  for (const part of pathArray) {
    if (dir.children && dir.children[part]) {
      dir = dir.children[part];
    } else {
      return null;
    }
  }
  return dir;
}

function updatePrompt() {
  const pathStr = currentPath.length === 0 ? "~" : "~/" + currentPath.join("/");
  const inputContainer = document.querySelector("#input").parentElement.parentElement;
  const promptSpan = inputContainer.querySelector("span");
  if (promptSpan && !isChatMode) {
      promptSpan.innerHTML = `puga@page:${pathStr}$`;
  }
}

// EXTEND COMMANDS WITH FS
commands.ls = () => {
  if (currentDir.type !== "dir") return "Not a directory";
  const items = Object.keys(currentDir.children || {}).map(name => {
    const isDir = currentDir.children[name].type === "dir";
    return isDir ? `<span class="text-blue-500">${name}/</span>` : name;
  });
  return items.join("  ");
};

commands.cd = (args) => {
  if (!args || args.length === 0) {
    currentPath = [];
    currentDir = fileSystem;
    updatePrompt();
    return "";
  }
  const target = args[0];
  if (target === "/") {
    currentPath = [];
    currentDir = fileSystem;
  } else if (target === "..") {
    if (currentPath.length > 0) {
      currentPath.pop();
      currentDir = getDir(currentPath);
    }
  } else {
    // Determine path parts to handle multi-level cd if needed, logic simplified for single level relative mostly
    // For now assuming simple one-level navigation or absolute from root if starts with / (not impl here strictly yet)
    // Let's support simple relative naming
    if (currentDir.children && currentDir.children[target] && currentDir.children[target].type === "dir") {
      currentPath.push(target);
      currentDir = currentDir.children[target];
    } else {
      return `bash: cd: ${target}: No such file or directory`;
    }
  }
  updatePrompt();
  return "";
};

commands.cat = (args) => {
    if (!args || args.length === 0) return "Usage: cat <filename>";
    const filename = args[0];
    if (currentDir.children && currentDir.children[filename]) {
        const node = currentDir.children[filename];
        if (node.type === "file") {
            return node.content;
        } else {
            return `cat: ${filename}: Is a directory`;
        }
    }
    return `cat: ${filename}: No such file or directory`;
}

// EXTEND COMMANDS WITH CHAT
commands.chat = () => {
  isChatMode = true;
  chatSessionId = crypto.randomUUID(); // New session on start
  // Visual indicator for chat mode
  const inputContainer = document.querySelector("#input").parentElement.parentElement;
  // We need to be careful with DOM manipulation here. The prompt is:
  // <span class="text-green-500 mr-2 whitespace-nowrap">puga@page:~$</span>
  // We should target that span specifically.
  const promptSpan = inputContainer.querySelector("span");
  if(promptSpan) {
     promptSpan.innerHTML = "chat@neonao:~$";
     promptSpan.classList.remove("text-green-500");
     promptSpan.classList.add("text-blue-500");
  }

  return "Iniciando conexión segura con NeoNao AI... 🤖\nEscribe 'exit' para salir.";
};

async function handleChat(message) {
  if (message.toLowerCase() === "exit") {
    isChatMode = false;
    updatePrompt(); // Use the helper to restore correct path in prompt
    // Just ensure color is back to green
    const inputContainer = document.querySelector("#input").parentElement.parentElement;
    const promptSpan = inputContainer.querySelector("span");
    if (promptSpan) {
         promptSpan.classList.remove("text-blue-500");
         promptSpan.classList.add("text-green-500");
    }
    appendToConsole("Desconectado del chat.", true);
    return;
  }

  // Display user message immediately
  const pUser = document.createElement("p");
  pUser.innerHTML = `<span class="text-blue-500">chat@neonao:~$</span> ${message}`;
  consoleOutput.appendChild(pUser);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;

  try {
    const res = await fetch("https://api.neonao.es/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, sessionId: chatSessionId }),
    });

    let data = "";
    try {
      data = await res.json();
    } catch {
      data = await res.text();
    }

    // Extract message logic
    const replyRaw = (typeof data === "object" && data !== null)
      ? (data.message ?? data.response ?? JSON.stringify(data))
      : data;

    const reply = String(replyRaw); 

    // Simulation of streaming/typing effect could go here, but for now just append
    const pBot = document.createElement("p");
    pBot.className = "text-purple-400"; // Distinct color for AI
    pBot.innerText = reply; // Use innerText to avoid HTML injection risks unless sanitized
    consoleOutput.appendChild(pBot);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;

  } catch (err) {
    console.error(err);
    const pError = document.createElement("p");
    pError.className = "text-red-500";
    pError.innerText = "Error al comunicar con el servidor.";
    consoleOutput.appendChild(pError);
  }
}

function dox() {
  fetch("https://ipwho.is/")
    .then(res => res.json())
    .then(data => {
      const isVpn = isVPN(data.ip);
      const suffix = isVpn ? " (VPN Detectada)" : "";

      document.getElementById("ip-value").textContent = data.ip + suffix;
      document.getElementById("provider-value").textContent = data.connection.org + suffix;
      document.getElementById("country-value").textContent = data.country + suffix;
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

