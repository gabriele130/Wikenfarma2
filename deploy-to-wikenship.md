# 🚀 Deploy WikenFarma su wikenship.it

## 📋 Comandi per il tuo server ScalaHosting

### 1. 📤 Upload nuovo codice
```bash
# Sul tuo computer locale, carica questi file:
# - dist/index.js (backend)
# - dist/public/* (frontend React)

# Via FTP/SFTP carica in: /home/wikenshipit/apps/wikenfarma/
```

### 2. 🔄 Riavvia PM2 con nuovo codice
```bash
# SSH su wikenship.it
ssh wikenshipit@cloud-83c776

# Vai nella directory app
cd /home/wikenshipit/apps/wikenfarma/

# Ferma processo corrente
pm2 stop wikenship.it

# Riavvia con nuovo codice
pm2 start dist/index.js --name "wikenship.it"

# Oppure restart se già configurato
pm2 restart wikenship.it
```

### 3. ✅ Verifica nuove route GestLine
```bash
# Controlla che il server sia attivo
pm2 status

# Test endpoint modulari (dovrebbero rispondere 200, non 404)
curl -X GET https://wikenship.it:3100/api/gestline/health
curl -X POST https://wikenship.it:3100/api/gestline/orders -H "Content-Type: application/json" -d '{}'

# Controlla logs se ci sono errori
pm2 logs wikenship.it --lines 50
```

## 🔧 Se hai problemi di porta

Se la porta 3100 è bloccata, modifica la variabile ambiente:
```bash
# Usa porta 3100 (produzione)
pm2 set PM2_ENV_PORT 3100
pm2 restart wikenship.it

# Poi testa su:
curl https://wikenship.it:3100/api/gestline/orders
```

## 📊 Verificare architettura modulare attiva

Il nuovo codice include:
- ✅ `/api/gestline/orders` (modulo orders.ts)
- ✅ `/api/gestline/products` (modulo products.ts) 
- ✅ `/api/gestline/customers` (modulo customers.ts)
- ✅ XML injection protection
- ✅ Backward compatibility con endpoints legacy

Una volta deployato, non riceverai più 404! 🎯