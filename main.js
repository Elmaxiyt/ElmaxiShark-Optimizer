// main.js (v1.3.0 GOLD - FINAL FIX LANGUAGE)
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn, execSync, exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// 1. VARIABLES
let mainWindow = null;
let customWindow = null;
let cmdProcess = null;
let commandTimers = [];
let isRunning = false;
let store;
let currentLanguageStrings = {};

// 2. CARGA SCRIPTS
let customTweaks = {};
try {
    const tweaksPath = path.join(__dirname, 'scripts', 'custom-tweaks.js');
    if (fs.existsSync(tweaksPath)) {
        delete require.cache[require.resolve(tweaksPath)];
        customTweaks = require(tweaksPath);
    }
} catch (e) { console.error("Custom Tweaks Error:", e.message); }

const tools = {
    'restauracion': require('./scripts/herramienta-restauracion.js'),
    'energia': require('./scripts/herramienta-energia.js'),
    'limpieza-sistema': require('./scripts/herramienta-limpieza-sistema.js'),
    'backup-reg': require('./scripts/herramienta-backup-reg.js')
};

const optimizacionScripts = {
    'basico': require('./scripts/optimizacion-basica.js'),
    'equilibrado': require('./scripts/optimizacion-equilibrada.js'),
    'extremo': require('./scripts/optimizacion-extremo.js'),
    'mododios': require('./scripts/optimizacion-mododios.js'),
    'red-avanzada': require('./scripts/herramienta-red-avanzada.js')
};

// 3. UTILIDADES
function isRunningAsAdmin() { try { execSync('fsutil dirty query %systemdrive%'); return true; } catch { return false; } }

function loadLanguage(langCode) {
    try {
        const target = ['es', 'en'].includes(langCode) ? langCode : 'es';
        currentLanguageStrings = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', `${target}.json`), 'utf8'));
        if (store) store.set('language', target);
    } catch (error) { 
        currentLanguageStrings = {}; 
        console.error("Error loading language:", error);
    }
}

async function initializeStore() {
    try {
        const { default: Store } = await import('electron-store');
        store = new Store({ defaults: { activeMode: null, customTweakSelection: [], customTweaksActive: false, networkToolActive: false, language: 'es' } });
        loadLanguage(store.get('language', 'es'));
    } catch (err) { console.error("Store Error:", err); }
}

// 4. EJECUCIÓN
function launchPersistentCmd(win) {
    if (cmdProcess && !cmdProcess.killed) return;
    cmdProcess = spawn('cmd.exe', ['/k'], { stdio: ['pipe', 'ignore', 'ignore'] });
    try { ['chcp 65001 >nul', 'cls', '@echo off', `echo ElmaxiShark Optimizer v${app.getVersion()} Ready`, 'echo.'].forEach(c => cmdProcess.stdin.write(`${c}\n`)); } catch (e) {}
    cmdProcess.on('close', () => { cmdProcess = null; isRunning = false; });
}

function executeCommands(win, commands, action, mode) {
    if (isRunning || !win || win.isDestroyed()) return;
    isRunning = true;
    commandTimers.forEach(clearTimeout);
    commandTimers = [];
    launchPersistentCmd(win);

    win.webContents.send('progress-update', { percentage: 0, text: 'Iniciando...', isRunning: true });
    try { cmdProcess.stdin.write(`cls\necho --- Ejecutando: ${mode} (${action}) ---\necho.\n`); } catch (e) { isRunning = false; return; }

    let i = 0; const total = commands.length;
    function runNext() {
        if (i >= total) { finishExecution(win, mode, action); return; }
        const cmd = commands[i++];
        const pct = Math.max(0, Math.min(99, Math.round(((i - 1) / total) * 100)));
        if (cmdProcess && !cmdProcess.killed && win && !win.isDestroyed()) {
            win.webContents.send('log-update', { id: cmd.id, message: cmd.message, command: cmd.command });
            win.webContents.send('progress-update', { percentage: pct, text: `${pct}%`, isRunning: true, currentCommand: i, totalCommands: total });
            try {
                cmdProcess.stdin.write(`echo [LOG] ${cmd.message}\n`);
                if (cmd.isScript) {
                    const temp = path.join(os.tmpdir(), 'emx_temp.bat');
                    fs.writeFileSync(temp, cmd.command, 'utf8');
                    cmdProcess.stdin.write(`call "${temp}"\n`);
                } else { cmdProcess.stdin.write(`${cmd.command}\n`); }
                cmdProcess.stdin.write('echo.\n');
            } catch (e) {}
        }
        commandTimers.push(setTimeout(runNext, 300));
    }
    runNext();
}

