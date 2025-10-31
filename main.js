// main.js (v1.8.0 - Lógica de Ocultar Ventana Custom)

const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path =require('path');
const { spawn, execSync, exec } = require('child_process');
const os =require('os');
const fs = require('fs'); 
const { autoUpdater } = require('electron-updater'); 

// --- Carga del Banco de Tweaks (VUELVE A ESTAR AQUÍ) ---
const customTweaks = require('./scripts/custom-tweaks.js'); 

// --- Importación de Herramientas ---
const herramientaRestauracion = require('./scripts/herramienta-restauracion.js');
const herramientaEnergia = require('./scripts/herramienta-energia.js');
const herramientaLimpieza = require('./scripts/herramienta-limpieza-sistema.js');

// --- Precargar TODOS los scripts de optimización ---
const optimizacionScripts = {
  'basico': require('./scripts/optimizacion-basica.js'),
  'equilibrado': require('./scripts/optimizacion-equilibrada.js'),
  'extremo': require('./scripts/optimizacion-extremo.js'),
  'overdrive': require('./scripts/optimizacion-overdrive.js'),
  'mododios': require('./scripts/optimizacion-mododios.js')
};
console.log("Todos los scripts de optimizacion fueron precargados exitosamente.");
// --- FIN DE LA PRECARGA ---

let cmdProcess = null;
let commandTimers = [];
let isRunning = false;
let store;
let customWindow = null; // Ventana para el Modo Custom

async function initializeStore() {
  try {
    const { default: Store } = await import('electron-store');
    store = new Store({
        defaults: {
            activeMode: null, // Para Básico, Equilibrado, etc.
            customTweakSelection: [], // Array para guardar selecciones
            customTweaksActive: false // Para el botón Custom
        }
    });
    console.log("electron-store inicializado correctamente.");
  } catch (err) {
    console.error("!!! Error CRÍTICO al inicializar electron-store:", err);
  }
}

function isRunningAsAdmin() {
  if (process.platform === 'win32') {
    try {
      execSync('fsutil dirty query %systemdrive%');
      return true;
    } catch (e) {
      return false;
    }
  }
  return true;
}

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
            cmdProcess.stdin.write('echo     ElmaxiShark Optimizer v1.8.0 (Ventana Oculta)\n');
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

