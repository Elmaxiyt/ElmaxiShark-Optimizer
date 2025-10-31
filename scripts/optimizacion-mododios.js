// scripts/optimizacion-mododios.js (v1.4 - SEGURO, Bug Bluetooth Arreglado)
const optimizacionOverdrive = require('./optimizacion-overdrive.js'); 

const applyModoDios = [
  // --- TWEAKS DE RED AGRESIVOS ---
  {
    message: "Optimizando red agresivamente (Nagle)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 1 /f'
  },
  { // --- NUEVO TWEAK SEGURO (RED) ---
    message: "Optimizando red agresivamente (TcpDelAckTicks)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando IPv6...",
    command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 255 /f'
  },
  {
    message: "Desactivando ICMP Redirects...",
    command: 'netsh int ip set global icmpredirects=disabled'
  },
  {
    message: "MODO DIOS: Desactivando NDU (Diagnostico de Red)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f'
  },
  // --- TWEAKS DE SISTEMA AGRESIVOS ---
  {
    message: "Desactivando virtualizacion (Hyper-V)...",
    command: 'bcdedit /set hypervisorlaunchtype off'
  },
  { // --- MODIFICADO (QUITADO RmSvc PARA ARREGLAR BLUETOOTH) ---
    message: "Desactivando servicios avanzados (Notas, Tablet)...",
    command: 'sc config PimIndexMaintenanceSvc start= disabled & sc config TabletInputService start= disabled'
  },
];

const revertModoDios = [
  // --- REVERT TWEAKS DE RED AGRESIVOS ---
  {
    message: "Reactivando Algoritmo de Nagle...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 2 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 0 /f'
  },
  { // --- NUEVO TWEAK SEGURO (REVERTIR) ---
    message: "Restaurando red (TcpDelAckTicks)...",
    command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /f >nul 2>&1'
  },
  {
    message: "Reactivando IPv6...",
    command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Reactivando ICMP Redirects...",
    command: 'netsh int ip set global icmpredirects=enabled'
  },
  {
    message: "MODO DIOS: Reactivando NDU (Diagnostico de Red)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 2 /f'
  },
  // --- REVERT TWEAKS DE SISTEMA AGRESIVOS ---
  {
    message: "Reactivando virtualizacion (Hyper-V)...",
    command: 'bcdedit /set hypervisorlaunchtype auto'
  },
  { // --- MODIFICADO (QUITADO RmSvc PARA ARREGLAR BLUETOOTH) ---
    message: "Reactivando servicios avanzados...",
    command: 'sc config PimIndexMaintenanceSvc start= auto & sc config TabletInputService start= auto'
  },
];

module.exports = {
  apply: [...optimizacionOverdrive.apply, ...applyModoDios],
  revert: [...revertModoDios, ...optimizacionOverdrive.revert]
};