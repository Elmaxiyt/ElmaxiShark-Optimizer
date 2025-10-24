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

1.  Descarga el `ElmaxiShark Optimizer.exe` desde la sección de **[Releases](https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases)** de este repositorio.
2.  Ejecuta el archivo `.exe`. La aplicación te pedirá permisos de Administrador (UAC) para poder aplicar los tweaks.
3.  (Opcional pero recomendado) Haz clic en **"Punto Restauracion"**.
4.  (Opcional) Haz clic en **"Crear Plan Energia"** para generar el plan optimizado.
5.  Elige un modo de optimización haciendo clic en uno de los botones de colores:
    * **Básico:** Optimizaciones seguras y básicas.
    * **Equilibrado:** Un buen balance entre rendimiento y estabilidad.
    * **Extremo:** Ajustes más agresivos. Prueba la estabilidad de tu sistema.
    * **Modo Dios:** Máximo rendimiento. Desactiva funciones del sistema y mitigaciones de seguridad.
6.  Para revertir los cambios de un modo, simplemente **vuelve a hacer clic en el botón que esté activo**.
7.  Puedes cambiar entre modos. Al hacerlo, se revertirán los cambios del modo anterior y se aplicarán los del nuevo modo seleccionado.

---

## Detalle de los Modos y Herramientas

### Herramientas Individuales

* **Punto Restauracion:**
    * **Propósito:** Crea un punto de restauración del sistema llamado 'ElmaxiShark - Punto Manual'.
    * **Comando:** `powershell.exe -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description 'ElmaxiShark - Punto Manual' -RestorePointType 'MODIFY_SETTINGS'"`

* **Crear Plan Energia:**
    * **Propósito:** Crea un plan de energía optimizado llamado 'Modo Gaming Extremo', lo activa y añade un acceso directo a "Planes de Energia" en el menú contextual.

---

### Modo Básico
*(Aplica todos estos comandos)*

* **Limpieza:** Caches de Temp, Prefetch, Shaders, Windows Update, Iconos, Steam y Epic Games.
* **QOL:** Ajusta visuales a "Mejor Rendimiento" y desactiva transparencia. **Acelera menús/animaciones y mantiene suavizado de fuentes (Preserva la configuración de Modo Oscuro/Claro del usuario).**
* **Red/Sistema:** Establece DNS a Cloudflare (1.1.1.1) y Google (8.8.8.8), limpia caché DNS, activa RSS, verifica TRIM (SSD).

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
* **QOL/Interfaz:** **Activa el Menú Contextual Completo (W10/W7 style)**.
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

* **Red:** Desactiva Algoritmo de Nagle (TcpAckFrequency = 1, TcpNoDelay = 1).
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