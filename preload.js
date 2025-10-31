// preload.js (v1.5 - Con Descarga de Guía)
const { contextBridge, ipcRenderer } = require('electron');

console.log("--- Preload script starting ---");

const apiToExpose = {
  send: (channel, data) => {
    // --- LISTA DE CANALES DE ENVÍO ACTUALIZADA ---
    const validSendChannels = [
        'minimize-app', 
        'close-app', 
        'open-external-link', 
        'run-optimization', // (Para Básico, Equilibrado, Extremo, Dios)
        'run-tool', 
        'open-custom-menu',  // (Para Overdrive/Custom)
        'restart-app-to-update', // (Para el actualizador)
        'download-guide', // <-- AÑADIDO
        'check-for-updates-manual' // <-- AÑADIDO
    ];
    
    if (validSendChannels.includes(channel)) {
      console.log(`[Preload] Sending on channel: ${channel}`);
      ipcRenderer.send(channel, data);
    } else {
      console.warn(`[Preload] Invalid send channel attempted: ${channel}`);
    }
  },
  on: (channel, func) => {
    // --- LISTA DE CANALES DE RECEPCIÓN ACTUALIZADA ---
    const validReceiveChannels = [
        'log-update', 
        'set-initial-mode', 
        'progress-update',
        'update-message', // (Para el actualizador)
        'set-app-version' // (Para mostrar la versión)
    ];
    if (validReceiveChannels.includes(channel)) {
      console.log(`[Preload] Setting listener for channel: ${channel}`);
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    } else {
      console.warn(`[Preload] Invalid receive channel attempted: ${channel}`);
    }
  }
};

console.log("[Preload] API object created");

try {
  contextBridge.exposeInMainWorld('electronAPI', apiToExpose);
  console.log("--- electronAPI exposed successfully ---");
} catch (error) {
  console.error("!!! FAILED TO EXPOSE electronAPI !!!", error);
}