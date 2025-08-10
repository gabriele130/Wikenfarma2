# Script PowerShell per installare tutte le dipendenze WikenFarma

Write-Host "Installazione dipendenze WikenFarma..." -ForegroundColor Green

# Dipendenze principali
npm install express@4.21.2 @tanstack/react-query@5.60.5 wouter@3.3.5 react-hook-form@7.55.0 @hookform/resolvers@3.10.0 zod@3.24.2

# Utility e styling
npm install clsx@2.1.1 tailwind-merge@2.6.0 class-variance-authority@0.7.1 lucide-react@0.453.0 tailwindcss-animate@1.0.7

# Charts e data visualization
npm install recharts@2.15.2

# Database
npm install drizzle-orm@0.39.1 drizzle-zod@0.7.0 @neondatabase/serverless@0.10.4

# Authentication
npm install express-session@1.18.1 passport@0.7.0 openid-client@6.6.2

# Radix UI components
npm install @radix-ui/react-accordion@1.2.4 @radix-ui/react-alert-dialog@1.1.7 @radix-ui/react-avatar@1.1.4 @radix-ui/react-checkbox@1.1.5 @radix-ui/react-dialog@1.1.7 @radix-ui/react-dropdown-menu@2.1.7 @radix-ui/react-label@2.1.3 @radix-ui/react-popover@1.1.7 @radix-ui/react-select@2.1.7 @radix-ui/react-separator@1.1.3 @radix-ui/react-slot@1.2.0 @radix-ui/react-tabs@1.1.4 @radix-ui/react-toast@1.2.7

# Dev dependencies types
npm install -D @types/express@4.17.21 @types/express-session@1.18.0 @types/passport@1.0.16 drizzle-kit@0.30.4

Write-Host "Installazione completata!" -ForegroundColor Green