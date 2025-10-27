// scripts/herramienta-limpieza-sistema.js
module.exports = {
  apply: [
    { message: "Limpiando archivos temporales (Usuario)...", command: 'del /f /s /q %TEMP%\\* >nul 2>&1' },
    { message: "Limpiando archivos temporales (Windows)...", command: 'del /f /s /q C:\\Windows\\Temp\\* >nul 2>&1' },
    { message: "Limpiando archivos Prefetch...", command: 'del /f /s /q C:\\Windows\\Prefetch\\* >nul 2>&1' },
    { message: "Limpiando cache DirectX generica (D3DSCache)...", command: 'rmdir /s /q "%LocalAppData%\\D3DSCache" >nul 2>&1' },
    { message: "Limpiando cache DirectX de NVIDIA...", command: 'del /s /q "%LocalAppData%\\NVIDIA\\DXCache\\*.*" >nul 2>&1' },
    { message: "Limpiando cache OpenGL de NVIDIA...", command: 'del /s /q "%LocalAppData%\\NVIDIA\\GLCache\\*.*" >nul 2>&1' },
    // { message: "Limpiando cache DirectX de AMD...", command: 'del /s /q "%LocalAppData%\\AMD\\DxCache\\*.*" >nul 2>&1' }, // Descomentar si se confirman rutas AMD
    // { message: "Limpiando cache OpenGL/Vulkan de AMD...", command: 'del /s /q "%LocalAppData%\\AMD\\GLCache\\*.*" >nul 2>&1' }, // Descomentar si se confirman rutas AMD
    { message: "Limpiando cache Vulkan...", command: 'del /s /q "%AppData%\\Vulkan\\Cache\\*.*" >nul 2>&1' },
    { message: "Limpiando cache de Windows Update...", command: 'del /f /s /q %windir%\\SoftwareDistribution\\Download\\* >nul 2>&1' },
    { message: "Limpiando cache de Iconos...", command: 'del /f /s /q %LOCALAPPDATA%\\Microsoft\\Windows\\Explorer\\iconcache_* >nul 2>&1' },
    { message: "Limpiando cache de Steam...", command: 'rmdir /s /q "%LOCALAPPDATA%\\Steam\\htmlcache" >nul 2>&1 & rmdir /s /q "%LOCALAPPDATA%\\Steam\\appcache" >nul 2>&1' },
    { message: "Limpiando cache de Epic Games Launcher...", command: 'rmdir /s /q "%LOCALAPPDATA%\\EpicGamesLauncher\\Saved\\webcache" >nul 2>&1' },
    { message: "Limpiando cache de DNS...", command: 'ipconfig /flushdns' }
  ]
};