const optimizacionExtremo = require('./optimizacion-extremo.js'); 

const applyModoDios = [
  { id: 'crit_sysmain', message: "MODO GAMER: Desactivando SysMain (Superfetch)...", command: 'sc config SysMain start= disabled' },
  { id: 'net_nagle', message: "MODO GAMER: Desactivando Algoritmo de Nagle...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /t REG_DWORD /d 0 /f' },
  { id: 'net_ipv6', message: "MODO GAMER: Desactivando IPv6...", command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 255 /f' },
  { id: 'net_ndu', message: "MODO GAMER: Desactivando NDU...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f' },
  { id: 'serv_advanced', message: "MODO GAMER: Desactivando servicios avanzados (Notas, Tablet)...", command: 'sc config PimIndexMaintenanceSvc start= disabled & sc config TabletInputService start= disabled' }
];

const revertModoDios = [
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