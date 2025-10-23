// scripts/optimizacion-basica.js
module.exports = {
  apply: [
    {
      message: "Limpiando archivos temporales (Usuario)...",
      command: 'del /f /s /q %TEMP%\\* >nul 2>&1'
    },
    {
      message: "Limpiando archivos temporales (Windows)...",
      command: 'del /f /s /q C:\\Windows\\Temp\\* >nul 2>&1'
    },
    {
      message: "Limpiando archivos Prefetch...",
      command: 'del /f /s /q C:\\Windows\\Prefetch\\* >nul 2>&1'
    },
    {
      message: "Limpiando cache de Shaders...",
      command: 'rmdir /s /q %LOCALAPPDATA%\\D3DSCache >nul 2>&1'
    },
    {
      message: "Limpiando cache de Windows Update...",
      command: 'del /f /s /q %windir%\\SoftwareDistribution\\Download\\* >nul 2>&1'
    },
    {
      message: "Limpiando cache de Iconos...",
      command: 'del /f /s /q %LOCALAPPDATA%\\Microsoft\\Windows\\Explorer\\iconcache_* >nul 2>&1'
    },
    {
      message: "Limpiando cache de Steam...",
      command: 'rmdir /s /q "%LOCALAPPDATA%\\Steam\\htmlcache" >nul 2>&1 & rmdir /s /q "%LOCALAPPDATA%\\Steam\\appcache" >nul 2>&1'
    },
    {
      message: "Limpiando cache de Epic Games Launcher...",
      command: 'rmdir /s /q "%LOCALAPPDATA%\\EpicGamesLauncher\\Saved\\webcache" >nul 2>&1'
    },
    {
      message: "Ajustando efectos visuales para Mejor Rendimiento...",
      command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f'
    },
    {
      message: "Desactivando efectos de transparencia...",
      command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f'
    },
    {
      message: "Activando Modo Oscuro (Apps)...",
      command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 0 /f'
    },
    {
      message: "Manteniendo suavizado de fuentes...",
      command: 'reg add "HKCU\\Control Panel\\Desktop" /v FontSmoothing /t REG_SZ /d 2 /f'
    },
    {
      message: "Mejorando calidad de compresion de Wallpaper...",
      command: 'reg add "HKCU\\Control Panel\\Desktop" /v "JPEGImportQuality" /t REG_DWORD /d "100" /f'
    },
    {
      // --- COMANDO DNS CORREGIDO (PARA ETHERNET Y WI-FI) ---
      message: "Cambiando DNS (Ethernet y Wi-Fi) a Cloudflare/Google...",
      command: 'netsh interface ipv4 set dnsserver name="Ethernet" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Ethernet" address=8.8.8.8 index=2 >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Wi-Fi" address=8.8.8.8 index=2 >nul 2>&1'
    },
    {
      message: "Limpiando cache de DNS...",
      command: 'ipconfig /flushdns'
    },
    {
      message: "Activando RSS...",
      command: 'netsh interface tcp set global rss=enabled'
    },
    {
      message: "Verificando TRIM para SSD...",
      command: 'fsutil behavior set DisableDeleteNotify 0'
    },
    {
      message: "Mostrando extensiones de archivos conocidos...",
      command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "HideFileExt" /t REG_DWORD /d 0 /f'
    },
    {
      message: "Acelerando menus...",
      command: 'reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 10 /f'
    },
    {
      message: "Desactivando animaciones...",
      command: 'reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 0 /f'
    }
  ],
  revert: [
    {
      message: "Restaurando plan a Equilibrado...",
      command: 'powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e'
    },
    {
      // --- COMANDO DNS-REVERT CORREGIDO (PARA ETHERNET Y WI-FI) ---
      message: "Restaurando DNS (Ethernet y Wi-Fi) a Automatico (DHCP)...",
      command: 'netsh interface ipv4 set dnsserver name="Ethernet" source=dhcp >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" source=dhcp >nul 2>&1'
    },
    {
      message: "Restaurando efectos visuales (Recomendado)...",
      command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 0 /f'
    },
    {
      message: "Reactivando efectos de transparencia...",
      command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 1 /f'
    },
    {
      message: "Restaurando Modo Claro (Apps)...",
      command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 1 /f'
    },
    {
      message: "Restaurando calidad de Wallpaper...",
      command: 'reg delete "HKCU\\Control Panel\\Desktop" /v "JPEGImportQuality" /f >nul 2>&1'
    },
    {
      message: "Ocultando extensiones de archivos...",
      command: 'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "HideFileExt" /t REG_DWORD /d 1 /f'
    },
    {
      message: "Restaurando velocidad de menus...",
      command: 'reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f'
    },
    {
      message: "Reactivando animaciones...",
      command: 'reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_SZ /d 1 /f'
    }
  ]
};