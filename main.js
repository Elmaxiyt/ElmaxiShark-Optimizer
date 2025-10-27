// main.js (Completo - v1.1 con Advertencias y Lógica Overdrive)

const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron'); // Aseguramos dialog
const path = require('path');
const { spawn, execSync, exec } = require('child_process');
const os = require('os');
const fs = require('fs');

let cmdProcess = null;
let commandTimers = [];
let isRunning = false;
let store; // Declaramos store aquí

// --- Función asíncrona para inicializar Store ---
async function initializeStore() {
  try {
    const { default: Store } = await import('electron-store');
    store = new Store();
    console.log("electron-store inicializado correctamente.");
  } catch (err) {
    console.error("!!! Error CRÍTICO al inicializar electron-store:", err);
  }
}

// Función para chequear si somos admin
function isRunningAsAdmin() {
  if (process.platform === 'win32') {
    try {
      execSync('fsutil dirty query %systemdrive%');
      return true;
    } catch (e) {
      console.log('Error al chequear admin (esto es normal si no lo somos):', e.message);
      return false;
    }
  }
  return true;
}

// Función para lanzar CMD
function launchPersistentCmd(win) {
    if (!cmdProcess || cmdProcess.killed) {
        console.log('Iniciando nuevo proceso CMD persistente...');
        cmdProcess = spawn('cmd.exe', ['/k'], { stdio: ['pipe', 'ignore', 'ignore'] });
        try {
            cmdProcess.stdin.write('chcp 65001 >nul\n');
            cmdProcess.stdin.write('mode con: cols=120 lines=40\n');
            cmdProcess.stdin.write('title ElmaxiShark Optimizer - Log de Comandos\n');
            cmdProcess.stdin.write('cls\n');
            cmdProcess.stdin.write('echo off\n');
            cmdProcess.stdin.write('echo =========================================\n');
            cmdProcess.stdin.write('echo     ElmaxiShark Optimizer v1.0 - Consola de Log\n');
            cmdProcess.stdin.write('echo =========================================\n\n');
            cmdProcess.stdin.write('echo Esperando acciones del usuario...\n');
            cmdProcess.stdin.write('echo.\n');
        } catch (e) { console.error(`Error al inicializar CMD: ${e.message}`); }

        cmdProcess.on('close', (code) => {
            console.log(`Proceso CMD cerrado con código ${code}`);
            if (win && !win.isDestroyed()) {
                win.webContents.send('log-update', { message: `[INFO] Consola CMD cerrada (codigo ${code})`, command: "=== PROCESO CMD FINALIZADO ===" });
            }
            cmdProcess = null; isRunning = false;
        });
        cmdProcess.on('error', (err) => {
            console.error(`Error al iniciar CMD: ${err.message}`);
            if (win && !win.isDestroyed()) {
                win.webContents.send('log-update', { message: `[ERROR] Error al iniciar CMD: ${err.message}`, command: "!!! ERROR DE SPAWN !!!" });
            }
            cmdProcess = null; isRunning = false;
        });
    }
}


