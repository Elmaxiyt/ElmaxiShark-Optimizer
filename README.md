# ElmaxiShark Optimizer v1.3.0

Creado por Elmaxi ([@Elmaxizone en YouTube](https://www.youtube.com/@Elmaxizone))

> **⚠️ ADVERTENCIA IMPORTANTE ⚠️**
>
> Esta es una herramienta potente. Aunque ha sido probada, podrían existir comportamientos inesperados dependiendo de tu hardware y software.
>
> **SE RECOMIENDA ENCARECIDAMENTE USAR EL BOTÓN "BACKUP REGISTRO" Y LUEGO "PUNTO RESTAURACION"** ANTES de aplicar cualquier modo de optimización.
>
> El uso de esta herramienta es bajo tu propia responsabilidad. El autor no se hace responsable de posibles daños o pérdidas de datos.

---

## 🚀 Novedades de la v1.3.0 GOLD

¡La actualización más grande hasta la fecha! Nos hemos centrado en la seguridad, la usabilidad internacional y un diseño más profesional.

* **🌍 Soporte Multi-idioma:** Ahora ElmaxiShark Optimizer está disponible completamente en Español e Inglés. Cambia el idioma al instante con el nuevo botón global (🌐).
* **🛡️ "Modo Dios" ahora es "Modo Gamer":** Hemos renombrado este modo y lo hemos hecho **100% seguro**. Ya no desactiva la virtualización (Hyper-V), por lo que puedes usarlo sin miedo a romper Docker o máquinas virtuales.
* **💾 Nueva Herramienta "Backup Registro":** Botón salvavidas (color cian) que guarda una copia de tus configuraciones clave en Documentos antes de que toques nada.
* **🌐 Nueva Herramienta "Red Avanzada":** Para aplicar solo las optimizaciones de red más agresivas sin tocar el resto del sistema.
* **✨ Interfaz Profesional:** Botones perfectamente alineados con colores temáticos que relacionan cada herramienta con su modo correspondiente.
* **🔧 Mejoras Técnicas:** Solucionado el bug del menú "Custom" y ahora todos los logs se traducen correctamente.

---

## ⚠️ Guía Rápida: ¿Qué modo debo usar?

Para saber qué modo es el mejor para tu sistema (Portátil, PC Gaming, etc.), por favor haz clic en el botón **"Descargar Guía"** que se encuentra en la aplicación.

Esto guardará un archivo `GUIA_RECOMENDACIONES.txt` en tu carpeta de Descargas con todas las instrucciones y recomendaciones.

### Antes de Empezar (¡OBLIGATORIO!)

1.  **Paso 1: Primer Salvavidas (Backup de Registro):** Haz clic en **"Backup Registro"** (guardará tu config actual en Documentos).
    > **⚠️ NOTA IMPORTANTE:** Este es un backup manual, y es el **último recurso** antes del Punto de Restauración. Si tienes que usarlo, haz doble clic en los archivos `.reg` **en Modo Seguro de Windows** para garantizar la reversión sin conflictos.
2.  **Paso 2: Segundo Salvavidas (Punto de Restauración):** Haz clic en **"Punto Restauracion"**.
    > **👍 Recomendación:** El Punto de Restauración es la forma más fácil y segura de deshacer cambios grandes.
3.  **Paso 3:** Después de aplicar cualquier modo, **REINICIA EL EQUIPO**.

---

## 🔧 Cómo Usar (Instalación)

1.  Descarga el `ElmaxiShark Optimizer.exe` desde la sección de **[Releases](https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases)** de este repositorio.
2.  Ejecuta el archivo `.exe`. La aplicación te pedirá permisos de Administrador (UAC).
3.  **(Recomendado)** Usa las herramientas de backup primero.
4.  Elige un modo de optimización siguiendo la guía de recomendaciones.
5.  Para revertir los cambios de un modo, simplemente **vuelve a hacer clic en el botón que esté activo**.

---

## 📂 Detalle de los Modos y Herramientas

### Herramientas Individuales

* **Backup Registro:** Guarda claves críticas del registro (Usuario, Sistema, Gaming) en `Documentos\Elmaxi_Backups`.
* **Punto Restauracion:** Crea un punto de restauración del sistema de Windows.
* **Crear Plan Energia:** Crea y activa el plan de energía 'Modo Gaming Extremo'.
* **Limpieza Sistema:** Ejecuta tareas de limpieza profundas (Temp, Prefetch, Cachés de Shaders, etc.).
* **Red Avanzada:** Aplica únicamente las optimizaciones de TCP, Nagle, y adaptador de red.

### Modo Básico
*(Aplica todos estos comandos)*

* **Limpieza:** Caches de Temp, Prefetch, Cachés de GPU (NVIDIA/Vulkan/D3D), Windows Update, Iconos, Steam y Epic Games.
* **QOL:** Ajusta visuales a "Mejor Rendimiento", desactiva transparencia, acelera menús/animaciones y mantiene suavizado de fuentes.
* **Red/Sistema:** Establece DNS a Cloudflare/Google, limpia caché DNS, activa RSS, verifica TRIM (SSD), Habilita Rutas de Archivo Largas (LongPaths).
* **Optimización NTFS:** Desactiva la creación de nombres de archivo 8.3 (mejora la E/S del disco).

### Modo Equilibrado
*(Aplica todo lo de Básico **MÁS** lo siguiente)*

* **Servicios:** Desactiva Telemetría (DiagTrack, DPS, WerSvc), Game Bar, DVR, Modo Juego Auto y servicios innecesarios (Fax, Mapas, Geo-localización, etc.).
* **Debloat Ligero:** Desactiva Sugerencias (ConsumerFeatures), Servicio BAM, Tareas Idle, Experiencias Compartidas (CDP) y Sincronización de Ajustes.
* **Sistema:** Desactiva Mantenimiento Automático, Evita drivers de Windows Update.
* **Memoria:** Desactiva Large System Cache, Mantiene Kernel en RAM (DisablePagingExecutive), Optimiza uso de memoria de NTFS.
* **QOL/Interfaz:** Activa el Menú Contextual Completo (W10/W7 style), desactiva aceleración de ratón y optimiza respuesta de teclado.
* **Optimización de Tareas:** Mejora la respuesta de la aplicación activa (Foreground Boost).
* **Optimización de Shaders:** Optimiza el registro del Caché de Shaders de Direct3D.

### Modo Extremo
*(Aplica todo lo de Equilibrado **MÁS** lo siguiente)*

* **Sistema:** Prioriza CPU/GPU para juegos (SystemResponsiveness = 0), Activa Programación de GPU (HwSchMode).
* **Red:** Optimiza Network Throttling, Desactiva Autotuning, Optimiza TCP (MaxUserPort, etc.), Desactiva ECN Capability.
* **Red (Script):** Optimiza propiedades de adaptador de red (desactiva EEE, Flow Control, WakeOnLan).
* **Energía/Almacenamiento:** Desactiva Power Throttling, Desactiva Inicio Rápido, Desactiva Last Access Time (NTFS), Desactiva ahorro de energía SSD/USB.
* **Estabilidad de GPU:** Aumenta el TdrDelay a 10 segundos para prevenir cuelgues del controlador gráfico.

### Modo Gamer (Máximo Rendimiento Seguro)
*(Antiguo "Modo Dios". Aplica todo lo de Extremo **MÁS** lo siguiente)*

> **NOTA:** Este modo ahora es 100% seguro para uso diario.

* **Red Agresiva:** Desactiva Algoritmo de Nagle y optimiza TCP (para latencia mínima), Desactiva IPv6, Desactiva NDU (Diagnóstico de Red).
* **Servicios:** Desactiva servicios avanzados (Notas, Tablet).
* **Seguridad:** Ya NO desactiva Hyper-V (virtualización), por lo que no rompe WSL2 ni emuladores.

### Modo Personalizado (Custom)

* **Propósito:** Para usuarios expertos que quieren control total.
* **Qué hace:** Abre un menú que te permite seleccionar tweaks individuales que son demasiado agresivos o específicos para los modos de 1-clic.
* **Incluye (y más):**
    * **[NUEVO]** Desactivar Hyper-V (Virtualización).
    * Desactivar Servicios (Xbox, Impresoras, Búsqueda, etc.).
    * Desactivar Microsoft Store y Desinstalar Apps UWP (Debloat).
    * Desactivar Mitigaciones de CPU (Spectre/Meltdown).
    * Tweaks de Kernel (DynamicTick, HPET, etc.).

---

## ©️ Licencia y Créditos

ElmaxiShark Optimizer es una herramienta gratuita (freeware). Creada y propiedad de Elmaxi.

* Puedes usar esta aplicación libremente para fines personales y no comerciales.
* Puedes distribuir la aplicación (en su forma original, sin modificar) siempre y cuando des crédito claro y visible al creador (Elmaxi) e incluyas este archivo `README.md` sin modificar.
* **ESTÁ PROHIBIDO vender esta aplicación o cualquier parte de ella.**
* Está prohibido modificar, descompilar o realizar ingeniería inversa a la aplicación con fines de lucro o para crear obras derivadas sin el permiso expreso del autor.

El incumplimiento de estos términos puede llevar a acciones legales.

Gracias por usar ElmaxiShark Optimizer.