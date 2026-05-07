# Resume Builder Local Desktop-Style Deployment

This project is set up to run as a production-style localhost application on Windows. The React frontend is built once, served by Express from `build/`, and the backend runs under PM2 on `http://localhost:5000`.

## Folder layout

```text
my-app/
├── backend/
├── frontend/
├── build/
├── database/
│   └── schema.sql
├── ecosystem.config.js
├── install.bat
├── start.bat
├── .env.example
└── README.md
```

## One-click setup

1. Make sure Node.js and MySQL are already installed and available on `PATH`.
2. If you already have working backend credentials in `backend/.env`, `install.bat` will reuse them automatically.
3. Otherwise, copy `.env.example` to `.env` and fill in your MySQL settings.
4. Run `install.bat`.

`install.bat` performs the full local production setup:

- Installs backend dependencies
- Installs frontend dependencies
- Builds the React app
- Copies the production build into `build/`
- Installs PM2 globally if needed
- Applies `database/schema.sql`
- Starts the app with PM2
- Saves the PM2 process list
- Creates a Windows startup task for PM2 restore
- Opens `http://localhost:5000`

## Manual restart

Use `start.bat` if you want to restart the app manually after installation.

## Runtime details

- Backend host: `127.0.0.1`
- Backend port: `5000`
- Frontend delivery: static files served by Express
- Database bootstrap: `backend/scripts/run-schema.js`
- PM2 process name: `resume-builder`
- PM2 state folder: `.pm2/`
- Logs directory: `backend/logs/`

## Important files

- Backend server: [backend/src/server.js](/d:/VtechOffical/Resume_builder/backend/src/server.js)
- Database config: [backend/src/database.js](/d:/VtechOffical/Resume_builder/backend/src/database.js)
- PM2 config: [ecosystem.config.js](/d:/VtechOffical/Resume_builder/ecosystem.config.js)
- Install script: [install.bat](/d:/VtechOffical/Resume_builder/install.bat)
- Start script: [start.bat](/d:/VtechOffical/Resume_builder/start.bat)
- Schema: [database/schema.sql](/d:/VtechOffical/Resume_builder/database/schema.sql)

## Environment variables

The app loads root `.env` first, then falls back to `backend/.env` if present.

Key variables:

- `HOST=127.0.0.1`
- `PORT=5000`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `PDF_TIMEOUT`

## Logging

Application and PM2 logs are written to `backend/logs/`:

- `access.log`
- `app.log`
- `error.log`
- `pm2-out.log`
- `pm2-error.log`

## Notes

- The install flow is designed for Windows only.
- The app binds to localhost only and does not expose itself on the network.
- The schema includes `users`, `resumes`, `download_requests`, and `activity_logs`.
- The startup task tries `ONSTART` first and falls back to `ONLOGON` if Windows blocks the system-level task.