// 'win' es la ventana principal (BrowserWindow)
function executeCommands(win, commands, action, mode) {
    if (isRunning) {
        if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: '[ERROR] Espere a que termine el proceso actual.', command: "!!! PROCESO OCUPADO !!!" }); }
        return;
    }
    if (!win || win.isDestroyed()) {
        console.error("executeCommands fue llamado sin una ventana válida.");
        return; 
    }
    
    isRunning = true;
    commandTimers.forEach(timer => clearTimeout(timer));
    commandTimers = [];
    launchPersistentCmd(win);

    if (win && !win.isDestroyed()) {
        win.webContents.send('progress-update', { percentage: 0, text: 'Iniciando...', isRunning: true });
    }

    try {
        cmdProcess.stdin.write('cls\n');
        cmdProcess.stdin.write('echo off\n');
        cmdProcess.stdin.write('echo =========================================\n');
        let logMessage;
        
        if (mode === 'custom') { logMessage = (action === 'apply') ? 'Aplicacion Custom' : 'Reversion Custom'; }
        else if (mode === 'limpieza-sistema' || mode === 'restauracion' || mode === 'energia') { logMessage = 'Herramienta'; }
        else { logMessage = (action === 'apply') ? 'Optimizacion' : 'Reversion'; }

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
                const finalMessage = `=== Proceso completado. Esperando nuevas acciones... ===`;
                if (win && !win.isDestroyed()) {
                    win.webContents.send('log-update', { message: `[${new Date().toLocaleTimeString()}] ¡Proceso completado!`, command: "=== FIN ===" });
                    win.webContents.send('progress-update', { percentage: 100, text: 'Completado', isRunning: false });
                }
                try { cmdProcess.stdin.write(`\necho ${finalMessage}\n`); } catch (e) { console.error(e); }
            } else {
                success = false;
                if (win && !win.isDestroyed()) { win.webContents.send('progress-update', { percentage: 0, text: 'Error', isRunning: false }); }
            }

            if (store && success) {
                if (mode !== 'custom' && mode !== 'limpieza-sistema' && mode !== 'restauracion' && mode !== 'energia') {
                    if (action === 'apply' || action === 'process') {
                        store.set('activeMode', mode);
                        store.set('customTweaksActive', false); // <-- Se resetea Custom
                    } else if (action === 'revert') {
                        store.set('activeMode', null);
                    }
                }
            }
            
            // --- INICIO: BLOQUE DE REINICIO ---
            if (success) {
                const isOptimization = (mode !== 'limpieza-sistema' && mode !== 'restauracion' && mode !== 'energia');
                
                if (isOptimization && win && !win.isDestroyed()) {
                    dialog.showMessageBox(win, {
                        type: 'info',
                        buttons: ['Aceptar'],
                        title: 'Proceso Completado',
                        message: '¡Optimización aplicada con éxito!',
                        detail: 'Para asegurar que todos los cambios se apliquen correctamente, se recomienda reiniciar el equipo.'
                    });
                }
            }
            // --- FIN: BLOQUE DE REINICIO ---

            isRunning = false;
            
            if (store && win && !win.isDestroyed()) {
                const updatedState = {
                    activeMode: store.get('activeMode', null),
                    customTweaksActive: store.get('customTweaksActive', false)
                };
                console.log(`[executeCommands] Proceso finalizado. Enviando estado actualizado:`, updatedState);
                win.webContents.send('set-initial-mode', updatedState);
            }
            
        }, 500 * (commands.length + 2));
        commandTimers.push(finalTimerId);
    }, 100);
}

// --- INICIO: FUNCIÓN "createCustomWindow" MODIFICADA ---
function createCustomWindow() {
    // 1. Si la ventana YA EXISTE (incluso si está oculta), solo muéstrala.
    if (customWindow) {
        customWindow.show();
        customWindow.focus();
        return;
    }
    
    // 2. Si es la primera vez, crea la ventana
    console.log("Creando la ventana Custom por primera vez...");
    customWindow = new BrowserWindow({
        width: 700,
        height: 750,
        minWidth: 600,
        minHeight: 500,
        resizable: true, 
        frame: false, 
        transparent: true, 
        parent: BrowserWindow.getFocusedWindow(),
        modal: true,
        show: false, // <-- IMPORTANTE: Empezar oculta
        icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'custom-preload.js') 
        }
    });

    customWindow.loadFile('custom.html');

    // 3. Muéstrala solo cuando el HTML esté listo
    customWindow.webContents.on('did-finish-load', () => {
        customWindow.show();
        customWindow.focus();
    });

    // 4. Cuando el usuario intente cerrarla (con la 'X'), NO la destruyas, OCÚLTALA.
    customWindow.on('close', (event) => {
        if (!app.isQuitting) { // Asegurarse de que no estamos cerrando la app entera
            event.preventDefault(); // Previene la destrucción
            customWindow.hide();    // Solo ocúltala
        }
    });

    // 5. Si la app se cierra, AHORA SÍ déjala morir
    app.on('before-quit', () => {
        app.isQuitting = true;
    });
}
// --- FIN: FUNCIÓN "createCustomWindow" MODIFICADA ---


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
      const initialState = {
          activeMode: store.get('activeMode', null),
          customTweaksActive: store.get('customTweaksActive', false)
      };
      console.log(`Enviando estado inicial DUAL al renderer:`, initialState);
      win.webContents.send('set-initial-mode', initialState);
    } else {
      console.warn("Store no inicializado al enviar estado inicial.");
      win.webContents.send('set-initial-mode', { activeMode: null, customTweaksActive: false });
    }
    
    // --- BUSCAR ACTUALIZACIONES (DESACTIVADO AL INICIO) ---
    // (Se movió a un botón manual)
    
    // --- ENVIAR VERSIÓN DE APP A LA VENTANA ---
    win.webContents.send('set-app-version', app.getVersion());
  });

  setTimeout(() => { launchPersistentCmd(win); }, 500);

  win.on('close', () => {
    console.log('Ventana principal cerrándose...');
    if (cmdProcess && !cmdProcess.killed && cmdProcess.pid) {
      try { execSync(`taskkill /PID ${cmdProcess.pid} /F /T`); }
      catch (e) { console.error(e); }
      cmdProcess = null;
    }
  });
}

