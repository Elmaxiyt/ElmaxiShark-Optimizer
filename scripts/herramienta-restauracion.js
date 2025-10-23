// scripts/herramienta-restauracion.js
module.exports = {
  apply: [
    {
      message: "Creando Punto de Restauracion Manual ('ElmaxiShark - Punto Manual')...",
      command: `powershell.exe -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description 'ElmaxiShark - Punto Manual' -RestorePointType 'MODIFY_SETTINGS'"`
    }
  ]
};