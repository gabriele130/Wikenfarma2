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
    Write-Host "Configurazione IPv4 per Windows..." -ForegroundColor Cyan
    Write-Host "Server disponibile su: http://127.0.0.1:5000" -ForegroundColor Yellow
    npx cross-env NODE_ENV=development tsx server/index.ts
} else {
    Write-Host ""
    Write-Host "Per avviare WikenFarma esegui uno di questi comandi:" -ForegroundColor Green
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host "  npx cross-env NODE_ENV=development tsx server/index.ts" -ForegroundColor White
    Write-Host ""
    Write-Host "Ricordati di configurare il DATABASE_URL nel file .env" -ForegroundColor Yellow
}