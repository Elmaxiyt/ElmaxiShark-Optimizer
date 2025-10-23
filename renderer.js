// renderer.js (CORREGIDO - Sin código de partículas)

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
    log.innerHTML = logEntry + log.innerHTML; // Añade al principio
    // Opcional: Auto-scroll hacia arriba si prefieres que se vea lo más nuevo arriba
    // log.scrollTop = 0; 
  });

  // --- LÓGICA DE BOTONES DE MODO ---

  // Función auxiliar para obtener el 'mode' de un botón
  const getModeFromButton = (btn) => {
    if (!btn) return null;
    if (btn.classList.contains('minimo')) return 'basica';
    if (btn.classList.contains('equilibrado')) return 'equilibrada';
    if (btn.classList.contains('extremo')) return 'extremo';
    if (btn.classList.contains('mododios')) return 'mododios';
    return null;
  };

  botones.forEach(btn => {
    // Ignoramos los botones de herramientas para la lógica de selección de modo
    if (btn.classList.contains('tool')) {
      return;
    }

    btn.addEventListener('click', () => {

      const clickedMode = getModeFromButton(btn);
      if (!clickedMode) return;

      const activeBtn = document.querySelector('#niveles .boton.active'); // Busca solo en los botones de nivel
      const activeMode = getModeFromButton(activeBtn);

      let payload = {
        applyMode: null,
        revertMode: null
      };

      if (activeBtn && activeBtn === btn) { // Clic en el botón ya activo -> Desactivar
        btn.classList.remove('active');
        payload.revertMode = clickedMode;

      } else if (activeBtn && activeBtn !== btn) { // Clic en un botón diferente -> Cambiar
        activeBtn.classList.remove('active');
        btn.classList.add('active');
        payload.revertMode = activeMode;
        payload.applyMode = clickedMode;

      } else if (!activeBtn) { // Ningún botón activo -> Activar
        btn.classList.add('active');
        payload.applyMode = clickedMode;
      }

      if (payload.applyMode || payload.revertMode) {
        window.electronAPI.send('run-optimization', payload);
      }
    });
  });

  // --- LISTENERS PARA HERRAMIENTAS ---
  document.getElementById('btn-restore').addEventListener('click', () => {
    window.electronAPI.send('run-tool', { tool: 'restauracion' });
  });

  document.getElementById('btn-energy').addEventListener('click', () => {
    window.electronAPI.send('run-tool', { tool: 'energia' });
  });

});