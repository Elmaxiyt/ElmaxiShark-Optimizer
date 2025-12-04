# ElmaxiShark Optimizer v1.5.0

Creado por Elmaxi ([@Elmaxizone en YouTube](https://www.youtube.com/@Elmaxizone))

> **⚠️ ADVERTENCIA IMPORTANTE ⚠️**
>
> Esta es una herramienta potente. Aunque ha sido probada, podrían existir comportamientos inesperados dependiendo de tu hardware y software.
>
> **SE RECOMIENDA ENCARECIDAMENTE USAR EL BOTÓN "BACKUP REGISTRO" Y LUEGO "PUNTO RESTAURACION"** ANTES de aplicar cualquier modo de optimización.
>
> El uso de esta herramienta es bajo tu propia responsabilidad. El autor no se hace responsable de posibles daños o pérdidas de datos.

---

## 🚀 Novedades de la v1.5.0 (THE GOLD UPDATE)

¡La versión más pulida, segura y completa hasta la fecha! Hemos reescrito la lógica interna para darte el control total.

### 🛠️ Nuevas Herramientas y Lógica
* **🔴 Red Avanzada (Centralizada):** ¡Cambio importante! Los modos de 1-clic (Básico, Gamer, etc.) ya **NO** tocan tu configuración de internet. Ahora toda la optimización de ping, DNS, Nagle, QoS y Adaptador vive exclusivamente en este botón para evitar conflictos.
* **🖱️ Nueva Herramienta "Reducir Input Lag":** Un módulo dedicado para optimizar la cola de datos del ratón y teclado, y desactivar la aceleración de Windows para una precisión 1:1 (Raw Input).
* **🟣 Debloat Avanzado 3.0:**
    * **Botón de Rescate:** ¿Borraste algo por error? Ahora puedes reinstalar todas las apps por defecto con un clic.
    * **Anti-IA:** Nuevos scripts para eliminar **Copilot** y la función **Recall** (grabación de pantalla) de Windows 11.
* **⚡ Shell Tools (Fix):** Corregido el error en rutas con espacios. Ahora puedes añadir el menú de limpieza al clic derecho sin problemas.

### 🎨 Mejoras Visuales y de Uso
* **🌍 Multi-Idioma Completo:** La aplicación ahora está traducida al 100% (Interfaz, Tooltips y Guías) en **Español, Inglés, Portugués, Francés y Alemán**.
* **✨ Fix de Pantalla Completa:** Solucionado el corte de los bordes de neón al maximizar la ventana.
* **💡 Sistema de Prioridad de Color:** El anillo central ahora reacciona de forma inteligente. El modo "Custom" tiene prioridad visual (Morado) sobre las herramientas individuales.
* **📝 Tooltips Recuperados:** Vuelven las descripciones flotantes con bordes de colores según la categoría (Verde, Naranja, Rojo, Morado).

---

## ⚠️ Guía Rápida: ¿Qué modo debo usar?

Para saber qué modo es el mejor para tu sistema, haz clic en el botón **"Descargar Guía"** dentro de la aplicación. Esto bajará dos archivos actualizados a tu carpeta de Descargas:
1. `GUIA_RECOMENDACIONES.txt` (Instrucciones básicas según tu perfil de usuario).
2. `DICCIONARIO_TWEAKS.txt` (Explicación técnica de cada ajuste).

### Antes de Empezar (¡OBLIGATORIO!)

1.  **Paso 1: Primer Salvavidas (Backup de Registro):** Haz clic en el botón **"Backup Registro"** (color gris/azul). Guarda tu configuración actual en `Documentos\ElmaxiShark_Backups`.
2.  **Paso 2: Segundo Salvavidas (Punto de Restauración):** Haz clic en el botón **"Punto Restauracion"** (color verde). Es la forma más segura de deshacer cambios.
3.  **Paso 3:** Después de aplicar cualquier modo, **REINICIA EL EQUIPO**.

---

## 🔧 Cómo Usar (Instalación)

1.  Descarga el `ElmaxiShark Optimizer.exe` desde la sección de **[Releases](https://github.com/Elmaxiyt/ElmaxiShark-Optimizer/releases)**.
2.  Ejecuta el archivo `.exe`. La aplicación te pedirá permisos de Administrador.
3.  **(Recomendado)** Usa las herramientas de backup primero.
4.  Elige un modo de optimización o usa las herramientas individuales.
5.  Para revertir los cambios de un modo, simplemente **vuelve a hacer clic en el botón que esté activo** (se apagará la luz del botón).

---

## 📂 Detalle de los Modos (1-Clic)

> **NOTA:** Ninguno de estos modos toca la configuración de red. Usa el botón "Red Avanzada" por separado si lo deseas.

#### Modo Básico
* **Limpieza:** Caches, Temporales, DirectX y Windows Update.
* **Visuales:** Ajusta efectos para rendimiento básico sin afear el sistema.
* **Sistema:** TRIM para SSD y soporte para rutas largas.

#### Modo Equilibrado
*(Aplica Básico + lo siguiente)*
* **Servicios:** Desactiva Telemetría, Game Bar, DVR y servicios innecesarios (Fax, Mapas).
* **Privacidad:** Bloquea sugerencias, historial de actividad y sincronización.
* **Sistema:** Optimiza memoria NTFS y prioridades de CPU (Foreground Boost).

#### Modo Extremo
*(Aplica Equilibrado + lo siguiente)*
* **Rendimiento:** Prioriza CPU/GPU para juegos, activa HwSchMode (GPU Scheduling).
* **Energía:** Desactiva Power Throttling e Inicio Rápido para mayor estabilidad.
* **Sistema:** Desactiva Hibernación para liberar espacio en disco.

#### Modo Gamer (Gold Tier)
*(Aplica Extremo + lo siguiente)*
* **Enfoque Puro:** Diseñado para el máximo FPS estable.
* **Estabilidad:** Fuerza MMCSS (Multimedia Class Scheduler) siempre activo.
* **Servicios:** Desactiva SysMain (Superfetch) para reducir uso de disco en segundo plano.

### Modo Personalizado (Custom)
* **Propósito:** Para usuarios expertos que quieren control total.
* **Exclusivos de Custom:** Aquí encontrarás los tweaks retirados de los modos automáticos por seguridad:
    * Desactivar Hyper-V (Virtualización).
    * Desactivar Mitigaciones de CPU (Spectre/Meltdown).
    * Desactivar Windows Search o Cola de Impresión.
    * Tweaks de Kernel.

---

## ©️ Licencia y Créditos

ElmaxiShark Optimizer es una herramienta gratuita (freeware). Creada y propiedad de Elmaxi.

* Puedes usar esta aplicación libremente para fines personales y no comerciales.
* Puedes distribuir la aplicación (en su forma original, sin modificar) siempre y cuando des crédito claro y visible al creador (Elmaxi).
* **ESTÁ PROHIBIDO vender esta aplicación o cualquier parte de ella.**
* Está prohibido modificar, descompilar o realizar ingeniería inversa a la aplicación con fines de lucro.

El incumplimiento de estos términos puede llevar a acciones legales.

Gracias por usar ElmaxiShark Optimizer.