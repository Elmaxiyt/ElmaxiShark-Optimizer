// scripts/herramienta-energia.js
module.exports = {
  apply: [
    {
      id: 'tool_energy_creating',
      message: "Creando Plan de Energia 'Modo Gaming Extremo'...",
      isScript: true,
      command: `@echo off
chcp 65001 >nul
:: Clonar el plan de "Maximo rendimiento" (o el activo si no esta disponible)
for /f "tokens=2 delims=:" %%A in ('powercfg -duplicatescheme SCHEME_MIN 2^>nul') do set PLAN_GUID=%%A
if not defined PLAN_GUID for /f "tokens=2 delims=:" %%A in ('powercfg -getactivescheme') do set PLAN_GUID=%%A
set PLAN_GUID=%PLAN_GUID:~1,36%
if "%PLAN_GUID%"=="" ( exit /b 1 )
:: Renombrar y activar el plan
powercfg -changename %PLAN_GUID% "Modo Gaming Extremo"
powercfg -setactive %PLAN_GUID%
:: Aplicar ajustes avanzados
powercfg -setacvalueindex %PLAN_GUID% SUB_PROCESSOR PROCTHROTTLEMIN 100 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_PROCESSOR PROCTHROTTLEMIN 100 2>nul
powercfg -setacvalueindex %PLAN_GUID% SUB_PROCESSOR PROCTHROTTLEMAX 100 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_PROCESSOR PROCTHROTTLEMAX 100 2>nul
powercfg -setacvalueindex %PLAN_GUID% SUB_PROCESSOR PERFBOOSTMODE 2 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_PROCESSOR PERFBOOSTMODE 2 2>nul
powercfg -setacvalueindex %PLAN_GUID% SUB_PROCESSOR CPMINCORES 100 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_PROCESSOR CPMINCORES 100 2>nul
powercfg -setacvalueindex %PLAN_GUID% SUB_DISK DISKIDLE 0 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_DISK DISKIDLE 0 2>nul
powercfg -setacvalueindex %PLAN_GUID% SUB_PCIEXPRESS ASPM 0 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_PCIEXPRESS ASPM 0 2>nul
powercfg -setacvalueindex %PLAN_GUID% SUB_USB USBSELECTSUSPEND 0 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_USB USBSELECTSUSPEND 0 2>nul
powercfg -setacvalueindex %PLAN_GUID% SUB_VIDEO VIDEOIDLE 0 2>nul
powercfg -setdcvalueindex %PLAN_GUID% SUB_VIDEO VIDEOIDLE 0 2>nul
powercfg -setactive %PLAN_GUID%
`
    },
    {
      id: 'tool_energy_contextual',
      message: "Anadiendo 'Planes de Energia' al menu contextual...",
      command: 'reg add "HKCU\\Software\\Classes\\DesktopBackground\\Shell\\PowerOptions" /v "Icon" /t REG_SZ /d "powercpl.dll" /f & reg add "HKCU\\Software\\Classes\\DesktopBackground\\Shell\\PowerOptions" /v "MUIVerb" /t REG_SZ /d "Planes de Energia" /f & reg add "HKCU\\Software\\Classes\\DesktopBackground\\Shell\\PowerOptions\\command" /v "" /t REG_SZ /d "control.exe powercfg.cpl" /f'
    }
  ]
};