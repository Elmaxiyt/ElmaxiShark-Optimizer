🚀 Novedades de la v1.2.0
¡Esta versión se centra en la seguridad, la funcionalidad y las peticiones de la comunidad!

¡Buscador de Actualizaciones! Se ha añadido un botón ("Buscar Actualización") para comprobar manualmente si hay una nueva versión en GitHub.

Filosofía "Seguro por Defecto": Los botones de 1-clic (Básico, Equilibrado, Extremo, Modo Dios) han sido revisados para mejorar la seguridad y estabilidad. Ya no desactivan funciones clave del sistema (Store, Búsqueda, Impresoras, etc.).

Modo "Custom" Mejorado: Todos los tweaks "agresivos" (Debloat, Mitigaciones de CPU, Desactivar VRAM, etc.) se han movido al menú "Custom" para usuarios expertos.

Arreglado (Bug de Bluetooth): El "Modo Dios" ya no desactiva el servicio de Radio (RmSvc), por lo que los mandos de PS5 y otros dispositivos Bluetooth funcionan perfectamente.

Arreglado (Bug Plan de Energía): Los modos de optimización ya no fuerzan el plan "Equilibrado" al revertir o cambiar entre modos.

Nuevos Tweaks Seguros: Se han añadido optimizaciones seguras para NTFS, prioridad de tareas y estabilidad de la GPU (TdrDelay) a los botones de 1-clic.

Aviso de Reinicio: La aplicación ahora recomienda reiniciar el PC después de aplicar una optimización para asegurar que todos los cambios surtan efecto.

Versión en la App: La versión actual (v1.2.0) ahora se muestra en el pie de página.

Guía de Recomendaciones: Se ha añadido un botón "Descargar Guía" en la app para ayudarte a elegir el modo correcto para tu PC.

⚠️ Guía Rápida: ¿Qué modo debo usar?
Para saber qué modo es el mejor para tu sistema (Portátil, PC Gaming, etc.), por favor haz clic en el botón "Descargar Guía" que se encuentra en la aplicación.

Esto guardará un archivo GUIA_RECOMENDACIONES.txt en tu carpeta de Descargas con todas las instrucciones y recomendaciones.

Antes de Empezar (¡OBLIGATORIO!)
Paso 1: Haz clic en el botón "Punto Restauracion".

Paso 2: Después de aplicar cualquier modo, REINICIA EL EQUIPO.

Perfil 4: Usuario Experto / Entusiasta del Tweak
(Extracto de la Guía)

¿Quién eres?: Sabes lo que es bcdedit, entiendes los riesgos y quieres control total.

Modo Recomendado: Modo Custom.

Tu ruta:

NO apliques ningún modo de 1-clic. Ve directamente al menú "Custom".

"Custom" es un lienzo en blanco que te permite seleccionar exactamente lo que quieres (tweaks críticos, debloat, etc.).

RECUERDA: El modo "Custom" es un estado separado. Si aplicas "Custom" y luego "Modo Dios", tus ajustes de Custom se revertirán (y viceversa).

🔧 Cómo Usar (Instalación)
Descarga el ElmaxiShark Optimizer.exe desde la sección de Releases de este repositorio.

Ejecuta el archivo .exe. La aplicación te pedirá permisos de Administrador (UAC).

(Recomendado) Haz clic en "Punto Restauracion" primero.

Elige un modo de optimización siguiendo la guía de recomendaciones de arriba.

Para revertir los cambios de un modo, simplemente vuelve a hacer clic en el botón que esté activo.

Al cambiar de modo, se revertirán los cambios del modo anterior y se aplicarán los del nuevo.

📂 Detalle de los Modos y Herramientas
Herramientas Individuales
Punto Restauracion: Crea un punto de restauración del sistema llamado 'ElmaxiShark - Punto Manual'.

Crear Plan Energia: Crea un plan de energía optimizado llamado 'Modo Gaming Extremo' y lo activa.

Limpieza Sistema: Ejecuta solamente las tareas de limpieza profundas (Temp, Prefetch, Cachés de Shaders, etc.).

Modo Básico
(Aplica todos estos comandos)

Limpieza: Caches de Temp, Prefetch, Cachés de GPU (NVIDIA/Vulkan/D3D), Windows Update, Iconos, Steam y Epic Games.

QOL: Ajusta visuales a "Mejor Rendimiento", desactiva transparencia, acelera menús/animaciones y mantiene suavizado de fuentes.

