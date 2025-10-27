// renderer.js (CORREGIDO - Con guardado, barra de progreso y lógica Overdrive)

// TÍTULO (Efecto escritura corregido)
const tituloEl = document.getElementById('titulo');
const textoTitulo = '¿PREPARADO PARA EL SIGUIENTE NIVEL?';
tituloEl.textContent = '';
let idx = 0;
function startTypingEffect() {
  if (idx < textoTitulo.length) {
    tituloEl.textContent += textoTitulo.charAt(idx);
    idx++;
    setTimeout(startTypingEffect, 45); // Llama a la función renombrada
  }
}

window.addEventListener('DOMContentLoaded', () => {
  startTypingEffect(); // Llama a la función renombrada

  // CONTROLES DE VENTANA Y LINKS
  document.getElementById('minimize-btn').addEventListener('click', () => window.electronAPI.send('minimize-app'));
  document.getElementById('close-btn').addEventListener('click', () => window.electronAPI.send('close-app'));
  document.getElementById('yt-link-footer').addEventListener('click', (e) => {
    e.preventDefault();
    window.electronAPI.send('open-external-link', e.currentTarget.href);
  });

  const botonesNiveles = document.querySelectorAll('#niveles .boton');
  const log = document.getElementById('log');
  
  // --- ELEMENTOS BARRA DE PROGRESO ---
  const progressBarContainer = document.getElementById('progress-container');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressBarText = document.getElementById('progress-bar-text');
  // --- FIN ELEMENTOS ---


  // --- RECIBIR Y APLICAR ESTADO INICIAL ---
  window.electronAPI.on('set-initial-mode', (activeMode) => {
    console.log(`Estado inicial recibido: ${activeMode}`);
    if (activeMode) {
      botonesNiveles.forEach(btn => {
        if (getModeFromButton(btn) === activeMode) {
          btn.classList.add('active');
          console.log(`Botón ${activeMode} activado visualmente.`);
        } else {
          btn.classList.remove('active');
        }
      });
    } else {
      botonesNiveles.forEach(btn => btn.classList.remove('active'));
    }
  });

  // --- LISTENER LOG ---
  window.electronAPI.on('log-update', (data) => {
    let messageClass = '';
    if (data.message.includes('[ERROR]')) messageClass = 'log-error';
    let cleanCommand = data.command;
    if (cleanCommand.includes(':: Clonar el plan')) { cleanCommand = '[Ejecutando script de plan de energia...]'; }
    else { cleanCommand = cleanCommand.replace(/ \|\| echo .*$/i, '').replace(/ & @?echo .*$/i, '').replace(/ && echo .*$/i, '').replace(/ >nul 2>&1/g, '').replace(/@\(/g, '(').replace(/\)/g, ')').replace(/^@echo /i, ''); }
    const logEntry = `<div class="${messageClass}">${data.message}</div><div class="log-command">${cleanCommand}</div>`;
    log.innerHTML = logEntry + log.innerHTML;
    log.scrollTop = 0;
  });

  // --- LISTENER BARRA DE PROGRESO ---
  window.electronAPI.on('progress-update', (data) => {
    if (data.isRunning) {
      // Mostrar barra y actualizarla
      progressBarContainer.style.display = 'block';
      progressBarFill.style.width = `${data.percentage}%`;
      progressBarText.textContent = data.text;
    } else {
      // Si no está corriendo (completado o error), actualizamos una última vez
      progressBarFill.style.width = `${data.percentage}%`;
      progressBarText.textContent = data.text;
      
      // Ocultamos la barra después de 2 segundos
      setTimeout(() => {
        progressBarContainer.style.display = 'none';
        // Reseteamos para la próxima vez
        progressBarFill.style.width = '0%';
        progressBarText.textContent = '';
      }, 2000); // Oculta después de 2 seg
    }
  });
  // --- FIN LISTENER ---

  // --- LÓGICA BOTONES DE MODO (Incluye Overdrive) ---
  const getModeFromButton = (btn) => {
    if (!btn) return null;
    if (btn.classList.contains('minimo')) return 'basica';
    if (btn.classList.contains('equilibrado')) return 'equilibrada';
    if (btn.classList.contains('extremo')) return 'extremo';
    if (btn.classList.contains('overdrive')) return 'overdrive'; // <-- AÑADIDO
    if (btn.classList.contains('mododios')) return 'mododios';
    return null;
  };

  botonesNiveles.forEach(btn => {
    btn.addEventListener('click', () => {
      const clickedMode = getModeFromButton(btn);
      if (!clickedMode) return;
      const activeBtn = document.querySelector('#niveles .boton.active');
      const activeMode = getModeFromButton(activeBtn);
      let payload = { applyMode: null, revertMode: null };

      if (activeBtn && activeBtn === btn) { // Desactivar
        btn.classList.remove('active');
        payload.revertMode = clickedMode;
      } else if (activeBtn && activeBtn !== btn) { // Cambiar
        activeBtn.classList.remove('active');
        btn.classList.add('active');
        payload.revertMode = activeMode;
        payload.applyMode = clickedMode;
      } else { // Activar
        btn.classList.add('active');
        payload.applyMode = clickedMode;
      }
      if (payload.applyMode || payload.revertMode) {
        window.electronAPI.send('run-optimization', payload);
      }
    });
  });

  // --- Listeners Herramientas ---
  document.getElementById('btn-restore').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'restauracion' }));
  document.getElementById('btn-energy').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'energia' }));
  document.getElementById('btn-clean').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'limpieza-sistema' }));

  // --- Placeholder Traducción ---
  document.getElementById('btn-translate').addEventListener('click', () => {
    console.log('Botón de traducción pulsado (funcionalidad futura)');
  });

}); // Fin DOMContentLoaded