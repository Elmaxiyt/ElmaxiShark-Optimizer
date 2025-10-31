// renderer.js (v1.8.1 - Mensaje de Timeout Amigable)

// TÍTULO (Efecto escritura)
const tituloEl = document.getElementById('titulo');
const textoTitulo = '¿PREPARADO PARA EL SIGUIENTE NIVEL?';
tituloEl.textContent = '';
let idx = 0;
function startTypingEffect() {
  if (idx < textoTitulo.length) {
    tituloEl.textContent += textoTitulo.charAt(idx);
    idx++;
    setTimeout(startTypingEffect, 45);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  startTypingEffect();

  // --- CONTROLES DE VENTANA Y LINKS ---
  document.getElementById('minimize-btn').addEventListener('click', () => window.electronAPI.send('minimize-app'));
  document.getElementById('close-btn').addEventListener('click', () => window.electronAPI.send('close-app'));
  document.getElementById('yt-link-footer').addEventListener('click', (e) => {
    e.preventDefault();
    window.electronAPI.send('open-external-link', e.currentTarget.href);
  });

  // --- BOTÓN DESCARGAR GUÍA ---
  document.getElementById('download-guide-btn').addEventListener('click', () => {
    window.electronAPI.send('download-guide');
  });

  // --- LÓGICA DE ACTUALIZACIÓN MEJORADA ---
  const log = document.getElementById('log'); // Obtener el elemento log aquí
  let updateLogEntryId = 0; // Para identificar el mensaje de búsqueda de actualización
  let loadingDotsInterval = null; // Para la animación de puntos suspensivos
  let updateTimeout = null; // Para el temporizador de seguridad de 10s

  // Función para añadir mensajes al log
  const addLogMessage = (message, type = '', command = '') => {
    let messageClass = '';
    if (type === 'error') messageClass = 'log-error';
    if (type === 'info-update') messageClass = 'log-info-update'; 
    if (type === 'success') messageClass = 'log-success'; // Asegurarse que se aplica

    let finalCommand = '';
    if (command) {
        finalCommand = `<div class="log-command">${command.replace(/ >nul 2>&1/g, '').replace(/@echo off/g, '').replace(/chcp \d+ >nul/g, '').replace(/^@/i, '')}</div>`;
    }

    const logEntry = `<div class="${messageClass}" data-log-id="${updateLogEntryId}">${message}</div>${finalCommand}`;
    log.innerHTML = logEntry + log.innerHTML;
    log.scrollTop = 0;
  };

  // Función para limpiar/actualizar un mensaje específico del log
  const updateLogMessage = (messageId, newMessage, type = '', actionButton = '') => {
    const entry = log.querySelector(`[data-log-id="${messageId}"]`);
    if (entry) {
        entry.innerHTML = newMessage + actionButton;
        entry.className = type === 'error' ? 'log-error' : type === 'success' ? 'log-success' : 'log-info-update';
        // Si hay botón de reiniciar, lo adjuntamos y agregamos listener
        if (actionButton) {
            const restartBtn = entry.querySelector('#restart-btn');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    window.electronAPI.send('restart-app-to-update');
                });
            }
        }
    }
  };


  document.getElementById('btn-check-update').addEventListener('click', () => {
    // Limpiar temporizadores y animaciones previas
    if (updateTimeout) clearTimeout(updateTimeout);
    if (loadingDotsInterval) clearInterval(loadingDotsInterval);
    
    updateLogEntryId++; // Nuevo ID para este ciclo de búsqueda
    const currentLogId = updateLogEntryId;

    // Mensaje inicial en el log
    addLogMessage(`Buscando actualizaciones<span class="log-loading-dots"><span>.</span><span>.</span><span>.</span></span>`, 'info-update', 'Verificando repositorio...');

    // Iniciar animación de puntos suspensivos (solo para el mensaje de búsqueda)
    const loadingMessageSpan = log.querySelector(`[data-log-id="${currentLogId}"] .log-loading-dots`);
    if (loadingMessageSpan) {
        let dotsCount = 0;
        loadingDotsInterval = setInterval(() => {
            dotsCount = (dotsCount + 1) % 4; // 0, 1, 2, 3
            let dots = '';
            for (let i = 0; i < 3; i++) {
                dots += `<span style="opacity:${i < dotsCount ? '1' : '0.2'}">.</span>`;
            }
            loadingMessageSpan.innerHTML = dots;
        }, 300); // Cambia cada 300ms
    }

    // Envía el comando al main process
    window.electronAPI.send('check-for-updates-manual');

    // --- CAMBIO EN EL TEMPORIZADOR DE SEGURIDAD ---
    updateTimeout = setTimeout(() => {
      // Solo si el mensaje sigue siendo el de "Buscando..."
      const currentEntry = log.querySelector(`[data-log-id="${currentLogId}"]`);
      if (currentEntry && currentEntry.textContent.includes('Buscando actualizaciones')) {
          if (loadingDotsInterval) clearInterval(loadingDotsInterval);
          
          // Mostramos un mensaje amigable en lugar de un error
          updateLogMessage(currentLogId, `No se encontraron actualizaciones recientes.`, 'success');
          console.log('Timeout del mensaje de actualización (10s), mostrando mensaje amigable.');

          // Oculta el mensaje después de 3 segundos
          setTimeout(() => { 
            const entry = log.querySelector(`[data-log-id="${currentLogId}"]`);
            if (entry) entry.remove(); // Elimina la entrada del log
          }, 3000);
      }
    }, 10000); // 10 segundos
    // --- FIN DEL CAMBIO ---
  });


  const botonesNiveles = document.querySelectorAll('#niveles .boton');
  
  // --- ELEMENTOS BARRA DE PROGRESO ---
  const progressBarContainer = document.getElementById('progress-container');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressBarText = document.getElementById('progress-bar-text');

  
  // --- AÑADIDO: LISTENER PARA MOSTRAR VERSIÓN ---
  window.electronAPI.on('set-app-version', (version) => {
    const versionEl = document.getElementById('app-version');
    if (versionEl) {
      versionEl.textContent = `v${version}`;
    }
  });

  // --- RECIBIR Y APLICAR ESTADO INICIAL (DUAL) ---
  window.electronAPI.on('set-initial-mode', (initialState) => {
    console.log(`Estado DUAL recibido:`, initialState);
    
    // 1. Manejar botones de 1-Clic (Básico, Dios, etc.)
    botonesNiveles.forEach(btn => {
        const mode = getModeFromButton(btn); // Esta función ignora 'custom'
        if (mode) { // Si es un botón de 1-clic
            if (initialState.activeMode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
    
    // 2. Manejar botón Custom (separado)
    const customBtn = document.querySelector('#niveles .boton.overdrive');
    if (customBtn) {
        if (initialState.customTweaksActive) {
            customBtn.classList.add('active');
            console.log(`Botón Custom activado visualmente.`);
        } else {
            customBtn.classList.remove('active');
        }
    }
  });
  // --- FIN ESTADO DUAL ---

  // --- LISTENER LOG ---
  window.electronAPI.on('log-update', (data) => {
    let messageClass = '';
    if (data.message.includes('[ERROR]')) messageClass = 'log-error';
    
    let cleanCommand = data.command.replace(/ >nul 2>&1/g, '').replace(/@echo off/g, '').replace(/chcp \d+ >nul/g, '').replace(/^@/i, '');
    
    const logEntry = `<div class="${messageClass}">${data.message}</div><div class="log-command">${cleanCommand}</div>`;
    log.innerHTML = logEntry + log.innerHTML;
    log.scrollTop = 0;
  });

  // --- LISTENER BARRA DE PROGRESO ---
  window.electronAPI.on('progress-update', (data) => {
    if (data.isRunning) {
      progressBarContainer.style.display = 'block';
      progressBarFill.style.width = `${data.percentage}%`;
      progressBarText.textContent = data.text;
    } else {
      progressBarFill.style.width = `${data.percentage}%`;
      progressBarText.textContent = data.text;
      
      setTimeout(() => {
        progressBarContainer.style.display = 'none';
        progressBarFill.style.width = '0%';
        progressBarText.textContent = '';
      }, 2000);
    }
  });

  // --- LÓGICA BOTONES DE MODO (HÍBRIDA V1.4) ---
  const getModeFromButton = (btn) => {
    if (!btn) return null;
    if (btn.classList.contains('minimo')) return 'basico';
    if (btn.classList.contains('equilibrado')) return 'equilibrado';
    if (btn.classList.contains('extremo')) return 'extremo';
    if (btn.classList.contains('mododios')) return 'mododios';
    return null; 
  };

  botonesNiveles.forEach(btn => {
    
    // --- BOTÓN CUSTOM (Overdrive) ---
    if (btn.classList.contains('overdrive')) {
        btn.addEventListener('click', () => {
            console.log("Botón Custom (Overdrive) presionado.");
            window.electronAPI.send('open-custom-menu');
        });
        return; 
    }

    // --- BOTONES DE 1 CLIC (Básico, Equilibrado, Extremo, Dios) ---
    btn.addEventListener('click', () => {
      const clickedMode = getModeFromButton(btn);
      if (!clickedMode) return;
      
      const activeBtn = document.querySelector('#niveles .boton.active:not(.overdrive)');
      
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
        const customBtn = document.querySelector('#niveles .boton.overdrive');
        if (customBtn) customBtn.classList.remove('active');
        
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


  // --- LISTENER DE MENSAJES DE ACTUALIZACIÓN ---
  window.electronAPI.on('update-message', (data) => {
    console.log('Mensaje de actualización recibido:', data.status);

    // Limpiar temporizadores y animaciones al recibir cualquier respuesta
    if (updateTimeout) clearTimeout(updateTimeout);
    if (loadingDotsInterval) clearInterval(loadingDotsInterval);
    
    let message = '';
    let actionButton = '';
    let messageType = 'log-info-update';
  
    switch(data.status) {
      case 'available':
        message = `Descargando actualización v${data.version}...`;
        messageType = 'log-info-update';
        break;
  
      case 'error':
        if (data.message && data.message.includes('ENOENT')) {
          message = 'Error al buscar actualizaciones (no se encontró .yml).';
        } else {
          message = `Error al actualizar: ${data.message || 'Error desconocido'}`;
        }
        messageType = 'error';
        break;
      
      case 'downloaded':
        message = `¡Actualización v${data.version} lista! Reinicia para instalar.`;
        messageType = 'success';
        actionButton = `<button id="restart-btn" style="
            background: linear-gradient(180deg,#62ffb8,#18d77e);
            color: black;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: 'Russo One', sans-serif;
            font-size: 11px;
            cursor: pointer;
            margin-left: 10px;
            transition: background 0.2s;
        ">Reiniciar Ahora</button>`;
        break;
        
      case 'not-available':
        message = '¡Ya tienes la última versión!';
        messageType = 'success'; 
        // Oculta el mensaje después de 3 segundos
        setTimeout(() => { 
          const entry = log.querySelector(`[data-log-id="${updateLogEntryId}"]`);
          if (entry) entry.remove(); // Elimina la entrada del log
        }, 3000);
        break;
    }
  
    // Actualizamos el mensaje en el log o lo añadimos si no existe
    updateLogMessage(updateLogEntryId, message, messageType, actionButton);
  });

}); // Fin DOMContentLoaded