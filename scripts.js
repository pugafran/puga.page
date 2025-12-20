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
  help: () => "Comandos disponibles:\nhelp, whoami, projects, clear, web3, date, chat, ls, cd, cat, mint",
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
    ensureWeb3PanelVisible();
    connectMeta({ fromCommand: true });
    return "Inicializando Web3...";
  },
  date: () => new Date().toString(),
  mint: () => {
    ensureWeb3PanelVisible();
    mintHackerBadge({ fromCommand: true });
    return "Firmando NFT de regalo...";
  }
};

const provider = window.ethereum;
const web3Panel = document.getElementById("web3-panel");
const metaElements = {
  connectionPill: document.getElementById("connection-pill"),
  connectButton: document.getElementById("connect-metamask"),
  refreshButton: document.getElementById("refresh-metamask"),
  walletAddress: document.getElementById("wallet-address"),
  networkName: document.getElementById("network-name"),
  chainId: document.getElementById("chain-id"),
  walletBalance: document.getElementById("wallet-balance"),
  blockNumber: document.getElementById("block-number"),
  mintButton: document.getElementById("mint-nft"),
  mintCard: document.getElementById("mint-card"),
  mintTokenId: document.getElementById("mint-token-id"),
  mintSignature: document.getElementById("mint-signature"),
  mintTimestamp: document.getElementById("mint-timestamp")
};

let currentAccount = null;
let isMinting = false;
const mintedStoragePrefix = "puga-hacker-nft";

const KNOWN_NETWORKS = {
  "0x1": { name: "Ethereum Mainnet", symbol: "ETH" },
  "0x5": { name: "Goerli Testnet", symbol: "ETH" },
  "0xaa36a7": { name: "Sepolia Testnet", symbol: "ETH" },
  "0x89": { name: "Polygon Mainnet", symbol: "MATIC" },
  "0x13881": { name: "Polygon Mumbai", symbol: "MATIC" },
  "0xa": { name: "Optimism Mainnet", symbol: "ETH" },
  "0x2105": { name: "Base Mainnet", symbol: "ETH" },
  "0x14a33": { name: "Base Goerli", symbol: "ETH" },
  "0x2a": { name: "Kovan Testnet", symbol: "ETH" }
};

function ensureWeb3PanelVisible() {
  if (web3Panel) {
    web3Panel.classList.remove("hidden");
  }
}

function updateConnectionPill(state) {
  if (!metaElements.connectionPill) return;
  const baseClasses = "px-4 py-1 rounded-full border text-lg text-center transition-colors";
  let text = "Desconectado";
  let classes = "border-green-500 text-green-400";
  switch (state) {
    case "connected":
      text = "Conectado";
      classes = "border-green-400 text-green-200 bg-green-500/20";
      break;
    case "connecting":
      text = "Conectando...";
      classes = "border-green-400 text-green-200 animate-pulse";
      break;
    case "unavailable":
      text = "MetaMask no detectado";
      classes = "border-red-500 text-red-300";
      break;
    default:
      text = "Desconectado";
      classes = "border-green-500 text-green-400";
  }
  metaElements.connectionPill.className = `${baseClasses} ${classes}`;
  metaElements.connectionPill.textContent = text;
}

function setWalletStat(element, value) {
  if (!element) return;
  element.textContent = value;
}

function resetWalletStats() {
  setWalletStat(metaElements.walletAddress, "-");
  setWalletStat(metaElements.networkName, "-");
  setWalletStat(metaElements.chainId, "Chain ID: -");
  setWalletStat(metaElements.walletBalance, "-");
  setWalletStat(metaElements.blockNumber, "-");
}

function toggleWalletButtons(isConnected) {
  if (metaElements.connectButton) {
    metaElements.connectButton.disabled = false;
    metaElements.connectButton.textContent = isConnected ? "Cambiar cuenta" : "Conectar MetaMask";
  }
  if (metaElements.refreshButton) {
    metaElements.refreshButton.disabled = !isConnected;
    if (!isConnected) {
      metaElements.refreshButton.textContent = "Actualizar estado";
    }
  }
  updateMintButtonState(isConnected);
}

function updateMintButtonState(isConnected) {
  if (!metaElements.mintButton) return;
  if (isMinting) {
    metaElements.mintButton.disabled = true;
    metaElements.mintButton.textContent = "Firmando...";
    return;
  }
  metaElements.mintButton.disabled = !isConnected;
  updateMintButtonLabel();
}

function updateMintButtonLabel() {
  if (!metaElements.mintButton) return;
  const hasMinted = metaElements.mintButton.dataset.minted === "true";
  metaElements.mintButton.textContent = hasMinted ? "Volver a firmar NFT" : "Mintear NFT de regalo";
}

function clearMintCard() {
  if (!metaElements.mintCard) return;
  metaElements.mintCard.classList.add("hidden");
  if (metaElements.mintTokenId) metaElements.mintTokenId.textContent = "";
  if (metaElements.mintSignature) metaElements.mintSignature.textContent = "";
  if (metaElements.mintTimestamp) metaElements.mintTimestamp.textContent = "";
  if (metaElements.mintButton) {
    metaElements.mintButton.dataset.minted = "false";
    updateMintButtonState(!!currentAccount);
  }
}

