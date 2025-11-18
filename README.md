# ElmaxiShark Optimizer v1.4.0

Creado por Elmaxi ([@Elmaxizone en YouTube](https://www.youtube.com/@Elmaxizone))

> **⚠️ ADVERTENCIA IMPORTANTE ⚠️**
>
> Esta es una herramienta potente. Aunque ha sido probada, podrían existir comportamientos inesperados dependiendo de tu hardware y software.
>
> **SE RECOMIENDA ENCARECIDAMENTE USAR EL BOTÓN "BACKUP REGISTRO" Y LUEGO "PUNTO RESTAURACION"** ANTES de aplicar cualquier modo de optimización.
>
> El uso de esta herramienta es bajo tu propia responsabilidad. El autor no se hace responsable de posibles daños o pérdidas de datos.

---

## 🚀 Novedades de la v1.4.0 (COMPETITIVE UPDATE)

¡La actualización definitiva para Gamers y Power Users! Hemos escuchado a la comunidad y traemos herramientas totalmente nuevas.

* **🟣 Nuevo: Herramienta "Debloat Avanzado":** Una ventana dedicada para eliminar Bloatware, Inteligencia Artificial (Copilot/Recall) y Publicidad de Windows. ¡Incluye un **Botón de Rescate** para reinstalar apps borradas por error!
* **🔵 Nuevo: Herramienta "Shell Tools":** Añade o quita accesos directos útiles (Limpieza, Energía, etc.) directamente en el menú contextual (clic derecho) de tu escritorio.
* **🔴 Red Avanzada 2.0 (Safe Competitive):** Hemos reescrito el motor de optimización de red. Ahora es **100% seguro para juegos competitivos** (Valorant, CS2, CoD, Battlefield), eliminando problemas de desconexión y mejorando el registro de impactos (Hitreg).
* **⚡ Nuevos Tweaks "Pro":**
    * **QoS Unlock:** Libera el 20% de ancho de banda que Windows se guarda para sí mismo.
    * **MMCSS Always On:** Mantiene la prioridad de juegos siempre activa para evitar micro-tirones.
    * **Sticky Keys:** Opción para desactivar el molesto aviso al pulsar Shift 5 veces.
* **📚 Documentación Técnica:** Al descargar la guía, ahora recibes también un **"Diccionario de Tweaks"** que te explica qué hace cada opción y sus riesgos.
* **🎨 Nueva Interfaz Visual:** Organización de botones por colores lógicos (Seguridad, Energía, Limpieza, Herramientas) para un uso más intuitivo.

---

## ⚠️ Guía Rápida: ¿Qué modo debo usar?

Para saber qué modo es el mejor para tu sistema (Portátil, PC Gaming, etc.), por favor haz clic en el botón **"Descargar Guía"** que se encuentra en la aplicación.

Esto guardará dos archivos en tu carpeta de Descargas:
1. `GUIA_RECOMENDACIONES.txt` (Instrucciones básicas).
2. `DICCIONARIO_TWEAKS.txt` (Explicación técnica de cada ajuste).

### Antes de Empezar (¡OBLIGATORIO!)

1.  **Paso 1: Primer Salvavidas (Backup de Registro):** Haz clic en el botón **"Backup Registro"** (color gris/azul).
    > **⚠️ NOTA IMPORTANTE:** Este es un backup manual. Si tienes que usarlo, haz doble clic en los archivos `.reg` **en Modo Seguro de Windows** para garantizar la reversión sin conflictos.
2.  **Paso 2: Segundo Salvavidas (Punto de Restauración):** Haz clic en el botón **"Punto Restauracion"** (color verde).
    > **👍 Recomendación:** El Punto de Restauración es la forma más fácil y segura de deshacer cambios grandes.
3.  **Paso 3:** Después de aplicar cualquier modo, **REINICIA EL EQUIPO**.

---

## 🔧 Cómo Usar (Instalación)

1.  Descarga el `ElmaxiShark Optimizer.exe` desde la sección de **[Releases](https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases)** de este repositorio.
2.  Ejecuta el archivo `.exe`. La aplicación te pedirá permisos de Administrador (UAC).
3.  **(Recomendado)** Usa las herramientas de backup primero.
4.  Elige un modo de optimización siguiendo la guía.
5.  Para revertir los cambios de un modo, simplemente **vuelve a hacer clic en el botón que esté activo**.

---

## 📂 Detalle de los Modos y Herramientas

### Herramientas Individuales

* **Backup Registro:** Guarda claves críticas del registro en `Documentos\ElmaxiShark_Backups`.
* **Punto Restauracion:** Crea un punto de restauración del sistema de Windows.
* **Crear Plan Energia:** Crea y activa el plan 'Modo Gaming Extremo'.
* **Limpieza Sistema:** Ejecuta tareas de limpieza profundas (Temp, Prefetch, Cachés, DNS).
* **Shell Tools:** (Nuevo) Gestiona accesos directos en tu escritorio.
* **Debloat Avanzado:** (Nuevo) Panel de control total para eliminar basura de Windows, IA y Telemetría.
* **Red Avanzada:** Aplica optimizaciones de latencia (Nagle, QoS, Throttling) y script de adaptador de red.

### Modos de Optimización (1-Clic)

#### Modo Básico
* **Limpieza:** Caches, Temporales y Windows Update.
* **Visuales:** Ajusta para rendimiento básico sin afear el sistema.
* **Red/Sistema:** DNS rápidos, TRIM para SSD y soporte para rutas largas.

#### Modo Equilibrado
*(Aplica Básico + lo siguiente)*
* **Servicios:** Desactiva Telemetría básica, Game Bar, DVR y servicios innecesarios (Fax, Mapas).
* **Privacidad:** Bloquea sugerencias y sincronización innecesaria.
* **Sistema:** Optimiza memoria NTFS y prioridades de CPU (Foreground Boost).

#### Modo Extremo
*(Aplica Equilibrado + lo siguiente)*
* **Rendimiento:** Prioriza CPU/GPU para juegos, activa HwSchMode (GPU Scheduling).
* **Red:** Optimiza Network Throttling y TCP avanzado.
* **Energía:** Desactiva Power Throttling e Inicio Rápido para mayor estabilidad.

#### Modo Gamer (Gold Tier)
*(Aplica Extremo + lo siguiente)*
> **NOTA:** Este modo es 100% seguro y está diseñado para el máximo FPS estable.
* **Red Competitiva:** Desactiva Algoritmo de Nagle, QoS (Reserva de ancho de banda) y NDU.
* **Estabilidad:** Fuerza MMCSS (Multimedia Class Scheduler) siempre activo.
* **Seguridad:** NO toca la virtualización (Hyper-V) para garantizar compatibilidad con todo.

### Modo Personalizado (Custom)
* **Propósito:** Para usuarios expertos que quieren control total.
* **Qué hace:** Abre un menú con casillas individuales.
* **Exclusivos de Custom:** Aquí encontrarás los tweaks que hemos retirado de los modos automáticos por seguridad o preferencia personal:
    * Desactivar Hyper-V (Virtualización).
    * Desactivar Mitigaciones de CPU (Spectre/Meltdown).
    * Desactivar Windows Search o Cola de Impresión.
    * Tweaks de Kernel (HPET, etc.).

---

## ©️ Licencia y Créditos

ElmaxiShark Optimizer es una herramienta gratuita (freeware). Creada y propiedad de Elmaxi.

* Puedes usar esta aplicación libremente para fines personales y no comerciales.
* Puedes distribuir la aplicación (en su forma original, sin modificar) siempre y cuando des crédito claro y visible al creador (Elmaxi) e incluyas este archivo `README.md` sin modificar.
* **ESTÁ PROHIBIDO vender esta aplicación o cualquier parte de ella.**
* Está prohibido modificar, descompilar o realizar ingeniería inversa a la aplicación con fines de lucro o para crear obras derivadas sin el permiso expreso del autor.

El incumplimiento de estos términos puede llevar a acciones legales.

Gracias por usar ElmaxiShark Optimizer.