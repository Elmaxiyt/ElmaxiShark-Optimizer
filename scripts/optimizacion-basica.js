// scripts/optimizacion-basica.js (v1.4 - FULL SYNC IDs)
module.exports = {
  apply: [
    { id: 'clean_temp', message: "Limpiando archivos temporales (Usuario)...", command: 'del /f /s /q %TEMP%\\* >nul 2>&1' },
    { id: 'clean_temp_win', message: "Limpiando archivos temporales (Windows)...", command: 'del /f /s /q C:\\Windows\\Temp\\* >nul 2>&1' },
    { id: 'clean_prefetch', message: "Limpiando archivos Prefetch...", command: 'del /f /s /q C:\\Windows\\Prefetch\\* >nul 2>&1' },
    { id: 'clean_d3dcache', message: "Limpiando cache DirectX generica (D3DSCache)...", command: 'rmdir /s /q "%LocalAppData%\\D3DSCache" >nul 2>&1' },
    { id: 'clean_nvidia_dx', message: "Limpiando cache DirectX de NVIDIA...", command: 'del /s /q "%LocalAppData%\\NVIDIA\\DXCache\\*.*" >nul 2>&1' },
    { id: 'clean_nvidia_gl', message: "Limpiando cache OpenGL de NVIDIA...", command: 'del /s /q "%LocalAppData%\\NVIDIA\\GLCache\\*.*" >nul 2>&1' },
    { id: 'clean_vulkan', message: "Limpiando cache Vulkan...", command: 'del /s /q "%AppData%\\Vulkan\\Cache\\*.*" >nul 2>&1' },
    { id: 'clean_wu', message: "Limpiando cache de Windows Update...", command: 'del /f /s /q %windir%\\SoftwareDistribution\\Download\\* >nul 2>&1' },
    { id: 'clean_iconcache', message: "Limpiando cache de Iconos...", command: 'del /f /s /q %LOCALAPPDATA%\\Microsoft\\Windows\\Explorer\\iconcache_* >nul 2>&1' },
    { id: 'clean_steam', message: "Limpiando cache de Steam...", command: 'rmdir /s /q "%LOCALAPPDATA%\\Steam\\htmlcache" >nul 2>&1 & rmdir /s /q "%LOCALAPPDATA%\\Steam\\appcache" >nul 2>&1' },
    { id: 'clean_epic', message: "Limpiando cache de Epic Games Launcher...", command: 'rmdir /s /q "%LOCALAPPDATA%\\EpicGamesLauncher\\Saved\\webcache" >nul 2>&1' },
    { id: 'ui_visualfx', message: "Ajustando efectos visuales para Mejor Rendimiento...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f' },
    { id: 'ui_transparencia', message: "Desactivando efectos de transparencia...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f' },
    { message: "Manteniendo suavizado de fuentes...", command: 'reg add "HKCU\\Control Panel\\Desktop" /v FontSmoothing /t REG_SZ /d 2 /f' },
    { id: 'qol_wallpaper', message: "Mejorando calidad de compresion de Wallpaper...", command: 'reg add "HKCU\\Control Panel\\Desktop" /v "JPEGImportQuality" /t REG_DWORD /d "100" /f' },
    { id: 'net_dns_cloudflare', message: "Cambiando DNS (Ethernet y Wi-Fi) a Cloudflare/Google...", command: 'netsh interface ipv4 set dnsserver name="Ethernet" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Ethernet" address=8.8.8.8 index=2 >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Wi-Fi" address=8.8.8.8 index=2 >nul 2>&1' },
    { id: 'net_flushdns', message: "Limpiando cache de DNS...", command: 'ipconfig /flushdns' },
    { id: 'net_rss', message: "Activando RSS...", command: 'netsh interface tcp set global rss=enabled' },
    { id: 'sys_trim', message: "Verificando TRIM para SSD...", command: 'fsutil behavior set DisableDeleteNotify 0' },
    { id: 'qol_show_extensions', message: "Mostrando extensiones de archivos conocidos...", command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "HideFileExt" /t REG_DWORD /d 0 /f' },
    { id: 'ui_menus_animaciones', message: "Acelerando menus y desactivando animaciones...", command: 'reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 10 /f & reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 0 /f' },
    { id: 'sys_longpaths', message: "Habilitando rutas de archivo largas (LongPaths)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f' },
    { id: 'sys_ntfs_8dot3', message: "Desactivando Nombres 8.3 de NTFS (Mejora rendimiento de disco)...", command: 'fsutil behavior set disable8dot3 1' }
  ],
  revert: [
    { id: 'net_dns_cloudflare', message: "Restaurando DNS (Ethernet y Wi-Fi) a Automatico (DHCP)...", command: 'netsh interface ipv4 set dnsserver name="Ethernet" source=dhcp >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" source=dhcp >nul 2>&1' },
    { id: 'ui_visualfx', message: "Restaurando efectos visuales (Recomendado)...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 0 /f' },
    { id: 'ui_transparencia', message: "Reactivando efectos de transparencia...", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 1 /f' },
    { id: 'qol_wallpaper', message: "Restaurando calidad de Wallpaper...", command: 'reg delete "HKCU\\Control Panel\\Desktop" /v "JPEGImportQuality" /f >nul 2>&1' },
    { id: 'qol_show_extensions', message: "Ocultando extensiones de archivos...", command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "HideFileExt" /t REG_DWORD /d 1 /f' },
    { id: 'ui_menus_animaciones', message: "Restaurando velocidad de menus...", command: 'reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f' },
    { message: "Reactivando animaciones...", command: 'reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 1 /f' },
    { id: 'sys_longpaths', message: "Deshabilitando rutas de archivo largas (LongPaths)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 0 /f' },
    { id: 'sys_ntfs_8dot3', message: "Reactivando Nombres 8.3 de NTFS...", command: 'fsutil behavior set disable8dot3 0' }
  ]
};