function showMintData(data) {
  if (!metaElements.mintCard) return;
  metaElements.mintCard.classList.remove("hidden");
  if (metaElements.mintTokenId) metaElements.mintTokenId.textContent = data.tokenId;
  if (metaElements.mintTimestamp) metaElements.mintTimestamp.textContent = formatTimestamp(data.timestamp);
  if (metaElements.mintSignature) metaElements.mintSignature.textContent = data.signature;
  if (metaElements.mintButton) {
    metaElements.mintButton.dataset.minted = "true";
    updateMintButtonState(true);
  }
}

function getMintStorageKey(account) {
  return `${mintedStoragePrefix}:${account.toLowerCase()}`;
}

function loadMintState() {
  if (!currentAccount) {
    clearMintCard();
    return;
  }
  try {
    const stored = localStorage.getItem(getMintStorageKey(currentAccount));
    if (!stored) {
      clearMintCard();
      return;
    }
    const data = JSON.parse(stored);
    showMintData(data);
  } catch (error) {
    console.error("Error leyendo el NFT almacenado", error);
    clearMintCard();
  }
}

function ensureMetaMaskAvailability() {
  if (!provider) {
    updateConnectionPill("unavailable");
    toggleWalletButtons(false);
    if (metaElements.connectButton) {
      metaElements.connectButton.disabled = true;
      metaElements.connectButton.textContent = "MetaMask no detectado";
    }
    return false;
  }
  updateConnectionPill("disconnected");
  toggleWalletButtons(false);
  return true;
}

async function connectMeta({ fromCommand = false } = {}) {
  if (!ensureMetaMaskAvailability()) {
    if (!fromCommand) appendToConsole("MetaMask no está disponible.");
    return;
  }
  try {
    updateConnectionPill("connecting");
    if (metaElements.connectButton) {
      metaElements.connectButton.disabled = true;
      metaElements.connectButton.textContent = "Conectando...";
    }
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) {
      handleDisconnect("No se recibió ninguna cuenta de MetaMask.");
      return;
    }
    currentAccount = accounts[0];
    updateConnectionPill("connected");
    setWalletStat(metaElements.walletAddress, currentAccount);
    toggleWalletButtons(true);
    appendToConsole("Wallet conectada: " + currentAccount);
    await refreshWalletStats({ silent: true });
    loadMintState();
  } catch (error) {
    console.error("Error al conectar con MetaMask", error);
    if (error && error.code === 4001) {
      appendToConsole("Solicitud de conexión cancelada por el usuario.");
    } else {
      appendToConsole("Error al conectar con MetaMask ❌");
    }
    handleDisconnect(null, { silent: true });
  } finally {
    toggleWalletButtons(!!currentAccount);
    if (!currentAccount) {
      updateConnectionPill(provider ? "disconnected" : "unavailable");
    }
  }
}

async function refreshWalletStats({ silent = false, chainIdOverride } = {}) {
  if (!provider || !currentAccount) {
    if (!silent) appendToConsole("Conecta tu cartera para ver estadísticas.");
    return;
  }
  try {
    if (metaElements.refreshButton) {
      metaElements.refreshButton.disabled = true;
      metaElements.refreshButton.textContent = "Consultando...";
    }
    const chainPromise = chainIdOverride ? Promise.resolve(chainIdOverride) : provider.request({ method: "eth_chainId" });
    const [chainIdHex, balanceHex, blockNumberHex] = await Promise.all([
      chainPromise,
      provider.request({ method: "eth_getBalance", params: [currentAccount, "latest"] }),
      provider.request({ method: "eth_blockNumber" })
    ]);
    const networkData = getNetworkData(chainIdHex);
    setWalletStat(metaElements.networkName, networkData.name);
    setWalletStat(metaElements.chainId, `Chain ID: ${networkData.numeric} (${chainIdHex})`);
    const balanceFormatted = formatEthBalance(balanceHex);
    setWalletStat(metaElements.walletBalance, `${balanceFormatted} ${networkData.symbol}`.trim());
    setWalletStat(metaElements.blockNumber, formatBlockNumber(blockNumberHex));
    if (!silent) {
      appendToConsole(`Red: ${networkData.name} | Balance: ${balanceFormatted} ${networkData.symbol}`.trim());
    }
  } catch (error) {
    console.error("Error actualizando estadísticas Web3", error);
    if (!silent) appendToConsole("No se pudieron obtener las estadísticas on-chain ❌");
  } finally {
    if (metaElements.refreshButton) {
      metaElements.refreshButton.textContent = "Actualizar estado";
      metaElements.refreshButton.disabled = !currentAccount;
    }
  }
}

function getNetworkData(chainIdHex) {
  if (!chainIdHex) {
    return { name: "Desconocida", symbol: "ETH", numeric: "-" };
  }
  const normalized = chainIdHex.toLowerCase();
  const numeric = parseInt(chainIdHex, 16);
  const network = KNOWN_NETWORKS[normalized];
  return {
    name: network ? network.name : `Chain ${numeric}`,
    symbol: network ? network.symbol : "ETH",
    numeric
  };
}

