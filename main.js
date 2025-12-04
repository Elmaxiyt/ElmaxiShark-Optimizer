// main.js (v1.5.4 - FIX: BORDER MAXIMIZED)
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn, execSync, exec } = require('child_process');
const os = require('os');
const fs = require('fs');

let mainWindow = null;
let customWindow = null;
let debloatWindow = null; 
let cmdProcess = null;
let commandTimers = [];
let isRunning = false;
let store;
let currentLanguageStrings = {};
let isShellMode = false;
let autoRunData = null;

const args = process.argv;
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--runtool' && args[i + 1]) {
        isShellMode = true;
        autoRunData = { type: 'tool', target: args[i + 1] };
    } else if (args[i] === '--runmode' && args[i + 1]) {
        isShellMode = true;
        autoRunData = { type: 'mode', target: args[i + 1] };
    } else if (args[i] === '--toggletool' && args[i + 1]) {
        isShellMode = true;
        autoRunData = { type: 'toggle', target: args[i + 1] };
    }
}

const IS_PRO_VERSION = false; 

// --- CARGA DE SCRIPTS ---
let customTweaks = {}; try { customTweaks = require(path.join(__dirname, 'scripts', 'custom-tweaks.js')); } catch (e) { }
let debloatTweaks = {}; try { debloatTweaks = require(path.join(__dirname, 'scripts', 'herramienta-debloat.js')); } catch (e) { }
let shellTool; try { shellTool = require(path.join(__dirname, 'scripts', 'herramienta-shell.js')); } catch(e) {}

const tools = {
    'restauracion': require(path.join(__dirname, 'scripts', 'herramienta-restauracion.js')),
    'energia': require(path.join(__dirname, 'scripts', 'herramienta-energia.js')),
    'limpieza-sistema': require(path.join(__dirname, 'scripts', 'herramienta-limpieza-sistema.js')),
    'backup-reg': require(path.join(__dirname, 'scripts', 'herramienta-backup-reg.js')),
    'input-lag': require(path.join(__dirname, 'scripts', 'herramienta-input.js'))
};

const optimizacionScripts = {
    'basico': require(path.join(__dirname, 'scripts', 'optimizacion-basica.js')),
    'equilibrado': require(path.join(__dirname, 'scripts', 'optimizacion-equilibrada.js')),
    'extremo': require(path.join(__dirname, 'scripts', 'optimizacion-extremo.js')),
    'mododios': require(path.join(__dirname, 'scripts', 'optimizacion-mododios.js')),
    'red-avanzada': require(path.join(__dirname, 'scripts', 'herramienta-red-avanzada.js'))
};

function isRunningAsAdmin() { try { execSync('fsutil dirty query %systemdrive%'); return true; } catch { return false; } }

function loadLanguage(langCode) {
    try {
        const validLanguages = ['es', 'en', 'fr', 'de', 'pt'];
        const target = validLanguages.includes(langCode) ? langCode : 'es'; 
        currentLanguageStrings = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', `${target}.json`), 'utf8'));
        if (store) store.set('language', target);
    } catch (error) { currentLanguageStrings = {}; }
}

async function initializeStore() {
    try {
        const { default: Store } = await import('electron-store');
        store = new Store({ defaults: { activeMode: null, customTweakSelection: [], customTweaksActive: false, networkToolActive: false, debloatTweakSelection: [], debloatTweaksActive: false, shellToolActive: false, inputLagActive: false, language: 'es' } });
        loadLanguage(store.get('language', 'es'));
    } catch (err) { }
}

// --- DETECCIÓN HARDWARE ---
function getSystemInfoAsync(callback) {
    const cpuRaw = os.cpus()[0].model;
    const cpu = cpuRaw
        .replace(/\(R\)/g, '')
        .replace(/\(TM\)/g, '')
        .replace(/@.*/, '') 
        .replace(/\d+-Core Processor/, '') 
        .replace(/\d+-\s*Core/, '')        
        .replace(/Six-Core/, '')
        .replace(/Quad-Core/, '')
        .replace(/Processor/, '')
        .replace(/-$/, '')                 
        .trim();

    const totalMem = os.totalmem();
    const ramGB = Math.round(totalMem / (1024 * 1024 * 1024));
    
    const psCommand = 'powershell "Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name; echo Separator; Get-CimInstance Win32_OperatingSystem | Select-Object -ExpandProperty Caption"';
    
    exec(psCommand, (error, stdout, stderr) => {
        let finalGpu = "GPU Generic";
        let finalOs = "Windows";
        if (!error && stdout) {
            const parts = stdout.split('Separator');
            const gpus = parts[0].trim().split('\r\n');
            let foundDedicated = false;
            for (const gpu of gpus) {
                const name = gpu.trim();
                if (name.includes("NVIDIA") || name.includes("RTX") || name.includes("GTX") || (name.includes("AMD") && name.includes("RX"))) {
                    finalGpu = name; foundDedicated = true; break;
                }
            }
            if (!foundDedicated && gpus.length > 0) finalGpu = gpus[0].trim();
            if (parts[1]) finalOs = parts[1].trim().replace('Microsoft ', ''); 
        }
        callback({ cpu: cpu, ram: ramGB + " GB", gpu: finalGpu, os: finalOs });
    });
}

