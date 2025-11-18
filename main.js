// main.js (v3.5 - FINAL STABLE: Fix Black Screen & ASAR Paths)
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn, execSync, exec } = require('child_process');
const os = require('os');
const fs = require('fs');

// 1. VARIABLES
let mainWindow = null;
let customWindow = null;
let debloatWindow = null; 
let cmdProcess = null;
let commandTimers = [];
let isRunning = false;
let store;
let currentLanguageStrings = {};
let isShellMode = false;

// 2. CARGA SCRIPTS (USANDO path.join PARA EVITAR PANTALLA NEGRA EN .EXE)
let customTweaks = {};
try { 
    customTweaks = require(path.join(__dirname, 'scripts', 'custom-tweaks.js')); 
} catch (e) { console.error("Custom Error:", e.message); }

let debloatTweaks = {};
try { 
    debloatTweaks = require(path.join(__dirname, 'scripts', 'herramienta-debloat.js')); 
} catch (e) { 
    console.error("Debloat Error:", e.message);
    debloatTweaks = {}; // Evita crash si falla la carga
}

// Carga segura de herramientas
let shellTool, get_emx_plan_command;
try { shellTool = require(path.join(__dirname, 'scripts', 'herramienta-shell.js')); } catch(e) {}
try { get_emx_plan_command = require(path.join(__dirname, 'scripts', 'herramienta-energia.js')).activate_emx_plan; } catch(e) {}

const tools = {
    'restauracion': require(path.join(__dirname, 'scripts', 'herramienta-restauracion.js')),
    'energia': require(path.join(__dirname, 'scripts', 'herramienta-energia.js')),
    'limpieza-sistema': require(path.join(__dirname, 'scripts', 'herramienta-limpieza-sistema.js')),
    'backup-reg': require(path.join(__dirname, 'scripts', 'herramienta-backup-reg.js'))
};

const optimizacionScripts = {
    'basico': require(path.join(__dirname, 'scripts', 'optimizacion-basica.js')),
    'equilibrado': require(path.join(__dirname, 'scripts', 'optimizacion-equilibrada.js')),
    'extremo': require(path.join(__dirname, 'scripts', 'optimizacion-extremo.js')),
    'mododios': require(path.join(__dirname, 'scripts', 'optimizacion-mododios.js')),
    'red-avanzada': require(path.join(__dirname, 'scripts', 'herramienta-red-avanzada.js'))
};

// 3. UTILIDADES
function isRunningAsAdmin() { try { execSync('fsutil dirty query %systemdrive%'); return true; } catch { return false; } }

function loadLanguage(langCode) {
    try {
        const target = ['es', 'en'].includes(langCode) ? langCode : 'es';
        currentLanguageStrings = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', `${target}.json`), 'utf8'));
        if (store) store.set('language', target);
    } catch (error) { currentLanguageStrings = {}; }
}

async function initializeStore() {
    try {
        const { default: Store } = await import('electron-store');
        store = new Store({ defaults: { activeMode: null, customTweakSelection: [], customTweaksActive: false, networkToolActive: false, debloatTweakSelection: [], debloatTweaksActive: false, shellToolActive: false, language: 'es' } });
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
        // VELOCIDAD: 75ms
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

    const SIMPLE_TOOLS = ['restauracion', 'energia', 'limpieza-sistema', 'backup-reg', 'activate_emx_plan'];
    
    if (store) {
        if (mode === 'TOOL_RED_AVANZADA') store.set('networkToolActive', action === 'apply');
        else if (mode === 'shell' && action !== 'toggle_red') store.set('shellToolActive', action === 'apply');
        else if (mode === 'shell' && action === 'toggle_red') store.set('networkToolActive', !store.get('networkToolActive', false));
        else if (mode === 'debloat') store.set('debloatTweaksActive', action === 'apply');
        else if (mode === 'custom') {
            store.set('customTweaksActive', action === 'apply');
            store.set('activeMode', null);
        }
        else if (!SIMPLE_TOOLS.includes(mode)) { 
             store.set('activeMode', (action === 'apply' || action === 'process') ? mode : null);
             store.set('customTweaksActive', false);
        }

        win.webContents.send('set-initial-mode', { 
            activeMode: store.get('activeMode'), 
            customTweaksActive: store.get('customTweaksActive'), 
            debloatTweaksActive: store.get('debloatTweaksActive'),
            networkToolActive: store.get('networkToolActive'), 
            shellToolActive: store.get('shellToolActive')
        });
    }
    
    // LÓGICA INTELIGENTE DE MENSAJES
    const MODES_NEED_RESTART = ['basico', 'equilibrado', 'extremo', 'mododios', 'custom'];
    if (!isShellMode) {
        let detailText = "";
        if (MODES_NEED_RESTART.includes(mode)) {
            detailText = currentLanguageStrings.msg_restart_required || 'Reinicia el PC.';
        }
        dialog.showMessageBox(win, { 
            type: 'info', 
            title: currentLanguageStrings.msg_completed_title || 'Completado', 
            message: currentLanguageStrings.msg_completed_text || 'Finalizado.', 
            detail: detailText 
        });
    }
    
    if (isShellMode) {
        setTimeout(() => { app.quit(); }, 1000);
    }
}

// 5. VENTANAS (Debloat y Custom)
function createDebloatWindow() {
    if (debloatWindow && !debloatWindow.isDestroyed()) { debloatWindow.show(); return; }
    debloatWindow = new BrowserWindow({ 
        width: 800, height: 750, 
        resizable: true, frame: false, 
        transparent: false, backgroundColor: '#000000', // Fondo negro seguro
        modal: true, show: false, 
        parent: mainWindow, 
        icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'), 
        webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'debloat-preload.js') } 
    });
    debloatWindow.loadFile('debloat.html');
    
    // Si vuelve a salir negra, descomenta esta línea para ver el error:
    // debloatWindow.webContents.openDevTools({ mode: 'detach' });

    debloatWindow.once('ready-to-show', () => debloatWindow.show());
    debloatWindow.on('close', (e) => { if (!app.isQuitting) { e.preventDefault(); debloatWindow.hide(); } });
}