app.whenReady().then(async () => {
  await initializeStore();
  console.log(`[DEBUG] __dirname (directorio de main.js) es: ${__dirname}`);

  if (process.platform === 'win32' && !isRunningAsAdmin()) {
    console.log('Detectado: no es admin. Re-lanzando app con permisos...');
    const command = `Start-Process -FilePath "${process.execPath}" -Verb runas -ArgumentList '${process.argv.slice(1).join(' ')}'`;
    exec(command, { shell: 'powershell.exe' }, (error) => {
      if (error) { console.error('Error al re-lanzar:', error.message); }
      app.quit();
    });
    return;
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});

ipcMain.on('minimize-app', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on('close-app', () => BrowserWindow.getFocusedWindow()?.close());
ipcMain.on('open-external-link', (event, url) => shell.openExternal(url));

// --- Canal para cerrar la ventana custom (AHORA OCULTA) ---
ipcMain.on('close-custom-window', () => {
  if (customWindow) {
    customWindow.hide(); // <-- CAMBIO
  }
});

// --- LÓGICA DE DESCARGA DE GUÍA (CORREGIDA) ---
ipcMain.on('download-guide', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  
  try {
    const sourcePath = path.join(__dirname, 'GUIA_RECOMENDACIONES.txt');
    const destPath = path.join(app.getPath('downloads'), 'GUIA_RECOMENDACIONES.txt');
    const fileContent = fs.readFileSync(sourcePath, 'utf-8');
    fs.writeFileSync(destPath, fileContent, { encoding: 'utf-8' });

    console.log('Guía guardada en:', destPath);    
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Guía Descargada',
      message: 'La "GUIA_RECOMENDACIONES.txt" se ha guardado en tu carpeta de Descargas.'
    });

  } catch (err) {
    console.error('Error al guardar la guía:', err);
    dialog.showErrorBox('Error al Descargar', 'No se pudo guardar la guía en tu carpeta de Descargas.\n\n' + err.message);
  }
});
// --- FIN: LÓGICA DE DESCARGA DE GUÍA (CORREGIDA) ---


// --- SISTEMA HÍBRIDO ---

