// scripts/optimizacion-equilibrada.js (v1.1)
const optimizacionBasica = require('./optimizacion-basica.js');

const applyEquilibrado = [
  // --- DEBLOAT Y SERVICIOS ---
  {
    message: "Desactivando servicios de telemetria...",
    command: 'sc config diagtrack start= disabled & sc config DPS start= disabled & sc config WerSvc start= disabled'
  },
  // { message: "Desactivando SysMain (Superfetch)...", command: 'sc config SysMain start= disabled' }, // Movido a Overdrive
  {
    message: "Desactivando Game Bar y DVR...",
    command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando Modo de Juego automatico...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando servicios innecesarios (Base)...",
    command: 'sc config Fax start= disabled & sc config MapsBroker start= disabled & sc config PhoneSvc start= disabled'
  },
  {
    message: "Desactivando servicios innecesarios (Tienda)...",
    command: 'sc config RetailDemo start= disabled & sc config WalletService start= disabled'
  },
  {
    message: "Desactivando servicios adicionales (Geolocalizacion, Archivos sin conexion)...",
    command: 'sc config lfsvc start= disabled & sc config CscService start= disabled'
  },
  {
    message: "Desactivando servicios de diagnostico y comparticion (ICS)...",
    command: 'sc config diagnosticshub.standardcollector.service start= disabled & sc config SharedAccess start= disabled'
  },
  {
    message: "Desactivando Experiencias Compartidas (CDP)...",
    command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando Sincronizacion de Ajustes...",
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\SettingSync" /v "DisableSettingSync" /t Reg_DWORD /d "2" /f'
  },
  {
    message: "Evitando Reinstalacion de Apps (ContentDelivery)...",
    command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando Sugerencias de Apps (ConsumerFeatures)...",
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableWindowsConsumerFeatures" /t "REG_DWORD" /d "1" /f'
  },
  {
    message: "Desactivando Tarea Programada (Microsoft Compatibility Appraiser)...",
    command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Application Experience\\Microsoft Compatibility Appraiser" /Disable'
  },
  {
    message: "Desactivando Tarea Programada (Consolidator CEIP)...",
    command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /Disable'
  },
  {
    message: "Desactivando Servicio BAM (Background Activity Moderator)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam" /v Start /t REG_DWORD /d 4 /f'
  },
  {
    message: "Desactivando Tareas de Mantenimiento Inactivo...",
    command: 'schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Idle Maintenance" /Disable & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Maintenance Configurator" /Disable'
  },
  // --- SISTEMA Y MEMORIA ---
  {
    message: "Desactivando Mantenimiento Automatico...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d 1 /f'
  },
  {
    message: "Evitando busqueda de drivers en Windows Update...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DriverSearching" /v "SearchOrderConfig" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando Large System Cache (mas RAM para apps)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Desactivando Paging Executive (Kernel en RAM)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 1 /f'
  },
  {
    message: "Optimizando uso de memoria de NTFS...",
    command: 'fsutil behavior set memoryusage 2'
  },
  {
    message: "Optimizando registro de Caché de Shaders (Direct3D)...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCache" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheSize" /t REG_DWORD /d 10240 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheDefrag" /t REG_DWORD /d 1 /f'
  },
  // --- QOL Y PERIFERICOS ---
  {
    message: "Activando Menu Contextual Completo (W10/W7 style)",
    command: 'reg add "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" /v "" /t REG_SZ /d "" /f'
  },
  {
    message: "Desactivando aceleracion del raton...",
    command: 'reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 0 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 0 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 0 /f'
  },
  {
    message: "Optimizando respuesta del teclado...",
    command: 'reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardDelay /t REG_SZ /d 0 /f & reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardSpeed /t REG_SZ /d 31 /f'
  },
  {
    message: "Desactivando Optimizaciones de Pantalla Completa (Global)...",
    command: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f'
  },
  {
    message: "Restringiendo ejecucion de Apps UWP en segundo plano...",
    command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f'
  },
  {
    message: "Desactivando sondeo de internet (Internet Probing)...",
    command: 'reg add "HKLM\\System\\ControlSet001\\services\\NlaSvc\\Parameters\\Internet" /v "EnableActiveProbing" /t REG_DWORD /d 0 /f'
  }
];