function finishExecution(win, mode, action) {
    isRunning = false;
    if (!win || win.isDestroyed()) return;
    const endMsg = currentLanguageStrings['log_process_completed'] || '¡Proceso completado!';
    win.webContents.send('progress-update', { percentage: 100, text: 'Completado', isRunning: false });
    win.webContents.send('log-update', { message: endMsg, command: "=== FIN ===" });

    const isTool = ['restauracion', 'energia', 'limpieza-sistema', 'backup-reg'].includes(mode);
    if (store) {
        if (mode === 'TOOL_RED_AVANZADA') store.set('networkToolActive', action === 'apply');
        else if (mode === 'custom' && action === 'apply') { store.set('activeMode', null); store.set('customTweaksActive', true); }
        else if (!isTool) { store.set('activeMode', (action === 'apply' || action === 'process') ? mode : null); store.set('customTweaksActive', false); }
        win.webContents.send('set-initial-mode', { activeMode: store.get('activeMode'), customTweaksActive: store.get('customTweaksActive'), networkToolActive: store.get('networkToolActive') });
    }
    if (!isTool && mode !== 'TOOL_RED_AVANZADA') {
        dialog.showMessageBox(win, { type: 'info', title: currentLanguageStrings.msg_completed_title || 'Completado', message: currentLanguageStrings.msg_completed_text || 'Finalizado.', detail: currentLanguageStrings.msg_restart_required || 'Reinicia el PC.' });
    }
}

// 5. VENTANAS
function createCustomWindow() {
    if (customWindow && !customWindow.isDestroyed()) { customWindow.show(); return; }
    customWindow = new BrowserWindow({
        width: 720, height: 750, minWidth: 600, minHeight: 500, resizable: true, frame: false, transparent: true, modal: true, show: false,
        parent: (mainWindow && !mainWindow.isDestroyed()) ? mainWindow : BrowserWindow.getFocusedWindow(),
        icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'),
        webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'custom-preload.js') }
    });
    customWindow.loadFile('custom.html');
    customWindow.once('ready-to-show', () => customWindow.show());
    customWindow.on('close', (e) => { if (!app.isQuitting) { e.preventDefault(); customWindow.hide(); } });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 840, height: 800, minWidth: 840, minHeight: 800, resizable: false, maximizable: false, frame: false, autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'),
        webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.js') }
    });
    mainWindow.loadFile('index.html');
    mainWindow.webContents.on('did-finish-load', () => {
        if (store) mainWindow.webContents.send('set-initial-mode', { activeMode: store.get('activeMode'), customTweaksActive: store.get('customTweaksActive'), networkToolActive: store.get('networkToolActive') });
        mainWindow.webContents.send('set-app-version', app.getVersion());
    });
    setTimeout(() => launchPersistentCmd(mainWindow), 1000);
    mainWindow.on('closed', () => { mainWindow = null; if (cmdProcess) try { execSync(`taskkill /PID ${cmdProcess.pid} /F /T`); } catch (e) {} });
}

