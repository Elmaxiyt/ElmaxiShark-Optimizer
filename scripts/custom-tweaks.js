// scripts/custom-tweaks.js
// (v1.2 - MASTER LIST - Añadidos Mitigaciones, VRAM, NVIDIA y más)
// Los tweaks CRÍTICOS (SysMain, BCDEDIT, Compresión) se mantienen
// en su propia categoría con advertencias claras.

module.exports = {
  
  // --- Categoría Limpieza (Añadida - Riesgo Bajo) ---
  limpieza: [
    {
      id: 'clean_temp',
      message: "Limpiar archivos temporales (Usuario)",
      apply: 'del /f /s /q %TEMP%\\* >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de temporales."'
    },
    {
      id: 'clean_temp_win',
      message: "Limpiar archivos temporales (Windows)",
      apply: 'del /f /s /q C:\\Windows\\Temp\\* >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de temporales."'
    },
    {
      id: 'clean_prefetch',
      message: "Limpiar archivos Prefetch",
      apply: 'del /f /s /q C:\\Windows\\Prefetch\\* >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de temporales."'
    },
    {
      id: 'clean_d3dcache',
      message: "Limpiar cache DirectX generica (D3DSCache)",
      apply: 'rmdir /s /q "%LocalAppData%\\D3DSCache" >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'clean_nvidia_dx',
      message: "Limpiar cache DirectX de NVIDIA",
      apply: 'del /s /q "%LocalAppData%\\NVIDIA\\DXCache\\*.*" >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'clean_nvidia_gl',
      message: "Limpiar cache OpenGL de NVIDIA",
      apply: 'del /s /q "%LocalAppData%\\NVIDIA\\GLCache\\*.*" >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'clean_vulkan',
      message: "Limpiar cache Vulkan",
      apply: 'del /s /q "%AppData%\\Vulkan\\Cache\\*.*" >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'clean_wu',
      message: "Limpiar cache de Windows Update",
      apply: 'del /f /s /q %windir%\\SoftwareDistribution\\Download\\* >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'clean_iconcache',
      message: "Limpiar cache de Iconos",
      apply: 'del /f /s /q %LOCALAPPDATA%\\Microsoft\\Windows\\Explorer\\iconcache_* >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'clean_steam',
      message: "Limpiar cache de Steam",
      apply: 'rmdir /s /q "%LOCALAPPDATA%\\Steam\\htmlcache" >nul 2>&1 & rmdir /s /q "%LOCALAPPDATA%\\Steam\\appcache" >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'clean_epic',
      message: "Limpiar cache de Epic Games",
      apply: 'rmdir /s /q "%LOCALAPPDATA%\\EpicGamesLauncher\\Saved\\webcache" >nul 2>&1',
      revert: 'echo "No se puede revertir la limpieza de cache."'
    },
    {
      id: 'net_flushdns',
      message: "Limpiar cache de DNS",
      apply: 'ipconfig /flushdns',
      revert: 'ipconfig /flushdns'
    }
  ],
  
  // --- Categoría Interfaz (QoL - Riesgo Bajo) ---
  interfaz: [
    {
      id: 'ui_visualfx',
      message: "Ajustar efectos visuales a 'Mejor Rendimiento'",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 0 /f'
    },
    {
      id: 'ui_transparencia',
      message: "Desactivar efectos de transparencia",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 1 /f'
    },
    {
      id: 'ui_menus_animaciones',
      message: "Acelerar menús y desactivar animaciones",
      apply: 'reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 10 /f & reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 0 /f',
      revert: 'reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f & reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 1 /f'
    },
    {
      id: 'ui_menu_contextual',
      message: "Activar Menú Contextual Completo (W10/W7 style)",
      apply: 'reg add "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" /v "" /t REG_SZ /d "" /f',
      revert: 'reg delete "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f >nul 2>&1'
    },
    {
      id: 'qol_wallpaper',
      message: "Mejorar calidad de compresion de Wallpaper",
      apply: 'reg add "HKCU\\Control Panel\\Desktop" /v "JPEGImportQuality" /t REG_DWORD /d "100" /f',
      revert: 'reg delete "HKCU\\Control Panel\\Desktop" /v "JPEGImportQuality" /f >nul 2>&1'
    },
    {
      id: 'qol_show_extensions',
      message: "Mostrar extensiones de archivos conocidos",
      apply: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "HideFileExt" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "HideFileExt" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'qol_mouse_accel',
      message: "Desactivar aceleracion del raton",
      apply: 'reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 0 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 0 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 0 /f',
      revert: 'reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 1 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 6 /f & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 10 /f'
    },
    { // --- NUEVO TWEAK (CUSTOM) ---
      id: 'qol_mouse_queue',
      message: "Optimizar cola de datos del raton (Para 1000Hz+)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters" /v MouseDataQueueSize /t REG_DWORD /d 100 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters" /v MouseDataQueueSize /t REG_DWORD /d 20 /f'
    },
    {
      id: 'qol_keyboard',
      message: "Optimizar respuesta del teclado",
      apply: 'reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardDelay /t REG_SZ /d 0 /f & reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardSpeed /t REG_SZ /d 31 /f',
      revert: 'reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardDelay /t REG_SZ /d 1 /f & reg add "HKCU\\Control Panel\\Keyboard" /v KeyboardSpeed /t REG_SZ /d 31 /f'
    },
    {
      id: 'qol_fse',
      message: "Desactivar Optimizaciones de Pantalla Completa (Global)",
      apply: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f',
      revert: 'reg delete "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /f >nul 2>&1'
    },
    {
      id: 'qol_widgets_chat',
      message: "Desactivar Widgets y Chat (W11)",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarDa /t REG_DWORD /d 0 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarMn /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarDa /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarMn /t REG_DWORD /d 1 /f'
    }
  ],
  
  // --- Categoría Privacidad (Añadida - Riesgo Bajo) ---
  privacidad: [
    {
      id: 'privacy_cdp',
      message: "Desactivar Experiencias Compartidas (CDP)",
      apply: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'privacy_settingsync',
      message: "Desactivar Sincronizacion de Ajustes",
      apply: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\SettingSync" /v "DisableSettingSync" /t Reg_DWORD /d "2" /f',
      revert: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\SettingSync" /v "DisableSettingSync" /t Reg_DWORD /d 0 /f'
    },
    {
      id: 'privacy_contentdelivery',
      message: "Evitar Reinstalacion de Apps (ContentDelivery)",
      apply: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'privacy_consumerfeatures',
      message: "Desactivar Sugerencias de Apps (ConsumerFeatures)",
      apply: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableWindowsConsumerFeatures" /t "REG_DWORD" /d "1" /f',
      revert: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableWindowsConsumerFeatures" /t "REG_DWORD" /d "0" /f'
    },
    {
      id: 'privacy_uwp_background',
      message: "Restringir apps UWP en segundo plano",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f',
      revert: 'reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /f >nul 2>&1'
    },
    { // --- NUEVO TWEAK (CUSTOM) ---
      id: 'privacy_nvidia_telemetry',
      message: "Desactivar Telemetria de NVIDIA (Servicios y Tareas)",
      apply: 'sc config NvTelemetryContainer start= disabled & schtasks /Change /TN "\\NVIDIA\\NvDriverUpdateCheckDaily" /Disable & schtasks /Change /TN "\\NVIDIA\\NvProfileUpdaterDaily" /Disable & reg add "HKLM\\SOFTWARE\\NVIDIA Corporation\\Global\\NvTelemetry" /v NvTelemetryEnable /t REG_DWORD /d 0 /f',
      revert: 'sc config NvTelemetryContainer start= auto & schtasks /Change /TN "\\NVIDIA\\NvDriverUpdateCheckDaily" /Enable & schtasks /Change /TN "\\NVIDIA\\NvProfileUpdaterDaily" /Enable & reg delete "HKLM\\SOFTWARE\\NVIDIA Corporation\\Global\\NvTelemetry" /v NvTelemetryEnable /f >nul 2>&1'
    }
  ],

  // --- Categoría Servicios (Riesgo Bajo/Medio) ---
  servicios: [
    {
      id: 'serv_telemetria',
      message: "Desactivar Telemetría (DiagTrack, DPS, WerSvc)",
      apply: 'sc config diagtrack start= disabled & sc config DPS start= disabled & sc config WerSvc start= disabled',
      revert: 'sc config diagtrack start= auto & sc config DPS start= auto & sc config WerSvc start= auto'
    },
    {
      id: 'serv_gamebar',
      message: "Desactivar Game Bar, DVR y Modo Juego Auto",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 1 /f & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /f >nul 2>&1 & reg add "HKLM\\SOFTWARE\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f'
    },
    {
      id: 'serv_mantenimiento',
      message: "Desactivar Mantenimiento Automático y Tareas Idle",
      apply: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d 1 /f & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Idle Maintenance" /Disable & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Maintenance Configurator" /Disable',
      revert: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d 0 /f & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Idle Maintenance" /Enable & schtasks /Change /TN "\\Microsoft\\Windows\\TaskScheduler\\Maintenance Configurator" /Enable'
    },
    {
      id: 'serv_fax_maps_phone',
      message: "Desactivar servicios (Fax, MapsBroker, PhoneSvc)",
      apply: 'sc config Fax start= disabled & sc config MapsBroker start= disabled & sc config PhoneSvc start= disabled',
      revert: 'sc config Fax start= auto & sc config MapsBroker start= auto & sc config PhoneSvc start= auto'
    },
    {
      id: 'serv_store_demo',
      message: "Desactivar servicios (RetailDemo, WalletService)",
      apply: 'sc config RetailDemo start= disabled & sc config WalletService start= disabled',
      revert: 'sc config RetailDemo start= auto & sc config WalletService start= auto'
    },
    {
      id: 'serv_geo_offline',
      message: "Desactivar servicios (Geolocalizacion, Archivos sin conexion)",
      apply: 'sc config lfsvc start= disabled & sc config CscService start= disabled',
      revert: 'sc config lfsvc start= auto & sc config CscService start= auto'
    },
    {
      id: 'serv_diag_ics',
      message: "Desactivar servicios (Diagnosticshub, ICS)",
      apply: 'sc config diagnosticshub.standardcollector.service start= disabled & sc config SharedAccess start= disabled',
      revert: 'sc config diagnosticshub.standardcollector.service start= auto & sc config SharedAccess start= auto'
    },
    {
      id: 'serv_advanced',
      message: "Desactivar servicios (Notas, Radio, Tablet)",
      apply: 'sc config PimIndexMaintenanceSvc start= disabled & sc config RmSvc start= disabled & sc config TabletInputService start= disabled',
      revert: 'sc config PimIndexMaintenanceSvc start= auto & sc config RmSvc start= auto & sc config TabletInputService start= auto'
    },
    {
      id: 'serv_bam',
      message: "Desactivar Servicio BAM (Background Activity Moderator)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam" /v Start /t REG_DWORD /d 4 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam" /v Start /t REG_DWORD /d 3 /f'
    },
    {
      id: 'serv_search',
      message: "[ADVERTENCIA] Desactivar Windows Search (Rompe el buscador)",
      apply: 'sc config WSearch start= disabled',
      revert: 'sc config WSearch start= auto'
    },
    {
      id: 'serv_spooler',
      message: "[ADVERTENCIA] Desactivar Cola de Impresion (Rompe impresoras)",
      apply: 'sc config Spooler start= disabled',
      revert: 'sc config Spooler start= auto'
    },
    {
      id: 'serv_xbox',
      message: "Desactivar Servicios de Xbox",
      apply: 'sc config XblAuthManager start= disabled & sc config XblGameSave start= disabled & sc config XboxGipSvc start= disabled & sc config XboxNetApiSvc start= disabled',
      revert: 'sc config XblAuthManager start= auto & sc config XblGameSave start= auto & sc config XboxGipSvc start= auto & sc config XboxNetApiSvc start= auto'
    }
  ],
  
  // --- Categoría Sistema (Riesgo Bajo/Medio) ---
  sistema: [
    {
      id: 'sys_longpaths',
      message: "Habilitar rutas de archivo largas (LongPaths)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 0 /f'
    },
    {
      id: 'sys_trim',
      message: "Verificar/Activar TRIM para SSD",
      apply: 'fsutil behavior set DisableDeleteNotify 0',
      revert: 'fsutil behavior set DisableDeleteNotify 0'
    },
    { // --- NUEVO TWEAK (CUSTOM) ---
      id: 'sys_ntfs_8dot3',
      message: "Desactivar Nombres 8.3 de NTFS (Mejora E/S)",
      apply: 'fsutil behavior set disable8dot3 1',
      revert: 'fsutil behavior set disable8dot3 0'
    },
    {
      id: 'task_compatibility',
      message: "Desactivar Tarea (Microsoft Compatibility Appraiser)",
      apply: 'schtasks /Change /TN "\\Microsoft\\Windows\\Application Experience\\Microsoft Compatibility Appraiser" /Disable',
      revert: 'schtasks /Change /TN "\\Microsoft\\Windows\\Application Experience\\Microsoft Compatibility Appraiser" /Enable'
    },
    {
      id: 'task_ceip',
      message: "Desactivar Tarea (Consolidator CEIP)",
      apply: 'schtasks /Change /TN "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /Disable',
      revert: 'schtasks /Change /TN "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /Enable'
    },
    {
      id: 'sys_driver_search',
      message: "Evitar busqueda de drivers en Windows Update",
      apply: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DriverSearching" /v "SearchOrderConfig" /t REG_DWORD /d 0 /f',
      revert: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DriverSearching" /v "SearchOrderConfig" /f >nul 2>&1'
    },
    {
      id: 'mem_largesystemcache',
      message: "Desactivar Large System Cache (mas RAM para apps)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d 0 /f'
    },
    {
      id: 'mem_pagingexecutive',
      message: "Desactivar Paging Executive (Kernel en RAM)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 1 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 0 /f'
    },
    {
      id: 'sys_ntfs_memory',
      message: "Optimizar uso de memoria de NTFS",
      apply: 'fsutil behavior set memoryusage 2',
      revert: 'fsutil behavior set memoryusage 1'
    },
    {
      id: 'sys_shadercache',
      message: "Optimizar registro de Caché de Shaders (Direct3D)",
      apply: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCache" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheSize" /t REG_DWORD /d 10240 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheDefrag" /t REG_DWORD /d 1 /f',
      revert: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCache" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheSize" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Microsoft\\Direct3D" /v "ShaderCacheDefrag" /f >nul 2>&1'
    },
    {
      id: 'sys_hyperv',
      message: "[ADVERTENCIA] Desactivar virtualizacion (Hyper-V)",
      apply: 'bcdedit /set hypervisorlaunchtype off',
      revert: 'bcdedit /set hypervisorlaunchtype auto'
    },
    {
      id: 'sys_vulkan_icd',
      message: "Limpiar configuracion de drivers Vulkan (ICD)",
      apply: 'setx VK_ICD_FILENAMES ""',
      revert: 'echo "La reversion es manual (reinstalar drivers de GPU)"'
    },
    {
      id: 'sys_lastaccess',
      message: "Desactivar Last Access Time (Mejora NTFS)",
      apply: 'fsutil behavior set disableLastAccess 1',
      revert: 'fsutil behavior set disableLastAccess 2'
    }
  ],
  
  // --- Categoría Rendimiento/Energía (Riesgo Medio) ---
  rendimiento: [
    {
      id: 'rend_prioridad_gpu',
      message: "Priorizar CPU y GPU para juegos",
      apply: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f & reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 6 /f',
      revert: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /f >nul 2>&1'
    },
    { // --- NUEVO TWEAK (CUSTOM) ---
      id: 'rend_priority_separation',
      message: "Optimizar prioridades de aplicaciones (Foreground Boost)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 26 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 2 /f'
    },
    {
      id: 'rend_hwschmode',
      message: "Activar Programación de GPU acelerada (HwSchMode)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d "2" /f',
      revert: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "HwSchMode" /f >nul 2>&1'
    },
    {
      id: 'rend_power_throttling',
      message: "Desactivar Power Throttling",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f',
      revert: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /f >nul 2>&1'
    },
    {
      id: 'rend_inicio_rapido',
      message: "Desactivar Inicio Rapido",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f'
    },
    {
      id: 'rend_almacenamiento',
      message: "Desactivar ahorro de energía SSD/USB",
      apply: 'fsutil behavior set disableLastAccess 1 & for %%i in (EnableHIPM EnableDIPM) do for /f %%a in (\'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services" /s /f "%%i" ^| findstr "HKEY"\') do reg add "%%a" /v "%%i" /t REG_DWORD /d 0 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB" /v "DisableSelectiveSuspend" /t REG_DWORD /d 1 /f',
      revert: 'fsutil behavior set disableLastAccess 2 & for %%i in (EnableHIPM EnableDIPM) do for /f %%a in (\'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services" /s /f "%%i" ^| findstr "HKEY"\') do reg add "%%a" /v "%%i" /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB" /v "DisableSelectiveSuspend" /t REG_DWORD /d 0 /f'
    },
    { // --- NUEVO TWEAK (CUSTOM) ---
      id: 'rend_vram_compression',
      message: "[ADVERTENCIA] Desactivar Compresión de VRAM (Puede usar MAS VRAM)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v DisableGpuMemoryCompression /t REG_DWORD /d 1 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v DisableGpuMemoryCompression /t REG_DWORD /d 0 /f'
    },
    { // --- NUEVO TWEAK (CUSTOM) ---
      id: 'rend_tdr_delay',
      message: "Aumentar TdrDelay (Estabilidad de GPU)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 10 /f',
      revert: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /f >nul 2>&1'
    }
  ],
  
  // --- Categoría Red (Riesgo Medio/Funcional) ---
  red: [
     {
      id: 'net_dns_cloudflare',
      message: "Cambiar DNS a Cloudflare/Google (Ethernet/Wi-Fi)",
      apply: 'netsh interface ipv4 set dnsserver name="Ethernet" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Ethernet" address=8.8.8.8 index=2 >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Wi-Fi" address=8.8.8.8 index=2 >nul 2>&1',
      revert: 'netsh interface ipv4 set dnsserver name="Ethernet" source=dhcp >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" source=dhcp >nul 2>&1'
    },
    {
      id: 'net_rss',
      message: "Activar RSS (Receive Side Scaling)",
      apply: 'netsh interface tcp set global rss=enabled',
      revert: 'netsh interface tcp set global rss=disabled'
    },
    {
      id: 'net_probing',
      message: "Desactivar sondeo de internet (Internet Probing)",
      apply: 'reg add "HKLM\\System\\ControlSet001\\services\\NlaSvc\\Parameters\\Internet" /v "EnableActiveProbing" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKLM\\System\\ControlSet001\\services\\NlaSvc\\Parameters\\Internet" /v "EnableActiveProbing" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'net_throttle',
      message: "Optimizar red (NetworkThrottling)",
      apply: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f',
      revert: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f'
    },
     {
      id: 'net_tcp_advanced',
      message: "Optimizar TCP (MaxUserPort, TcpTimedWaitDelay)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /t REG_DWORD /d 65534 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d 30 /f',
      revert: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /f >nul 2>&1 & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /f >nul 2>&1'
    },
    {
      id: 'net_ecn',
      message: "Desactivar ECN Capability",
      apply: 'netsh int tcp set global ecncapability=disabled',
      revert: 'netsh int tcp set global ecncapability=enabled'
    },
    {
      id: 'net_autotuning',
      message: "[ADVERTENCIA] Desactivar Autotuning (Baja velocidad de descarga)",
      apply: 'netsh interface tcp set global autotuninglevel=disabled',
      revert: 'netsh interface tcp set global autotuninglevel=normal'
    },
    {
      id: 'net_offloads',
      message: "[ADVERTENCIA] Desactivar Offloads (LSO/RSC)",
      apply: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing disabled -ReceiveSideScaling disabled -Chimney disabled; Disable-NetAdapterLso -Name *; Disable-NetAdapterChecksumOffload -Name *"',
      revert: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing enabled -ReceiveSideScaling enabled -Chimney enabled; Enable-NetAdapterLso -Name *; Enable-NetAdapterChecksumOffload -Name *"'
    },
    {
      id: 'script_net_adapter',
      message: "[ADVERTENCIA] Optimizar Adaptador de Red (Script)",
      apply: '@echo off\nchcp 65001 >nul\nfor /f %%n in (\'Reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"\') do (\n    reg add "%%n" /v "AdvancedEEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*EEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnableGreenEthernet" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnablePME" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*WakeOnMagicPacket" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*WakeOnPattern" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnableWakeOnLan" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*FlowControl" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "RxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "IPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TCPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TCPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "UDPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "UDPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1\n)',
      revert: '@echo off\nchcp 65001 >nul\nfor /f %%n in (\'Reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"\') do (\n    reg delete "%%n" /v "AdvancedEEE" /f >nul 2>&1\n    reg delete "%%n" /v "*EEE" /f >nul 2>&1\n    reg delete "%%n" /v "EEE" /f >nul 2>&1\n    reg delete "%%n" /v "EnableGreenEthernet" /f >nul 2>&1\n    reg delete "%%n" /v "EnablePME" /f >nul 2>&1\n    reg delete "%%n" /v "*WakeOnMagicPacket" /f >nul 2>&1\n    reg delete "%%n" /v "*WakeOnPattern" /f >nul 2>&1\n    reg delete "%%n" /v "EnableWakeOnLan" /f >nul 2>&1\n    reg delete "%%n" /v "*FlowControl" /f >nul 2>&1\n    reg delete "%%n" /v "RxAbsIntDelay" /f >nul 2>&1\n    reg delete "%%n" /v "TxAbsIntDelay" /f >nul 2>&1\n    reg delete "%%n" /v "IPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "TCPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "TCPChecksumOffloadIPv6" /f >nul 2>&1\n    reg delete "%%n" /v "UDPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "UDPChecksumOffloadIPv6" /f >nul 2>&1\n)'
    },
    {
      id: 'net_nagle',
      message: "Desactivar Algoritmo de Nagle (Baja latencia)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 2 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 0 /f & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /f >nul 2>&1'
    },
    {
      id: 'net_ipv6',
      message: "Desactivar IPv6",
      apply: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 255 /f',
      revert: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 0 /f'
    },
     {
      id: 'net_icmp_redirect',
      message: "Desactivar ICMP Redirects",
      apply: 'netsh int ip set global icmpredirects=disabled',
      revert: 'netsh int ip set global icmpredirects=enabled'
    },
    {
      id: 'net_ndu',
      message: "Desactivar NDU (Diagnóstico de Red)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f',
      revert: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 2 /f'
    }
  ],

  // --- Categoría Debloat (Riesgo Alto/Funcional) ---
  debloat: [
    {
      id: 'debloat_store',
      message: "[ADVERTENCIA] Desactivar Microsoft Store (Impide descargar apps)",
      apply: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v "DisableStoreApps" /t REG_DWORD /d 1 /f',
      revert: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v "DisableStoreApps" /t REG_DWORD /d 0 /f'
    },
    {
      id: 'debloat_uwp',
      message: "[RIESGO MÁXIMO] Desinstalar Apps UWP (Cortana, Mapas, Clima...)",
      apply: 'powershell -Command "Get-appxpackage -allusers *Microsoft.549981C3F5F10* | Remove-AppxPackage; Get-AppxPackage Microsoft.Windows.Ai.Copilot.Provider | Remove-AppxPackage; Get-AppxPackage *Microsoft.BingWeather* | Remove-AppxPackage; Get-AppxPackage *Microsoft.GetHelp* | Remove-AppxPackage; Get-AppxPackage *Microsoft.WindowsMaps* | Remove-AppxPackage; Get-AppxPackage *Microsoft.Messaging* | Remove-AppxPackage; Get-AppxPackage *Microsoft.People* | Remove-AppxPackage; Get-AppxPackage *Microsoft.WindowsFeedbackHub* | Remove-AppxPackage; Get-AppxPackage *Microsoft.YourPhone* | Remove-AppxPackage"',
      revert: 'powershell -Command "Get-AppxPackage -allusers | foreach {Add-AppxPackage -register \\"$($_.InstallLocation)\\appxmanifest.xml\\" -DisabledevelopmentMode}"'
    }
  ],
  
  // --- Categoría RIESGO CRÍTICO (Solo Expertos) ---
  criticos: [
    {
      id: 'crit_sysmain',
      message: "[RIESGO CRÍTICO] Desactivar SysMain (Causa lag en portátiles)",
      apply: 'sc config SysMain start= disabled',
      revert: 'sc config SysMain start= auto'
    },
    {
      id: 'crit_compression',
      message: "[RIESGO CRÍTICO] Desactivar Compresión de Memoria (Causa lag)",
      apply: 'powershell -Command "Disable-MMAgent -MemoryCompression; Disable-MMAgent -PageCombining"',
      revert: 'powershell -Command "Enable-MMAgent -MemoryCompression; Enable-MMAgent -PageCombining"'
    },
    { // --- NUEVO TWEAK (CUSTOM) ---
      id: 'crit_mitigations',
      message: "[RIESGO CRÍTICO] Desactivar Mitigaciones (Spectre/Meltdown)",
      apply: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverride /t REG_DWORD /d 3 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverrideMask /t REG_DWORD /d 3 /f',
      revert: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverride /f >nul 2>&1 & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverrideMask /f >nul 2>&1'
    },
    {
      id: 'crit_dynamictick',
      message: "[RIESGO CRÍTICO] Desactivar DynamicTick (Riesgo de Kernel)",
      apply: 'bcdedit /set disabledynamictick yes',
      revert: 'bcdedit /deletevalue disabledynamictick'
    },
    {
      id: 'crit_hpet',
      message: "[RIESGO CRÍTICO] Optimizar HPET/TSC (Riesgo de Kernel)",
      apply: 'bcdedit /deletevalue useplatformclock & bcdedit /set tscsyncpolicy Enhanced',
      revert: 'bcdedit /set useplatformclock true & bcdedit /deletevalue tscsyncpolicy'
    },
    {
      id: 'crit_svchost',
      message: "[RIESGO CRÍTICO] Optimizar SvcHost (Riesgo de RAM)",
      apply: 'for /f "tokens=2 delims==" %%R in (\'wmic ComputerSystem get TotalPhysicalMemory /value\') do set "RAM_BYTES=%%R" & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control" /v SvcHostSplitThresholdInKB /t REG_DWORD /d %RAM_BYTES:~0,-3% /f',
      revert: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control" /v SvcHostSplitThresholdInKB /f'
    }
  ]
};