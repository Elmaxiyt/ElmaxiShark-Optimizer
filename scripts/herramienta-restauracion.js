// scripts/herramienta-restauracion.js
module.exports = {
  apply: [
    {
      id: 'tool_restore_creating',
      message: "Creando Punto de Restauracion Manual...",
      command: `powershell.exe -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description 'ElmaxiShark - Punto Manual' -RestorePointType 'MODIFY_SETTINGS'"`
    }
  ]
};