// --- ESCÁNER BASURA ---
async function scanJunkMB() {
    let totalSize = 0;
    const folders = [os.tmpdir(), 'C:\\Windows\\Temp', 'C:\\Windows\\Prefetch', path.join(process.env.SystemRoot, 'SoftwareDistribution', 'Download')];
    for (const folder of folders) {
        try {
            if (fs.existsSync(folder)) {
                const files = await fs.promises.readdir(folder);
                for (const file of files) {
                    try {
                        const stats = await fs.promises.stat(path.join(folder, file));
                        totalSize += stats.size;
                    } catch (e) {}
                }
            }
        } catch (e) {}
    }
    return Math.round(totalSize / (1024 * 1024));
}

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
            let localizedMessage = cmd.message;
            if (cmd.id && currentLanguageStrings[cmd.id]) {
                localizedMessage = currentLanguageStrings[cmd.id];
            }

            win.webContents.send('log-update', { id: cmd.id, message: localizedMessage, command: cmd.command });
            win.webContents.send('progress-update', { percentage: pct, text: `${pct}%`, isRunning: true, currentCommand: i, totalCommands: total });
            try {
                cmdProcess.stdin.write(`echo [LOG] ${localizedMessage}\n`);
                if (cmd.isScript) {
                    const temp = path.join(os.tmpdir(), 'emx_temp.bat');
                    fs.writeFileSync(temp, cmd.command, 'utf8');
                    cmdProcess.stdin.write(`call "${temp}"\n`);
                } else { cmdProcess.stdin.write(`${cmd.command}\n`); }
                cmdProcess.stdin.write('echo.\n');
            } catch (e) {}
        }
        commandTimers.push(setTimeout(runNext, 75));
    }
    runNext();
}

function finishExecution(win, mode, action) {
    isRunning = false;
    if (!win || win.isDestroyed()) return;
    const endMsg = currentLanguageStrings['log_process_completed'] || '¡Proceso completado!';
    win.webContents.send('progress-update', { percentage: 100, text: 'Completado', isRunning: false });
    win.webContents.send('log-update', { message: endMsg, command: "=== FIN ===" });

    if (store) {
        if (mode === 'TOOL_RED_AVANZADA') store.set('networkToolActive', action === 'apply');
        else if (mode === 'input-lag') store.set('inputLagActive', action === 'apply');
        else if (mode === 'shell') store.set('shellToolActive', action === 'apply');
        else if (mode === 'debloat') store.set('debloatTweaksActive', action === 'apply');
        else if (mode === 'custom') { store.set('customTweaksActive', action === 'apply'); store.set('activeMode', null); }
        else if (['basico', 'equilibrado', 'extremo', 'mododios'].includes(mode)) { 
             store.set('activeMode', (action === 'apply' || action === 'process') ? mode : null);
             store.set('customTweaksActive', false);
        }
        win.webContents.send('set-initial-mode', { 
            activeMode: store.get('activeMode'), 
            customTweaksActive: store.get('customTweaksActive'), 
            debloatTweaksActive: store.get('debloatTweaksActive'),
            networkToolActive: store.get('networkToolActive'), 
            shellToolActive: store.get('shellToolActive'),
            inputLagActive: store.get('inputLagActive')
        });
    }
    
    if (mode === 'limpieza-sistema') {
        setTimeout(async () => {
            const mb = await scanJunkMB();
            win.webContents.send('update-junk-status', mb);
        }, 2000);
    }

    if (isShellMode) {
        setTimeout(() => { app.quit(); }, 800);
    } else {
        const MODES_NEED_RESTART = ['basico', 'equilibrado', 'extremo', 'mododios', 'custom'];
        let detailText = "";
        if (MODES_NEED_RESTART.includes(mode)) detailText = currentLanguageStrings.msg_restart_required || 'Reinicia el PC.';
        
        const dialogTitle = currentLanguageStrings.msg_completed_title || 'Completado';
        const dialogMessage = currentLanguageStrings.msg_finished || 'Finalizado.';
        
        dialog.showMessageBox(win, { 
            type: 'info', 
            title: dialogTitle, 
            message: dialogMessage, 
            detail: detailText 
        });
    }
}

