# Simple workaround: Just use the PNG directly
# Windows shortcuts can display PNG files as icons in modern Windows
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\RedAngel.lnk")
$Shortcut.TargetPath = "C:\boredm\Red Angel\START-DESKTOP-APP.bat"
$Shortcut.WorkingDirectory = "C:\boredm\Red Angel"
$Shortcut.IconLocation = "C:\boredm\Red Angel\build\icon.png"
$Shortcut.Description = "Red Angel Desktop App"
$Shortcut.Save()

Write-Host "Shortcut updated with PNG icon"