// Función executeCommands (Con Barra de Progreso y Guardado)
function executeCommands(win, commands, action, mode) {
    if (isRunning) {
        if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: '[ERROR] Espere a que termine el proceso actual.', command: "!!! PROCESO OCUPADO !!!" }); }
        return;
    }
    isRunning = true;
    commandTimers.forEach(timer => clearTimeout(timer));
    commandTimers = [];
    launchPersistentCmd(win);

    // --- BARRA DE PROGRESO: Enviar 0% al inicio ---
    if (win && !win.isDestroyed()) {
        win.webContents.send('progress-update', { percentage: 0, text: 'Iniciando...', isRunning: true });
    }

    try {
        cmdProcess.stdin.write('cls\n');
        cmdProcess.stdin.write('echo off\n');
        cmdProcess.stdin.write('echo =========================================\n');
        let logMessage;
        if (mode === 'limpieza-sistema' || mode === 'restauracion' || mode === 'energia') { logMessage = 'Herramienta'; }
        else if (action === 'apply') { logMessage = 'Optimizacion'; }
        else if (action === 'revert') { logMessage = 'Reversion'; }
        else { logMessage = 'Reajuste'; }
        cmdProcess.stdin.write(`echo     Iniciando ${logMessage} (${mode})\n`);
        cmdProcess.stdin.write('echo =========================================\n\n');
        cmdProcess.stdin.write('echo.\n');
    } catch (e) {
        console.error(`Error al escribir en CMD: ${e.message}`);
        isRunning = false;
        if (win && !win.isDestroyed()) { win.webContents.send('progress-update', { percentage: 0, text: 'Error', isRunning: false }); }
        return;
    }

    const totalCommands = commands.length;

    setTimeout(() => {
        commands.forEach((cmdObj, index) => {
            const timerId = setTimeout(() => {
                if (cmdProcess && !cmdProcess.killed) {
                    if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: `[${new Date().toLocaleTimeString()}] ${cmdObj.message}`, command: cmdObj.command }); }
                    const percentage = Math.round(((index + 1) / totalCommands) * 100);
                    const progressText = `${percentage}% (${index + 1}/${totalCommands})`;
                    if (win && !win.isDestroyed()) {
                        win.webContents.send('progress-update', { percentage: percentage, text: progressText, isRunning: true });
                    }
                    try {
                        cmdProcess.stdin.write(`echo. & echo [${new Date().toLocaleTimeString()}] ${cmdObj.message}\n`);
                        if (cmdObj.isScript) {
                            const tempPath = path.join(os.tmpdir(), 'elmaxishark_temp_script.bat');
                            fs.writeFileSync(tempPath, cmdObj.command, { encoding: 'utf8' });
                            cmdProcess.stdin.write(`call "${tempPath}"\n`);
                        } else {
                            cmdProcess.stdin.write(`${cmdObj.command}\n`);
                        }
                        cmdProcess.stdin.write('echo.\n');
                    } catch (e) { console.error(`Error al escribir comando en CMD: ${e.message}`); }
                }
            }, 500 * (index + 1));
            commandTimers.push(timerId);
        });

        const finalTimerId = setTimeout(() => {
            let success = true;
            if (cmdProcess && !cmdProcess.killed) {
                let finalLogMessage, finalActionWord;
                if (mode === 'energia' || mode === 'restauracion' || mode === 'limpieza-sistema') {
                    finalLogMessage = 'Herramienta'; finalActionWord = 'completada';
                } else if (action === 'apply' || action === 'process') {
                    finalLogMessage = (action === 'process') ? 'Reajuste' : 'Tweaks';
                    finalActionWord = (action === 'process') ? 'completado' : 'completados';
                } else if (action === 'revert') {
                    finalLogMessage = 'Tweaks'; finalActionWord = 'revertidos';
                } else {
                    finalLogMessage = 'Proceso'; finalActionWord = 'terminado';
                }
                const finalMessage = `=== ${finalLogMessage} ${finalActionWord}. Esperando nuevas acciones... ===`;
                console.log(`${finalLogMessage} ${finalActionWord}`);
                if (win && !win.isDestroyed()) {
                    win.webContents.send('log-update', { message: `[${new Date().toLocaleTimeString()}] ¡${finalLogMessage} ${finalActionWord}!`, command: "=== FIN ===" });
                    win.webContents.send('progress-update', { percentage: 100, text: 'Completado', isRunning: false });
                }
                try {
                    cmdProcess.stdin.write(`\necho ${finalMessage}\n`);
                    cmdProcess.stdin.write('echo.\n');
                } catch (e) { console.error(`Error al escribir mensaje final en CMD: ${e.message}`); }
            } else {
                success = false;
                if (win && !win.isDestroyed()) { win.webContents.send('progress-update', { percentage: 0, text: 'Error', isRunning: false }); }
            }

            if (store) {
                if (success && mode !== 'limpieza-sistema' && mode !== 'restauracion' && mode !== 'energia') {
                    if (action === 'apply' || action === 'process') {
                        store.set('activeMode', mode);
                    } else if (action === 'revert') {
                        store.set('activeMode', null);
                    }
                }
            } else { console.warn("Store no disponible para guardar estado."); }

            isRunning = false;
        }, 500 * (commands.length + 2));
        commandTimers.push(finalTimerId);
    }, 100);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 840, height: 800, minWidth: 840, minHeight: 800,
    resizable: false, maximizable: false, frame: false,
    icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'),
    webPreferences: {
      contextIsolation: true, nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true
  });
  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    if (store) {
      const activeMode = store.get('activeMode', null);
      console.log(`Enviando estado inicial al renderer: ${activeMode}`);
      win.webContents.send('set-initial-mode', activeMode);
    } else {
      console.warn("Store no inicializado al enviar estado inicial.");
      win.webContents.send('set-initial-mode', null);
    }
  });

  setTimeout(() => { launchPersistentCmd(win); }, 500);

  win.on('close', () => {
    console.log('Ventana principal cerrándose...');
    if (cmdProcess && !cmdProcess.killed && cmdProcess.pid) {
      try { execSync(`taskkill /PID ${cmdProcess.pid} /F /T`); }
      catch (e) { console.error(`Error al cerrar CMD con taskkill: ${e.message}`); }
      cmdProcess = null;
    }
  });
}

