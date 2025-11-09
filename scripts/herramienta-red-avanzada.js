module.exports = {
  apply: [
    {
      id: 'script_net_adapter',
      message: "Optimizando adaptador de red (Script agresivo)...",
      // ... (El script largo se mantiene igual, solo añade ID arriba) ...
      command: `@echo off\nchcp 65001 >nul\nfor /f %%n in ('Reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"') do (\n    reg add "%%n" /v "AdvancedEEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*EEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EEE" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnableGreenEthernet" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnablePME" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*WakeOnMagicPacket" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*WakeOnPattern" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "EnableWakeOnLan" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "*FlowControl" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "RxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TxAbsIntDelay" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "IPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TCPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "TCPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "UDPChecksumOffloadIPv4" /t REG_SZ /d 0 /f >nul 2>&1\n    reg add "%%n" /v "UDPChecksumOffloadIPv6" /t REG_SZ /d 0 /f >nul 2>&1\n)`
    },
    { id: 'net_ecn', message: "Desactivando ECN Capability...", command: 'netsh int tcp set global ecncapability=disabled' },
    { id: 'net_autotuning', message: "Desactivando Autotuning...", command: 'netsh interface tcp set global autotuninglevel=disabled' }
  ],
  revert: [
    {
      id: 'script_net_adapter',
      message: "Restaurando adaptador de red...",
      // ... (Script largo de revert) ...
      command: `@echo off\nchcp 65001 >nul\nfor /f %%n in ('Reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002bE10318}" /v "*SpeedDuplex" /s ^| findstr "HKEY"') do (\n    reg delete "%%n" /v "AdvancedEEE" /f >nul 2>&1\n    reg delete "%%n" /v "*EEE" /f >nul 2>&1\n    reg delete "%%n" /v "EEE" /f >nul 2>&1\n    reg delete "%%n" /v "EnableGreenEthernet" /f >nul 2>&1\n    reg delete "%%n" /v "EnablePME" /f >nul 2>&1\n    reg delete "%%n" /v "*WakeOnMagicPacket" /f >nul 2>&1\n    reg delete "%%n" /v "*WakeOnPattern" /f >nul 2>&1\n    reg delete "%%n" /v "EnableWakeOnLan" /f >nul 2>&1\n    reg delete "%%n" /v "*FlowControl" /f >nul 2>&1\n    reg delete "%%n" /v "RxAbsIntDelay" /f >nul 2>&1\n    reg delete "%%n" /v "TxAbsIntDelay" /f >nul 2>&1\n    reg delete "%%n" /v "IPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "TCPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "TCPChecksumOffloadIPv6" /f >nul 2>&1\n    reg delete "%%n" /v "UDPChecksumOffloadIPv4" /f >nul 2>&1\n    reg delete "%%n" /v "UDPChecksumOffloadIPv6" /f >nul 2>&1\n)`
    },
    { id: 'net_ecn', message: "Reactivando ECN Capability...", command: 'netsh int tcp set global ecncapability=enabled' },
    { id: 'net_autotuning', message: "Reactivando Autotuning...", command: 'netsh interface tcp set global autotuninglevel=normal' }
  ]
};