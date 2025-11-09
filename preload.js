// preload.js (v1.7 - COMPLETO)
const { contextBridge, ipcRenderer } = require('electron');

const apiToExpose = {
  send: (channel, data) => {
    const validSendChannels = [
        'minimize-app', 'close-app', 'open-external-link', 'run-optimization', 
        'run-tool', 'open-custom-menu', 'restart-app-to-update', 
        'download-guide', 'check-for-updates-manual', 'change-language',
        'toggle-network-tool'
    ];
    if (validSendChannels.includes(channel)) ipcRenderer.send(channel, data);
    else console.warn(`[Preload] Blocked send: ${channel}`);
  },
  on: (channel, func) => {
    const validReceiveChannels = ['log-update', 'set-initial-mode', 'progress-update', 'update-message', 'set-app-version', 'set-language'];
    if (validReceiveChannels.includes(channel)) ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  invoke: (channel, data) => {
    const validInvokeChannels = ['request-language'];
    if (validInvokeChannels.includes(channel)) return ipcRenderer.invoke(channel, data);
  }
};

contextBridge.exposeInMainWorld('electronAPI', apiToExpose);