function formatEthBalance(balanceHex) {
  try {
    const balance = BigInt(balanceHex);
    const wei = 10n ** 18n;
    const whole = balance / wei;
    const fraction = balance % wei;
    const fractionStr = fraction.toString().padStart(18, "0").replace(/0+$/, "");
    const formattedFraction = fractionStr ? `.${fractionStr.slice(0, 4)}` : "";
    return `${whole.toString()}${formattedFraction}`;
  } catch (error) {
    console.error("Error formateando balance", error);
    return "0";
  }
}

function formatBlockNumber(blockHex) {
  if (!blockHex) return "-";
  try {
    return parseInt(blockHex, 16).toLocaleString("es-ES");
  } catch (error) {
    console.error("Error formateando bloque", error);
    return blockHex;
  }
}

function handleDisconnect(message, { silent = false } = {}) {
  currentAccount = null;
  resetWalletStats();
  clearMintCard();
  toggleWalletButtons(false);
  updateConnectionPill(provider ? "disconnected" : "unavailable");
  if (message && !silent) {
    appendToConsole(message);
  }
}

function handleAccountsChanged(accounts, { silent = false } = {}) {
  if (!accounts || accounts.length === 0) {
    handleDisconnect("MetaMask se desconectó.", { silent });
    return;
  }
  currentAccount = accounts[0];
  updateConnectionPill("connected");
  setWalletStat(metaElements.walletAddress, currentAccount);
  toggleWalletButtons(true);
  if (!silent) {
    appendToConsole("Cuenta MetaMask cambiada: " + currentAccount);
  }
  refreshWalletStats({ silent: true });
  loadMintState();
}

function handleChainChanged(chainId) {
  if (!currentAccount) return;
  const networkData = getNetworkData(chainId);
  appendToConsole(`Red cambiada en MetaMask: ${networkData.name} (${chainId})`);
  refreshWalletStats({ silent: true, chainIdOverride: chainId });
}

function setMintButtonLoading(isLoading) {
  isMinting = isLoading;
  updateMintButtonState(!!currentAccount);
}

function generateTokenId(account) {
  const fragment = account.slice(2, 6).toUpperCase();
  const randomBytes = new Uint32Array(2);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < randomBytes.length; i++) {
      randomBytes[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }
  const randomHex = Array.from(randomBytes, n => n.toString(16).padStart(8, "0")).join("").slice(0, 8).toUpperCase();
  return `PUGA-${fragment}-${randomHex}`;
}

function formatTimestamp(timestamp) {
  try {
    return new Date(timestamp).toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch (_a) {
    return timestamp;
  }
}

async function mintHackerBadge({ fromCommand = false } = {}) {
  if (!provider) {
    appendToConsole("MetaMask no está disponible.");
    return;
  }
  if (!currentAccount) {
    await connectMeta({ fromCommand: true });
    if (!currentAccount) {
      appendToConsole("Conecta tu wallet antes de mintear el NFT.");
      return;
    }
  }
  if (isMinting) return;
  setMintButtonLoading(true);
  try {
    const tokenId = generateTokenId(currentAccount);
    const timestamp = new Date().toISOString();
    const message = `Puga Hacker Badge\nWallet: ${currentAccount}\nToken ID: ${tokenId}\nFecha: ${timestamp}`;
    const signature = await provider.request({
      method: "personal_sign",
      params: [message, currentAccount]
    });
    const mintData = { account: currentAccount, tokenId, timestamp, signature };
    localStorage.setItem(getMintStorageKey(currentAccount), JSON.stringify(mintData));
    showMintData(mintData);
    appendToConsole("NFT firmado correctamente ✅");
  } catch (error) {
    console.error("Error al firmar el NFT", error);
    if (error && error.code === 4001) {
      appendToConsole("Firma cancelada por el usuario.");
    } else {
      appendToConsole("Firma cancelada o fallida ❌");
    }
  } finally {
    setMintButtonLoading(false);
  }
}

function setupMetaMaskUI() {
  ensureMetaMaskAvailability();
  if (metaElements.connectButton) {
    metaElements.connectButton.addEventListener("click", () => connectMeta());
  }
  if (metaElements.refreshButton) {
    metaElements.refreshButton.addEventListener("click", () => refreshWalletStats());
  }
  if (metaElements.mintButton) {
    metaElements.mintButton.addEventListener("click", () => mintHackerBadge());
  }
  if (!provider) {
    return;
  }
  if (provider.on) {
    provider.on("accountsChanged", accounts => handleAccountsChanged(accounts));
    provider.on("chainChanged", chainId => handleChainChanged(chainId));
    provider.on("disconnect", () => handleDisconnect("MetaMask se desconectó."));
  }
  provider
    .request({ method: "eth_accounts" })
    .then(accounts => {
      if (accounts && accounts.length > 0) {
        handleAccountsChanged(accounts, { silent: true });
      }
    })
    .catch(error => {
      console.error("Error consultando cuentas MetaMask", error);
    });
}

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
  setupMetaMaskUI();
});
