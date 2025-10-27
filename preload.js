// preload.js (Con todos los canales necesarios)
const { contextBridge, ipcRenderer } = require('electron');

console.log("--- Preload script starting ---");

const apiToExpose = {
  send: (channel, data) => {
    const validSendChannels = ['minimize-app', 'close-app', 'open-external-link', 'run-optimization', 'run-tool'];
    if (validSendChannels.includes(channel)) {
      console.log(`[Preload] Sending on channel: ${channel}`);
      ipcRenderer.send(channel, data);
    } else {
      console.warn(`[Preload] Invalid send channel attempted: ${channel}`);
    }
  },
  on: (channel, func) => {
    const validReceiveChannels = ['log-update', 'set-initial-mode', 'progress-update']; // <-- AÑADIDO 'progress-update'
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