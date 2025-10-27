// scripts/optimizacion-overdrive.js (v1.1)
const optimizacionExtremo = require('./optimizacion-extremo.js');

const applyOverdrive = [
  // --- TWEAKS SENSIBLES DE MEMORIA Y SERVICIOS ---
  {
    message: "Desactivando SysMain (Superfetch)...", // Movido de Equilibrado
    command: 'sc config SysMain start= disabled'
  },
  {
    message: "Desactivando Compresion de Memoria y Page Combining (para 16GB+ RAM)...", // Movido de Extremo
    command: 'powershell -Command "Disable-MMAgent -MemoryCompression; Disable-MMAgent -PageCombining"'
  },
  // --- TWEAKS SENSIBLES DE TEMPORIZACIÓN (KERNEL/BCD) ---
  {
    message: "Optimizando temporizadores del sistema (DynamicTick)...", // Movido de Extremo
    command: 'bcdedit /set disabledynamictick yes'
  },
  {
    message: "Optimizando temporizadores avanzados (HPET/TSC)...", // Movido de Modo Dios
    command: 'bcdedit /deletevalue useplatformclock & bcdedit /set tscsyncpolicy Enhanced'
  },
  {
    message: "Desactivando Timer Coalescing (Experimental)...", // Nuevo
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Kernel" /v "CoalescingTimerDisabled" /t REG_DWORD /d 1 /f'
  },
  // --- TWEAKS SENSIBLES DE RED ---
  {
    message: "Desactivando Offloads (LSO, RSC) (Puede mejorar latencia)...", // Movido de Extremo
    command: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing disabled -ReceiveSideScaling disabled -Chimney disabled; Disable-NetAdapterLso -Name *; Disable-NetAdapterChecksumOffload -Name *"'
  }
  // Nota: El tweak de SvcHost se inyecta desde main.js
];

const revertOverdrive = [
  // --- REVERT MEMORIA Y SERVICIOS ---
  {
    message: "Reactivando SysMain (Superfetch)...",
    command: 'sc config SysMain start= auto'
  },
  {
    message: "Reactivando Compresion de Memoria y Page Combining...",
    command: 'powershell -Command "Enable-MMAgent -MemoryCompression; Enable-MMAgent -PageCombining"'
  },
  // --- REVERT TEMPORIZACIÓN (KERNEL/BCD) ---
  {
    message: "Reactivando Dynamic Tick...",
    command: 'bcdedit /deletevalue disabledynamictick'
  },
  {
    message: "Restaurando temporizadores del sistema (HPET/TSC)...",
    command: 'bcdedit /set useplatformclock true & bcdedit /deletevalue tscsyncpolicy'
  },
  {
    message: "Reactivando Timer Coalescing...",
    command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Kernel" /v "CoalescingTimerDisabled" /f >nul 2>&1'
  },
  // --- REVERT RED ---
  {
    message: "Reactivando Offloads (LSO, RSC)...",
    command: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing enabled -ReceiveSideScaling enabled -Chimney enabled; Enable-NetAdapterLso -Name *; Enable-NetAdapterChecksumOffload -Name *"'
  }
];

module.exports = {
  apply: [...optimizacionExtremo.apply, ...applyOverdrive],
  revert: [...revertOverdrive, ...optimizacionExtremo.revert]
};