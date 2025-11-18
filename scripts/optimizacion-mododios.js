// scripts/optimizacion-mododios.js (v2.1 - Gold Tier Gamer)
const optimizacionExtremo = require('./optimizacion-extremo.js'); 

const applyModoDios = [
  // --- NUEVOS TWEAKS GAMING (Seguros y Efectivos) ---
  { 
    id: 'rend_mmcss', 
    message: "MODO GAMER: Forzando MMCSS Siempre Activo (Estabilidad FPS)...", 
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v AlwaysOn /t REG_DWORD /d 1 /f' 
  },
  { 
    id: 'net_qos', 
    message: "MODO GAMER: Liberando Ancho de Banda QoS (100% Red)...", 
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f' 
  },
  
  // --- Tweaks Clásicos de Modo Dios ---
  { id: 'crit_sysmain', message: "MODO GAMER: Desactivando SysMain (Superfetch)...", command: 'sc config SysMain start= disabled' },
  { id: 'net_nagle', message: "MODO GAMER: Desactivando Algoritmo de Nagle...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /t REG_DWORD /d 0 /f' },
  { id: 'net_ipv6', message: "MODO GAMER: Desactivando IPv6...", command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 255 /f' },
  { id: 'net_ndu', message: "MODO GAMER: Desactivando NDU...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f' },
  { id: 'serv_advanced', message: "MODO GAMER: Desactivando servicios avanzados (Notas, Tablet)...", command: 'sc config PimIndexMaintenanceSvc start= disabled & sc config TabletInputService start= disabled' }
];

const revertModoDios = [
  // Revertir Nuevos
  { id: 'rend_mmcss', message: "MODO GAMER: Restaurando MMCSS...", command: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v AlwaysOn /f >nul 2>&1' },
  { id: 'net_qos', message: "MODO GAMER: Restaurando QoS...", command: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /f >nul 2>&1' },

  // Revertir Clásicos
  { id: 'crit_sysmain', message: "MODO GAMER: Reactivando SysMain...", command: 'sc config SysMain start= auto' },
  { id: 'net_nagle', message: "MODO GAMER: Restaurando Nagle...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 2 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 0 /f & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /f >nul 2>&1' },
  { id: 'net_ipv6', message: "MODO GAMER: Reactivando IPv6...", command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 0 /f' },
  { id: 'net_ndu', message: "MODO GAMER: Reactivando NDU...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 2 /f' },
  { id: 'serv_advanced', message: "MODO GAMER: Reactivando servicios avanzados...", command: 'sc config PimIndexMaintenanceSvc start= auto & sc config TabletInputService start= auto' }
];

module.exports = {
  apply: [...optimizacionExtremo.apply, ...applyModoDios],
  revert: [...revertModoDios, ...optimizacionExtremo.revert]
};