function createCustomWindow() {
    if (customWindow && !customWindow.isDestroyed()) { customWindow.show(); return; }
    customWindow = new BrowserWindow({ 
        width: 720, height: 750, 
        resizable: true, frame: false, 
        transparent: false, backgroundColor: '#000000', // Fondo negro seguro
        modal: true, show: false, 
        parent: mainWindow, 
        icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'), 
        webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'custom-preload.js') } 
    });
    customWindow.loadFile('custom.html');
    customWindow.once('ready-to-show', () => customWindow.show());
    customWindow.on('close', (e) => { if (!app.isQuitting) { e.preventDefault(); customWindow.hide(); } });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({ width: 840, height: 800, resizable: false, maximizable: false, frame: false, autoHideMenuBar: true, icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'), webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.js') } });
    mainWindow.loadFile('index.html');
    
    mainWindow.webContents.on('did-finish-load', () => {
        if (store) {
            mainWindow.webContents.send('set-initial-mode', { 
                activeMode: store.get('activeMode'), 
                customTweaksActive: store.get('customTweaksActive'),
                debloatTweaksActive: store.get('debloatTweaksActive'), 
                networkToolActive: store.get('networkToolActive'), 
                shellToolActive: store.get('shellToolActive') 
            });

            // AUTO-REPARACIÓN DEL MENÚ CONTEXTUAL
            if (store.get('shellToolActive')) {
                try {
                    // Usamos path.join también aquí para asegurar la carga
                    const shellScriptPath = path.join(__dirname, 'scripts', 'herramienta-shell.js');
                    delete require.cache[require.resolve(shellScriptPath)];
                    const currentShellTool = require(shellScriptPath);
                    currentShellTool.apply.forEach(item => {
                        try { execSync(item.command); } catch (err) { }
                    });
                } catch (error) { console.error("Auto-Fix Shell Error:", error); }
            }
        }
        mainWindow.webContents.send('set-app-version', app.getVersion());
    });
    
    setTimeout(() => launchPersistentCmd(mainWindow), 1000);
    mainWindow.on('closed', () => { mainWindow = null; if (cmdProcess) try { execSync(`taskkill /PID ${cmdProcess.pid} /F /T`); } catch (e) {} });
}

