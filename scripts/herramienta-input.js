// scripts/herramienta-input.js
module.exports = {
  apply: [
    {
      message: "Optimizando cola de datos de Ratón y Teclado (Menos Input Lag)...",
      // Aumenta el buffer para ratones de altos Hz y teclados rápidos
      command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters" /v "MouseDataQueueSize" /t REG_DWORD /d 100 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters" /v "KeyboardDataQueueSize" /t REG_DWORD /d 100 /f'
    },
    {
      message: "Desactivando suavizado y aceleración de ratón (Precisión 1:1)...",
      // Desactiva la curva de aceleración de Windows para puntería pura
      command: 'reg add "HKCU\\Control Panel\\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f & reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f & reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f'
    },
    {
      message: "Mejorando prioridad de respuesta Win32...",
      command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 38 /f'
    }
  ]
};