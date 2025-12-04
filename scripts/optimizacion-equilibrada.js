// scripts/optimizacion-equilibrada.js (v1.5.3 - NETWORK TWEAKS REMOVED)
const optimizacionBasica = require('./optimizacion-basica.js');

const applyEquilibrado = [
  // --- Privacidad y QoL Seguros ---
  { id: 'qol_stickykeys', message: "Desactivando Sticky Keys (Shift 5 veces)...", command: 'reg add "HKCU\\Control Panel\\Accessibility\\StickyKeys" /v "Flags" /t REG_SZ /d "506" /f & reg add "HKCU\\Control Panel\\Accessibility\\Keyboard Response" /v "Flags" /t REG_SZ /d "122" /f & reg add "HKCU\\Control Panel\\Accessibility\\ToggleKeys" /v "Flags" /t REG_SZ /d "58" /f' },
  { id: 'privacy_activity_history', message: "Desactivando Historial de Actividad...", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v "PublishUserActivities" /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v "UploadUserActivities" /t REG_DWORD /d 0 /f' },
  { id: 'privacy_notifications_toast', message: "Desactivando Notificaciones Toast molestas...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d 0 /f' },
  
  // --- Tweaks Originales ---
  { id: 'serv_telemetria', message: "Desactivando servicios de telemetria...", command: 'sc config diagtrack start= disabled & sc config DPS start= disabled & sc config WerSvc start= disabled' },
  { id: 'serv_gamebar', message: "Desactivando Game Bar, DVR y Modo Juego Auto...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 0 /f' },
  { id: 'serv_fax_maps_phone', message: "Desactivando servicios innecesarios (Fax, Maps, Phone)...", command: 'sc config Fax start= disabled & sc config MapsBroker start= disabled & sc config PhoneSvc start= disabled' },
  { id: 'serv_store_demo', message: "Desactivando servicios RetailDemo/Wallet...", command: 'sc config RetailDemo start= disabled & sc config WalletService start= disabled' },
  { id: 'serv_geo_offline', message: "Desactivando Geolocalizacion y Archivos sin conexion...", command: 'sc config lfsvc start= disabled & sc config CscService start= disabled' },
  { id: 'serv_diag_ics', message: "Desactivando servicios de diagnostico e ICS...", command: 'sc config diagnosticshub.standardcollector.service start= disabled & sc config SharedAccess start= disabled' },
  { id: 'privacy_cdp', message: "Desactivando Experiencias Compartidas (CDP)...", command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d 0 /f' },
  { id: 'privacy_settingsync', message: "Desactivando Sincronizacion de Ajustes...", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\SettingSync" /v "DisableSettingSync" /t Reg_DWORD /d "2" /f' },
  { id: 'privacy_contentdelivery', message: "Evitando Reinstalacion de Apps (ContentDelivery)...", command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 0 /f' },
  { id: 'privacy_consumerfeatures', message: "Desactivando Sugerencias de Apps (ConsumerFeatures)...", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableWindowsConsumerFeatures" /t "REG_DWORD" /d "1" /f' },
  { id: 'task_compatibility', message: "Desactivando Tarea Compatibility Appraiser...", command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Application Experience\\Microsoft Compatibility Appraiser" /Disable' },
  { id: 'task_ceip', message: "Desactivando Tarea CEIP...", command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /Disable' },
  { id: 'serv_bam', message: "Desactivando Servicio BAM...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam" /v Start /t REG_DWORD /d 4 /f' },
  { id: 'serv_mantenimiento', message: "Desactivando Mantenimiento Automático...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d 1 /f & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Idle Maintenance" /Disable & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Maintenance Configurator" /Disable' },
  { id: 'sys_driver_search', message: "Evitando busqueda de drivers en Windows Update...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DriverSearching" /v "SearchOrderConfig" /t REG_DWORD /d 0 /f' },
  { id: 'mem_largesystemcache', message: "Desactivando Large System Cache...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d 0 /f' },
  { id: 'mem_pagingexecutive', message: "Desactivando Paging Executive...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 1 /f' },
  { id: 'sys_ntfs_memory', message: "Optimizando memoria NTFS...", command: 'fsutil behavior set memoryusage 2' },
  { id: 'sys_shadercache', message: "Optimizando registro de Caché de Shaders...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCache" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheSize" /t REG_DWORD /d 10240 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheDefrag" /t REG_DWORD /d 1 /f' },
  { id: 'qol_fse', message: "Desactivando Optimizaciones de Pantalla Completa...", command: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f' },
  { id: 'privacy_uwp_background', message: "Restringiendo Apps UWP en segundo plano...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f' },
  // ELIMINADO: net_probing (Movido a Red Avanzada)
  { id: 'rend_priority_separation', message: "Optimizando prioridades (Foreground Boost)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 26 /f' }
];

const revertEquilibrado = [
  { id: 'qol_stickykeys', message: "Restaurando Sticky Keys...", command: 'reg add "HKCU\\Control Panel\\Accessibility\\StickyKeys" /v "Flags" /t REG_SZ /d "510" /f' },
  { id: 'privacy_activity_history', message: "Restaurando Historial de Actividad...", command: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v "PublishUserActivities" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v "UploadUserActivities" /f >nul 2>&1' },
  { id: 'privacy_notifications_toast', message: "Reactivando Notificaciones Toast...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d 1 /f' },
  { id: 'serv_telemetria', message: "Reactivando servicios de telemetria...", command: 'sc config diagtrack start= auto & sc config DPS start= auto & sc config WerSvc start= auto' },
  { id: 'serv_gamebar', message: "Reactivando Game Bar y DVR...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 1 /f & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /f >nul 2>&1 & reg add "HKLM\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f' },
  { id: 'serv_fax_maps_phone', message: "Reactivando servicios base...", command: 'sc config Fax start= auto & sc config MapsBroker start= auto & sc config PhoneSvc start= auto' },
  { id: 'serv_store_demo', message: "Reactivando servicios Retail...", command: 'sc config RetailDemo start= auto & sc config WalletService start= auto' },
  { id: 'serv_geo_offline', message: "Reactivando servicios Geo/Offline...", command: 'sc config lfsvc start= auto & sc config CscService start= auto' },
  { id: 'serv_diag_ics', message: "Reactivando servicios Diag/ICS...", command: 'sc config diagnosticshub.standardcollector.service start= auto & sc config SharedAccess start= auto' },
  { id: 'privacy_cdp', message: "Reactivando Experiencias Compartidas...", command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d 1 /f' },
  { id: 'privacy_settingsync', message: "Reactivando Sincronizacion de Ajustes...", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\SettingSync" /v "DisableSettingSync" /t Reg_DWORD /d 0 /f' },
  { id: 'privacy_contentdelivery', message: "Permitiendo Reinstalacion de Apps...", command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 1 /f' },
  { id: 'privacy_consumerfeatures', message: "Reactivando Sugerencias de Apps...", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableWindowsConsumerFeatures" /t "REG_DWORD" /d "0" /f' },
  { id: 'task_compatibility', message: "Reactivando Tarea Compatibility...", command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Application Experience\\Microsoft Compatibility Appraiser" /Enable' },
  { id: 'task_ceip', message: "Reactivando Tarea CEIP...", command: 'schtasks /Change /TN "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /Enable' },
  { id: 'serv_bam', message: "Reactivando Servicio BAM...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam" /v Start /t REG_DWORD /d 3 /f' },
  { id: 'serv_mantenimiento', message: "Reactivando Mantenimiento Automático...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d 0 /f & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Idle Maintenance" /Enable & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Maintenance Configurator" /Enable' },
  { id: 'sys_driver_search', message: "Permitiendo busqueda de drivers...", command: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DriverSearching" /v "SearchOrderConfig" /f >nul 2>&1' },
  { id: 'mem_largesystemcache', message: "Restaurando Large System Cache...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d 0 /f' },
  { id: 'mem_pagingexecutive', message: "Restaurando Paging Executive...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 0 /f' },
  { id: 'sys_ntfs_memory', message: "Restaurando memoria NTFS...", command: 'fsutil behavior set memoryusage 1' },
  { id: 'sys_shadercache', message: "Restaurando registro Caché Shaders...", command: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCache" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheSize" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheDefrag" /f >nul 2>&1' },
  { id: 'qol_fse', message: "Restaurando Optimizaciones Pantalla Completa...", command: 'reg delete "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /f >nul 2>&1' },
  { id: 'privacy_uwp_background', message: "Permitiendo Apps UWP en segundo plano...", command: 'reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /f >nul 2>&1' },
  // ELIMINADO: net_probing revert
  { id: 'rend_priority_separation', message: "Restaurando prioridades...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 2 /f' }
];

module.exports = {
  apply: [...optimizacionBasica.apply, ...applyEquilibrado],
  revert: [...revertEquilibrado, ...optimizacionBasica.revert]
};