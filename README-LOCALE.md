# WikenFarma - Setup Locale Windows

## Configurazione Rapida

### 1. Installa Dipendenze
```bash
npm install
```

### 2. Configura Variabili d'Ambiente
```bash
# Copia il template di configurazione
copy .env.local .env

# Configura manualmente le variabili necessarie
```

### 3. Configura Database
Modifica il file `.env` e inserisci il tuo DATABASE_URL:

```env
DATABASE_URL=postgresql://tuo_username:tua_password@tuo_host:5432/tuo_database
```

#### Opzioni Database Consigliate:
- **Neon** (Consigliato): https://neon.tech - Serverless PostgreSQL
- **Supabase**: https://supabase.com - PostgreSQL con auth integrata  
- **Railway**: https://railway.app - Hosting e database integrati
- **ElephantSQL**: https://elephantsql.com - PostgreSQL specializzato

### 4. Esegui Migrazioni Database
```bash
npx drizzle-kit push
```

### 5. Avvia Applicazione
```bash
# Su Windows (configurazione automatica localhost)
npm run dev

# Oppure direttamente:
npx cross-env NODE_ENV=development tsx server/index.ts
```

**Nota:** L'applicazione si avvia automaticamente su:
- 🖥️ **Windows locale**: `http://127.0.0.1:5000` (IPv4 per compatibilità)
- ☁️ **Replit produzione**: `http://0.0.0.0:5000`

L'applicazione sarà disponibile su: http://localhost:5000

## Struttura Progetto

```
WikenFarma/
├── client/          # Frontend React + TypeScript
├── server/          # Backend Express + TypeScript
├── shared/          # Schemi condivisi (Zod + Drizzle)
├── .env            # Variabili d'ambiente (da configurare)
├── .env.local      # Template configurazione
└── package.json    # Dipendenze Node.js
```

## Funzionalità Principali

- ✅ Autenticazione JWT personalizzata
- ✅ Database PostgreSQL con Drizzle ORM
- ✅ Gestione clienti (farmacie, grossisti, dottori)
- ✅ Sistema ordini e spedizioni
- ✅ Dashboard analytics avanzate
- ✅ Integrazione WIKENSHIP (WooCommerce/eBay)
- ✅ Sistema commissioni ISF
- ✅ Reports medici condivisibili

## Supporto

Per problemi di configurazione:
1. Verifica che DATABASE_URL sia corretto
2. Controlla che il database sia accessibile
3. Esegui `npx drizzle-kit push` per creare le tabelle