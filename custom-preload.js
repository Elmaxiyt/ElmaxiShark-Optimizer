// custom-preload.js (v1.8 - Carga por Categoría)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronCustom', {
  
  // --- INICIO: NUEVAS FUNCIONES DE CARGA ---
  getCategories: () => ipcRenderer.invoke('custom:get-categories'),
  getTweaksForCategory: (category) => ipcRenderer.invoke('custom:get-tweaks-for-category', category),
  // --- FIN: NUEVAS FUNCIONES DE CARGA ---
  
  // Renderer -> Main
  // CAMBIO: apply/revert ya no envían el objeto tweaks
  applyTweaks: (tweakIds) => ipcRenderer.send('run-custom-tweaks', { action: 'apply', ids: tweakIds }),
  revertTweaks: (tweakIds) => ipcRenderer.send('run-custom-tweaks', { action: 'revert', ids: tweakIds }),
  
  saveTweakState: (tweakIds) => ipcRenderer.send('save-custom-tweaks', tweakIds),
  
  closeWindow: () => ipcRenderer.send('close-custom-window'),
  
  loadTweakState: () => ipcRenderer.invoke('load-custom-tweaks')
});