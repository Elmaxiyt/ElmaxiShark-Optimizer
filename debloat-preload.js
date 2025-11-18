// debloat-preload.js (v1.0 - Preload para Debloat Avanzado)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronDebloat', {
  // Funciones de datos para cargar el contenido
  getCategories: () => ipcRenderer.invoke('debloat:get-categories'),
  getTweaksForCategory: (category) => ipcRenderer.invoke('debloat:get-tweaks-for-category', category),
  loadTweakState: () => ipcRenderer.invoke('load-debloat-tweaks'),
  
  // Función para pedir el idioma desde esta ventana
  getLanguage: () => ipcRenderer.invoke('request-language'),

  // Funciones de acción
  // run-debloat-tweaks es el NUEVO canal de ejecución
  applyTweaks: (tweakIds) => ipcRenderer.send('run-debloat-tweaks', { action: 'apply', ids: tweakIds }),
  revertTweaks: (tweakIds) => ipcRenderer.send('run-debloat-tweaks', { action: 'revert', ids: tweakIds }),
  saveTweakState: (tweakIds) => ipcRenderer.send('save-debloat-tweaks', tweakIds),
  closeWindow: () => ipcRenderer.send('close-debloat-window'), // NUEVO canal de cierre

  // Listeners (para cambios de idioma en tiempo real)
  on: (channel, func) => {
    if (channel === 'set-language') {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});