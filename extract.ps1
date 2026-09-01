$content = Get-Content "f:\Youtube 2.0\src\content\layouts\styles\misc.css" -Raw
$lines = $content -split "`r?`n"

$newMisc = @()

$toastLines = @()
$floatingPlayerLines = @()
$subtitlesLines = @()

$state = "misc"

for ($i=0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    
    if ($line -match "\/\* Cinematic Mode \(Netflix Style\) \*\/") {
        $state = "cinematic"
    } elseif ($line -match "KEYBOARD SHORTCUT TOAST") {
        $state = "toast"
    } elseif ($line -match "FLOATING PLAYER" -or $line -match "body\.ypp-floating-player-active") {
        $state = "floating"
    } elseif ($line -match "NETFLIX SUBTITLES") {
        $state = "subtitles"
    }
    
    if ($state -eq "cinematic") {
        if ($line -match "@keyframes yppPulse") {
            $state = "cinematic_end"
        }
    } elseif ($state -eq "cinematic_end") {
        if ($line -match "^\}") {
            $state = "misc"
        }
    } elseif ($state -eq "toast") {
        $toastLines += $line
        # Ends after .ypp-time-dashboard.active rule
        if ($line -match "box-shadow: 0 4px 16px rgba\(0, 0, 0, 0\.3\) !important;") {
            $state = "toast_end"
        }
    } elseif ($state -eq "toast_end") {
        if ($line -match "^\}") {
            $toastLines += $line
            $state = "misc"
        }
    } elseif ($state -eq "floating") {
        $floatingPlayerLines += $line
        if ($line -match "pointer-events: auto !important;") {
            $state = "floating_end"
        }
    } elseif ($state -eq "floating_end") {
        if ($line -match "^\}") {
            $floatingPlayerLines += $line
            $state = "misc"
        }
    } elseif ($state -eq "subtitles") {
        $subtitlesLines += $line
        if ($line -match "text-shadow: 0 2px 4px rgba\(0,0,0,0\.8\), 0 0 8px rgba\(0,0,0,0\.8\) !important;") {
            $state = "subtitles_end"
        }
    } elseif ($state -eq "subtitles_end") {
        if ($line -match "^\}") {
            $subtitlesLines += $line
            $state = "misc"
        }
    } else {
        # Check for empty comments (e.g. /* Hide Video Title */ followed by blank line or another comment)
        if ($line -match "^\s*\/\*.*?\*\/\s*$" -and $line -notmatch "===" -and $line -notmatch "---" -and $line -notmatch "stylelint-disable") {
            # Skip if next line is empty or another empty comment, meaning this one has no css attached
            if (($i+1) -lt $lines.Length -and ($lines[$i+1] -match "^\s*$" -or $lines[$i+1] -match "^\s*\/\*")) {
                continue
            }
        }
        $newMisc += $line
    }
}

New-Item -ItemType Directory -Force -Path "f:\Youtube 2.0\src\content\components\toast"
Set-Content -Path "f:\Youtube 2.0\src\content\components\toast\toast.css" -Value ($toastLines -join "`n")

New-Item -ItemType Directory -Force -Path "f:\Youtube 2.0\src\content\pages\watch\player\enhancements"
Set-Content -Path "f:\Youtube 2.0\src\content\pages\watch\player\enhancements\subtitles.css" -Value ($subtitlesLines -join "`n")

Set-Content -Path "f:\Youtube 2.0\src\content\pages\watch\layouts\modes\css\floating-player.css" -Value ($floatingPlayerLines -join "`n")

Set-Content -Path "f:\Youtube 2.0\src\content\layouts\styles\misc.css" -Value ($newMisc -join "`n")

Write-Output "Extraction complete"
