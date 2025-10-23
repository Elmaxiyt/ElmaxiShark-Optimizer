// main.js (Completo, con FORZADO DE ADMIN, tamaño y nombre corregidos)

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn, execSync, exec } = require('child_process');
const os = require('os');
const fs = require('fs'); // Para manejar archivos

let cmdProcess = null;
let commandTimers = [];
let isRunning = false;

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
  return true; // Asumir admin en plataformas no-Windows
}

function launchPersistentCmd(win) {
  if (!cmdProcess || cmdProcess.killed) {
    console.log('Iniciando nuevo proceso CMD persistente...');

    cmdProcess = spawn('cmd.exe', ['/k'], {
      stdio: ['pipe', 'ignore', 'ignore']
    });

    try {
      cmdProcess.stdin.write('chcp 65001 >nul\n');
      cmdProcess.stdin.write('mode con: cols=120 lines=40\n'); // Tamaño CMD

      // --- CAMBIO DE NOMBRE AQUÍ ---
      cmdProcess.stdin.write('title ElmaxiShark Optimizer - Log de Comandos\n');
      cmdProcess.stdin.write('cls\n');
      cmdProcess.stdin.write('echo off\n');
      cmdProcess.stdin.write('echo =========================================\n');
      cmdProcess.stdin.write('echo     ElmaxiShark Optimizer v1.0 - Consola de Log\n');
      // --- FIN CAMBIO NOMBRE ---

      cmdProcess.stdin.write('echo =========================================\n\n');
      cmdProcess.stdin.write('echo Esperando acciones del usuario...\n');
      cmdProcess.stdin.write('echo.\n');
    } catch (e) {
      console.error(`Error al inicializar CMD: ${e.message}`);
    }

    cmdProcess.on('close', (code) => {
      console.log(`Proceso CMD cerrado con código ${code}`);
      if (win && !win.isDestroyed()) {
        win.webContents.send('log-update', {
          message: `[INFO] Consola de CMD cerrada (codigo ${code})`,
          command: "=== PROCESO CMD FINALIZADO ==="
        });
      }
      cmdProcess = null;
      isRunning = false;
    });

    cmdProcess.on('error', (err) => {
      console.error(`Error al iniciar CMD: ${err.message}`);
      if (win && !win.isDestroyed()) {
        win.webContents.send('log-update', {
          message: `[ERROR] Error al iniciar CMD: ${err.message}`,
          command: "!!! ERROR DE SPAWN !!!"
        });
      }
      isRunning = false;
    });
  }
}


