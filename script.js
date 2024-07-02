const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#33ff33';
    ctx.font = fontSize + 'px Courier New';
    
    for (let i = 0; i < drops.length; i++) {
        const text = symbols.charAt(Math.floor(Math.random() * symbols.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrixRain, 33);

// Terminal functionality
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

terminalInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const input = terminalInput.value;
        terminalOutput.textContent += '> ' + input + '\\n';
        terminalInput.value = '';

        // Process the input (you can expand this with more commands and responses)
        if (input.toLowerCase() === 'hack') {
            terminalOutput.textContent += 'Launching hack...\\n';
        } else {
            terminalOutput.textContent += 'Unrecognized command\\n';
        }
    }
});