app.whenReady().then(async () => {
  await initializeStore();
  if (process.platform === 'win32' && !isRunningAsAdmin()) {
    console.log('Detectado: no es admin. Re-lanzando app con permisos...');
    const command = `Start-Process -FilePath "${process.execPath}" -Verb runas -ArgumentList '${process.argv.slice(1).join(' ')}'`;
    exec(command, { shell: 'powershell.exe' }, (error) => {
      if (error) { console.error('Error al re-lanzar:', error.message); }
      app.quit();
    });
    return;
  }
  console.log(`[INFO] Directorio de trabajo: ${process.cwd()}`);
  console.log('[INFO] Ejecutando la aplicacion (como admin)...');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('Todas las ventanas cerradas.');
  commandTimers.forEach(timer => clearTimeout(timer));
  if (cmdProcess && !cmdProcess.killed && cmdProcess.pid) {
    try { execSync(`taskkill /PID ${cmdProcess.pid} /F /T`); }
    catch (e) { console.error(`Error al cerrar CMD (window-all-closed): ${e.message}`); }
  }
  if (process.platform !== 'darwin') { app.quit(); }
});

ipcMain.on('minimize-app', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on('close-app', () => BrowserWindow.getFocusedWindow()?.close());
ipcMain.on('open-external-link', (event, url) => shell.openExternal(url));

// --- LISTENER RUN-OPTIMIZATION (ACTUALIZADO CON ADVERTENCIAS Y LÓGICA V1.1) ---
ipcMain.on('run-optimization', (event, { applyMode, revertMode }) => {
    console.log(`Evento run-optimization recibido: applyMode=${applyMode}, revertMode=${revertMode}`);
    const win = BrowserWindow.fromWebContents(event.sender);
    
    // --- ADVERTENCIAS PARA MODOS AGRESIVOS ---
    if (applyMode === 'overdrive') {
        const choice = dialog.showMessageBoxSync(win, {
            type: 'warning',
            buttons: ['Continuar', 'Cancelar'],
            defaultId: 1,
            title: 'Advertencia: Modo Overdrive',
            message: 'Estás a punto de aplicar ajustes sensibles de temporización y memoria (SysMain, HPET, DynamicTick).',
            detail: 'Estos ajustes pueden causar inestabilidad o lentitud en algunos portátiles o sistemas. ¿Estás seguro de que quieres continuar?'
        });
        if (choice === 1) { // Si elige 'Cancelar'
            if (win && !win.isDestroyed()) { win.webContents.send('set-initial-mode', store.get('activeMode', null)); } // Revierte el botón visualmente
            return;
        }
    }
    if (applyMode === 'mododios') {
        const choice = dialog.showMessageBoxSync(win, {
            type: 'error',
            buttons: ['Entiendo el riesgo, Continuar', 'Cancelar'],
            defaultId: 1,
            title: '¡ADVERTENCIA MÁXIMA: MODO DIOS!',
            message: 'Estás a punto de aplicar DEBLOAT AGRESIVO y desactivar funciones clave del sistema.',
            detail: 'Esto desactivará Windows Search, la Cola de Impresión, Servicios de Xbox y Hyper-V. Es un modo de riesgo para máximo rendimiento. NO RECOMENDADO en portátiles o PCs de trabajo. ¿Continuar?'
        });
        if (choice === 1) { // Si elige 'Cancelar'
            if (win && !win.isDestroyed()) { win.webContents.send('set-initial-mode', store.get('activeMode', null)); } // Revierte el botón visualmente
            return;
        }
    }
    // --- FIN ADVERTENCIAS ---

    let commandsToRun = [];
    let actionType = 'Optimizacion';
    try {
        let scriptToLoad = '';
        if (revertMode) {
            scriptToLoad = (revertMode === 'mododios') ? 'optimizacion-mododios' : (revertMode === 'overdrive') ? 'optimizacion-overdrive' : `optimizacion-${revertMode}`;
            const revertScriptPath = path.join(__dirname, 'scripts', `${scriptToLoad}.js`);
            console.log(`Cargando script de REVERSION: ${revertScriptPath}`);
            delete require.cache[require.resolve(revertScriptPath)];
            const revertScript = require(revertScriptPath);
            commandsToRun.push(...revertScript.revert);
            actionType = 'Reajuste';
        }
        if (applyMode) {
            scriptToLoad = (applyMode === 'mododios') ? 'optimizacion-mododios' : (applyMode === 'overdrive') ? 'optimizacion-overdrive' : `optimizacion-${applyMode}`;
            const applyScriptPath = path.join(__dirname, 'scripts', `${scriptToLoad}.js`);
            console.log(`Cargando script de APLICACION: ${applyScriptPath}`);
            delete require.cache[require.resolve(applyScriptPath)];
            const applyScript = require(applyScriptPath);
            const applyCommands = [...applyScript.apply];
            
            // --- INYECCIÓN SvcHost (AHORA SOLO EN OVERDRIVE Y DIOS) ---
            if (applyMode === 'overdrive' || applyMode === 'mododios') {
                const svchostCommand = {
                    message: "Optimizando 'svchost.exe' segun RAM...",
                    command: `for /f "tokens=2 delims==" %%R in ('wmic ComputerSystem get TotalPhysicalMemory /value') do set "RAM_BYTES=%%R" & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control" /v SvcHostSplitThresholdInKB /t REG_DWORD /d %RAM_BYTES:~0,-3% /f`
                };
                // Inyectarlo después de SysMain (que ahora está en Overdrive)
                const sysMainIndex = applyCommands.findIndex(c => c.message.includes("SysMain"));
                if (sysMainIndex !== -1) { applyCommands.splice(sysMainIndex + 1, 0, svchostCommand); console.log(`Comando svchost inyectado`);}
                else { applyCommands.push(svchostCommand); }
            }
            // --- FIN INYECCIÓN ---

            commandsToRun.push(...applyCommands);
            actionType = revertMode ? 'Reajuste' : 'Optimizacion';
        }
        if (commandsToRun.length > 0) {
            if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: `[${new Date().toLocaleTimeString()}] Iniciando ${actionType}: ${applyMode || revertMode}`, command: `Cargando ${commandsToRun.length} comandos...` }); }
            const modeForSave = applyMode || revertMode;
            let action = applyMode && revertMode ? 'process' : (applyMode ? 'apply' : 'revert');
            executeCommands(win, commandsToRun, action, modeForSave);
        } else {
            if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: `[ERROR] No se encontraron comandos.`, command: "!!! ERROR DE SCRIPT !!!" });}
        }
    } catch (e) {
        console.error("Error al cargar o ejecutar el script:", e);
        if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: `[ERROR] No se pudo ejecutar la optimizacion: ${applyMode || revertMode} - ${e.message}`, command: "!!! ERROR AL CARGAR SCRIPT !!!" });}
        // Si la carga falla (ej. script no encontrado), revertir el botón visualmente
        if(store) { if (win && !win.isDestroyed()) { win.webContents.send('set-initial-mode', store.get('activeMode', null)); } }
    }
});