// --- SISTEMA 1: "RUN-OPTIMIZATION" (Para Básico, Equilibrado, Extremo, Dios) ---
ipcMain.on('run-optimization', (event, { applyMode, revertMode }) => {
    console.log(`Evento run-optimization (1-Clic) recibido: applyMode=${applyMode}, revertMode=${revertMode}`);
    const win = BrowserWindow.fromWebContents(event.sender);
    
    // --- INICIO: DIÁLOGO DE MODO DIOS CORREGIDO ---
    if (applyMode === 'mododios') {
        const choice = dialog.showMessageBoxSync(win, {
            type: 'info', 
            buttons: ['Sí, continuar', 'Cancelar'], 
            defaultId: 1, 
            cancelId: 1,  
            title: 'Aviso: Modo Dios',
            message: 'Estás a punto de aplicar los tweaks de 1-Clic más avanzados.',
            detail: 'Este modo está diseñado para PCs de sobremesa (escritorio). Aunque es seguro para la estabilidad, puede no ser ideal para portátiles (debido a la gestión de energía) o afectar a la virtualización (Hyper-V). ¿Deseas continuar?'
        });

        if (choice !== 0) { 
            if (win && !win.isDestroyed()) { 
                win.webContents.send('set-initial-mode', {
                    activeMode: store.get('activeMode', null),
                    customTweaksActive: store.get('customTweaksActive', false)
                });
            }
            return; 
        }
    }
    // --- FIN: DIÁLOGO DE MODO DIOS CORREGIDO ---

    let commandsToRun = [];
    let actionType = 'Optimizacion';
    try {
        
        // --- INICIO: LÓGICA DE REVERSIÓN CUSTOM CORREGIDA ---
        if (store && (applyMode || revertMode) && store.get('customTweaksActive', false)) {
             const savedTweakIds = store.get('customTweakSelection', []);
             if (savedTweakIds.length > 0) {
                console.log(`[1-Click Action] Revertiendo ${savedTweakIds.length} tweaks de Custom...`);
                
                // --- CAMBIO: Carga el archivo de tweaks aquí ---
                const customTweaks = require('./scripts/custom-tweaks.js');
                
                for (const category in customTweaks) {
                    customTweaks[category].forEach(tweak => {
                        if (savedTweakIds.includes(tweak.id)) {
                            commandsToRun.push({
                                message: `(Revert Custom) ${tweak.message}`,
                                command: tweak.revert,
                                isScript: (tweak.revert && (tweak.revert.includes('@echo off') || tweak.revert.includes('powershell')))
                            });
                        }
                    });
                }
             }
             store.set('customTweaksActive', false); 
        }
        // --- FIN: LÓGICA DE REVERSIÓN CUSTOM CORREGIDA ---
        
        if (revertMode) {
            const revertScript = optimizacionScripts[revertMode];
            if (!revertScript) {
                throw new Error(`Script no encontrado en la precarga: ${revertMode}`);
            }
            commandsToRun.push(...revertScript.revert);
            actionType = 'Reajuste';
        }
        
        if (applyMode) {
            const applyScript = optimizacionScripts[applyMode];
            if (!applyScript) {
                throw new Error(`Script no encontrado en la precarga: ${applyMode}`);
            }
            commandsToRun.push(...applyScript.apply);
            actionType = revertMode ? 'Reajuste' : 'Optimizacion';
        }
        
        if (commandsToRun.length > 0) {
            const modeForSave = applyMode || revertMode;
            let action = applyMode && revertMode ? 'process' : (applyMode ? 'apply' : 'revert');
            
            executeCommands(win, commandsToRun, action, modeForSave);
        }
    } catch (e) {
        console.error("Error al cargar o ejecutar el script:", e);
        if (win && !win.isDestroyed()) { win.webContents.send('log-update', { message: `[ERROR] No se pudo ejecutar la optimizacion: ${applyMode || revertMode} - ${e.message}`, command: "!!! ERROR AL CARGAR SCRIPT !!!" });}
        if(store) { 
            if (win && !win.isDestroyed()) { 
                win.webContents.send('set-initial-mode', {
                    activeMode: store.get('activeMode', null),
                    customTweaksActive: store.get('customTweaksActive', false)
                });
            }
        }
    }
});


// --- SISTEMA 2: "MODO CUSTOM" (Para botón Overdrive) ---
ipcMain.on('open-custom-menu', (event) => {
    console.log(`Abriendo menú custom...`);
    createCustomWindow(); // <-- Esto ahora MUESTRA o CREA la ventana
});

// --- INICIO: "Handlers" para la carga por categoría (AHORA CARGAN EL ARCHIVO) ---
ipcMain.handle('custom:get-categories', async () => {
  // Carga el archivo fresco cada vez
  const customTweaks = require('./scripts/custom-tweaks.js');
  return Object.keys(customTweaks);
});

