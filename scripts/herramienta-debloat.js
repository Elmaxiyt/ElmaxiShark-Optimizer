// scripts/herramienta-debloat.js
// (v3.0 - FIX: Eliminación REAL de Store y Edge)

module.exports = {
  
  // --- A. Debloat de IA y Antispy ---
  ia_antispy: [
    {
      id: 'debloat_ai_copilot',
      message: "Desactivar la Inteligencia Artificial de Copilot (Botón y Servicio en segundo plano)",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowCopilotButton" /t REG_DWORD /d 0 /f & reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f',
      revert: 'reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowCopilotButton" /f >nul 2>&1 & reg delete "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /f >nul 2>&1'
    },
    {
      id: 'debloat_ai_recall',
      message: "Desactivar la función 'Recall' de grabación constante del escritorio",
      apply: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v "AllowRecallEnablement" /t REG_DWORD /d 0 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "TurnOffSavingSnapshots" /t REG_DWORD /d 1 /f',
      revert: 'reg delete "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v "AllowRecallEnablement" /f >nul 2>&1 & reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "TurnOffSavingSnapshots" /f >nul 2>&1'
    },
    {
      id: 'debloat_ai_bingsearch',
      message: "Desactivar la integración de Bing/Cortana en la Búsqueda de Windows",
      apply: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer" /v "DisableSearchBoxSuggestions" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v "AllowCortana" /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v "CortanaConsent" /t REG_DWORD /d 0 /f',
      revert: 'reg delete "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer" /v "DisableSearchBoxSuggestions" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v "AllowCortana" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v "CortanaConsent" /f >nul 2>&1'
    },
    {
      id: 'debloat_ai_paintnotepad',
      message: "Deshabilitar las funciones de IA generativa en Paint y Notepad",
      apply: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Paint" /v "DisableCocreator" /t REG_DWORD /d 1 /f & reg add "HKLM\\SOFTWARE\\Policies\\WindowsNotepad" /v "DisableAIFeatures" /t REG_DWORD /d 1 /f',
      revert: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Paint" /v "DisableCocreator" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\WindowsNotepad" /v "DisableAIFeatures" /f >nul 2>&1'
    },
    {
        id: 'debloat_ai_edge',
        message: "Desactivar funciones de IA, Chat y sugerencias de Bing en el navegador Edge",
        apply: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "CopilotCDPPageContext" /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "NewTabPageBingChatEnabled" /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "HubsSidebarEnabled" /t REG_DWORD /d 0 /f',
        revert: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "CopilotCDPPageContext" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "NewTabPageBingChatEnabled" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "HubsSidebarEnabled" /f >nul 2>&1'
    }
  ],

  // --- B. Bloqueo de Publicidad ---
  ads_suggestions: [
    {
      id: 'debloat_ads_settings',
      message: "Bloquear Anuncios de MS 365, Sugerencias y notificaciones en la App de Configuración",
      apply: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableConsumerAccountStateContent" /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-338393Enabled" /t REG_DWORD /d 0 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SystemSettings\\AccountNotifications" /v "EnableAccountNotifications" /t REG_DWORD /d 0 /f',
      revert: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v "DisableConsumerAccountStateContent" /f >nul 2>&1 & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-338393Enabled" /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SystemSettings\\AccountNotifications" /v "EnableAccountNotifications" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'debloat_ads_start',
      message: "Bloquear la sección 'Recomendado' (apps y archivos) en el Menú Inicio",
      apply: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Explorer" /v "HideRecommendedSection" /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-338388Enabled" /t REG_DWORD /d 0 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "Start_IrisRecommendations" /t REG_DWORD /d 0 /f',
      revert: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Explorer" /v "HideRecommendedSection" /f >nul 2>&1 & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-338388Enabled" /t REG_DWORD /d 1 /f & reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "Start_IrisRecommendations" /f >nul 2>&1'
    },
    {
      id: 'debloat_ads_lockscreen',
      message: "Bloquear 'Datos Curiosos' y Sugerencias en la Pantalla de Bloqueo",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-338387Enabled" /t REG_DWORD /d 0 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenOverlayEnabled" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-338387Enabled" /t REG_DWORD /d 1 /f & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenOverlayEnabled" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'debloat_ads_edge',
      message: "Bloquear anuncios, noticias y el asistente de compras en el navegador Edge",
      apply: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "NewTabPageContentEnabled" /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "EdgeShoppingAssistantEnabled" /t REG_DWORD /d 0 /f',
      revert: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "NewTabPageContentEnabled" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "EdgeShoppingAssistantEnabled" /f >nul 2>&1'
    }
  ],
  
  // --- C. Componentes de Interfaz ---
  ui_shell: [
    {
      id: 'debloat_hide_copilot',
      message: "Ocultar el Botón de Copilot de la Barra de Tareas (Recomendado)",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowCopilotButton" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "ShowCopilotButton" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'debloat_hide_chat',
      message: "Ocultar el Botón de Chat/Teams de la Barra de Tareas",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "TaskbarMn" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "TaskbarMn" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'debloat_hide_widgets',
      message: "Ocultar la sección y Botón de Widgets de la Barra de Tareas",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "TaskbarDa" /t REG_DWORD /d 0 /f & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Dsh" /v "AllowNewsAndInterests" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "TaskbarDa" /t REG_DWORD /d 1 /f & reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Dsh" /v "AllowNewsAndInterests" /f >nul 2>&1'
    },
    {
      id: 'debloat_hide_search_icon',
      message: "Ocultar el Icono de Búsqueda de la Barra de Tareas (Limpieza visual)",
      apply: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" /v "SearchboxTaskbarMode" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" /v "SearchboxTaskbarMode" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'debloat_remove_give_access',
      message: "Eliminar la opción 'Dar acceso a' del Menú Contextual",
      apply: 'reg delete "HKCR\\*\\shellex\\ContextMenuHandlers\\Sharing" /f >nul 2>&1 & reg delete "HKCR\\Directory\\Background\\shellex\\ContextMenuHandlers\\Sharing" /f >nul 2>&1 & reg delete "HKCR\\Directory\\shellex\\ContextMenuHandlers\\Sharing" /f >nul 2>&1 & reg delete "HKCR\\Drive\\shellex\\ContextMenuHandlers\\Sharing" /f >nul 2>&1',
      revert: 'reg add "HKCR\\*\\shellex\\ContextMenuHandlers\\Sharing" /ve /d "{f81e9010-6ea4-11ce-a7ff-00aa003ca9f6}" /f & reg add "HKCR\\Directory\\Background\\shellex\\ContextMenuHandlers\\Sharing" /ve /d "{f81e9010-6ea4-11ce-a7ff-00aa003ca9f6}" /f & reg add "HKCR\\Directory\\shellex\\ContextMenuHandlers\\Sharing" /ve /d "{f81e9010-6ea4-11ce-a7ff-00aa003ca9f6}" /f & reg add "HKCR\\Drive\\shellex\\ContextMenuHandlers\\Sharing" /ve /d "{f81e9010-6ea4-11ce-a7ff-00aa003ca9f6}" /f'
    },
    {
      id: 'debloat_remove_share',
      message: "Eliminar el botón 'Compartir' del Menú Contextual",
      apply: 'reg delete "HKCR\\*\\shellex\\ContextMenuHandlers\\ModernSharing" /f >nul 2>&1',
      revert: 'reg add "HKCR\\*\\shellex\\ContextMenuHandlers\\ModernSharing" /ve /d "{e2bf9676-5f8f-435c-97eb-11607a5bedf7}" /f'
    },
    {
      id: 'debloat_remove_library',
      message: "Eliminar la opción 'Incluir en biblioteca' del Menú Contextual",
      apply: 'reg delete "HKCR\\Folder\\ShellEx\\ContextMenuHandlers\\Library Location" /f >nul 2>&1',
      revert: 'reg add "HKCR\\Folder\\ShellEx\\ContextMenuHandlers\\Library Location" /ve /d "{3dad6c5d-2167-4cae-9914-f99e41c12cfa}" /f'
    }
  ],

  // --- D. Explorador de Archivos ---
  explorador: [
    {
      id: 'debloat_hide_3dobjects',
      message: "Ocultar la carpeta 'Objetos 3D' de la sección Este PC",
      apply: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}" /f >nul 2>&1',
      revert: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}" /ve /d "Objetos 3D" /f & reg add "HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}" /ve /d "Objetos 3D" /f'
    },
    {
      id: 'debloat_hide_onedrive',
      message: "Ocultar la carpeta OneDrive del Panel de Navegación",
      apply: 'reg add "HKCR\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}" /v "System.IsPinnedToNameSpaceTree" /t REG_DWORD /d 0 /f & reg add "HKCR\\Wow6432Node\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}" /v "System.IsPinnedToNameSpaceTree" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCR\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}" /v "System.IsPinnedToNameSpaceTree" /t REG_DWORD /d 1 /f & reg add "HKCR\\Wow6432Node\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}" /v "System.IsPinnedToNameSpaceTree" /t REG_DWORD /d 1 /f'
    },
    {
      id: 'debloat_hide_home',
      message: "Ocultar 'Home' / 'Acceso Rápido' del Panel de Navegación (W11)",
      apply: 'reg add "HKCU\\Software\\Classes\\CLSID\\{f874310e-b6b7-47dc-bc84-b9e6b38f5903}" /v "System.IsPinnedToNameSpaceTree" /t REG_DWORD /d 0 /f',
      revert: 'reg delete "HKCU\\Software\\Classes\\CLSID\\{f874310e-b6b7-47dc-bc84-b9e6b38f5903}" /v "System.IsPinnedToNameSpaceTree" /f >nul 2>&1'
    },
    {
      id: 'debloat_hide_music',
      message: "Ocultar la carpeta 'Música' de la sección Este PC",
      apply: 'reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}" /f >nul 2>&1 & reg delete "HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}" /f >nul 2>&1',
      revert: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}" /ve /d "Música" /f & reg add "HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace\\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}" /ve /d "Música" /f'
    },
    {
      id: 'debloat_hide_gallery',
      message: "Ocultar la carpeta 'Galería' del Panel de Navegación (W11)",
      apply: 'reg add "HKCU\\Software\\Classes\\CLSID\\{e88865ea-0e1c-4e20-9aa6-edcd0212c87c}" /v "System.IsPinnedToNameSpaceTree" /t REG_DWORD /d 0 /f',
      revert: 'reg add "HKCU\\Software\\Classes\\CLSID\\{e88865ea-0e1c-4e20-9aa6-edcd0212c87c}" /v "System.IsPinnedToNameSpaceTree" /t REG_DWORD /d 1 /f'
    }
  ],

  // --- E. Desinstalación de Aplicaciones UWP ---
  uwp_desinstalacion: [
    {
      id: 'uwp_store_disable',
      message: "[ADVERTENCIA] Desinstalar Microsoft Store (Reinstalar con el Botón de Rescate abajo)",
      // CAMBIO: Ahora usamos Remove-AppxPackage en lugar de la política de registro
      apply: 'powershell -Command "Get-AppxPackage *windowsstore* | Remove-AppxPackage"',
      revert: 'powershell -Command "Get-AppxPackage -AllUsers *windowsstore* | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register \"$($_.InstallLocation)\\AppXManifest.xml\"}"'
    },
    { id: 'uwp_3dbuilder', message: "Eliminar '3D Builder' (Modelado básico)", 
      apply: 'powershell -Command "Get-AppxPackage *3dbuilder* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_calculator', message: "Eliminar 'Calculadora' de Windows", 
      apply: 'powershell -Command "Get-AppxPackage *windowscalculator* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_calendar', message: "Eliminar 'Correo y Calendario'", 
      apply: 'powershell -Command "Get-AppxPackage *windowscommunicationsapps* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_camera', message: "Eliminar 'Cámara' de Windows", 
      apply: 'powershell -Command "Get-AppxPackage *windowscamera* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_clipchamp', message: "Eliminar 'Clipchamp' (Editor de video preinstalado)", 
      apply: 'powershell -Command "Get-AppxPackage *Clipchamp* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_cortana', message: "Eliminar 'Cortana' (Asistente de voz)", 
      apply: 'powershell -Command "Get-AppxPackage *Microsoft.549981C3F5F10* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_feedback', message: "Eliminar 'Feedback Hub' (Centro de comentarios)", 
      apply: 'powershell -Command "Get-AppxPackage *windowsfeedbackhub* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_maps', message: "Eliminar 'Mapas' de Windows", 
      apply: 'powershell -Command "Get-AppxPackage *windowsmaps* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_mediaplayer', message: "Eliminar 'Media Player' (Reproductor moderno)", 
      apply: 'powershell -Command "Get-AppxPackage *zunemusic* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_movies_tv', message: "Eliminar 'Películas y TV' (ZuneVideo)", 
      apply: 'powershell -Command "Get-AppxPackage *zunevideo* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_365', message: "Eliminar 'Microsoft 365' (Office Hub)", 
      apply: 'powershell -Command "Get-AppxPackage *MicrosoftOfficeHub* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_onenote', message: "Eliminar 'OneNote' (UWP)", 
      apply: 'powershell -Command "Get-AppxPackage *OneNote* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_people', message: "Eliminar 'People' (Contactos)", 
      apply: 'powershell -Command "Get-AppxPackage *People* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_photos', message: "Eliminar 'Fotos' de Windows (Nueva versión)", 
      apply: 'powershell -Command "Get-AppxPackage *Windows.Photos* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_powerautomate', message: "Eliminar 'Power Automate Desktop' (RPA)", 
      apply: 'powershell -Command "Get-AppxPackage *PowerAutomateDesktop* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_quickassist', message: "Eliminar 'Asistencia Rápida'", 
      apply: 'powershell -Command "Get-AppxPackage *QuickAssist* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_remotedesktop', message: "Eliminar 'Escritorio Remoto' de Windows", 
      apply: 'powershell -Command "Get-AppxPackage *RemoteDesktop* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_snippingtool', message: "Eliminar 'Herramienta de Recortes'", 
      apply: 'powershell -Command "Get-AppxPackage *ScreenSketch* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_soundrecorder', message: "Eliminar 'Grabadora de Sonidos'", 
      apply: 'powershell -Command "Get-AppxPackage *WindowsSoundRecorder* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_stickynotes', message: "Eliminar 'Sticky Notes' (Notas rápidas)", 
      apply: 'powershell -Command "Get-AppxPackage *MicrosoftStickyNotes* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_tips', message: "Eliminar 'Tips' (Sugerencias de Windows)", 
      apply: 'powershell -Command "Get-AppxPackage *Getstarted* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_todo', message: "Eliminar 'Microsoft To Do'", 
      apply: 'powershell -Command "Get-AppxPackage *Microsoft.Todos* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_weather', message: "Eliminar 'Tiempo' (Bing Weather)", 
      apply: 'powershell -Command "Get-AppxPackage *Microsoft.BingWeather* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { id: 'uwp_xbox', message: "Eliminar 'Xbox' y Servicios relacionados (Game Bar / Consola)", 
      apply: 'powershell -Command "Get-AppxPackage *XboxApp* | Remove-AppxPackage; Get-AppxPackage *XboxIdentityProvider* | Remove-AppxPackage"', 
      revert: 'powershell -Command "Write-Host -ForegroundColor Yellow \'Irreversible. Usar Tienda MS.\'"' },
    { 
      id: 'uwp_edge_iea', 
      message: "[RIESGO] Desinstalar Edge (Modo Agresivo)", 
      // CAMBIO: Usamos un bucle FOR para encontrar el setup.exe donde sea que esté
      apply: 'for /f "delims=" %%a in (\'dir /b /s "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\setup.exe"\') do "%%a" --uninstall --system-level --verbose-logging --force-uninstall',
      revert: 'powershell -Command "Write-Host -ForegroundColor Red \'Irreversible. Requiere descargar Edge manualmente.\'"'
    },
    // --- NUEVO BOTÓN DE RESCATE ---
{ 
      id: 'uwp_restore_store', 
      message: "[FIX] Restaurar solo Microsoft Store (Si fue eliminada)", 
      apply: 'powershell -Command "Get-AppxPackage -AllUsers Microsoft.WindowsStore | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register \\"$($_.InstallLocation)\\AppXManifest.xml\\"}"',
      revert: 'echo "Esta acción ya es una restauración."'
    },
    { 
      id: 'uwp_restore_all', 
      message: "[RESCATE] Reinstalar TODAS las Apps por defecto de Windows", 
      apply: 'powershell -Command "Get-AppXPackage -AllUsers | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register \\"$($_.InstallLocation)\\AppXManifest.xml\\" -ErrorAction SilentlyContinue}"',
      revert: 'echo "Esta acción ya es una restauración."'
    }
  ]
};