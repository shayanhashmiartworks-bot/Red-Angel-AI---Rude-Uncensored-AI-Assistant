Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\boredm\Red Angel"
WshShell.Run "START-DESKTOP-APP.bat", 0, False

