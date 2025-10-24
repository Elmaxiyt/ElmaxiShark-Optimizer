// scripts/optimizacion-mododios.js
const optimizacionExtremo = require('./optimizacion-extremo.js');

const applyModoDios = [
  // --- TWEAKS DE RED AGRESIVOS ---
  {
    message: "Optimizando red agresivamente (Nagle)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 1 /f'
  },
  {
    message: "Desactivando IPv6...",
    command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 255 /f'
  },
  {
    message: "Desactivando ICMP Redirects (Puede romper FiveM)...",
    command: 'netsh int ip set global icmpredirects=disabled'
  },
  {
    message: "MODO DIOS: Desactivando NDU (Diagnostico de Red)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f'
  },
  // --- TWEAKS DE SISTEMA AGRESIVOS ---
  {
    message: "Optimizando temporizadores avanzados (HPET/TSC)...",
    command: 'bcdedit /deletevalue useplatformclock & bcdedit /set tscsyncpolicy Enhanced'
  },
  {
    message: "Desactivando virtualizacion (Hyper-V)...",
    command: 'bcdedit /set hypervisorlaunchtype off'
  },
  {
    message: "Desactivando servicios avanzados (Notas, Radio, Tablet)...",
    command: 'sc config PimIndexMaintenanceSvc start= disabled & sc config RmSvc start= disabled & sc config TabletInputService start= disabled'
  },
  // --- DEBLOAT AGRESIVO ---
  {
    message: "MODO DIOS: Desactivando Windows Search (Rompe el buscador)...",
    command: 'sc config WSearch start= disabled'
  },
  {
    message: "MODO DIOS: Desactivando Cola de Impresion (Impresoras)...",
    command: 'sc config Spooler start= disabled'
  },
  {
    message: "MODO DIOS: Desactivando servicios de Xbox...",
    command: 'sc config XblAuthManager start= disabled & sc config XblGameSave start= disabled & sc config XboxGipSvc start= disabled & sc config XboxNetApiSvc start= disabled'
  },
  {
    message: "MODO DIOS: Desactivando Widgets y Chat (W11)...",
    command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarDa /t REG_DWORD /d 0 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarMn /t REG_DWORD /d 0 /f'
  },
  {
    message: "MODO DIOS: Desactivando Microsoft Store...",
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v "DisableStoreApps" /t REG_DWORD /d 1 /f'
  },
  {
    message: "MODO DIOS: Desinstalando Cortana y Copilot...
powershell -Command \"Get-appxpackage -allusers *Microsoft.549981C3F5F10* | Remove-AppxPackage; Get-AppxPackage Microsoft.Windows.Ai.Copilot.Provider | Remove-AppxPackage\""
  },
  {
    message: "MODO DIOS: Desinstalando Apps UWP (Clima, Mapas, People...)...",
    isScript: true,
    command: `@echo off
chcp 437 >nul
Powershell.exe -command "& {Get-AppxPackage *Microsoft.BingWeather* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.GetHelp* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.Getstarted* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.Messaging* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.Microsoft3DViewer* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.MicrosoftSolitaireCollection* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.MicrosoftStickyNotes* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.MixedReality.Portal* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.OneConnect* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.People* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.Print3D* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.SkypeApp* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.WindowsAlarms* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.WindowsCamera* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *microsoft.windowscommunicationsapps* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.WindowsMaps* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.WindowsFeedbackHub* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.WindowsSoundRecorder* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.YourPhone* | Remove-AppxPackage}" >nul 2>&1
Powershell.exe -command "& {Get-AppxPackage *Microsoft.ZuneMusic* | Remove-AppxPackage}" >nul 2>&1
:: (Línea para eliminar Microsoft.ZuneVideo (Películas y TV) ELIMINADA aquí)
`
  },
  // --- MITIGACIONES AGRESIVAS ---
  {
    message: "ADVERTENCIA: Desactivando mitigaciones de CPU (Meltdown/Spectre)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverride /t REG_DWORD /d 3 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverrideMask /t REG_DWORD /d 3 /f'
  },
  {
    message: "ADVERTENCIA: Desactivando mitigaciones (VBS, CFG, ASLR)...",
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d 0 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel" /v "DisableExceptionChainValidation" /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel" /v "KernelSEHOPEnabled" /t REG_DWORD /d 0 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "EnableCfg" /t REG_DWORD /d 0 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "MoveImages" /t REG_DWORD /d 0 /f'
  }
];

const revertModoDios = [
  // --- REVERT TWEAKS DE RED AGRESIVOS ---
  {
    message: "Reactivando Algoritmo de Nagle...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 2 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 0 /f'
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
    message: "Restaurando temporizadores del sistema (HPET/TSC)...",
    command: 'bcdedit /set useplatformclock true & bcdedit /deletevalue tscsyncpolicy'
  },
  {
    message: "Reactivando virtualizacion (Hyper-V)...",
    command: 'bcdedit /set hypervisorlaunchtype auto'
  },
  {
    message: "Reactivando servicios avanzados...",
    command: 'sc config PimIndexMaintenanceSvc start= auto & sc config RmSvc start= auto & sc config TabletInputService start= auto'
  },
  // --- REVERT DEBLOAT AGRESIVO ---
  {
    message: "MODO DIOS: Reactivando Windows Search...",
    command: 'sc config WSearch start= auto'
  },
  {
    message: "MODO DIOS: Reactivando Cola de Impresion...",
    command: 'sc config Spooler start= auto'
  },
  {
    message: "MODO DIOS: Reactivando servicios de Xbox...",
    command: 'sc config XblAuthManager start= auto & sc config XblGameSave start= auto & sc config XboxGipSvc start= auto & sc config XboxNetApiSvc start= auto'
  },
  {
    message: "MODO DIOS: Reactivando Widgets y Chat (W11)...",
    command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarDa /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarMn /t REG_DWORD /d 1 /f'
  },
  {
    message: "MODO DIOS: Reactivando Microsoft Store...
reg add \"HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore\" /v \"DisableStoreApps\" /t REG_DWORD /d 0 /f"
  },
  {
    message: "MODO DIOS: Reinstalando Apps UWP (Puede tardar)...",
    command: 'powershell -Command "Get-AppxPackage -allusers | foreach {Add-AppxPackage -register “$($_.InstallLocation)\\appxmanifest.xml” -DisabledevelopmentMode}"'
  },
  // --- REVERT MITIGACIONES AGRESIVAS ---
  {
    message: "Reactivando mitigaciones de CPU (Meltdown/Spectre)...",
    command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverride /f >nul 2>&1 & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverrideMask /f >nul 2>&1'
  },
  {
    message: "Reactivando mitigaciones (VBS, CFG, ASLR)...",
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel\" /v "DisableExceptionChainValidation" /t REG_DWORD /d 0 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel\" /v "KernelSEHOPEnabled" /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v "EnableCfg" /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v "MoveImages" /t REG_DWORD /d 1 /f'
  }
];

module.exports = {
  apply: [...optimizacionExtremo.apply, ...applyModoDios],
  revert: [...revertModoDios, ...optimizacionExtremo.revert]
};