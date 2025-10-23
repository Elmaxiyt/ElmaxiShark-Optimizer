// scripts/optimizacion-extremo.js
const optimizacionEquilibrada = require('./optimizacion-equilibrada.js');

const applyExtremo = [
  // --- SISTEMA Y RED ---
  {
    message: "Priorizando CPU y GPU para juegos...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 6 /f'
  },
  {
    message: "Optimizando red para baja latencia (NetworkThrottling)...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f & netsh interface tcp set global autotuninglevel=disabled'
  },
  {
    message: "Optimizando temporizadores del sistema (DynamicTick)...",
    command: 'bcdedit /set disabledynamictick yes'
  },
  {
    message: "Optimizando TCP (MaxUserPort, TcpTimedWaitDelay)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /t REG_DWORD /d 65534 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d 30 /f'
  },
  {
    message: "Desactivando ECN Capability (Red)...",
    command: 'netsh int tcp set global ecncapability=disabled'
  },
  {
    message: "Desactivando Offloads (LSO, RSC) (Puede mejorar latencia)...",
    command: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing disabled -ReceiveSideScaling disabled -Chimney disabled; Disable-NetAdapterLso -Name *; Disable-NetAdapterChecksumOffload -Name *"'
  },
  // --- ENERGIA Y MEMORIA ---
  {
    message: "Desactivando Power Throttling (Rendimiento Segundo Plano)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f'
  },
  {
    message: "Desactivando Inicio Rapido...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando Compresion de Memoria y Page Combining (para 16GB+ RAM)...",
    command: 'powershell -Command "Disable-MMAgent -MemoryCompression; Disable-MMAgent -PageCombining"'
  },
  // --- ALMACENAMIENTO Y USB ---
  {
    message: "Desactivando Last Access Time (Mejora NTFS)...",
    command: 'fsutil behavior set disableLastAccess 1'
  },
  {
    message: "Desactivando ahorro de energia de almacenamiento (HIPM/DIPM)...",
    command: 'for %%i in (EnableHIPM EnableDIPM) do for /f %%a in (\'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services" /s /f "%%i" ^| findstr "HKEY"\') do reg add "%%a" /v "%%i" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando Suspension Selectiva de USB...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB" /v "DisableSelectiveSuspend" /t REG_DWORD /d 1 /f'
  },
  // --- SCRIPT DE ADAPTADOR DE RED ---
  {
    message: "Optimizando propiedades de Adaptador de Red (Script)...",
    isScript: true,
    command: `@echo off
chcp 65001 >nul
:: Itera sobre todos los adaptadores de red y desactiva funciones de ahorro de energia/interrupcion
for /f %%n in ('Reg query "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"') do (
    reg add "%%n" /v "AdvancedEEE" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "*EEE" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "EEE" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "EnableGreenEthernet" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "EnablePME" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "*WakeOnMagicPacket" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "*WakeOnPattern" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "EnableWakeOnLan" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "*FlowControl" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "RxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "TxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "IPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "TCPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "TCPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "UDPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1
    reg add "%%n" /v "UDPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1
)`
  }
];

const revertExtremo = [
  // --- REVERT SISTEMA Y RED ---
  {
    message: "Restaurando prioridades de CPU y GPU...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /f >nul 2>&1'
  },
  {
    message: "Restaurando configuracion de red (NetworkThrottling)...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f & netsh interface tcp set global autotuninglevel=normal'
  },
  {
    message: "Reactivando Dynamic Tick...",
    command: 'bcdedit /deletevalue disabledynamictick'
  },
  {
    message: "Restaurando TCP (MaxUserPort, TcpTimedWaitDelay)...",
    command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /f >nul 2>&1 & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /f >nul 2>&1'
  },
  {
    message: "Reactivando ECN Capability (Red)...",
    command: 'netsh int tcp set global ecncapability=enabled'
  },
  {
    message: "Reactivando Offloads (LSO, RSC)...",
    command: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing enabled -ReceiveSideScaling enabled -Chimney enabled; Enable-NetAdapterLso -Name *; Enable-NetAdapterChecksumOffload -Name *"'
  },
  // --- REVERT ENERGIA Y MEMORIA ---
  {
    message: "Reactivando Power Throttling...",
    command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /f >nul 2>&1'
  },
  {
    message: "Reactivando Inicio Rapido...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f'
  },
  {
    message: "Reactivando Compresion de Memoria y Page Combining...",
    command: 'powershell -Command "Enable-MMAgent -MemoryCompression; Enable-MMAgent -PageCombining"'
  },
  // --- REVERT ALMACENAMIENTO Y USB ---
  {
    message: "Restaurando Last Access Time...",
    command: 'fsutil behavior set disableLastAccess 2'
  },
  {
    message: "Reactivando ahorro de energia de almacenamiento (HIPM/DIPM)...",
    command: 'for %%i in (EnableHIPM EnableDIPM) do for /f %%a in (\'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services" /s /f "%%i" ^| findstr "HKEY"\') do reg add "%%a" /v "%%i" /t REG_DWORD /d 1 /f'
  },
  {
    message: "Reactivando Suspension Selectiva de USB...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB" /v "DisableSelectiveSuspend" /t REG_DWORD /d 0 /f'
  },
  // --- REVERT SCRIPT DE ADAPTADOR DE RED ---
  {
    message: "Restaurando propiedades de Adaptador de Red (Script)...",
    isScript: true,
    command: `@echo off
chcp 65001 >nul
:: Itera y borra los valores para que vuelvan a su default de driver
for /f %%n in ('Reg query "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"') do (
    reg delete "%%n" /v "AdvancedEEE" /f >nul 2>&1
    reg delete "%%n" /v "*EEE" /f >nul 2>&1
    reg delete "%%n" /v "EEE" /f >nul 2>&1
    reg delete "%%n" /v "EnableGreenEthernet" /f >nul 2>&1
    reg delete "%%n" /v "EnablePME" /f >nul 2>&1
    reg delete "%%n" /v "*WakeOnMagicPacket" /f >nul 2>&1
    reg delete "%%n" /v "*WakeOnPattern" /f >nul 2>&1
    reg delete "%%n" /v "EnableWakeOnLan" /f >nul 2>&1
    reg delete "%%n" /v "*FlowControl" /f >nul 2>&1
    reg delete "%%n" /v "RxAbsIntDelay" /f >nul 2>&1
    reg delete "%%n" /v "TxAbsIntDelay" /f >nul 2>&1
    reg delete "%%n" /v "IPChecksumOffloadIPv4" /f >nul 2>&1
    reg delete "%%n" /v "TCPChecksumOffloadIPv4" /f >nul 2>&1
    reg delete "%%n" /v "TCPChecksumOffloadIPv6" /f >nul 2>&1
    reg delete "%%n" /v "UDPChecksumOffloadIPv4" /f >nul 2>&1
    reg delete "%%n" /v "UDPChecksumOffloadIPv6" /f >nul 2>&1
)`
  }
];

module.exports = {
  apply: [...optimizacionEquilibrada.apply, ...applyExtremo],
  revert: [...revertExtremo, ...optimizacionEquilibrada.revert]
};