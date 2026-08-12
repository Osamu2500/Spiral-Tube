$KEEP = @("abyss", "sakura", "vintage", "aurora", "autumn")

# Get all changed ui-styles paths since f5fcd3d
$changedFiles = git diff f5fcd3d HEAD --name-only 2>&1 | Where-Object { $_ -match "^src/content/ui-styles/" }

# Extract unique theme folder names
$changedThemes = $changedFiles | ForEach-Object {
    ($_ -split "/")[3]
} | Sort-Object -Unique

Write-Host "Changed themes: $($changedThemes -join ', ')"

foreach ($theme in $changedThemes) {
    if ($KEEP -contains $theme) {
        Write-Host "KEEPING: $theme"
        continue
    }
    Write-Host "REVERTING: $theme"
    git checkout f5fcd3d -- "src/content/ui-styles/$theme" 2>&1
}
Write-Host "Done reverting."
