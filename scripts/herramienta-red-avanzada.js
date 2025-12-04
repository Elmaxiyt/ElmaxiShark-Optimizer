// scripts/herramienta-red-avanzada.js (v1.5.3 - MASTER NETWORK TWEAKS + PROBING ADDED)
// Incluye toda la suite de red: DNS, QoS, Nagle, Throttling, Offloads, Adaptador y Sondeo.

module.exports = {
  apply: [
    // 1. Script Agresivo del Adaptador (Hardware)
    {
      id: 'script_net_adapter',
      message: "Optimizando adaptador de red (Script Hardware)...",
      command: `@echo off\nchcp 65001 >nul\nfor /f %%n in ('Reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"') do (\n    reg add "%%n" /v "AdvancedEEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*EEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnableGreenEthernet" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnablePME" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*WakeOnMagicPacket" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*WakeOnPattern" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnableWakeOnLan" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*FlowControl" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "RxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "IPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TCPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TCPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "UDPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "UDPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1\n)`
    },
    // 2. Latencia y Ping
    { id: 'net_dns_cloudflare', message: "Cambiando DNS (Ethernet y Wi-Fi) a Cloudflare/Google...", command: 'netsh interface ipv4 set dnsserver name="Ethernet" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Ethernet" address=8.8.8.8 index=2 >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" static 1.1.1.1 primary >nul 2>&1 & netsh interface ipv4 add dnsserver name="Wi-Fi" address=8.8.8.8 index=2 >nul 2>&1' },
    { id: 'net_nagle', message: "Desactivando Algoritmo de Nagle (Baja latencia)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 1 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /t REG_DWORD /d 0 /f' },
    { id: 'net_throttle', message: "Desactivando limitación de red (Throttling)...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f' },
    { id: 'net_qos', message: "Liberando Ancho de Banda QoS (100% Red)...", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f' },
    { id: 'net_tcp_advanced', message: "Optimizando TCP (Puertos y Tiempos)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /t REG_DWORD /d 65534 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d 30 /f' },

    // 3. Estabilidad y Protocolos
    { id: 'net_ecn', message: "Desactivando ECN Capability...", command: 'netsh int tcp set global ecncapability=disabled' },
    { id: 'net_rss', message: "Activando RSS (Uso multi-núcleo)...", command: 'netsh interface tcp set global rss=enabled' },
    { id: 'net_ipv6', message: "Desactivando IPv6 (Prioridad IPv4)...", command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 255 /f' },
    { id: 'net_ndu', message: "Desactivando NDU (Diagnóstico)...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f' },
    { id: 'net_icmp_redirect', message: "Desactivando ICMP Redirects...", command: 'netsh int ip set global icmpredirects=disabled' },
    // --- AGREGADO: Recuperado de Modo Equilibrado ---
    { id: 'net_probing', message: "Desactivando sondeo de internet (ActiveProbing)...", command: 'reg add "HKLM\\System\\ControlSet001\\services\\NlaSvc\\Parameters\\Internet" /v "EnableActiveProbing" /t REG_DWORD /d 0 /f' },
    
    // 4. Offloads
    { id: 'net_offloads', message: "Desactivando Offloads (LSO/RSC) (Más carga CPU, Menos Latencia)...", apply: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing disabled -ReceiveSideScaling disabled -Chimney disabled; Disable-NetAdapterLso -Name *; Disable-NetAdapterChecksumOffload -Name *"', revert: 'powershell -Command "Set-NetOffloadGlobalSetting -ReceiveSegmentCoalescing enabled -ReceiveSideScaling enabled -Chimney enabled; Enable-NetAdapterLso -Name *; Enable-NetAdapterChecksumOffload -Name *"' },
  ],
  
  revert: [
    {
      id: 'script_net_adapter',
      message: "Restaurando adaptador de red...",
      command: `@echo off\nchcp 65001 >nul\nfor /f %%n in ('Reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"') do (\n    reg delete "%%n" /v "AdvancedEEE" /f >nul 2>&1\n    reg delete "%%n" /v "*EEE" /f >nul 2>&1\n    reg delete "%%n" /v "EEE" /f >nul 2>&1\n    reg delete "%%n" /v "EnableGreenEthernet" /f >nul 2>&1\n    reg delete "%%n" /v "EnablePME" /f >nul 2>&1\n    reg delete "%%n" /v "*WakeOnMagicPacket" /f >nul 2>&1\n    reg delete "%%n" /v "*WakeOnPattern" /f >nul 2>&1\n    reg delete "%%n" /v "EnableWakeOnLan" /f >nul 2>&1\n    reg delete "%%n" /v "*FlowControl" /f >nul 2>&1\n    reg delete "%%n" /v "RxAbsIntDelay" /f >nul 2>&1\n    reg delete "%%n" /v "TxAbsIntDelay" /f >nul 2>&1\n    reg delete "%%n" /v "IPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "TCPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "TCPChecksumOffloadIPv6" /f >nul 2>&1\n    reg delete "%%n" /v "UDPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "UDPChecksumOffloadIPv6" /f >nul 2>&1\n)`
    },
    { id: 'net_dns_cloudflare', message: "Restaurando DNS (Ethernet y Wi-Fi) a Automático (DHCP)...", command: 'netsh interface ipv4 set dnsserver name="Ethernet" source=dhcp >nul 2>&1 & netsh interface ipv4 set dnsserver name="Wi-Fi" source=dhcp >nul 2>&1' },
    { id: 'net_nagle', message: "Restaurando Nagle...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpAckFrequency /t REG_DWORD /d 2 /f & reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpNoDelay /t REG_DWORD /d 0 /f & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpDelAckTicks /f >nul 2>&1' },
    { id: 'net_throttle', message: "Restaurando NetworkThrottling...", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f' },
    { id: 'net_qos', message: "Restaurando QoS...", command: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /f >nul 2>&1' },
    { id: 'net_tcp_advanced', message: "Restaurando TCP...", command: 'reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /f >nul 2>&1 & reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /f >nul 2>&1' },
    { id: 'net_ecn', message: "Reactivando ECN Capability...", command: 'netsh int tcp set global ecncapability=enabled' },
    { id: 'net_rss', message: "Restaurando RSS...", command: 'netsh interface tcp set global rss=disabled' },
    { id: 'net_ipv6', message: "Reactivando IPv6...", command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\services\\TCPIP6\\Parameters" /v "DisabledComponents" /t REG_DWORD /d 0 /f' },
    { id: 'net_ndu', message: "Reactivando NDU...", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 2 /f' },
    { id: 'net_icmp_redirect', message: "Reactivando ICMP Redirects...", command: 'netsh int ip set global icmpredirects=enabled' },
    // --- REVERT AGREGADO ---
    { id: 'net_probing', message: "Reactivando sondeo de internet...", command: 'reg add "HKLM\\System\\ControlSet001\\services\\NlaSvc\\Parameters\\Internet" /v "EnableActiveProbing" /t REG_DWORD /d 1 /f' },
  ]
};