Red/Sistema: Establece DNS a Cloudflare/Google, limpia caché DNS, activa RSS, verifica TRIM (SSD), Habilita Rutas de Archivo Largas (LongPaths).

Optimización NTFS: Desactiva la creación de nombres de archivo 8.3 (mejora la E/S del disco).

Modo Equilibrado
(Aplica todo lo de Básico MÁS lo siguiente)

Servicios: Desactiva Telemetría (DiagTrack, DPS, WerSvc), Game Bar, DVR, Modo Juego Auto y servicios innecesarios (Fax, Mapas, Geo-localización, etc.).

Debloat Ligero: Desactiva Sugerencias (ConsumerFeatures), Servicio BAM, Tareas Idle, Experiencias Compartidas (CDP) y Sincronización de Ajustes.

Sistema: Desactiva Mantenimiento Automático, Evita drivers de Windows Update.

Memoria: Desactiva Large System Cache, Mantiene Kernel en RAM (DisablePagingExecutive), Optimiza uso de memoria de NTFS.

QOL/Interfaz: Activa el Menú Contextual Completo (W10/W7 style), desactiva aceleración de ratón y optimiza respuesta de teclado.

Optimización de Tareas: Mejora la respuesta de la aplicación activa (Foreground Boost).

Optimización de Shaders: Optimiza el registro del Caché de Shaders de Direct3D.

Modo Extremo
(Aplica todo lo de Equilibrado MÁS lo siguiente)

Sistema: Prioriza CPU/GPU para juegos (SystemResponsiveness = 0), Activa Programación de GPU (HwSchMode).

Red: Optimiza Network Throttling (NetworkThrottlingIndex), Desactiva Autotuning, Optimiza TCP (MaxUserPort, etc.), Desactiva ECN Capability.

Red (Script): Optimiza propiedades de adaptador de red (desactiva EEE, Flow Control, WakeOnLan).

Energía/Almacenamiento: Desactiva Power Throttling, Desactiva Inicio Rápido, Desactiva Last Access Time (NTFS), Desactiva ahorro de energía SSD/USB.

Estabilidad de GPU: Aumenta el TdrDelay a 10 segundos para prevenir cuelgues del controlador gráfico.

Modo Dios (Optimización Avanzada)
(Aplica todo lo de Extremo MÁS lo siguiente)

ADVERTENCIA (Experto): Este modo aplica tweaks de red y sistema de bajo nivel. Está pensado para usuarios avanzados que buscan el máximo rendimiento. (Ver Guía para más detalles).

Red Agresiva: Desactiva Algoritmo de Nagle y optimiza TCP (para latencia mínima), Desactiva IPv6, Desactiva NDU (Diagnóstico de Red).

Sistema: Desactiva Hyper-V (virtualización).

Servicios: Desactiva servicios avanzados (Notas, Tablet).

¡ARREGLADO! Ya NO desactiva el servicio de Radio (RmSvc), por lo que el Bluetooth y los mandos funcionan correctamente.

¡NOTA! Los tweaks de Debloat (Store, Search, Impresoras, Xbox) han sido eliminados de este modo y movidos al menú Custom.

Modo Personalizado (Custom)
Propósito: Para usuarios expertos que quieren control total.

Qué hace: Abre un menú que te permite seleccionar tweaks individuales que son demasiado agresivos o específicos para los modos de 1-clic.

Incluye (y más):

Desactivar Servicios (Xbox, Impresoras, Búsqueda, etc.).

Desactivar Microsoft Store.

Desinstalar Apps UWP (Debloat).

Desactivar Mitigaciones de CPU (Spectre/Meltdown).

Desactivar Compresión de VRAM.

Desactivar Telemetría de NVIDIA.

Tweaks de Kernel (DynamicTick, HPET, etc.).

©️ Licencia y Créditos
ElmaxiShark Optimizer v1.2.0 es una herramienta gratuita (freeware). Creada y propiedad de Elmaxi.

Puedes usar esta aplicación libremente para fines personales y no comerciales.

Puedes distribuir la aplicación (en su forma original, sin modificar) siempre y cuando des crédito claro y visible al creador (Elmaxi) e incluyas este archivo README.md sin modificar.

ESTÁ PROHIBIDO vender esta aplicación o cualquier parte de ella.

Está prohibido modificar, descompilar o realizar ingeniería inversa a la aplicación con fines de lucro o para crear obras derivadas sin el permiso expreso del autor.

El incumplimiento de estos términos puede llevar a acciones legales.

Gracias por usar ElmaxiShark Optimizer.