// custom-preload.js (v1.8 - FIX: Soporte de idioma añadido)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronCustom', {
  // Funciones de datos
  getCategories: () => ipcRenderer.invoke('custom:get-categories'),
  getTweaksForCategory: (category) => ipcRenderer.invoke('custom:get-tweaks-for-category', category),
  getTweaksForActiveMode: () => ipcRenderer.invoke('custom:get-tweaks-for-active-mode'),
  loadTweakState: () => ipcRenderer.invoke('load-custom-tweaks'),
  
  // --- NUEVO: Función para pedir el idioma desde esta ventana ---
  getLanguage: () => ipcRenderer.invoke('request-language'),

  // Funciones de acción
  applyTweaks: (tweakIds) => ipcRenderer.send('run-custom-tweaks', { action: 'apply', ids: tweakIds }),
  revertTweaks: (tweakIds) => ipcRenderer.send('run-custom-tweaks', { action: 'revert', ids: tweakIds }),
  saveTweakState: (tweakIds) => ipcRenderer.send('save-custom-tweaks', tweakIds),
  closeWindow: () => ipcRenderer.send('close-custom-window'),

  // Listeners (para cambios de idioma en tiempo real)
  on: (channel, func) => {
    if (channel === 'set-language') {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});