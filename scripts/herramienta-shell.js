// scripts/herramienta-shell.js (v3.5 - FINAL DESIGN: Tech Style)

const rawPath = process.env.PORTABLE_EXECUTABLE_FILE || process.execPath;
const APP_PATH = rawPath; 

const APP_GUID = "{C811D447-0628-40F1-AA4B-E0E9C7E552C8}"; 
const APP_NAME = "ElmaxiShark Tools";

const apply = [
  // 1. Crear el Submenú principal
  { 
    id: 'shell_menu_create', 
    message: `Creando menu contextual '${APP_NAME}'...`, 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /v "MUIVerb" /t REG_SZ /d "${APP_NAME}" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /v "Icon" /t REG_SZ /d "\\"${APP_PATH}\\",0" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /v "SubCommands" /f
      `
  },

  // 2. Opción Limpieza
  { 
    id: 'shell_menu_clean', 
    message: "Anadiendo opcion 'Limpieza Rapida'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\01Clean\\command" /v "" /t REG_SZ /d "\\"${APP_PATH}\\" --runtool limpieza-sistema" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\01Clean" /v "MUIVerb" /t REG_SZ /d "Limpieza Rapida (Caches)" /f
      `
  },

  // 3. Opción Restauración
  { 
    id: 'shell_menu_restore', 
    message: "Anadiendo opcion 'Punto de Restauracion'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\02Restore\\command" /v "" /t REG_SZ /d "\\"${APP_PATH}\\" --runtool restauracion" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\02Restore" /v "MUIVerb" /t REG_SZ /d "Crear Punto de Restauracion" /f
      `
  },
  
  // 4. Opción Red Avanzada
  { 
    id: 'shell_menu_network', 
    message: "Anadiendo opcion 'Red Avanzada'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\03Network" /v "MUIVerb" /t REG_SZ /d "Red Avanzada (ON/OFF)" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\03Network\\command" /v "" /t REG_SZ /d "\\"${APP_PATH}\\" --toggletool red-avanzada" /f
      `
  },
  
  // 5. MODOS DE OPTIMIZACIÓN (Diseño Jerárquico Seguro)
  { 
    id: 'shell_menu_mode_basic', 
    message: "Anadiendo opcion 'Modo Basico'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\04ModeBasic\\command" /v "" /t REG_SZ /d "\\"${APP_PATH}\\" --runmode basico" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\04ModeBasic" /v "MUIVerb" /t REG_SZ /d "[ 1 ] Aplicar: Modo Basico" /f
      `
  },
  { 
    id: 'shell_menu_mode_balanced', 
    message: "Anadiendo opcion 'Modo Equilibrado'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\05ModeBalanced\\command" /v "" /t REG_SZ /d "\\"${APP_PATH}\\" --runmode equilibrado" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\05ModeBalanced" /v "MUIVerb" /t REG_SZ /d "[ 2 ] Aplicar: Modo Equilibrado" /f
      `
  },
  { 
    id: 'shell_menu_mode_extreme', 
    message: "Anadiendo opcion 'Modo Extremo'...", 
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\06ModeExtreme\\command" /v "" /t REG_SZ /d "\\"${APP_PATH}\\" --runmode extremo" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\06ModeExtreme" /v "MUIVerb" /t REG_SZ /d "[ 3 ] Aplicar: Modo Extremo" /f
      `
  },
  { 
    id: 'shell_menu_mode_god', 
    message: "Anadiendo opcion 'Modo Gamer'...", 
    // La estrella ★ es un caracter unicode estándar que suele funcionar bien, si fallara se vería un cuadrado, pero es mucho más seguro que los emojis de colores.
    command: `
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\07ModeGod\\command" /v "" /t REG_SZ /d "\\"${APP_PATH}\\" --runmode mododios" /f
      reg add "HKCR\\DesktopBackground\\Shell\\${APP_GUID}\\Shell\\07ModeGod" /v "MUIVerb" /t REG_SZ /d "[ * ] APLICAR: MODO GAMER" /f
      `
  }
  // ELIMINADO DEFINITIVAMENTE: Planes de Energía
];

const revert = [
  { 
    id: 'shell_menu_delete', 
    message: "Eliminando menu contextual de la aplicacion...", 
    // Esto borra la carpeta entera, así que limpiará también el botón de energía viejo si quedó ahí
    command: `reg delete "HKCR\\DesktopBackground\\Shell\\${APP_GUID}" /f` 
  }
];

module.exports = { apply, revert };