ipcMain.handle('custom:get-tweaks-for-category', async (event, categoryName) => {
  // Carga el archivo fresco cada vez
  const customTweaks = require('./scripts/custom-tweaks.js');
  if (customTweaks[categoryName]) {
    return customTweaks[categoryName];
  }
  return []; // Devuelve vacío si la categoría no existe
});
// --- FIN: "Handlers" ---


ipcMain.on('save-custom-tweaks', (event, tweakIds) => {
    if (store) {
        store.set('customTweakSelection', tweakIds);
        console.log('Estado custom (seleccion) guardado.');
    }
});

ipcMain.handle('load-custom-tweaks', async () => {
    if (store) {
        return store.get('customTweakSelection', []);
    }
    return [];
});


// --- CAMBIO: 'tweaks' ya no viene del renderer ---
ipcMain.on('run-custom-tweaks', (event, { action, ids }) => {
    
    const win = BrowserWindow.getFocusedWindow(); 
    const mainWin = (win && win.getParentWindow()) ? win.getParentWindow() : BrowserWindow.getAllWindows()[0];
    
    if (!mainWin) { console.error("No se pudo encontrar la ventana principal."); return; }

    if (isRunning) {
        if (mainWin && !mainWin.isDestroyed()) { 
            mainWin.webContents.send('log-update', { message: '[ERROR] Espere a que termine el proceso actual.', command: "!!! PROCESO OCUPADO !!!" }); 
        }
        return;
    }
    
    let commandsToRun = [];
    
    // --- LÓGICA DE ESTADOS SEPARADOS (CORREGIDA) ---
    if (store && action === 'apply') {
        const currentActiveMode = store.get('activeMode', null);

        if (currentActiveMode) {
            console.log(`[Custom Apply] Detectado modo 1-clic activo: ${currentActiveMode}. Revertiendo primero...`);
            try {
                const revertScript = optimizacionScripts[currentActiveMode]; 
                if (!revertScript) {
                    throw new Error(`Script no encontrado en la precarga: ${currentActiveMode}`);
                }
                commandsToRun.push(...revertScript.revert);

                if (mainWin && !mainWin.isDestroyed()) {
                    mainWin.webContents.send('log-update', { message: `[INFO] Revertiendo '${currentActiveMode}' antes de aplicar Custom...`, command: `REVERT ${currentActiveMode}` });
                }
                
            } catch (e) {
                console.error(`Error al cargar script de reversión ${currentActiveMode}: ${e.message}`);
                if (mainWin && !mainWin.isDestroyed()) {
                    mainWin.webContents.send('log-update', { message: `[ERROR] No se pudo revertir ${currentActiveMode}. Abortando.`, command: `!!! ERROR DE REVERSIÓN !!!` });
                }
                return; 
            }
        }
    }
    // --- FIN LÓGICA CORREGIDA ---
    
    // --- CAMBIO: Carga el archivo de tweaks aquí ---
    const customTweaks = require('./scripts/custom-tweaks.js');

    for (const category in customTweaks) {
        customTweaks[category].forEach(tweak => {
            if (ids.includes(tweak.id)) {
                const commandObj = {
                    message: tweak.message,
                    command: (action === 'apply') ? tweak.apply : tweak.revert,
                    isScript: (tweak.apply && (tweak.apply.includes('@echo off') || tweak.apply.includes('powershell')))
                };
                commandsToRun.push(commandObj);
            }
        });
    }

    if (commandsToRun.length > 0) {
        if (mainWin && !mainWin.isDestroyed()) { 
            mainWin.webContents.send('log-update', { message: `[${new Date().toLocaleTimeString()}] Iniciando ${action} personalizado...`, command: `Cargando ${commandsToRun.length} comandos...` });
        }
        
        if (store) {
            if (action === 'apply') {
                store.set('customTweaksActive', true);
                store.set('activeMode', null); // <-- LÓGICA CORREGIDA
            } else if (action === 'revert') {
                const savedTweaks = store.get('customTweakSelection', []);
                const isRevertingAllSaved = savedTweaks.length > 0 && savedTweaks.every(id => ids.includes(id));
                
                if (isRevertingAllSaved) {
                    console.log("Se están revirtiendo todos los tweaks de Custom guardados. Desactivando modo Custom.");
                    store.set('customTweaksActive', false);
                } else {
                    store.set('customTweaksActive', true);
                }
            }
        }

        executeCommands(mainWin, commandsToRun, action, 'custom');
        
        // --- CAMBIO: AHORA OCULTA LA VENTANA ---
        if (customWindow) {
            customWindow.hide();
        }
    } else {
        if (mainWin && !mainWin.isDestroyed()) { 
            mainWin.webContents.send('log-update', { message: `[INFO] No se seleccionaron tweaks.`, command: "Accion cancelada." });
        }
    }
});


