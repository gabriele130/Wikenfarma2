# WikenFarma - Sistema Gestionale Farmaceutico

## Panoramica

WikenFarma è un sistema completo di gestione farmaceutica progettato per centralizzare e automatizzare diverse operazioni commerciali. L'applicazione gestisce ordini privati, operazioni di farmacie e grossisti, database clienti (medici, farmacie, grossisti), gestione inventario, spedizioni, commissioni e integrazioni con sistemi esterni come eBay, Gestline, Odoo, GLS, PharmaEVO e diverse piattaforme ecommerce.

Il sistema fornisce reportistica avanzata per analisi di marketing e controllo gestionale, con funzionalità specializzate per informatori scientifici del farmaco (ISF) incluso il tracciamento delle commissioni e gestione del territorio.

## Preferenze Utente

Stile di comunicazione preferito: Linguaggio semplice e quotidiano.

## Modifiche Recenti (Agosto 2025)

- ✅ **Supporto Cross-Platform Windows**: Risolti errori di rete ENOTSUP implementando binding IPv4 (127.0.0.1) per ambiente di sviluppo Windows
- ✅ **Gestione Sessioni PostgreSQL**: Risolti conflitti session store creando tabella dedicata `user_sessions`, eliminando errori `IDX_session_expire`
- ✅ **Migrazione Database**: Configurato con successo Neon PostgreSQL con creazione automatica tabelle via migrazioni Drizzle
- ✅ **Registrazione Utenti**: Confermato sistema di autenticazione funzionante con ambiente localhost Windows
- ✅ **Integrazione Cross-env**: Aggiunto supporto script PowerShell Windows con setup automatico database e lancio applicazione

## Architettura Sistema

### Architettura Frontend
- **Framework**: React 18 con TypeScript per interfacce utente moderne e type-safe
- **Build Tool**: Vite per sviluppo veloce e build ottimizzate
- **Routing**: Wouter per navigazione client-side leggera e performante
- **Gestione Stato**: TanStack React Query per gestione stato server con caching intelligente
- **Framework UI**: Libreria componenti personalizzata usando primitive Radix UI con Tailwind CSS
- **Styling**: Tailwind CSS con proprietà CSS personalizzate per theming avanzato
- **Gestione Form**: React Hook Form con validazione Zod per form robusti e type-safe

### Architettura Backend
- **Runtime**: Node.js con TypeScript per sviluppo server-side type-safe
- **Framework**: Express.js per API REST con middleware modulari
- **Autenticazione**: Sistema di autenticazione JWT personalizzato con storage sessioni
- **Database ORM**: Drizzle ORM per operazioni database type-safe e performanti
- **Design API**: Endpoint RESTful con gestione errori consistente e formattazione risposta standardizzata

### Design Database
- **Database Primario**: PostgreSQL con connection pooling per alte prestazioni
- **Storage Sessioni**: Session store basato su PostgreSQL usando connect-pg-simple
- **Gestione Schema**: Migrazioni Drizzle con definizioni schema TypeScript
- **Entità Chiave**: Utenti, Clienti, Prodotti, Ordini, Spedizioni, Commissioni, Integrazioni, Log Attività, Informatori

### Autenticazione e Autorizzazione
- **Metodo Autenticazione**: Implementazione JWT personalizzata con fallback sessioni
- **Tipi Utente**: Utenti standard e Informatori (rappresentanti vendite farmaceutici)
- **Accesso Basato su Ruoli**: Ruoli admin, manager e user con protezione a livello route
- **Gestione Sessioni**: Sessioni Express con storage PostgreSQL per affidabilità

### Organizzazione Codice
- **Struttura Monorepo**: Schemi TypeScript condivisi tra client e server
- **Path Aliases**: Configurati per import puliti (@/ per client, @shared per codice condiviso)
- **Type Safety**: TypeScript end-to-end con schemi validazione Zod
- **Architettura Componenti**: Componenti UI riusabili con pattern design consistenti

## Dipendenze Esterne

### Database e Infrastruttura
- **PostgreSQL**: Database primario (provider consigliati: Neon, Supabase, Railway, ElephantSQL)
- **Neon Database**: PostgreSQL serverless con client @neondatabase/serverless per scalabilità automatica

### UI e Design System
- **Radix UI**: Set completo di primitive UI (@radix-ui/react-*) per accessibilità e usabilità
- **Tailwind CSS**: Framework CSS utility-first con design token personalizzati
- **Lucide React**: Libreria icone per iconografia consistente e moderna

