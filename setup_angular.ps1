# Lépj be a frontend mappába
Set-Location -Path frontend

# Ellenőrizzük, hogy az Angular CLI telepítve van-e
if (-not (Get-Command ng -ErrorAction SilentlyContinue)) {
    Write-Host "Angular CLI nem található, telepítés..."
    npm install -g @angular/cli
}

# Angular projekt inicializálása
ng new . --routing --style=scss --skip-install:$false --skip-git --force
