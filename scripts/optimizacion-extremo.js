const optimizacionEquilibrada = require('./optimizacion-equilibrada.js');

const applyExtremo = [
  { id: 'rend_prioridad_gpu', message: "Priorizando CPU y GPU para juegos...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 6 /f' },
  { id: 'net_throttle', message: "Optimizando red (NetworkThrottling)...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f' },
  { id: 'net_tcp_advanced', message: "Optimizando TCP (MaxUserPort, TcpTimedWaitDelay)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /t REG_DWORD /d 65534 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d 30 /f' },
  { id: 'rend_hwschmode', message: "Activando Programacion de GPU (HwSchMode)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d "2" /f' },
  { id: 'rend_tdr_delay', message: "Aumentando Timeout de GPU (TdrDelay)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 10 /f' },
  { id: 'rend_power_throttling', message: "Desactivando Power Throttling...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f' },
  { id: 'rend_inicio_rapido', message: "Desactivando Inicio Rapido...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f' },
  { id: 'sys_lastaccess', message: "Desactivando Last Access Time (NTFS)...", command: 'fsutil behavior set disableLastAccess 1' },
  { id: 'rend_almacenamiento', message: "Desactivando ahorro de energía SSD/USB...", command: 'for %%i in (EnableHIPM EnableDIPM) do for /f %%a in (\'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services" /s /f "%%i" ^| findstr "HKEY"\') do reg add "%%a" /v "%%i" /t REG_DWORD /d 0 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB" /v "DisableSelectiveSuspend" /t REG_DWORD /d 1 /f' }
];

const revertExtremo = [
  { id: 'rend_prioridad_gpu', message: "Restaurando prioridades de CPU y GPU...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /f >nul 2>&1' },
  { id: 'net_throttle', message: "Restaurando NetworkThrottling...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f' },
  { id: 'net_tcp_advanced', message: "Restaurando TCP...", command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /f >nul 2>&1 & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /f >nul 2>&1' },
  { id: 'rend_hwschmode', message: "Restaurando HwSchMode...", command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "HwSchMode" /f >nul 2>&1' },
  { id: 'rend_tdr_delay', message: "Restaurando TdrDelay...", command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /f >nul 2>&1' },
  { id: 'rend_power_throttling', message: "Restaurando Power Throttling...", command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /f >nul 2>&1' },
  { id: 'rend_inicio_rapido', message: "Restaurando Inicio Rapido...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f' },
  { id: 'sys_lastaccess', message: "Restaurando Last Access Time...", command: 'fsutil behavior set disableLastAccess 2' },
  { id: 'rend_almacenamiento', message: "Restaurando ahorro de energía SSD/USB...", command: 'for %%i in (EnableHIPM EnableDIPM) do for /f %%a in (\'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services" /s /f "%%i" ^| findstr "HKEY"\') do reg add "%%a" /v "%%i" /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB" /v "DisableSelectiveSuspend" /t REG_DWORD /d 0 /f' }
];

module.exports = {
  apply: [...optimizacionEquilibrada.apply, ...applyExtremo],
  revert: [...revertExtremo, ...optimizacionEquilibrada.revert]
};