function executeCommands(win, commands, action, mode) {

  if (isRunning) {
    console.warn("Proceso ya en ejecucion. Se ignoro el nuevo comando.");
    if (win && !win.isDestroyed()) {
      win.webContents.send('log-update', {
        message: '[ERROR] Espere a que termine el proceso actual.',
        command: "!!! PROCESO OCUPADO !!!"
      });
    }
    return;
  }

  isRunning = true;
  commandTimers.forEach(timer => clearTimeout(timer));
  commandTimers = [];

  launchPersistentCmd(win);

  try {
    cmdProcess.stdin.write('cls\n');
    cmdProcess.stdin.write('echo off\n');
    cmdProcess.stdin.write('echo =========================================\n');

    let logMessage;
    if (action === 'apply' && (mode === 'energia' || mode === 'restauracion')) {
      logMessage = 'Herramienta';
    } else if (action === 'apply') logMessage = 'Optimizacion';
    else if (action === 'revert') logMessage = 'Reversion';
    else logMessage = 'Procesamiento';

    cmdProcess.stdin.write(`echo     Iniciando ${logMessage} (${mode})\n`);
    cmdProcess.stdin.write('echo =========================================\n\n');
    cmdProcess.stdin.write('echo.\n');
  } catch (e) {
    console.error(`Error al escribir en CMD (probablemente ya se cerró): ${e.message}`);
    isRunning = false;
    return;
  }

  setTimeout(() => {
    commands.forEach((cmdObj, index) => {
      const timerId = setTimeout(() => {
        if (cmdProcess && !cmdProcess.killed) {
          console.log(`Ejecutando comando: ${cmdObj.message}`);
          if (win && !win.isDestroyed()) {
            win.webContents.send('log-update', {
              message: `[${new Date().toLocaleTimeString()}] ${cmdObj.message}`,
              command: cmdObj.command
            });
          }

          try {
            cmdProcess.stdin.write(`echo. & echo [${new Date().toLocaleTimeString()}] ${cmdObj.message}\n`);

            if (cmdObj.isScript) {
              const tempPath = path.join(os.tmpdir(), 'elmaxishark_temp_script.bat'); // Nombre temporal cambiado
              fs.writeFileSync(tempPath, cmdObj.command, { encoding: 'utf8' });
              cmdProcess.stdin.write(`call "${tempPath}"\n`);
            } else {
              cmdProcess.stdin.write(`${cmdObj.command}\n`);
            }

            cmdProcess.stdin.write('echo.\n');
          } catch (e) {
            console.error(`Error al escribir en CMD: ${e.message}`);
          }
        } else {
          console.error('Proceso CMD no disponible');
          if (win && !win.isDestroyed()) {
            win.webContents.send('log-update', {
              message: '[ERROR] Proceso CMD no disponible',
              command: "!!! ERROR DE PROCESO !!!"
            });
          }
        }
      }, 500 * (index + 1));
      commandTimers.push(timerId);
    });

    const finalTimerId = setTimeout(() => {
      if (cmdProcess && !cmdProcess.killed) {

        let finalLogMessage;
        let finalActionWord;
        if (action === 'apply' && (mode === 'energia' || mode === 'restauracion')) {
          finalLogMessage = 'Herramienta';
          finalActionWord = 'completada';
        } else if (action === 'apply') {
          finalLogMessage = 'Tweaks';
          finalActionWord = 'completados';
        } else if (action === 'revert') {
          finalLogMessage = 'Tweaks';
          finalActionWord = 'revertidos';
        } else {
          finalLogMessage = 'Reajuste';
          finalActionWord = 'completado';
        }

        const finalMessage = `=== ${finalLogMessage} ${finalActionWord}. Esperando nuevas acciones... ===`;

        console.log(`${finalLogMessage} ${finalActionWord}`);
        if (win && !win.isDestroyed()) {
          win.webContents.send('log-update', {
            message: `[${new Date().toLocaleTimeString()}] ¡${finalLogMessage} ${finalActionWord}!`,
            command: "=== FIN ==="
          });
        }

        try {
          cmdProcess.stdin.write(`\necho ${finalMessage}\n`);
          cmdProcess.stdin.write('echo.\n');
        } catch (e) {
          console.error(`Error al escribir en CMD: ${e.message}`);
        }
      }

      isRunning = false;

    }, 500 * (commands.length + 2));
    commandTimers.push(finalTimerId);
  }, 100);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 840,
    height: 800,     // Tamaño ventana corregido
    minWidth: 840,
    minHeight: 800,    // Tamaño ventana corregido
    resizable: false,
    maximizable: false,
    frame: false,
    icon: path.join(__dirname, 'assets', 'elmaxi_app_icon.ico'), // Mantenemos nombre icono
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true
  });

  win.loadFile('index.html');

  setTimeout(() => {
    launchPersistentCmd(win);
  }, 500);

  // win.webContents.openDevTools();

  win.on('close', () => {
    if (cmdProcess && !cmdProcess.killed) {
      try {
        cmdProcess.stdin.write('exit\n');
        cmdProcess.stdin.end();
      } catch (e) {
        console.error(`Error al cerrar CMD: ${e.message}`);
      }
      cmdProcess.kill();
    }
  });

  ipcMain.on('minimize-app', () => win.minimize());
  ipcMain.on('close-app', () => {
    if (cmdProcess && !cmdProcess.killed) {
      try {
        cmdProcess.stdin.write('exit\n');
        cmdProcess.stdin.end();
      } catch (e) {
        console.error(`Error al cerrar CMD: ${e.message}`);
      }
      cmdProcess.kill();
    }
    win.close();
  });
  ipcMain.on('open-external-link', (event, url) => shell.openExternal(url));

  ipcMain.on('run-optimization', (event, { applyMode, revertMode }) => {
    console.log(`Evento run-optimization recibido: applyMode=${applyMode}, revertMode=${revertMode}`);

    let commandsToRun = [];
    let actionType = 'Optimizacion';
    const win = BrowserWindow.fromWebContents(event.sender);

    try {
      if (revertMode) {
        let revertModeFile = (revertMode === 'mododios') ? 'optimizacion-mododios' : `optimizacion-${revertMode}`;

        const revertScriptPath = path.join(__dirname, 'scripts', `${revertModeFile}.js`);
        console.log(`Cargando script de REVERSION: ${revertScriptPath}`);
        delete require.cache[require.resolve(revertScriptPath)];
        const revertScript = require(revertScriptPath);
        commandsToRun.push(...revertScript.revert);
        actionType = 'Reajuste';
      }

      if (applyMode) {
        let applyModeFile = (applyMode === 'mododios') ? 'optimizacion-mododios' : `optimizacion-${applyMode}`;

        const applyScriptPath = path.join(__dirname, 'scripts', `${applyModeFile}.js`);
        console.log(`Cargando script de APLICACION: ${applyScriptPath}`);
        delete require.cache[require.resolve(applyScriptPath)];
        const applyScript = require(applyScriptPath);

        const applyCommands = [...applyScript.apply];

        if (applyMode === 'equilibrada' || applyMode === 'extremo' || applyMode === 'mododios') {
          const svchostCommand = {
            message: "Optimizando 'svchost.exe' segun RAM...",
            command: `for /f "tokens=2 delims==" %%R in ('wmic ComputerSystem get TotalPhysicalMemory /value') do set "RAM_BYTES=%%R" & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control" /v SvcHostSplitThresholdInKB /t REG_DWORD /d %RAM_BYTES:~0,-3% /f`
          };

          const sysMainIndex = applyCommands.findIndex(c => c.message.includes("SysMain"));
          if (sysMainIndex !== -1) {
            applyCommands.splice(sysMainIndex + 1, 0, svchostCommand);
            console.log(`Comando svchost inyectado en el indice ${sysMainIndex + 1}`);
          } else {
            applyCommands.push(svchostCommand);
          }
        }

        commandsToRun.push(...applyCommands);
        actionType = revertMode ? 'Reajuste' : 'Optimizacion';
      }

      if (commandsToRun && commandsToRun.length > 0) {
        console.log(`Comandos a ejecutar (${commandsToRun.length} en total): ${JSON.stringify(commandsToRun)}`);
        if (win && !win.isDestroyed()) {
          win.webContents.send('log-update', {
            message: `[${new Date().toLocaleTimeString()}] Iniciando ${actionType}: ${applyMode || revertMode}`,
            command: `Cargando ${commandsToRun.length} comandos...`
          });
        }

        const logMode = applyMode || revertMode;

        let action = 'process';
        if (!applyMode && revertMode) action = 'revert';
        if (applyMode && !revertMode) action = 'apply';

        executeCommands(win, commandsToRun, action, logMode);
      } else {
        console.error(`No se encontraron comandos para ${applyMode} o ${revertMode}`);
        if (win && !win.isDestroyed()) {
          win.webContents.send('log-update', {
            message: `[ERROR] No se encontraron comandos.`,
            command: "!!! ERROR DE SCRIPT !!!"
          });
        }
      }
    } catch (e) {
      console.error("Error al cargar o ejecutar el script:", e);
      if (win && !win.isDestroyed()) {
        win.webContents.send('log-update', {
          message: `[ERROR] No se pudo ejecutar la optimizacion: ${applyMode || revertMode} - ${e.message}`,
          command: "!!! ERROR AL CARGAR SCRIPT !!!"
        });
      }
    }
  });

  ipcMain.on('run-tool', (event, { tool }) => {
    console.log(`Evento run-tool recibido: tool=${tool}`);

    const win = BrowserWindow.fromWebContents(event.sender);

    try {
      const scriptPath = path.join(__dirname, 'scripts', `herramienta-${tool}.js`);
      console.log(`Cargando script de HERRAMIENTA: ${scriptPath}`);

      delete require.cache[require.resolve(scriptPath)];
      const toolScript = require(scriptPath);
      const commandsToRun = [...toolScript.apply];

      if (commandsToRun && commandsToRun.length > 0) {
        console.log(`Comandos a ejecutar (${commandsToRun.length} en total): ${JSON.stringify(commandsToRun)}`);
        if (win && !win.isDestroyed()) {
          win.webContents.send('log-update', {
            message: `[${new Date().toLocaleTimeString()}] Iniciando herramienta: ${tool}`,
            command: `Cargando ${commandsToRun.length} comandos...`
          });
        }
        executeCommands(win, commandsToRun, 'apply', tool);
      } else {
        console.error(`No se encontraron comandos para la herramienta: ${tool}`);
        if (win && !win.isDestroyed()) {
          win.webContents.send('log-update', {
            message: `[ERROR] No se encontraron comandos.`,
            command: "!!! ERROR DE SCRIPT !!!"
          });
        }
      }
    } catch (e) {
      console.error("Error al cargar o ejecutar el script de herramienta:", e);
      if (win && !win.isDestroyed()) {
        win.webContents.send('log-update', {
          message: `[ERROR] No se pudo ejecutar la herramienta: ${e.message}`,
          command: "!!! ERROR AL CARGAR SCRIPT !!!"
        });
      }
    }
  });
}

app.whenReady().then(() => {

  // FORZAR EJECUCIÓN COMO ADMINISTRADOR
  if (process.platform === 'win32' && !isRunningAsAdmin()) {
    console.log('Detectado: no es admin. Re-lanzando app con permisos...');
    const command = `Start-Process -FilePath "${process.execPath}" -Verb runas -ArgumentList "${process.argv.slice(1).join(' ')}"`;
    exec(command, { shell: 'powershell.exe' }, (error) => {
      if (error) {
        console.error('Error al re-lanzar:', error.message);
      }
      app.quit();
    });
    return;
  }

  console.log(`[INFO] Directorio de trabajo: ${process.cwd()}`);
  console.log('[INFO] Ejecutando la aplicacion (como admin)...');
  createWindow();
});

app.on('window-all-closed', () => {
  commandTimers.forEach(timer => clearTimeout(timer));
  if (cmdProcess && !cmdProcess.killed) {
    try {
      cmdProcess.stdin.write('exit\n');
      cmdProcess.stdin.end();
    } catch (e) {
      console.error(`Error al cerrar CMD: ${e.message}`);
    }
    cmdProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});