// 6. MANEJO DE LÍNEA DE COMANDOS
if (process.argv.length > 1) {
    const args = process.argv.slice(1);
    const runToolIndex = args.indexOf('--runtool') > -1 ? args.indexOf('--runtool') : args.indexOf('/runtool');
    const toggleToolIndex = args.indexOf('--toggletool') > -1 ? args.indexOf('--toggletool') : args.indexOf('/toggletool');
    const runModeIndex = args.indexOf('--runmode') > -1 ? args.indexOf('--runmode') : args.indexOf('/runmode');
    
    if (runToolIndex > -1 && args[runToolIndex + 1]) {
        const toolName = args[runToolIndex + 1];
        let toolCommand;
        if (toolName === 'activate_emx_plan') toolCommand = get_emx_plan_command; 
        else if (tools[toolName]) toolCommand = tools[toolName].apply; 
        
        if (toolCommand) {
            isShellMode = true;
            app.whenReady().then(async () => {
                await initializeStore();
                createMainWindow();
                mainWindow.setAlwaysOnTop(true, "screen-saver");
                mainWindow.once('ready-to-show', () => {
                    mainWindow.show(); mainWindow.focus();
                    executeCommands(mainWindow, Array.isArray(toolCommand) ? toolCommand : [toolCommand], 'apply', toolName);
                });
            });
        }
    } else if (toggleToolIndex > -1 && args[toggleToolIndex + 1] === 'red-avanzada') {
        isShellMode = true;
        app.whenReady().then(async () => {
            await initializeStore();
            createMainWindow();
            mainWindow.setAlwaysOnTop(true, "screen-saver");
            mainWindow.once('ready-to-show', () => {
                mainWindow.show(); mainWindow.focus();
                const isActive = store.get('networkToolActive', false);
                const script = optimizacionScripts['red-avanzada'];
                executeCommands(mainWindow, isActive ? script.revert : script.apply, 'toggle_red', 'shell'); 
            });
        });
    }
    // SOPORTE PARA MODOS (Con Auto-Revert)
    else if (runModeIndex > -1 && args[runModeIndex + 1]) {
        const targetMode = args[runModeIndex + 1];
        if (optimizacionScripts[targetMode]) {
            isShellMode = true;
            app.whenReady().then(async () => {
                await initializeStore();
                createMainWindow();
                mainWindow.setAlwaysOnTop(true, "screen-saver");
                
                mainWindow.once('ready-to-show', () => {
                    mainWindow.show(); mainWindow.focus();
                    let cmds = [];

                    if (store.get('customTweaksActive')) {
                        const activeCustomIds = store.get('customTweakSelection', []);
                        if (activeCustomIds.length > 0) {
                            cmds.push({ message: "--- REVIRTIENDO CUSTOM PREVIO ---", command: "echo Revertir Custom..." });
                            for (const cat in customTweaks) {
                                if (!Array.isArray(customTweaks[cat])) continue;
                                customTweaks[cat].forEach(t => {
                                    if (activeCustomIds.includes(t.id) && t.revert) {
                                        cmds.push({ id: t.id, message: `Revertir Custom: ${t.message}`, command: t.revert, isScript: (t.revert.includes('\n') || t.revert.includes('@echo')) });
                                    }
                                });
                            }
                        }
                        store.set('customTweaksActive', false);
                    }

                    const previousMode = store.get('activeMode');
                    if (previousMode && previousMode !== targetMode && optimizacionScripts[previousMode]) {
                        cmds.push(...optimizacionScripts[previousMode].revert);
                    }

                    cmds.push(...optimizacionScripts[targetMode].apply);
                    if (cmds.length > 0) executeCommands(mainWindow, cmds, 'process', targetMode);
                    else app.quit();
                });
            });
        }
    }
}

// INICIO NORMAL
if (!isShellMode) {
    app.whenReady().then(async () => { 
        await initializeStore(); 
        if (process.platform === 'win32' && !isRunningAsAdmin()) { 
            exec(`Start-Process -FilePath "${process.execPath}" -Verb runas`, { 'shell': 'powershell.exe' }); 
            app.quit(); 
            return; 
        } 
        createMainWindow();
    });
}

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
ipcMain.on('minimize-app', () => mainWindow?.minimize());
ipcMain.on('close-app', () => mainWindow?.close());
ipcMain.on('open-external-link', (e, url) => shell.openExternal(url));

ipcMain.on('download-guide', (e) => { 
    try { 
        const downloadsPath = app.getPath('downloads');
        fs.copyFileSync(path.join(__dirname, 'GUIA_RECOMENDACIONES.txt'), path.join(downloadsPath, 'GUIA_RECOMENDACIONES.txt'));
        fs.copyFileSync(path.join(__dirname, 'DICCIONARIO_TWEAKS.txt'), path.join(downloadsPath, 'DICCIONARIO_TWEAKS.txt'));
        dialog.showMessageBox(BrowserWindow.fromWebContents(e.sender), { type: 'info', title: 'Descarga Completada', message: 'Se han guardado 2 archivos en tu carpeta de Descargas:\n\n1. GUIA_RECOMENDACIONES.txt\n2. DICCIONARIO_TWEAKS.txt' }); 
    } catch (err) { dialog.showErrorBox('Error', 'Error guardando guías.'); } 
});

