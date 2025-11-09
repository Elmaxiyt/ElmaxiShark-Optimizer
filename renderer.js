// renderer.js (v2.0.3 GOLD - Final con PayPal Listener)
const tituloEl = document.getElementById('titulo');
let typingTimeout;
let currentStrings = {};

function applyLanguage(strings) {
    currentStrings = strings;
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n');
        if (currentStrings[key]) el.textContent = currentStrings[key]; 
    });
    document.querySelectorAll('[data-i18n-tip]').forEach(el => { 
        const key = el.getAttribute('data-i18n-tip');
        if (currentStrings[key]) { 
            el.setAttribute('data-tooltip', currentStrings[key]); 
            el.setAttribute('title', currentStrings[key]); 
        } 
    });
    startTypingEffect(currentStrings.subtitle || 'Potencia tu sistema con un CLICK');
}

function startTypingEffect(txt) {
    clearTimeout(typingTimeout);
    tituloEl.textContent = '';
    let idx = 0;
    (function type() { 
        if (idx < txt.length) { 
            tituloEl.textContent += txt.charAt(idx++); 
            typingTimeout = setTimeout(type, 45); 
        } 
    })();
}

window.addEventListener('DOMContentLoaded', async () => {
    try { 
        const d = await window.electronAPI.invoke('request-language'); 
        applyLanguage(d.strings); 
        window.electronAPI.on('set-language', applyLanguage); 
    } catch (e) { 
        startTypingEffect(document.getElementById('subtitulo').textContent); 
    }

    document.getElementById('minimize-btn').addEventListener('click', () => window.electronAPI.send('minimize-app'));
    document.getElementById('close-btn').addEventListener('click', () => window.electronAPI.send('close-app'));
    document.getElementById('download-guide-btn').addEventListener('click', () => window.electronAPI.send('download-guide'));

    // LISTENERS DE FOOTER (YouTube + PayPal)
    document.getElementById('yt-link-footer').addEventListener('click', (e) => { e.preventDefault(); window.electronAPI.send('open-external-link', e.currentTarget.href); });
    document.getElementById('paypal-link-footer').addEventListener('click', (e) => { e.preventDefault(); window.electronAPI.send('open-external-link', e.currentTarget.href); });

    const log = document.getElementById('log');
    const progressBarContainer = document.getElementById('progress-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressBarText = document.getElementById('progress-bar-text');

    window.electronAPI.on('log-update', (data) => {
        const cls = (data.message && data.message.includes('[ERROR]')) ? 'log-error' : '';
        const cmd = data.command.replace(/ >nul 2>&1/g, '').replace(/@echo off/g, '').replace(/chcp \d+ >nul/g, '').replace(/^@/i, '');
        let logText = data.message;
        if (data.id && currentStrings[data.id]) {
            logText = `[${currentStrings[data.id]}]`;
        } else if (data.message && !data.message.startsWith('[') && data.command !== "=== FIN ===") {
             logText = `[${data.message}]`;
        }
        log.innerHTML = `<div class="${cls}">${logText}</div><div class="log-command">${cmd}</div>` + log.innerHTML;
    });

    window.electronAPI.on('progress-update', (data) => {
        if (data.isRunning) {
            progressBarContainer.style.display = 'block';
            progressBarFill.style.width = `${data.percentage}%`;
            progressBarText.textContent = `${data.percentage}%` + (data.totalCommands ? ` (${data.currentCommand}/${data.totalCommands})` : '');
        } else {
            progressBarFill.style.width = `${data.percentage}%`;
            progressBarText.textContent = data.text;
            setTimeout(() => { 
                progressBarContainer.style.display = 'none'; 
                progressBarFill.style.width = '0%'; 
            }, 2000);
        }
    });

    const botonesNiveles = document.querySelectorAll('#niveles .boton');
    const btnRed = document.getElementById('btn-network-tool');
    const customBtn = document.querySelector('#niveles .boton.overdrive');

    window.electronAPI.on('set-initial-mode', (state) => {
        botonesNiveles.forEach(btn => {
            let mode = null;
            if (btn.classList.contains('minimo')) mode = 'basico';
            else if (btn.classList.contains('equilibrado')) mode = 'equilibrado';
            else if (btn.classList.contains('extremo')) mode = 'extremo';
            else if (btn.classList.contains('mododios')) mode = 'mododios';
            if (mode) btn.classList.toggle('active', state.activeMode === mode);
        });
        if (customBtn) customBtn.classList.toggle('active', state.customTweaksActive);
        if (btnRed) btnRed.classList.toggle('active', state.networkToolActive);
    });

    botonesNiveles.forEach(btn => {
        if (btn.classList.contains('overdrive')) { 
            btn.addEventListener('click', () => window.electronAPI.send('open-custom-menu')); 
            return; 
        }
        btn.addEventListener('click', () => {
            let mode = null;
            if (btn.classList.contains('minimo')) mode = 'basico';
            else if (btn.classList.contains('equilibrado')) mode = 'equilibrado';
            else if (btn.classList.contains('extremo')) mode = 'extremo';
            else if (btn.classList.contains('mododios')) mode = 'mododios';
            if (!mode) return;
            const activeBtn = document.querySelector('#niveles .boton.active:not(.overdrive)');
            let activeMode = null;
            if (activeBtn) {
                 if (activeBtn.classList.contains('minimo')) activeMode = 'basico';
                 else if (activeBtn.classList.contains('equilibrado')) activeMode = 'equilibrado';
                 else if (activeBtn.classList.contains('extremo')) activeMode = 'extremo';
                 else if (activeBtn.classList.contains('mododios')) activeMode = 'mododios';
            }
            let payload = { applyMode: null, revertMode: null };
            if (activeBtn === btn) { 
                btn.classList.remove('active'); 
                payload.revertMode = mode; 
            } else { 
                if (activeBtn) activeBtn.classList.remove('active'); 
                btn.classList.add('active'); 
                payload.revertMode = activeMode; 
                payload.applyMode = mode; 
            }
            window.electronAPI.send('run-optimization', payload);
        });
    });

    document.getElementById('btn-backup-reg').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'backup-reg' }));
    document.getElementById('btn-restore').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'restauracion' }));
    document.getElementById('btn-energy').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'energia' }));
    document.getElementById('btn-clean').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'limpieza-sistema' }));
    if (btnRed) btnRed.addEventListener('click', () => window.electronAPI.send('toggle-network-tool'));

    window.electronAPI.on('set-app-version', (v) => { const el = document.getElementById('version-display'); if (el) el.textContent = `v${v}`; });
    
    // START: MODIFICACION PARA ELIMINAR electron-updater y REDIRIGIR AL SITIO WEB
    document.getElementById('btn-check-update').addEventListener('click', () => { 
        // URL de la última release en GitHub
        const releaseUrl = 'https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases/latest';
        
        // Mostrar mensaje en el log
        const logMessage = currentStrings['utility_update'] ? `[UPDATE] Abriendo ${currentStrings['utility_update']}...` : "[UPDATE] Opening Update Page...";
        log.innerHTML = `<div class="log-info-update">${logMessage}</div>` + log.innerHTML; 

        // Enviar la URL a main.js para abrirla externamente
        window.electronAPI.send('open-external-link', releaseUrl); 
    });

    // Eliminar el listener de 'update-message' ya que electron-updater ya no se usa
    // window.electronAPI.on('update-message', (d) => { ... });

    // Eliminar el listener de 'update-message' si existía en el original:
    // La función original contenía:
    /*
    window.electronAPI.on('update-message', (d) => { 
        const cls = d.type === 'error' ? 'log-error' : d.type === 'success' ? 'log-success' : 'log-info-update'; 
        log.innerHTML = `<div class="${cls}">${d.text}</div>` + log.innerHTML; 
    });
    */
    // Lo anterior ha sido efectivamente eliminado al no reescribirlo.

    // END: MODIFICACION PARA ELIMINAR electron-updater y REDIRIGIR AL SITIO WEB

    document.getElementById('btn-translate').addEventListener('click', () => { 
        window.electronAPI.send('change-language', 'toggle'); 
    });
});