const revertEquilibrado = [
  // --- REVERT DEBLOAT Y SERVICIOS ---
  {
    message: "Reactivando servicios de telemetria...",
    command: 'sc config diagtrack start= auto & sc config DPS start= auto & sc config WerSvc start= auto'
  },
  // { message: "Reactivando SysMain (Superfetch)...", command: 'sc config SysMain start= auto' }, // Movido a Overdrive
  {
    message: "Reactivando Game Bar y DVR...",
    command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 1 /f & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /f >nul 2>&1'
  },
  {
    message: "Reactivando Modo de Juego automatico...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f'
  },
  {
    message: "Reactivando servicios base...",
    command: 'sc config Fax start= auto & sc config MapsBroker start= auto & sc config PhoneSvc start= auto'
  },
  {
    message: "Reactivando servicios de tienda...",
    command: 'sc config RetailDemo start= auto & sc config WalletService start= auto'
  },
  {
    message: "Reactivando servicios adicionales...",
    command: 'sc config lfsvc start= auto & sc config CscService start= auto'
  },
  {
    message: "Reactivando servicios de diagnostico y comparticion (ICS)...",
    command: 'sc config diagnosticshub.standardcollector.service start= auto & sc config SharedAccess start= auto'
  },
  {
    message: "Reactivando Experiencias Compartidas (CDP)...",
    command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d 1 /f'
  },
  {
    message: "Reactivando Sincronizacion de Ajustes...",
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\SettingSync" /v "DisableSettingSync" /t Reg_DWORD /d 0 /f'
  },
  {
    message: "Permitiendo Reinstalacion de Apps (ContentDelivery)...",
    command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 1 /f'
  },
  {
    message: "Reactivando Sugerencias de Apps (ConsumerFeatures)...",
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableWindowsConsumerFeatures" /t "REG_DWORD" /d "0" /f'
  },
  {
    message: "Reactivando Tarea Programada (Microsoft Compatibility Appraiser)...",
    command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Application Experience\\Microsoft Compatibility Appraiser" /Enable'
  },
  {
    message: "Reactivando Tarea Programada (Consolidator CEIP)...",
    command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /Enable'
  },
  {
    message: "Reactivando Servicio BAM (Background Activity Moderator)...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam" /v Start /t REG_DWORD /d 3 /f'
  },
  {
    message: "Reactivando Tareas de Mantenimiento Inactivo...",
    command: 'schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Idle Maintenance" /Enable & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Maintenance Configurator" /Enable'
  },
  // --- REVERT SISTEMA Y MEMORIA ---
  // { message: "Restaurando SvcHost por defecto...", command: 'reg delete "..."' }, // Movido a Overdrive (gestionado en main.js)
  {
    message: "Reactivando Mantenimiento Automatico...",
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Permitiendo busqueda de drivers en Windows Update...",
    command: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DriverSearching" /v "SearchOrderConfig" /f >nul 2>&1'
  },
  {
    message: "Restaurando Large System Cache...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Restaurando Paging Executive...",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 0 /f'
  },
  {
    message: "Restaurando uso de memoria de NTFS...",
    command: 'fsutil behavior set memoryusage 1'
  },
  {
    message: "Restaurando registro de Caché de Shaders (Direct3D)...",
    command: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCache" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheSize" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheDefrag" /f >nul 2>&1'
  },
  // --- REVERT QOL Y PERIFERICOS ---
  {
    message: "Restaurando Menu Contextual Moderno (W11 style)",
    command: 'reg delete "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f >nul 2>&1'
  },
  {
    message: "Restaurando aceleracion del raton...",
    command: 'reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 1 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 6 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 10 /f'
  },
  {
    message: "Restaurando respuesta del teclado...",
    command: 'reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardDelay /t REG_SZ /d 1 /f & reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardSpeed /t REG_SZ /d 31 /f'
  },
  {
    message: "Restaurando Optimizaciones de Pantalla Completa (Global)...",
    command: 'reg delete "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /f >nul 2>&1'
  },
  {
    message: "Permitiendo ejecucion de Apps UWP en segundo plano...",
    command: 'reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /f >nul 2>&1'
  },
  {
    message: "Reactivando sondeo de internet (Internet Probing)...",
    command: 'reg add "HKLM\\System\\ControlSet001\\services\\NlaSvc\\Parameters\\Internet" /v "EnableActiveProbing" /t REG_DWORD /d 1 /f'
  }
];

module.exports = {
  apply: [...optimizacionBasica.apply, ...applyEquilibrado],
  revert: [...revertEquilibrado, ...optimizacionBasica.revert]
};