// Listener run-tool (Actualizado para limpieza-sistema)
ipcMain.on('run-tool', (event, { tool }) => {
  console.log(`Evento run-tool recibido: tool=${tool}`);
  const win = BrowserWindow.fromWebContents(event.sender);
  let scriptFileName = '';
  if (tool === 'limpieza-sistema') { scriptFileName = 'herramienta-limpieza-sistema.js'; }
  else if (tool === 'restauracion' || tool === 'energia') { scriptFileName = `herramienta-${tool}.js`; }
  else { console.warn(`Herramienta desconocida: ${tool}`); return; }

  try {
    const scriptPath = path.join(__dirname, 'scripts', scriptFileName);
    console.log(`Cargando script de HERRAMIENTA: ${scriptPath}`);
    delete require.cache[require.resolve(scriptPath)];
    const toolScript = require(scriptPath);
    const commandsToRun = [...toolScript.apply];
    if (commandsToRun.length > 0) {
      if (win && !win.isDestroyed()) {
        win.webContents.send('log-update', { message: `[${new Date().toLocaleTimeString()}] Iniciando herramienta: ${tool.replace('-', ' ')}...`, command: `Cargando ${commandsToRun.length} comandos...` });
      }
      executeCommands(win, commandsToRun, 'apply', tool);
    } else {
        if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: `[ERROR] No se encontraron comandos.`, command: "!!! ERROR DE SCRIPT !!!" });}
    }
  } catch (e) {
      console.error("Error al cargar o ejecutar el script de herramienta:", e);
      if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: `[ERROR] No se pudo ejecutar la herramienta: ${tool} - ${e.message}`, command: "!!! ERROR AL CARGAR SCRIPT !!!" });}
  }
});