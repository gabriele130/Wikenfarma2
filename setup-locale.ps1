# Script PowerShell per configurazione locale WikenFarma
Write-Host "=== Setup WikenFarma - Ambiente Locale ===" -ForegroundColor Green

# Verifica se .env esiste
if (Test-Path ".env") {
    Write-Host "File .env esistente trovato." -ForegroundColor Yellow
    $risposta = Read-Host "Vuoi sovrascriverlo? (s/n)"
    if ($risposta -ne "s") {
        Write-Host "Setup annullato." -ForegroundColor Red
        exit
    }
}

# Copia il template
Copy-Item ".env.local" ".env"
Write-Host "File .env creato da template." -ForegroundColor Green

# Installa dipendenze se necessario
if (!(Test-Path "node_modules")) {
    Write-Host "Installazione dipendenze..." -ForegroundColor Yellow
    npm install
}

# Setup database (opzionale)
Write-Host ""
Write-Host "=== Configurazione Database ===" -ForegroundColor Cyan
Write-Host "Il file .env contiene l'URL del database Neon di esempio."
Write-Host "Per usare il tuo database:"
Write-Host "1. Crea un account su https://neon.tech"
Write-Host "2. Crea un nuovo progetto PostgreSQL"
Write-Host "3. Copia l'URL di connessione"
Write-Host "4. Sostituisci DATABASE_URL nel file .env"
Write-Host ""

# Avvio applicazione
$avvio = Read-Host "Vuoi avviare l'applicazione ora? (s/n)"
if ($avvio -eq "s") {
    Write-Host "Avvio WikenFarma..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host ""
    Write-Host "Per avviare WikenFarma esegui: npm run dev" -ForegroundColor Green
    Write-Host "Ricordati di configurare il DATABASE_URL nel file .env" -ForegroundColor Yellow
}