function createDebloatWindow() { if (debloatWindow && !debloatWindow.isDestroyed()) { debloatWindow.show(); return; } debloatWindow = new BrowserWindow({ width: 800, height: 750, resizable: true, frame: false, transparent: false, backgroundColor: '#000000', modal: true, show: false, parent: mainWindow, icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'), webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'debloat-preload.js') } }); debloatWindow.loadFile('debloat.html'); debloatWindow.once('ready-to-show', () => debloatWindow.show()); debloatWindow.on('close', (e) => { if (!app.isQuitting) { e.preventDefault(); debloatWindow.hide(); } }); }
function createCustomWindow() { if (customWindow && !customWindow.isDestroyed()) { customWindow.show(); return; } customWindow = new BrowserWindow({ width: 720, height: 750, resizable: true, frame: false, transparent: false, backgroundColor: '#000000', modal: true, show: false, parent: mainWindow, icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'), webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'custom-preload.js') } }); customWindow.loadFile('custom.html'); customWindow.once('ready-to-show', () => customWindow.show()); customWindow.on('close', (e) => { if (!app.isQuitting) { e.preventDefault(); customWindow.hide(); } }); }

function createMainWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1000, height: 800, minWidth: 860, minHeight: 700,
        resizable: true, maximizable: true, frame: false, autoHideMenuBar: true, 
        icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'), 
        webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.js') } 
    });
    mainWindow.loadFile('index.html');

    // --- CORRECCIÓN DE BORDES: DETECTAR ESTADO DE VENTANA ---
    mainWindow.on('maximize', () => mainWindow.webContents.send('window-state-change', 'maximized'));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-state-change', 'normal'));
    mainWindow.on('restore', () => mainWindow.webContents.send('window-state-change', 'normal'));
    // --------------------------------------------------------

    mainWindow.webContents.on('did-finish-load', () => {
        if (store) {
            mainWindow.webContents.send('set-initial-mode', { 
                activeMode: store.get('activeMode'), 
                customTweaksActive: store.get('customTweaksActive'),
                debloatTweaksActive: store.get('debloatTweaksActive'), 
                networkToolActive: store.get('networkToolActive'), 
                shellToolActive: store.get('shellToolActive'),
                inputLagActive: store.get('inputLagActive')
            });
            if (store.get('shellToolActive')) { try { const shellScriptPath = path.join(__dirname, 'scripts', 'herramienta-shell.js'); delete require.cache[require.resolve(shellScriptPath)]; const currentShellTool = require(shellScriptPath); } catch (error) { } }
        }
        mainWindow.webContents.send('set-app-version', app.getVersion());
        getSystemInfoAsync((info) => { mainWindow.webContents.send('update-sys-info', info); });
        scanJunkMB().then(mb => mainWindow.webContents.send('update-junk-status', mb));

        // --- AUTOMATIZACIÓN SHELL TOOLS ---
        if (isShellMode && autoRunData) {
            setTimeout(() => {
                if (autoRunData.type === 'tool') {
                    if (tools[autoRunData.target]) executeCommands(mainWindow, [...tools[autoRunData.target].apply], 'apply', autoRunData.target);
                } 
                else if (autoRunData.type === 'mode') {
                    if (optimizacionScripts[autoRunData.target]) {
                        executeCommands(mainWindow, [...optimizacionScripts[autoRunData.target].apply], 'apply', autoRunData.target);
                    }
                }
                else if (autoRunData.type === 'toggle') {
                    if (autoRunData.target === 'red-avanzada') {
                        const isActive = store.get('networkToolActive', false);
                        executeCommands(mainWindow, isActive ? optimizacionScripts['red-avanzada'].revert : optimizacionScripts['red-avanzada'].apply, isActive ? 'revert' : 'apply', 'TOOL_RED_AVANZADA');
                    }
                    else if (autoRunData.target === 'input-lag') {
                        const isActive = store.get('inputLagActive', false);
                        let commands = [];
                        let action = '';
                        if (isActive) {
                            action = 'revert';
                            commands = tools['input-lag'].revert || [ { id: 'revert_mouse_defaults', message: "Restaurando configuración...", command: 'reg add "HKCU\\Control Panel\\Mouse" /v "MouseSpeed" /t REG_SZ /d "1" /f & reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold1" /t REG_SZ /d "6" /f & reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold2" /t REG_SZ /d "10" /f' } ]; 
                        } else {
                            action = 'apply';
                            commands = tools['input-lag'].apply;
                        }
                        executeCommands(mainWindow, commands, action, 'input-lag');
                    }
                }
            }, 500);
        }
    });
    setTimeout(() => launchPersistentCmd(mainWindow), 1000);
    mainWindow.on('closed', () => { mainWindow = null; if (cmdProcess) try { execSync(`taskkill /PID ${cmdProcess.pid} /F /T`); } catch (e) {} });
}

ipcMain.on('maximize-app', () => { if (mainWindow) { if (mainWindow.isMaximized()) mainWindow.unmaximize(); else mainWindow.maximize(); } });

if (process.argv.length > 1) { }
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) { app.quit(); } else {
  app.on('second-instance', (event, commandLine, workingDirectory) => { if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); } });
  app.whenReady().then(async () => { 
      await initializeStore(); 
      if (process.platform === 'win32' && !isRunningAsAdmin()) { exec(`Start-Process -FilePath "${process.execPath}" -Verb runas`, { 'shell': 'powershell.exe' }); app.quit(); return; } 
      createMainWindow(); 
  });
}

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
ipcMain.on('minimize-app', () => mainWindow?.minimize());
ipcMain.on('close-app', () => mainWindow?.close());
ipcMain.on('download-guide', (e) => { 
    try { 
        const downloadsPath = app.getPath('downloads');
        const lang = store.get('language', 'es');
        const langCode = lang.toUpperCase();
        const docsPath = path.join(__dirname, 'docs');
        
        fs.copyFileSync(path.join(docsPath, `GUIA_${lang}.txt`), path.join(downloadsPath, `GUIA_RECOMENDACIONES_${langCode}.txt`));
        fs.copyFileSync(path.join(docsPath, `DICCIONARIO_${lang}.txt`), path.join(downloadsPath, `DICCIONARIO_TWEAKS_${langCode}.txt`));
        
        const dialogTitle = currentLanguageStrings.dialog_guide_title || 'Descarga Completada';
        const dialogMessage = currentLanguageStrings.dialog_guide_message || 'Guías guardadas en tu carpeta de Descargas.';
        
        dialog.showMessageBox(BrowserWindow.fromWebContents(e.sender), { type: 'info', title: dialogTitle, message: dialogMessage }); 
    } catch (err) { 
        const errorTitle = currentLanguageStrings.dialog_error_title || 'Error de Archivo';
        const errorMessage = currentLanguageStrings.dialog_error_message || 'No se encontraron las guías para este idioma.';
        dialog.showMessageBox(BrowserWindow.fromWebContents(e.sender), { type: 'error', title: errorTitle, message: errorMessage });
    } 
});
ipcMain.on('open-external-link', (e, url) => shell.openExternal(url));
ipcMain.handle('request-language', async () => ({ strings: currentLanguageStrings, currentLang: store?.get('language', 'es') || 'es' }));
ipcMain.handle('request-pro-status', async () => IS_PRO_VERSION);
ipcMain.on('change-language', (e, lang) => { loadLanguage(lang); BrowserWindow.getAllWindows().forEach(w => w.webContents.send('set-language', currentLanguageStrings)); });

