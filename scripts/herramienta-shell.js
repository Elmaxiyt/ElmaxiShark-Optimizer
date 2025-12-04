// scripts/herramienta-shell.js (v1.5.2 - FINAL FIX: SPACES IN PATH SUPPORT)

const rawPath = process.env.PORTABLE_EXECUTABLE_FILE || process.execPath;

// CRÍTICO: Preparamos la ruta con comillas escapadas (\") para que el comando REG ADD
// la acepte completa aunque tenga espacios (ej: "ElmaxiShark Optimizer.exe").
// En el registro quedará guardado así: "C:\Ruta\App.exe" --comando
const APP_EXE = `\\"${rawPath}\\"`;

const APP_GUID = "{C811D447-0628-40F1-AA4B-E0E9C7E552C8}"; 
const APP_NAME = "ElmaxiShark Tools";

const apply = [
  // --- 1. TWEAK DE SISTEMA: MENÚ CLÁSICO ---
  {
    id: 'ui_menu_contextual',
    message: "Activando Menú Contextual Clásico (Estilo Windows 10)...",
    command: 'reg add "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" /v "" /t REG_SZ /d "" /f'
  },

  // --- 2. HERRAMIENTAS DE LA APP ---
  { 
    id: 'shell_menu_create', 
    message: `Creando menú contextual '${APP_NAME}'...`, 
    // El icono también necesita la ruta limpia, aquí usamos comillas simples fuera para proteger las dobles dentro
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /v "MUIVerb" /t REG_SZ /d "${APP_NAME}" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /v "Icon" /t REG_SZ /d "${APP_EXE},0" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /v "SubCommands" /f
      `
  },

  // Opción Limpieza
  { 
    id: 'shell_menu_clean', 
    message: "Añadiendo opción 'Limpieza Rápida'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\01Clean\\command" /v "" /t REG_SZ /d "${APP_EXE} --runtool limpieza-sistema" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\01Clean" /v "MUIVerb" /t REG_SZ /d "Limpieza Rapida (Caches)" /f
      `
  },

  // Opción Restauración
  { 
    id: 'shell_menu_restore', 
    message: "Añadiendo opción 'Punto de Restauración'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\02Restore\\command" /v "" /t REG_SZ /d "${APP_EXE} --runtool restauracion" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\02Restore" /v "MUIVerb" /t REG_SZ /d "Crear Punto de Restauracion" /f
      `
  },
  
  // Opción Red Avanzada
  { 
    id: 'shell_menu_network', 
    message: "Añadiendo opción 'Red Avanzada'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\03Network" /v "MUIVerb" /t REG_SZ /d "Red Avanzada (ON/OFF)" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\03Network\\command" /v "" /t REG_SZ /d "${APP_EXE} --toggletool red-avanzada" /f
      `
  },
  
  // Opción Input Lag
  { 
    id: 'shell_menu_input', 
    message: "Añadiendo opción 'Input Lag (ON/OFF)'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\04InputLag" /v "MUIVerb" /t REG_SZ /d "Input Lag (ON/OFF)" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\04InputLag\\command" /v "" /t REG_SZ /d "${APP_EXE} --toggletool input-lag" /f
      `
  },
  
  // MODOS DE OPTIMIZACIÓN
  { 
    id: 'shell_menu_mode_basic', 
    message: "Añadiendo opción 'Modo Básico'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\05ModeBasic\\command" /v "" /t REG_SZ /d "${APP_EXE} --runmode basico" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\05ModeBasic" /v "MUIVerb" /t REG_SZ /d "[ 1 ] Aplicar: Modo Basico" /f
      `
  },
  { 
    id: 'shell_menu_mode_balanced', 
    message: "Añadiendo opción 'Modo Equilibrado'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\06ModeBalanced\\command" /v "" /t REG_SZ /d "${APP_EXE} --runmode equilibrado" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\06ModeBalanced" /v "MUIVerb" /t REG_SZ /d "[ 2 ] Aplicar: Modo Equilibrado" /f
      `
  },
  { 
    id: 'shell_menu_mode_extreme', 
    message: "Añadiendo opción 'Modo Extremo'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\07ModeExtreme\\command" /v "" /t REG_SZ /d "${APP_EXE} --runmode extremo" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\07ModeExtreme" /v "MUIVerb" /t REG_SZ /d "[ 3 ] Aplicar: Modo Extremo" /f
      `
  },
  { 
    id: 'shell_menu_mode_god', 
    message: "Añadiendo opción 'Modo Gamer'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\08ModeGod\\command" /v "" /t REG_SZ /d "${APP_EXE} --runmode mododios" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\08ModeGod" /v "MUIVerb" /t REG_SZ /d "[ * ] APLICAR: MODO GAMER" /f
      `
  }
];

const revert = [
  {
    id: 'shell_modern_menu',
    message: "Restaurando Menú Contextual Moderno (Windows 11)...",
    command: 'reg delete "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f >nul 2>&1'
  },
  { 
    id: 'shell_menu_delete', 
    message: "Eliminando menú contextual de la aplicación...", 
    command: `reg delete "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /f` 
  }
];

module.exports = { apply, revert };