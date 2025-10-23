// --- PLEXUS/NEURAL NETWORK BACKGROUND EFFECT ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let width, height, particles;
const PARTICLE_COUNT = 80;
const CONNECT_DISTANCE = 100;

const mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function init() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() * 0.4 - 0.2);
    this.speedY = (Math.random() * 0.4 - 0.2);
    this.color = '#9400D3';
  }

  update() {
    if (this.x > width || this.x < 0) this.speedX *= -1;
    if (this.y > height || this.y < 0) this.speedY *= -1;

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if(distance < mouse.radius){
        this.x -= dx / 20;
        this.y -= dy / 20;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function connect() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONNECT_DISTANCE) {
        const opacity = 1 - (distance / CONNECT_DISTANCE);
        ctx.strokeStyle = `rgba(148, 0, 211, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (const particle of particles) {
    particle.update();
    particle.draw();
  }
  connect();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  init();
});

init();
animate();
// TÍTULO
const tituloEl = document.getElementById('titulo');
const textoTitulo = '¿PREPARADO PARA EL SIGUIENTE NIVEL?';
tituloEl.textContent = '';
let idx = 0;
function type() {
  if (idx < textoTitulo.length) {
    tituloEl.textContent += textoTitulo.charAt(idx);
    idx++;
    setTimeout(type, 45);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  type();

  // CONTROLES DE VENTANA Y LINKS
  document.getElementById('minimize-btn').addEventListener('click', () => window.electronAPI.send('minimize-app'));
  document.getElementById('close-btn').addEventListener('click', () => window.electronAPI.send('close-app'));
  document.getElementById('yt-link-footer').addEventListener('click', (e) => {
    e.preventDefault();
    window.electronAPI.send('open-external-link', e.currentTarget.href);
  });

  const botones = document.querySelectorAll('.boton');
  const log = document.getElementById('log');

  // Escuchador que recibe los mensajes y comandos desde main.js
  window.electronAPI.on('log-update', (data) => {
    let messageClass = '';
    if (data.message.includes('[ERROR]')) {
      messageClass = 'log-error';
    }

    let cleanCommand = data.command;
    
    if (cleanCommand.includes(':: Clonar el plan')) {
        cleanCommand = '[Ejecutando script de plan de energia...]';
    } else {
        cleanCommand = cleanCommand.replace(/ \|\| echo .*$/i, '');
        cleanCommand = cleanCommand.replace(/ & @?echo .*$/i, '');
        cleanCommand = cleanCommand.replace(/ && echo .*$/i, '');
        cleanCommand = cleanCommand.replace(/ >nul 2>&1/g, '');
        cleanCommand = cleanCommand.replace(/@\(/g, '(');
        cleanCommand = cleanCommand.replace(/\)/g, ')');
        cleanCommand = cleanCommand.replace(/^@echo /i, '');
    }
    
    const logEntry = `
      <div class="${messageClass}">${data.message}</div>
      <div class="log-command">${cleanCommand}</div>
    `;
    log.innerHTML = logEntry + log.innerHTML;
  });

  // --- LÓGICA DE BOTONES DE MODO (CORREGIDA) ---

  // Función auxiliar para obtener el 'mode' de un botón
  const getModeFromButton = (btn) => {
    if (!btn) return null;
    if (btn.classList.contains('minimo')) return 'basica';
    if (btn.classList.contains('equilibrado')) return 'equilibrada';
    if (btn.classList.contains('extremo')) return 'extremo';
    if (btn.classList.contains('mododios')) return 'mododios';
    return null; // Devuelve null si no es un botón de modo
  };

  botones.forEach(btn => {
    // --- ESTA ES LA CORRECCIÓN DEL BUG ---
    // Si el boton es una herramienta (tool), ignoramos
    // y no le añadimos el listener de los modos.
    if (btn.classList.contains('tool')) {
      return; 
    }
    // --- FIN DE LA CORRECCIÓN ---

    btn.addEventListener('click', () => {
      
      const clickedMode = getModeFromButton(btn);
      // Si por alguna razon getModeFromButton falla, no hacemos nada
      if (!clickedMode) return; 

      const activeBtn = document.querySelector('.boton.active');
      const activeMode = getModeFromButton(activeBtn);

      let payload = {
        applyMode: null,
        revertMode: null
      };

      if (activeBtn && activeBtn === btn) {
        btn.classList.remove('active');
        payload.revertMode = clickedMode;
      
      } else if (activeBtn && activeBtn !== btn) {
        activeBtn.classList.remove('active');
        btn.classList.add('active');
        payload.revertMode = activeMode;
        payload.applyMode = clickedMode;
      
      } else if (!activeBtn) {
        btn.classList.add('active');
        payload.applyMode = clickedMode;
      }
      
      if (payload.applyMode || payload.revertMode) {
        window.electronAPI.send('run-optimization', payload);
      }
    });
  });

  // --- LISTENERS PARA HERRAMIENTAS (Estos están bien) ---
  document.getElementById('btn-restore').addEventListener('click', () => {
    window.electronAPI.send('run-tool', { tool: 'restauracion' });
  });
  
  document.getElementById('btn-energy').addEventListener('click', () => {
    window.electronAPI.send('run-tool', { tool: 'energia' });
  });

});