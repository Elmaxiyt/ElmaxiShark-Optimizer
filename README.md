# ElmaxiShark Optimizer v1.0

Creado por Elmaxi ([@Elmaxizone en YouTube](https://www.youtube.com/@Elmaxizone)) | [Mi Sitio Web](https://AQUI_VA_LA_URL_DE_TU_WEB.com)

> **⚠️ ADVERTENCIA IMPORTANTE (BETA) ⚠️**
>
> Esta es una versión BETA de ElmaxiShark Optimizer. Aunque ha sido probada, podrían existir errores o comportamientos inesperados.
>
> **SE RECOMIENDA ENCARECIDAMENTE CREAR UN PUNTO DE RESTAURACIÓN MANUAL** usando el botón "Punto Restauración" ANTES de aplicar cualquier modo de optimización, especialmente Extremo o Modo Dios.
>
> El uso de esta herramienta es bajo tu propia responsabilidad. El autor no se hace responsable de posibles daños o pérdidas de datos.

---

## Cómo Usar

1.  Descarga el `ElmaxiShark Optimizer.exe` desde la sección de **[Releases](https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases)** de este repositorio. (¡Recuerda cambiar este enlace si renombras el repo!).
2.  Ejecuta el archivo `.exe`. La aplicación te pedirá permisos de Administrador (UAC) para poder aplicar los tweaks.
3.  (Opcional pero recomendado) Haz clic en **"Punto Restauracion"**.
4.  (Opcional) Haz clic en **"Crear Plan Energia"** para generar el plan optimizado.
5.  Elige un modo de optimización haciendo clic en uno de los botones de colores:
    * **Básico:** Optimizaciones seguras y básicas.
    * **Equilibrado:** Un buen balance entre rendimiento y estabilidad.
    * **Extremo:** Ajustes más agresivos. Prueba la estabilidad de tu sistema.
    * **Modo Dios:** Máximo rendimiento. Desactiva funciones del sistema y mitigaciones de seguridad.
6.  Para revertir los cambios de un modo, simplemente **vuelve a hacer clic en el botón que esté activo**.
7.  Puedes cambiar entre modos. Al hacerlo, se revertirán los cambios del modo anterior y se aplicarán los del nuevo modo seleccionado.

---

## Detalle de los Modos y Herramientas

### Herramientas Individuales

* **Punto Restauracion:**
    * **Propósito:** Crea un punto de restauración del sistema llamado 'ElmaxiShark - Punto Manual'.
    * **Comando:** `powershell.exe -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description 'ElmaxiShark - Punto Manual' -RestorePointType 'MODIFY_SETTINGS'"`

* **Crear Plan Energia:**
    * **Propósito:** Crea un plan de energía optimizado llamado 'Modo Gaming Extremo', lo activa y añade un acceso directo a "Planes de Energia" en el menú contextual.
    * **Comando (Script de Plan):**
        ```batch
        @echo off
        chcp 65001 >nul
        :: Clona el plan de "Alto Rendimiento" (e9a42b02-d5df-448d-aa00-03f14749eb61)
        for /f "tokens=2 delims=:" %%A in ('powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 2^>nul') do set PLAN_GUID=%%A
        :: Si falla, usa el plan activo como base
        if not defined PLAN_GUID for /f "tokens=2 delims=:" %%A in ('powercfg -getactivescheme') do set PLAN_GUID=%%A
        set PLAN_GUID=%PLAN_GUID:~1,36%
        if "%PLAN_GUID%"=="" ( exit /b 1 )
        :: Renombrar y activar el plan
        powercfg -changename %PLAN_GUID% "Modo Gaming Extremo"
        powercfg -setactive %PLAN_GUID%
        :: Aplicar ajustes avanzados (Min/Max CPU, Core Parking, USB Suspend, etc.)
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
        ```
    * **Comando (Menú Contextual):**
        ```batch
        reg add "HKCU\Software\Classes\DesktopBackground\Shell\PowerOptions" /v "Icon" /t REG_SZ /d "powercpl.dll" /f
        reg add "HKCU\Software\Classes\DesktopBackground\Shell\PowerOptions" /v "MUIVerb" /t REG_SZ /d "Planes de Energia" /f
        reg add "HKCU\Software\Classes\DesktopBackground\Shell\PowerOptions\command" /v "" /t REG_SZ /d "control.exe powercfg.cpl" /f
        ```

---

### Modo Básico
*(Aplica todos estos comandos)*

* **Limpieza:** Caches de Temp, Prefetch, Shaders, Windows Update, Iconos, Steam y Epic Games.
* **Red:** Establece DNS a Cloudflare (1.1.1.1) y Google (8.8.8.8).
* **Red:** Limpia cache DNS (`ipconfig /flushdns`).
* **Red:** Activa RSS (`netsh interface tcp set global rss=enabled`).
* **Sistema:** Habilita TRIM para SSD (`fsutil behavior set DisableDeleteNotify 0`).
* **QOL:** Ajusta visuales a "Mejor Rendimiento".
* **QOL:** Desactiva transparencia y activa Modo Oscuro.
* **QOL:** Mejora calidad de JPG en wallpaper (`JPEGImportQuality = 100`).
* **QOL:** Muestra extensiones de archivos (`HideFileExt = 0`).
* **QOL:** Acelera menús y desactiva animaciones de ventanas.

---

### Modo Equilibrado
*(Aplica todo lo de Básico **MÁS** lo siguiente)*

* **Servicios:** Desactiva Telemetría (DiagTrack, DPS, WerSvc).
* **Servicios:** Desactiva SysMain (Superfetch).
* **Servicios:** Desactiva Game Bar, DVR, Modo Juego Auto, Mapas, Fax, Geo-localización, etc.
* **Sistema:** Inyecta SvcHost Tweak (dinámico según RAM total).
* **Sistema:** Desactiva Mantenimiento Automático.
* **Sistema:** Evita que Windows Update reemplace drivers de GPU.
* **Memoria:** Desactiva Large System Cache (`LargeSystemCache = 0`).
* **Memoria:** Mantiene el Kernel en RAM (`DisablePagingExecutive = 1`).
* **Memoria:** Optimiza uso de memoria de NTFS (`fsutil behavior set memoryusage 2`).
* **QOL (W11):** Activa Menú Contextual Clásico.
* **QOL:** Desactiva aceleración de ratón y optimiza respuesta de teclado.
* **QOL:** Desactiva Optimizaciones de Pantalla Completa (Global).
* **QOL:** Restringe Apps UWP en segundo plano.
* **QOL:** Desactiva sondeo de internet (NlaSvc).
* **Debloat:** Desactiva Experiencias Compartidas (CDP).
* **Debloat:** Desactiva Sincronización de Ajustes (SettingSync).
* **Debloat:** Evita reinstalación de apps (ContentDelivery).

---

### Modo Extremo
*(Aplica todo lo de Equilibrado **MÁS** lo siguiente)*

* **Sistema:** Prioriza CPU/GPU para juegos (SystemResponsiveness = 0).
* **Sistema:** Desactiva Dynamic Tick (`bcdedit /set disabledynamictick yes`).
* **Red:** Optimiza Network Throttling (`NetworkThrottlingIndex = 0xffffffff`).
* **Red:** Desactiva Autotuning (`netsh interface tcp set global autotuninglevel=disabled`).
* **Red:** Optimiza TCP (MaxUserPort = 65534, TcpTimedWaitDelay = 30).
* **Red:** Desactiva ECN Capability (`netsh int tcp set global ecncapability=disabled`).
* **Red:** Desactiva Offloads (LSO, RSC, Chimney) vía PowerShell.
* **Red (Script):** Optimiza propiedades de adaptador de red (desactiva EEE, Flow Control, WakeOnLan).
* **Energía:** Desactiva Power Throttling.
* **Energía:** Desactiva Inicio Rápido.
* **Memoria (16GB+):** Desactiva Compresión de Memoria y Page Combining.
* **Almacenamiento:** Desactiva Last Access Time (`disableLastAccess = 1`).
* **Almacenamiento:** Desactiva ahorro de energía de SSD (HIPM/DIPM).
* **USB:** Desactiva Suspensión Selectiva de USB.

---

### Modo Dios
*(Aplica todo lo de Extremo **MÁS** lo siguiente)*

> **ADVERTENCIA:** Este modo es muy agresivo. Desactiva funciones básicas del sistema como el Buscador de Windows, la impresión y servicios de Xbox. También desactiva mitigaciones de seguridad de la CPU. Puede causar inestabilidad o problemas de compatibilidad. **USAR CON PRECAUCIÓN.**

* **Red:** Desactiva Algoritmo de Nagle (TcpAckFrequency = 1, TCPNoDelay = 1).
* **Red:** Desactiva IPv6.
* **Red:** Desactiva ICMP Redirects.
* **Red:** Desactiva NDU (Servicio de Diagnóstico de Red).
* **Sistema:** Optimiza HPET/TSC (`bcdedit /deletevalue useplatformclock`).
* **Sistema:** Desactiva Hyper-V (`bcdedit /set hypervisorlaunchtype off`).
* **Servicios:** Desactiva servicios avanzados (Notas, Radio, Tablet).
* **Debloat (Agresivo):** Desactiva Windows Search (sc config WSearch start= disabled).
* **Debloat (Agresivo):** Desactiva Cola de Impresión (sc config Spooler start= disabled).
* **Debloat (Agresivo):** Desactiva servicios de Xbox.
* **Debloat (Agresivo):** Desactiva Widgets y Chat de Teams (W11).
* **Debloat (Agresivo):** Desactiva Microsoft Store.
* **Debloat (Agresivo):** Desinstala Cortana y Copilot.
* **Debloat (Agresivo):** Desinstala Apps UWP (Clima, Mapas, Correo, People, etc.).
* **Seguridad (RIESGO):** Desactiva mitigaciones de CPU (Spectre/Meltdown).
* **Seguridad (RIESGO):** Desactiva mitigaciones de sistema (VBS, CFG, ASLR).

---

## Licencia y Créditos

ElmaxiShark Optimizer v1.0 es una herramienta gratuita (freeware).
Creada y propiedad de Elmaxi.

* Puedes usar esta aplicación libremente para fines personales y no comerciales.
* Puedes distribuir la aplicación (en su forma original, sin modificar) siempre y cuando des crédito claro y visible al creador (Elmaxi) e incluyas este archivo `README.md` sin modificar.
* **ESTÁ PROHIBIDO vender esta aplicación o cualquier parte de ella.**
* Está prohibido modificar, descompilar o realizar ingeniería inversa a la aplicación con fines de lucro o para crear obras derivadas sin el permiso expreso del autor.

El incumplimiento de estos términos puede llevar a acciones legales.

Gracias por usar ElmaxiShark Optimizer.