// --- SISTEMA 3: "RUN-TOOL" (Herramientas) ---
ipcMain.on('run-tool', (event, { tool }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  
  const toolScripts = {
      'restauracion': herramientaRestauracion,
      'energia': herramientaEnergia, 
      'limpieza-sistema': herramientaLimpieza
  };

  let toolScript = toolScripts[tool];
  if (!toolScript) {
      console.warn(`Herramienta desconocida: ${tool}`); return;
  }

  try {
    const commandsToRun = [...toolScript.apply]; 
    if (commandsToRun.length > 0) {
      executeCommands(win, commandsToRun, 'apply', tool);
    }
  } catch (e) {
      console.error("Error al cargar o ejecutar el script de herramienta:", e);
  }
});

// --- AÑADIDO: Listener para el botón manual de actualización ---
ipcMain.on('check-for-updates-manual', () => {
  console.log('El usuario solicitó una comprobación de actualización manual...');
  const win = BrowserWindow.getAllWindows()[0];
  try {
    // Usamos el mismo comando que ya tenías
    autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.error("Error al iniciar autoUpdater (manual):", e.message);
    if (win) {
      win.webContents.send('update-message', { 
        status: 'error', 
        message: e.message 
      });
    }
  }
});

// --- LÓGICA DE AUTO-ACTUALIZACIÓN AÑADIDA ---
autoUpdater.autoDownload = true; 
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on('update-available', (info) => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.send('update-message', { 
      status: 'available', 
      version: info.version 
    });
  }
});

autoUpdater.on('update-not-available', () => {
  console.log("No hay actualizaciones disponibles.");
  // --- AÑADIDO: Envía un mensaje de éxito "No disponible"
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.send('update-message', { 
      status: 'not-available'
    });
  }
});

autoUpdater.on('error', (err) => {
  console.error('Error en auto-updater: ' + (err.message || err));
  const win = BrowserWindow.getAllWindows()[0];
  if (!win) return;

  // --- CAMBIO IMPORTANTE: Filtro de Errores de Conexión ---
  const errorMsg = err.message || '';
  const isConnectionError = errorMsg.includes('ERR_INTERNET_DISCONNECTED') || 
                            errorMsg.includes('ERR_NETWORK_CHANGED') ||
                            errorMsg.includes('ENOENT') || // El error que te salía a ti
                            errorMsg.includes('EPIPE');

  if (isConnectionError) {
    // Es un error de conexión, no molestamos al usuario.
    // Simplemente lo registramos en la consola.
    console.log('Error de conexión del AutoUpdater, ignorando (silencioso).');
    win.webContents.send('update-message', { 
      status: 'not-available' // Trátalo como si no hubiera updates
    });
  } else {
    // Es un error real (ej. firma corrupta), SÍ lo mostramos.
    win.webContents.send('update-message', { 
      status: 'error', 
      message: err.message 
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.send('update-message', {
      status: 'downloaded',
      version: info.version
    });
  }
});

ipcMain.on('restart-app-to-update', () => {
  autoUpdater.quitAndInstall();
});