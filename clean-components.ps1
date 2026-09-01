$content = Get-Content "f:\Youtube 2.0\src\content\layouts\styles\components.css" -Raw
$lines = $content -split "`r?`n"

$newLines = @()
$skip = $false

for ($i=0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    
    # Skip ypp-btn logic (lines 4-48)
    if ($line -match "\/\* Button Components \*\/") {
        $skip = $true
    }
    
    if ($skip -and $line -match "\/\* Specific component tweaks \*\/") {
        $skip = $false
    }
    
    # Skip View Mode Toggle
    if ($line -match "\/\* --- VIEW MODE TOGGLE BUTTON STYLES --- \*\/") {
        $skip = $true
    }
    
    if ($skip -and $line -match "\.yt-spiral-tube-theme ytd-multi-page-menu-renderer") {
        $skip = $false
    }
    
    # Skip cinema/minimal/study mode (extracted)
    if ($line -match "\/\* --- NEW FEATURES \(Premium Logo & Resume Badges\) --- \*\/") {
        $skip = $true
    }
    
    if ($skip -and $line -match "\/\* --- PREMIUM LOGO --- \*\/") {
        $skip = $false
    }
    
    if (-not $skip) {
        $newLines += $line
    }
}

Set-Content -Path "f:\Youtube 2.0\src\content\layouts\styles\components.css" -Value ($newLines -join "`n")
Write-Output "Cleaned components.css"
