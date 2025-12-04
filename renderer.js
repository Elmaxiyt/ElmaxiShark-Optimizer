// renderer.js (v1.6.9 - FIX: LOGO GLOW ONLY FOR MODES)
const tituloEl = document.getElementById('titulo');
let typingTimeout;
let currentStrings = {};
const FLAG_MAP = { 'es': '🇪🇸', 'en': '🇺🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'pt': '🇵🇹' };

// ... (ELEMENTOS DEL HUD, LOGO, BARRAS) ...
const logoContainer = document.getElementById('logo-container');
const logo = document.getElementById('logo');
const healthFillHorizontal = document.getElementById('health-fill-horizontal');
const junkInfo = document.getElementById('junk-info');
const healthText = document.getElementById('health-text');
const osInfo = document.getElementById('os-info');
const cpuInfo = document.getElementById('cpu-info');
const gpuInfo = document.getElementById('gpu-info');
const ramInfo = document.getElementById('ram-info');

function setLogoGlow(type) {
    logoContainer.className = '';
    switch (type) {
        case 'basico': case 'limpieza-sistema': logoContainer.classList.add('glow-white'); break;
        case 'equilibrado': case 'restauracion': logoContainer.classList.add('glow-green'); break;
        case 'extremo': case 'energia': logoContainer.classList.add('glow-orange'); break;
        case 'mododios': logoContainer.classList.add('glow-red'); break; // Solo Modo Gamer usa rojo ahora
        case 'custom': case 'debloat': case 'shell': logoContainer.classList.add('glow-purple'); break;
        default: break;
    }
}

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
    const sub = document.getElementById('subtitulo');
    if(sub) startTypingEffect(currentStrings.subtitle || 'POTENCIA TU SISTEMA');
}

function startTypingEffect(txt) {
    const sub = document.getElementById('subtitulo');
    if (!sub) return;
    clearTimeout(typingTimeout);
    sub.textContent = ''; 
    let idx = 0;
    (function type() { if (idx < txt.length) { sub.textContent += txt.charAt(idx++); typingTimeout = setTimeout(type, 40); } })();
}

function getStatusText(key, defaultText) { return currentStrings[key] || defaultText; }

