const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    // --- AÑADIDO 'run-tool' ---
    const validSendChannels = ['minimize-app', 'close-app', 'open-external-link', 'run-optimization', 'run-tool'];
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    const validReceiveChannels = ['log-update'];
    if (validReceiveChannels.includes(channel)) {
      // Recibe del proceso principal y ejecuta el callback en el renderer
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});