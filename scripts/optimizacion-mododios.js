// scripts/optimizacion-mododios.js (v1.5.3 - NETWORK TWEAKS REMOVED)
const optimizacionExtremo = require('./optimizacion-extremo.js'); 

const applyModoDios = [
  // --- TWEAKS GAMING (Seguros y Efectivos) ---
  { 
    id: 'rend_mmcss', 
    message: "MODO GAMER: Forzando MMCSS Siempre Activo (Estabilidad FPS)...", 
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v AlwaysOn /t REG_DWORD /d 1 /f' 
  },
  // ELIMINADO: net_qos (Movido a Red Avanzada)
  
  // --- Tweaks Clásicos de Modo Dios (Solo estables) ---
  { id: 'crit_sysmain', message: "MODO GAMER: Desactivando SysMain (Superfetch)...", command: 'sc config SysMain start= disabled' },
  // ELIMINADO: net_ndu (Movido a Red Avanzada)
  { id: 'serv_advanced', message: "MODO GAMER: Desactivando servicios avanzados (Notas, Tablet)...", command: 'sc config PimIndexMaintenanceSvc start= disabled & sc config TabletInputService start= disabled' }
];

const revertModoDios = [
  { id: 'rend_mmcss', message: "MODO GAMER: Restaurando MMCSS...", command: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v AlwaysOn /f >nul 2>&1' },
  // ELIMINADO: net_qos revert

  { id: 'crit_sysmain', message: "MODO GAMER: Reactivando SysMain...", command: 'sc config SysMain start= auto' },
  // ELIMINADO: net_ndu revert
  { id: 'serv_advanced', message: "MODO GAMER: Reactivando servicios avanzados...", command: 'sc config PimIndexMaintenanceSvc start= auto & sc config TabletInputService start= auto' }
];

module.exports = {
  apply: [...optimizacionExtremo.apply, ...applyModoDios],
  revert: [...revertModoDios, ...optimizacionExtremo.revert]
};