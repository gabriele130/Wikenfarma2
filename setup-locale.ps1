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
Write-Host "5. Esegui migrazione database: npx drizzle-kit push"
Write-Host ""

# Setup database
Write-Host ""
Write-Host "=== SETUP DATABASE ===" -ForegroundColor Magenta
$setupDb = Read-Host "Vuoi eseguire la migrazione del database ora? (s/n)"
if ($setupDb -eq "s") {
    Write-Host "Esecuzione migrazione database..." -ForegroundColor Green
    try {
        npx drizzle-kit push --yes
        Write-Host "✅ Migrazione completata!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Errore durante la migrazione. Verifica DATABASE_URL nel file .env" -ForegroundColor Red
    }
}

# Avvio applicazione
Write-Host ""
$avvio = Read-Host "Vuoi avviare l'applicazione ora? (s/n)"
if ($avvio -eq "s") {
    Write-Host "Avvio WikenFarma..." -ForegroundColor Green
    Write-Host "Configurazione IPv4 per Windows..." -ForegroundColor Cyan
    Write-Host "Server disponibile su: http://127.0.0.1:5000" -ForegroundColor Yellow
    npx cross-env NODE_ENV=development tsx server/index.ts
} else {
    Write-Host ""
    Write-Host "Per completare il setup:" -ForegroundColor Green
    Write-Host "  1. npx drizzle-kit push (crea tabelle database)" -ForegroundColor White
    Write-Host "  2. npm run dev (avvia applicazione)" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️ IMPORTANTE: Prima di avviare verifica DATABASE_URL nel file .env" -ForegroundColor Yellow
}