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
    { id: 'net_flushdns', message: "Limpiando cache de DNS...", command: 'ipconfig /flushdns' }
  ]
};