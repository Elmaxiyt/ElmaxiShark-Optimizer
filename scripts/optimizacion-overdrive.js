// scripts/optimizacion-overdrive.js (v1.2 - NEUTRALIZADO)
// Este script se mantiene por compatibilidad, pero ahora hereda de Extremo.
// Los tweaks peligrosos (BCDEDIT, SysMain, etc.) se han movido a 'custom-tweaks.js'

const optimizacionExtremo = require('./optimizacion-extremo.js');

const applyOverdrive = [
  // (Este array ahora está vacío)
];

const revertOverdrive = [
  // (Este array ahora está vacío)
];

module.exports = {
  apply: [...optimizacionExtremo.apply, ...applyOverdrive],
  revert: [...revertOverdrive, ...optimizacionExtremo.revert]
};