ipcMain.on('run-tool', (e, { tool }) => { 
    if (tools[tool]) { executeCommands(mainWindow, [...tools[tool].apply], 'apply', tool); }
    else if (tool === 'debloat') createDebloatWindow(); 
    else if (tool === 'shell') { const isInstalled = store.get('shellToolActive', false); executeCommands(mainWindow, isInstalled ? shellTool.revert : shellTool.apply, isInstalled ? 'revert' : 'apply', 'shell'); } 
});

ipcMain.on('toggle-network-tool', () => { const isActive = store.get('networkToolActive', false); executeCommands(mainWindow, isActive ? optimizacionScripts['red-avanzada'].revert : optimizacionScripts['red-avanzada'].apply, isActive ? 'revert' : 'apply', 'TOOL_RED_AVANZADA'); });

ipcMain.on('toggle-input-tool', () => {
    const isActive = store.get('inputLagActive', false);
    let commands = [];
    let action = '';
    if (isActive) {
        action = 'revert';
        commands = tools['input-lag'].revert || [ { id: 'revert_mouse_defaults', message: "Restaurando configuración...", command: 'reg add "HKCU\\Control Panel\\Mouse" /v "MouseSpeed" /t REG_SZ /d "1" /f & reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold1" /t REG_SZ /d "6" /f & reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold2" /t REG_SZ /d "10" /f' } ]; 
    } else {
        action = 'apply';
        commands = tools['input-lag'].apply;
    }
    executeCommands(mainWindow, commands, action, 'input-lag');
});

