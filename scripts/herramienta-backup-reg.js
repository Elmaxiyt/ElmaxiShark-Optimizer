// scripts/herramienta-backup-reg.js (v9 - Carpeta con nombre de la APP)
module.exports = {
  apply: [
    {
      id: 'backup_mkdir',
      message: "Creando carpeta de respaldos en Documentos...",
      // CAMBIO: Elmaxi_Backups -> ElmaxiShark_Backups
      command: 'mkdir "%USERPROFILE%\\Documents\\ElmaxiShark_Backups" >nul 2>&1'
    },
    {
      id: 'backup_hkcu',
      message: "Guardando registro de Usuario (1/3)...",
      command: 'reg export HKCU "%USERPROFILE%\\Documents\\ElmaxiShark_Backups\\1_BACKUP_USUARIO.reg" /y'
    },
    {
      id: 'backup_system',
      message: "Guardando registro del Sistema (2/3)...",
      command: 'reg export "HKLM\\SYSTEM\\CurrentControlSet" "%USERPROFILE%\\Documents\\ElmaxiShark_Backups\\2_BACKUP_SISTEMA.reg" /y'
    },
     {
      id: 'backup_gaming',
      message: "Guardando ajustes de optimización (3/3)...",
      command: 'reg export "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" "%USERPROFILE%\\Documents\\ElmaxiShark_Backups\\3_BACKUP_OPTIMIZACIONES.reg" /y'
    },
    {
      id: 'backup_open_folder',
      message: "Abriendo carpeta. Para restaurar, ejecuta el 1, 2 y 3.",
      // CAMBIO: Abre la nueva carpeta
      command: 'start "" "%USERPROFILE%\\Documents\\ElmaxiShark_Backups"'
    }
  ]
};