ipcMain.handle('request-language', async () => ({ strings: currentLanguageStrings, currentLang: store?.get('language', 'es') || 'es' }));
ipcMain.on('change-language', (e, lang) => {
    const current = store ? store.get('language', 'es') : 'es';
    loadLanguage(lang === 'toggle' ? (current === 'en' ? 'es' : 'en') : lang);
    BrowserWindow.getAllWindows().forEach(w => w.webContents.send('set-language', currentLanguageStrings));
});

ipcMain.on('run-tool', (e, { tool }) => { 
    if (tools[tool]) executeCommands(mainWindow, [...tools[tool].apply], 'apply', tool); 
    else if (tool === 'debloat') createDebloatWindow();
    else if (tool === 'shell') {
        const isInstalled = store.get('shellToolActive', false);
        executeCommands(mainWindow, isInstalled ? shellTool.revert : shellTool.apply, isInstalled ? 'revert' : 'apply', 'shell');
    }
});
ipcMain.on('toggle-network-tool', () => { 
    const isActive = store.get('networkToolActive', false); 
    executeCommands(mainWindow, isActive ? optimizacionScripts['red-avanzada'].revert : optimizacionScripts['red-avanzada'].apply, isActive ? 'revert' : 'apply', 'TOOL_RED_AVANZADA'); 
});
ipcMain.on('run-optimization', (e, { applyMode, revertMode }) => {
    if (!mainWindow || isRunning) return;
    let cmds = [];
    if (store.get('customTweaksActive')) {
        const activeCustomIds = store.get('customTweakSelection', []);
        if (activeCustomIds.length > 0) {
            cmds.push({ message: "--- REVIRTIENDO MODO CUSTOM PREVIO ---", command: "echo Revertir Custom..." });
            for (const cat in customTweaks) {
                if (!Array.isArray(customTweaks[cat])) continue;
                customTweaks[cat].forEach(t => {
                    if (activeCustomIds.includes(t.id) && t.revert) {
                        cmds.push({ id: t.id, message: `Revertir Custom: ${t.message}`, command: t.revert, isScript: (t.revert.includes('\n') || t.revert.includes('@echo')) });
                    }
                });
            }
        }
        store.set('customTweaksActive', false);
    }
    if (revertMode && optimizacionScripts[revertMode]) cmds.push(...optimizacionScripts[revertMode].revert);
    if (applyMode && optimizacionScripts[applyMode]) cmds.push(...optimizacionScripts[applyMode].apply);
    if (cmds.length > 0) {
        let actionType = 'process';
        if (applyMode && !revertMode) actionType = 'apply';
        else if (!applyMode && revertMode) actionType = 'revert';
        executeCommands(mainWindow, cmds, actionType, applyMode || revertMode || 'CustomCleanup');
    }
});

ipcMain.on('open-custom-menu', () => createCustomWindow()); 
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
    let cmds = [];
    for (const cat in customTweaks) {
        if (!Array.isArray(customTweaks[cat])) continue;
        customTweaks[cat].forEach(t => { if (ids.includes(t.id) && t.apply && t.revert) cmds.push({ id: t.id, message: t.message, command: action === 'apply' ? t.apply : t.revert, isScript: (t.apply.includes('\n') || t.apply.includes('@echo')) }); });
    }
    if (cmds.length > 0) { customWindow?.hide(); executeCommands(mainWindow, cmds, action, 'custom'); }
});
ipcMain.on('close-custom-window', () => customWindow?.hide()); 

ipcMain.handle('debloat:get-categories', async () => Object.keys(debloatTweaks));
ipcMain.handle('debloat:get-tweaks-for-category', async (e, c) => debloatTweaks[c] || []);
ipcMain.handle('load-debloat-tweaks', async () => store?.get('debloatTweakSelection', []) || []);
ipcMain.on('save-debloat-tweaks', (e, ids) => store?.set('debloatTweakSelection', ids));
ipcMain.on('run-debloat-tweaks', (e, { action, ids }) => {
    let cmds = [];
    for (const cat in debloatTweaks) {
        if (!Array.isArray(debloatTweaks[cat])) continue;
        debloatTweaks[cat].forEach(t => { if (ids.includes(t.id) && t.apply && t.revert) cmds.push({ id: t.id, message: t.message, command: action === 'apply' ? t.apply : t.revert, isScript: (t.apply.includes('\n') || t.apply.includes('@echo')) }); });
    }
    if (cmds.length > 0) { debloatWindow?.hide(); executeCommands(mainWindow, cmds, action, 'debloat'); }
});
ipcMain.on('close-debloat-window', () => debloatWindow?.hide());