### Integrazioni Terze Parti
- **Google Cloud Storage**: Storage e gestione file (@google-cloud/storage) per assets scalabili
- **Uppy**: Gestione upload file (@uppy/core, @uppy/dashboard, @uppy/aws-s3) con interfaccia moderna

### Strumenti Sviluppo
- **Ottimizzazioni Ambiente Sviluppo**: Ottimizzazioni ambiente sviluppo e gestione errori
- **ESBuild**: Bundling veloce per build produzione con tree shaking
- **TSX**: Esecuzione TypeScript per server sviluppo con hot reload

### API e Servizi Esterni
- **Integrazione eBay**: Elaborazione ordini automatica dal marketplace eBay
- **Gestline**: Integrazione sistema ERP per gestione ordini centralizzata
- **Odoo**: Integrazione software gestione business completo
- **GLS**: Integrazione provider spedizioni e logistica per tracking
- **PharmaEVO**: Integrazioni specifiche industria farmaceutica
- **IQVIA Data**: Integrazione analytics dati healthcare per insights
- **Email e WhatsApp**: Sistemi automazione comunicazione multicanale

### Analytics e Monitoraggio
- **Recharts**: Libreria visualizzazione dati per dashboard analytics interattive
- **Tracciamento Commissioni**: Calcolo e reportistica automatica per rappresentanti vendite
- **Log Attività**: Audit trail completo per tutte le operazioni sistema con tracciabilità

## Configurazione Ambiente

### Installazione Dipendenze
```bash
npm install
```

### Configurazione Variabili Ambiente
```bash
# Copia il template configurazione
cp .env.example .env
```

### Setup Database
Configura il tuo DATABASE_URL nel file `.env`:
```env
DATABASE_URL=postgresql://username:password@host:5432/database
```

### Esecuzione Migrazioni
```bash
npx drizzle-kit push
```

### Avvio Applicazione
```bash
# Ambiente sviluppo
npm run dev

# Build produzione
npm run build

# Avvio produzione
npm start
```

## Struttura Progetto

```
WikenFarma/
├── client/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/  # Componenti UI riusabili
│   │   ├── pages/      # Pagine applicazione
│   │   ├── hooks/      # Hook personalizzati React
│   │   └── lib/        # Utility e configurazioni
├── server/          # Backend Express + TypeScript
│   ├── routes.ts    # Definizioni route API
│   ├── storage.ts   # Interfaccia database
│   └── index.ts     # Server principale
├── shared/          # Schemi condivisi (Zod + Drizzle)
│   └── schema.ts    # Definizioni schema database
├── .env            # Variabili ambiente (da configurare)
└── package.json    # Dipendenze Node.js
```

## Funzionalità Principali

### Gestione Core Business
- ✅ **Sistema Autenticazione**: JWT personalizzato con gestione sessioni sicura
- ✅ **Database PostgreSQL**: ORM Drizzle per operazioni type-safe e performanti
- ✅ **Gestione Clienti**: Database completo farmacie, grossisti, medici con CRM integrato
- ✅ **Sistema Ordini**: Gestione ordini completa con workflow approvazione e tracking

### Logistica e Spedizioni
- ✅ **Gestione Spedizioni**: Integrazione corrieri con tracking automatico
- ✅ **Gestione Inventario**: Controllo stock con alert automatici e riordino
- ✅ **Integrazione WIKENSHIP**: Connessione WooCommerce/eBay per vendite online

### Analytics e Reporting
- ✅ **Dashboard Analytics**: Metriche business avanzate con visualizzazioni interattive
- ✅ **Sistema Commissioni ISF**: Calcolo automatico compensi informatori scientifici
- ✅ **Reports Medici**: Generazione e condivisione report personalizzati

### Integrazioni Esterne
- ✅ **Gestline/Odoo**: Sincronizzazione dati ERP per gestione unificata
- ✅ **PharmaEVO**: Bridge per ordini farmacie con protocolli settore
- ✅ **Multi-marketplace**: Gestione vendite eBay, Amazon, marketplace farmaceutici

## Supporto e Documentazione

Per supporto tecnico o domande sul sistema, consultare la documentazione interna o contattare il team di sviluppo.

## Licenza

Progetto proprietario - Tutti i diritti riservati.