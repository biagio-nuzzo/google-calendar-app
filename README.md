# Google Calendar Integration (React + Vite + TypeScript + Tailwind)

Applicazione frontend che effettua il login con Google (Google Identity Services) e permette di leggere gli ultimi 10 eventi dal calendario primario dell'utente tramite le Google Calendar API.

## Requisiti

- Node.js 18+ e npm
- Un Client ID OAuth 2.0 per applicazioni web creato su Google Cloud Console

## Setup

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. Crea un file `.env` nella radice del progetto con il tuo Client ID:

   ```bash
   VITE_GOOGLE_CLIENT_ID=la-tua-client-id.apps.googleusercontent.com
   ```

3. Avvia il dev server:

   ```bash
   npm run dev
   ```

4. Apri il browser su l'URL indicato (es. http://localhost:5173), premi **Login con Google** e poi **Carica eventi** per ottenere gli ultimi meeting.

## Note sull'integrazione Google

- Lo scope utilizzato è `https://www.googleapis.com/auth/calendar.readonly`.
- Nell'OAuth consent screen aggiungi `http://localhost:5173` tra gli URI autorizzati (o il dominio di deploy).
- L'applicazione usa solo il frontend: il token viene richiesto e usato direttamente per chiamare la Calendar API.

## Script disponibili

- `npm run dev` — avvia il server di sviluppo Vite
- `npm run build` — build di produzione
- `npm run preview` — anteprima della build