window.addEventListener('DOMContentLoaded', async () => {
    
    // --- FIX BORDE AL MAXIMIZAR ---
    window.electronAPI.on('window-state-change', (state) => {
        if (state === 'maximized') document.body.classList.add('maximized');
        else document.body.classList.remove('maximized');
    });

    try { 
        const d = await window.electronAPI.invoke('request-language'); 
        applyLanguage(d.strings); 
        const btnTranslate = document.getElementById('btn-translate');
        if (btnTranslate && d.currentLang && FLAG_MAP[d.currentLang]) btnTranslate.textContent = FLAG_MAP[d.currentLang];
        window.electronAPI.on('set-language', (strings) => applyLanguage(strings)); 
    } catch (e) { }

    window.electronAPI.on('update-sys-info', (info) => {
        if(osInfo) osInfo.innerHTML = `<span class="tech-label">OS:</span> ${info.os || "..."}`;
        if(cpuInfo) cpuInfo.innerHTML = `<span class="tech-label">CPU:</span> ${info.cpu || "..."}`;
        if(gpuInfo) gpuInfo.innerHTML = `<span class="tech-label">GPU:</span> ${info.gpu || "..."}`; 
        if(ramInfo) ramInfo.innerHTML = `<span class="tech-label">RAM:</span> ${info.ram || "..."}`;
    });

    window.electronAPI.on('update-junk-status', (mb) => {
        if(junkInfo && healthFillHorizontal) {
            junkInfo.textContent = `${mb} MB`;
            if (mb > 500) {
                healthFillHorizontal.style.width = '30%'; healthFillHorizontal.style.background = '#ff4444';
                if(healthText) { healthText.textContent = `[ ${getStatusText('status_dirty', "SISTEMA SUCIO").toUpperCase()} ]`; healthText.style.color = '#ff4444'; }
            } else if (mb > 100) {
                healthFillHorizontal.style.width = '60%'; healthFillHorizontal.style.background = '#ffaa00';
                if(healthText) { healthText.textContent = `[ ${getStatusText('status_fair', "ACEPTABLE").toUpperCase()} ]`; healthText.style.color = '#ffaa00'; }
            } else {
                healthFillHorizontal.style.width = '100%'; healthFillHorizontal.style.background = '#00ff88';
                if(healthText) { healthText.textContent = `[ ${getStatusText('status_optimal', "SISTEMA ÓPTIMO").toUpperCase()} ]`; healthText.style.color = '#00ff88'; }
            }
        }
    });

    document.getElementById('minimize-btn').addEventListener('click', () => window.electronAPI.send('minimize-app'));
    document.getElementById('close-btn').addEventListener('click', () => window.electronAPI.send('close-app'));
    const maxBtn = document.getElementById('maximize-btn');
    if (maxBtn) maxBtn.addEventListener('click', () => window.electronAPI.send('maximize-app'));

    document.getElementById('download-guide-btn').addEventListener('click', () => window.electronAPI.send('download-guide'));
    document.getElementById('btn-check-update').addEventListener('click', () => { 
        const releaseUrl = 'https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases/latest';
        const msg = currentStrings['utility_update_checking'] || "[UPDATE] ...";
        const log = document.getElementById('log');
        log.innerHTML = `<div class="log-info-update">${msg}</div>` + log.innerHTML; 
        window.electronAPI.send('open-external-link', releaseUrl); 
    });
    const ytLink = document.getElementById('yt-link-top');
    if(ytLink) ytLink.addEventListener('click', (e) => { e.preventDefault(); window.electronAPI.send('open-external-link', "https://www.youtube.com/@Elmaxizone"); });
    const paypalLink = document.getElementById('paypal-link-top');
    if(paypalLink) paypalLink.addEventListener('click', (e) => { e.preventDefault(); window.electronAPI.send('open-external-link', "https://paypal.me/Elmaxizone"); });

    const progressBarContainer = document.getElementById('progress-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressBarText = document.getElementById('progress-bar-text');
    const log = document.getElementById('log');

    window.electronAPI.on('log-update', (data) => {
        const cls = (data.message && data.message.includes('[ERROR]')) ? 'log-error' : '';
        const cmd = data.command.replace(/ >nul 2>&1/g, '').replace(/@echo off/g, '').replace(/chcp \d+ >nul/g, '').replace(/^@/i, '');
        let logMsg = data.message;
        if (data.id && currentStrings[data.id]) logMsg = currentStrings[data.id];
        if (data.command === "=== FIN ===") logMsg = currentStrings['msg_completed_title'] || "Completado";
        log.innerHTML = `<div class="${cls}">[${logMsg}]</div><div class="log-command">${cmd}</div>` + log.innerHTML;
    });

    window.electronAPI.on('progress-update', (data) => {
        if (data.isRunning) {
            progressBarContainer.style.display = 'block';
            progressBarFill.style.width = `${data.percentage}%`;
            if (data.currentCommand && data.totalCommands) progressBarText.textContent = `${data.currentCommand} / ${data.totalCommands}`;
            else progressBarText.textContent = `${data.percentage}%`;
        } else {
            progressBarFill.style.width = `${data.percentage}%`;
            progressBarText.textContent = data.text;
            setTimeout(() => { progressBarContainer.style.display = 'none'; progressBarFill.style.width = '0%'; }, 2000);
        }
    });

    const botonesNiveles = document.querySelectorAll('#niveles .boton');
    const btnRed = document.getElementById('btn-network-tool');
    const btnDebloat = document.getElementById('btn-debloat-tool');
    const btnShell = document.getElementById('btn-shell-tools'); 
    const btnInput = document.getElementById('btn-input-tool');
    const customBtn = document.querySelector('#niveles .boton.overdrive');

    // --- LÓGICA CORREGIDA: SÓLO MODOS DE 1 CLICK (Y CUSTOM) CAMBIAN EL LOGO ---
    window.electronAPI.on('set-initial-mode', (state) => {
        setLogoGlow('none'); // Reseteo inicial (sin brillo)

        // 1. Modos Principales (Básico, Equilibrado, Extremo, Gamer)
        // ESTOS SÍ CAMBIAN EL LOGO
        botonesNiveles.forEach(btn => {
            let mode = null;
            if (btn.classList.contains('minimo')) mode = 'basico';
            else if (btn.classList.contains('equilibrado')) mode = 'equilibrado';
            else if (btn.classList.contains('extremo')) mode = 'extremo';
            else if (btn.classList.contains('mododios')) mode = 'mododios';
            if (mode) {
                const isActive = state.activeMode === mode;
                btn.classList.toggle('active', isActive);
                if (isActive) setLogoGlow(mode);
            }
        });

        // 2. Modo Custom (Prioridad Máxima si está activo)
        // ESTE TAMBIÉN CAMBIA EL LOGO (A Morado)
        if (customBtn) { 
            customBtn.classList.toggle('active', state.customTweaksActive); 
            if (state.customTweaksActive) setLogoGlow('custom'); 
        }

        // 3. Herramientas Individuales (Red, Input, Debloat, Shell)
        // ESTAS SÓLO ACTIVAN SU BOTÓN, ¡¡NO CAMBIAN EL COLOR DEL LOGO!!
        if (btnRed) btnRed.classList.toggle('active', state.networkToolActive);
        if (btnInput) btnInput.classList.toggle('active', state.inputLagActive);
        if (btnDebloat) btnDebloat.classList.toggle('active', state.debloatTweaksActive);
        if (btnShell) btnShell.classList.toggle('active', state.shellToolActive);
    });

    // Listeners de los botones
    botonesNiveles.forEach(btn => {
        if (btn.classList.contains('overdrive')) return; 
        btn.addEventListener('click', () => {
            let mode = null;
            if (btn.classList.contains('minimo')) mode = 'basico';
            else if (btn.classList.contains('equilibrado')) mode = 'equilibrado';
            else if (btn.classList.contains('extremo')) mode = 'extremo';
            else if (btn.classList.contains('mododios')) mode = 'mododios';
            if (!mode) return;
            // Visual feedback inmediato al clickar
            setLogoGlow(mode);
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
                btn.classList.remove('active'); payload.revertMode = mode; setLogoGlow('none');
            } else { 
                if (activeBtn) activeBtn.classList.remove('active'); 
                btn.classList.add('active'); payload.revertMode = activeMode; payload.applyMode = mode; 
            }
            window.electronAPI.send('run-optimization', payload);
        });
    });

    if (customBtn) customBtn.addEventListener('click', () => { window.electronAPI.send('open-custom-menu'); });
    document.getElementById('btn-backup-reg').addEventListener('click', () => window.electronAPI.send('run-tool', { tool: 'backup-reg' }));
    document.getElementById('btn-restore').addEventListener('click', () => { setLogoGlow('restauracion'); window.electronAPI.send('run-tool', { tool: 'restauracion' }); });
    document.getElementById('btn-energy').addEventListener('click', () => { setLogoGlow('energia'); window.electronAPI.send('run-tool', { tool: 'energia' }); });
    
    // El botón Limpieza SÍ pone brillo momentáneo porque es una acción, no un estado persistente
    const btnClean = document.getElementById('btn-clean');
    btnClean.addEventListener('click', () => {
        setLogoGlow('limpieza-sistema');
        window.electronAPI.send('run-tool', { tool: 'limpieza-sistema' });
        if(healthFillHorizontal) {
            healthFillHorizontal.style.width = '100%'; 
            healthFillHorizontal.style.background = '#00ff88';
            if(junkInfo) junkInfo.textContent = "0 MB"; 
            if(healthText) { healthText.textContent = `[ ${getStatusText('status_cleaning', "LIMPIANDO...").toUpperCase()} ]`; healthText.style.color = "#00ff88"; }
        }
    });
    // El botón Debloat pone brillo momentáneo al abrir la ventana
    if (btnDebloat) btnDebloat.addEventListener('click', () => { setLogoGlow('debloat'); window.electronAPI.send('run-tool', { tool: 'debloat' }); });
    // El botón Shell pone brillo momentáneo al aplicar
    if (btnShell) btnShell.addEventListener('click', () => { setLogoGlow('shell'); window.electronAPI.send('run-tool', { tool: 'shell' }); });
    
    // Red e Input Lag NO ponen brillo al hacer click (solo togglean el botón)
    if (btnRed) btnRed.addEventListener('click', () => { window.electronAPI.send('toggle-network-tool'); });
    if (btnInput) btnInput.addEventListener('click', () => { window.electronAPI.send('toggle-input-tool'); });

    const langBtn = document.getElementById('btn-translate');
    const langMenu = document.getElementById('language-menu');
    const availableLanguages = [
        { code: 'es', label: '🇪🇸 Español' },
        { code: 'en', label: '🇺🇸 English' },
        { code: 'fr', label: '🇫🇷 Français' },
        { code: 'de', label: '🇩🇪 Deutsch' },
        { code: 'pt', label: '🇵🇹 Português' }
    ];

    langMenu.innerHTML = ''; 
    availableLanguages.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'lang-option';
        item.textContent = lang.label; 
        item.addEventListener('click', () => {
            window.electronAPI.send('change-language', lang.code);
            langBtn.textContent = FLAG_MAP[lang.code] || '🌐'; 
            langMenu.classList.remove('visible');
        });
        langMenu.appendChild(item);
    });

    langBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('visible'); });
    window.addEventListener('click', () => { if (langMenu.classList.contains('visible')) langMenu.classList.remove('visible'); });
});