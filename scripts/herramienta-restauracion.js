// scripts/herramienta-restauracion.js
module.exports = {
  apply: [
    {
      message: "Creando Punto de Restauracion Manual ('EMX - Manual')...",
      command: `powershell.exe -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description 'EMX - Punto Manual'"`
    }
  ]
};