app.whenReady().then(async () => { await initializeStore(); if (process.platform === 'win32' && !isRunningAsAdmin()) { exec(`Start-Process -FilePath "${process.execPath}" -Verb runas`, { 'shell': 'powershell.exe' }); app.quit(); return; } createMainWindow(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// 6. IPC
ipcMain.on('minimize-app', () => mainWindow?.minimize());
ipcMain.on('close-app', () => mainWindow?.close());
ipcMain.on('open-external-link', (e, url) => shell.openExternal(url));
ipcMain.on('download-guide', (e) => { try { fs.copyFileSync(path.join(__dirname, 'GUIA_RECOMENDACIONES.txt'), path.join(app.getPath('downloads'), 'GUIA_RECOMENDACIONES.txt')); dialog.showMessageBox(BrowserWindow.fromWebContents(e.sender), { type: 'info', title: 'Guía', message: 'Guía guardada en Descargas.' }); } catch (err) { dialog.showErrorBox('Error', 'No se pudo guardar la guía.'); } });

// --- FIX IDIOMA AQUÍ ---
ipcMain.handle('request-language', async () => ({ strings: currentLanguageStrings, currentLang: store?.get('language', 'es') || 'es' }));
ipcMain.on('change-language', (e, lang) => {
    // Si recibimos 'toggle', cambiamos al opuesto del actual
    if (lang === 'toggle') {
        const current = store ? store.get('language', 'es') : 'es';
        loadLanguage(current === 'en' ? 'es' : 'en');
    } else {
        loadLanguage(lang);
    }
    // Notificamos a todas las ventanas del cambio
    BrowserWindow.getAllWindows().forEach(w => w.webContents.send('set-language', currentLanguageStrings));
});
// -----------------------

ipcMain.on('run-tool', (e, { tool }) => { if (tools[tool]) executeCommands(mainWindow, [...tools[tool].apply], 'apply', tool); });
ipcMain.on('toggle-network-tool', () => { if (!mainWindow || isRunning) return; const isActive = store.get('networkToolActive', false); executeCommands(mainWindow, isActive ? optimizacionScripts['red-avanzada'].revert : optimizacionScripts['red-avanzada'].apply, isActive ? 'revert' : 'apply', 'TOOL_RED_AVANZADA'); });

ipcMain.on('run-optimization', (e, { applyMode, revertMode }) => {
    if (!mainWindow || isRunning) return;
    let cmds = [];
    if (revertMode && optimizacionScripts[revertMode]) cmds.push(...optimizacionScripts[revertMode].revert);
    if (applyMode && optimizacionScripts[applyMode]) cmds.push(...optimizacionScripts[applyMode].apply);
    if (cmds.length > 0) executeCommands(mainWindow, cmds, (applyMode && !revertMode) ? 'apply' : (!applyMode && revertMode) ? 'revert' : 'process', applyMode || revertMode);
});

ipcMain.on('open-custom-menu', () => createCustomWindow());
ipcMain.on('close-custom-window', () => customWindow?.hide());
ipcMain.handle('custom:get-categories', async () => Object.keys(customTweaks));
ipcMain.handle('custom:get-tweaks-for-category', async (e, c) => customTweaks[c] || []);
ipcMain.handle('load-custom-tweaks', async () => store?.get('customTweakSelection', []) || []);
ipcMain.on('save-custom-tweaks', (e, ids) => store?.set('customTweakSelection', ids));
ipcMain.handle('custom:get-tweaks-for-active-mode', async () => {
    if (!store) return [];
    const mode = store.get('activeMode');
    if (!mode || !optimizacionScripts[mode]) return [];
    const activeIds = new Set(optimizacionScripts[mode].apply.map(t => t.id).filter(id => id));
    let ids = [];
    for (const cat in customTweaks) {
        if (!Array.isArray(customTweaks[cat])) continue;
        customTweaks[cat].forEach(t => { if (activeIds.has(t.id)) ids.push(t.id); });
    }
    return ids;
});
ipcMain.on('run-custom-tweaks', (e, { action, ids }) => {
    if (!mainWindow || isRunning) return;
    let cmds = [];
    for (const cat in customTweaks) {
        if (!Array.isArray(customTweaks[cat])) continue;
        customTweaks[cat].forEach(t => { if (ids.includes(t.id) && t.apply && t.revert) cmds.push({ id: t.id, message: t.message, command: action === 'apply' ? t.apply : t.revert, isScript: (t.apply.includes('\n') || t.apply.includes('@echo')) }); });
    }
    if (cmds.length > 0) { customWindow?.hide(); executeCommands(mainWindow, cmds, action, 'custom'); }
});

autoUpdater.on('update-available', () => mainWindow?.webContents.send('update-message', { text: 'Actualización disponible!', type: 'info' }));
autoUpdater.on('update-not-available', () => mainWindow?.webContents.send('update-message', { text: 'Tu versión está al día.', type: 'success' }));
ipcMain.on('check-for-updates-manual', () => autoUpdater.checkForUpdates());