ipcMain.on('run-optimization', (e, { applyMode, revertMode }) => { if (!mainWindow || isRunning) return; let cmds = []; if (store.get('customTweaksActive')) { const activeCustomIds = store.get('customTweakSelection', []); if (activeCustomIds.length > 0) { cmds.push({ message: "Revirtiendo Custom...", command: "echo Revertir Custom..." }); for (const cat in customTweaks) { if (!Array.isArray(customTweaks[cat])) continue; customTweaks[cat].forEach(t => { if (activeCustomIds.includes(t.id) && t.revert) { cmds.push({ id: t.id, message: t.message, command: t.revert, isScript: (t.revert.includes('\n') || t.revert.includes('@echo')) }); } }); } } store.set('customTweaksActive', false); } if (revertMode && optimizacionScripts[revertMode]) cmds.push(...optimizacionScripts[revertMode].revert); if (applyMode && optimizacionScripts[applyMode]) cmds.push(...optimizacionScripts[applyMode].apply); if (cmds.length > 0) { let actionType = 'process'; if (applyMode && !revertMode) actionType = 'apply'; else if (!applyMode && revertMode) actionType = 'revert'; executeCommands(mainWindow, cmds, actionType, applyMode || revertMode || 'CustomCleanup'); } });
ipcMain.on('open-custom-menu', () => createCustomWindow()); ipcMain.handle('custom:get-categories', async () => Object.keys(customTweaks)); ipcMain.handle('custom:get-tweaks-for-category', async (e, c) => customTweaks[c] || []); ipcMain.handle('load-custom-tweaks', async () => store?.get('customTweakSelection', []) || []); ipcMain.on('save-custom-tweaks', (e, ids) => store?.set('customTweakSelection', ids)); ipcMain.handle('custom:get-tweaks-for-active-mode', async () => { if (!store) return []; const mode = store.get('activeMode'); if (!mode || !optimizacionScripts[mode]) return []; const activeIds = new Set(optimizacionScripts[mode].apply.map(t => t.id).filter(id => id)); let ids = []; for (const cat in customTweaks) { if (!Array.isArray(customTweaks[cat])) continue; customTweaks[cat].forEach(t => { if (activeIds.has(t.id)) ids.push(t.id); }); } return ids; }); ipcMain.on('run-custom-tweaks', (e, { action, ids }) => { let cmds = []; for (const cat in customTweaks) { if (!Array.isArray(customTweaks[cat])) continue; customTweaks[cat].forEach(t => { if (ids.includes(t.id) && t.apply && t.revert) cmds.push({ id: t.id, message: t.message, command: action === 'apply' ? t.apply : t.revert, isScript: (t.apply.includes('\n') || t.apply.includes('@echo')) }); }); } if (cmds.length > 0) { customWindow?.hide(); executeCommands(mainWindow, cmds, action, 'custom'); } }); 
ipcMain.on('close-custom-window', () => { if(customWindow && !customWindow.isDestroyed()) customWindow.hide(); });
ipcMain.handle('debloat:get-categories', async () => Object.keys(debloatTweaks)); ipcMain.handle('debloat:get-tweaks-for-category', async (e, c) => debloatTweaks[c] || []); ipcMain.handle('load-debloat-tweaks', async () => store?.get('debloatTweakSelection', []) || []); ipcMain.on('save-debloat-tweaks', (e, ids) => store?.set('debloatTweakSelection', ids)); ipcMain.on('run-debloat-tweaks', (e, { action, ids }) => { let cmds = []; for (const cat in debloatTweaks) { if (!Array.isArray(debloatTweaks[cat])) continue; debloatTweaks[cat].forEach(t => { if (ids.includes(t.id) && t.apply && t.revert) cmds.push({ id: t.id, message: t.message, command: action === 'apply' ? t.apply : t.revert, isScript: (t.apply.includes('\n') || t.apply.includes('@echo')) }); }); } if (cmds.length > 0) { debloatWindow?.hide(); executeCommands(mainWindow, cmds, action, 'debloat'); } }); ipcMain.on('close-debloat-window', () => debloatWindow?.hide());