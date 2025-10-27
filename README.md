# ElmaxiShark Optimizer v1.1

Creado por Elmaxi ([@Elmaxizone en YouTube](https://www.youtube.com/@Elmaxizone)) | [Mi Sitio Web](https://AQUI_VA_LA_URL_DE_TU_WEB.com)

> **⚠️ ADVERTENCIA IMPORTANTE (BETA) ⚠️**
>
> Esta es una versión BETA de ElmaxiShark Optimizer. Aunque ha sido probada, podrían existir errores o comportamientos inesperados.
>
> **SE RECOMIENDA ENCARECIDAMENTE CREAR UN PUNTO DE RESTAURACIÓN MANUAL** usando el botón "Punto Restauracion" ANTES de aplicar cualquier modo de optimización.
>
> El uso de esta herramienta es bajo tu propia responsabilidad. El autor no se hace responsable de posibles daños o pérdidas de datos.

---

## Cómo Usar

1.  Descarga el `ElmaxiShark Optimizer.exe` desde la sección de **[Releases](https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases)** de este repositorio.
2.  Ejecuta el archivo `.exe`. La aplicación te pedirá permisos de Administrador (UAC).
3.  **(Recomendado)** Haz clic en **"Punto Restauracion"** primero.
4.  **(Opcional)** Haz clic en **"Crear Plan Energia"** o **"Limpieza Sistema"** para acciones individuales.
5.  Elige un modo de optimización haciendo clic en uno de los botones de colores:
    * **Básico:** Optimizaciones seguras de limpieza y QOL (Calidad de Vida).
    * **Equilibrado:** Un buen balance que desactiva telemetría y servicios innecesarios.
    * **Extremo:** Ajustes más agresivos para gaming (prioridad de GPU, red).
    * **Overdrive:** Ajustes sensibles de bajo nivel (kernel, temporizadores). **Puede causar inestabilidad en algunos portátiles.**
    * **Modo Dios:** Debloat máximo. Desactiva funciones del sistema (Buscador, Impresión, etc.). **Máximo Riesgo.**
6.  Para revertir los cambios de un modo, simplemente **vuelve a hacer clic en el botón que esté activo**.
7.  Puedes cambiar entre modos. Al hacerlo, se revertirán los cambios del modo anterior y se aplicarán los del nuevo modo seleccionado.

---

## Detalle de los Modos y Herramientas

### Herramientas Individuales

* **Punto Restauracion:**
    * **Propósito:** Crea un punto de restauración del sistema llamado **'ElmaxiShark - Punto Manual'**.
* **Crear Plan Energia:**
    * **Propósito:** Crea un plan de energía optimizado llamado 'Modo Gaming Extremo', lo activa y añade un acceso directo a "Planes de Energia" en el menú contextual.
* **Limpieza Sistema:**
    * **Propósito:** Ejecuta *solamente* las tareas de limpieza profundas (Temp, Prefetch, Cachés de Shaders de NVIDIA/AMD/Vulkan, Cachés de Steam/Epic, etc.) sin aplicar otros tweaks.

---

### Modo Básico
*(Aplica todos estos comandos)*

* **Limpieza:** Caches de Temp, Prefetch, **Cachés de GPU (NVIDIA/Vulkan/D3D)**, Windows Update, Iconos, Steam y Epic Games.
* **QOL:** Ajusta visuales a "Mejor Rendimiento" y desactiva transparencia. **Acelera menús/animaciones y mantiene suavizado de fuentes (Preserva la configuración de Modo Oscuro/Claro del usuario).**
* **Red/Sistema:** Establece DNS a Cloudflare/Google, limpia caché DNS, activa RSS, verifica TRIM (SSD), **Habilita Rutas de Archivo Largas (LongPaths)**.

---

### Modo Equilibrado
*(Aplica todo lo de Básico **MÁS** lo siguiente)*

* **Servicios:** Desactiva Telemetría (DiagTrack, DPS, WerSvc), Game Bar, DVR, Modo Juego Auto y servicios innecesarios (Fax, Mapas, Geo-localización, etc.).
* **Debloat Ligero:** Desactiva Sugerencias (ConsumerFeatures), Servicio BAM, Tareas Idle, Experiencias Compartidas (CDP) y Sincronización de Ajustes.
* **Sistema:** Desactiva Mantenimiento Automático, Evita drivers de Windows Update, **Optimiza registro de Caché de Shaders**.
* **Memoria:** Desactiva Large System Cache, Mantiene Kernel en RAM (`DisablePagingExecutive`), Optimiza uso de memoria de NTFS.
* **QOL/Interfaz:** **Activa el Menú Contextual Completo (W10/W7 style)**, desactiva aceleración de ratón y optimiza respuesta de teclado.

---

### Modo Extremo
*(Aplica todo lo de Equilibrado **MÁS** lo siguiente)*

* **Sistema:** Prioriza CPU/GPU para juegos (SystemResponsiveness = 0), **Activa Programación de GPU (HwSchMode)**.
* **Red:** Optimiza Network Throttling (`NetworkThrottlingIndex`), Desactiva Autotuning, Optimiza TCP (MaxUserPort, etc.), Desactiva ECN Capability.
* **Red (Script):** Optimiza propiedades de adaptador de red (desactiva EEE, Flow Control, WakeOnLan).
* **Energía/Almacenamiento:** Desactiva Power Throttling, Desactiva Inicio Rápido, Desactiva Last Access Time (NTFS), Desactiva ahorro de energía SSD/USB.

---

### Modo Overdrive
*(Aplica todo lo de Extremo **MÁS** lo siguiente)*

> **ADVERTENCIA: MODO AVANZADO.** Contiene tweaks sensibles de bajo nivel (kernel, temporizadores) que pueden causar inestabilidad o lentitud en algunos portátiles. Aplicar con precaución.

* **Servicios/Memoria:** Desactiva **SysMain (Superfetch)**, Desactiva **Compresión de Memoria** (para 16GB+ RAM), **Inyecta Tweak SvcHost** (optimiza `svchost.exe` según RAM).
* **Kernel/Temporizadores:** Desactiva **Dynamic Tick** (`bcdedit`), Optimiza **HPET/TSC** (`bcdedit`), Desactiva Timer Coalescing (Experimental).
* **Red Sensible:** Desactiva **Offloads** (LSO, RSC) vía PowerShell (puede afectar velocidad de descarga en algunos sistemas).

---

### Modo Dios
*(Aplica todo lo de Overdrive **MÁS** lo siguiente)*

> **ADVERTENCIA MÁXIMA: DEBLOAT AGRESIVO.** Desactiva funciones clave del sistema para liberar la máxima cantidad de recursos. Usar con precaución y solo si sabes lo que haces.

* **Red Agresiva:** Desactiva Algoritmo de Nagle (para latencia mínima), Desactiva IPv6, Desactiva NDU (Diagnóstico de Red).
* **Sistema:** Desactiva Hyper-V.
* **Debloat (Riesgo):** Desactiva **Windows Search** (Rompe el buscador del Menú Inicio), **Cola de Impresión** (Desactiva impresoras), Servicios de Xbox, Microsoft Store.
* **Debloat (Irreversible):** Desinstala Cortana, Copilot y Apps UWP (Clima, Mapas, Correo, etc. **No elimina el Reproductor de Video**).
* **(NOTA: Se han eliminado los tweaks de Mitigación de CPU/Seguridad para prevenir BSODs y garantizar estabilidad.)**

---

## Licencia y Créditos

ElmaxiShark Optimizer v1.1 es una herramienta gratuita (freeware).
Creada y propiedad de Elmaxi.

* Puedes usar esta aplicación libremente para fines personales y no comerciales.
* Puedes distribuir la aplicación (en su forma original, sin modificar) siempre y cuando des crédito claro y visible al creador (Elmaxi) e incluyas este archivo `README.md` sin modificar.
* **ESTÁ PROHIBIDO vender esta aplicación o cualquier parte de ella.**
* Está prohibido modificar, descompilar o realizar ingeniería inversa a la aplicación con fines de lucro o para crear obras derivadas sin el permiso expreso del autor.

El incumplimiento de estos términos puede llevar a acciones legales.

Gracias por usar ElmaxiShark Optimizer.