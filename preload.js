// preload.js (v1.5.4 - FIX: BORDER MAXIMIZED)
const { contextBridge, ipcRenderer } = require('electron');

const apiToExpose = {
  send: (channel, data) => {
    const validSendChannels = [
        'minimize-app', 'maximize-app', 'close-app', 
        'open-external-link', 'run-optimization', 'run-tool', 
        'open-custom-menu', 'download-guide', 'change-language',
        'toggle-network-tool', 'toggle-input-tool'
    ];
    if (validSendChannels.includes(channel)) ipcRenderer.send(channel, data);
  },
  on: (channel, func) => {
    const validReceiveChannels = [
        'log-update', 'set-initial-mode', 'progress-update', 
        'update-message', 'set-app-version', 'set-language',
        'update-sys-info', 'update-junk-status',
        // CANAL AÑADIDO PARA LA CORRECCIÓN DE BORDES:
        'window-state-change'
    ];
    if (validReceiveChannels.includes(channel)) ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  invoke: (channel, data) => {
    const validInvokeChannels = ['request-language', 'request-pro-status'];
    if (validInvokeChannels.includes(channel)) return ipcRenderer.invoke(channel, data);
  }
};
contextBridge.exposeInMainWorld('electronAPI', apiToExpose);