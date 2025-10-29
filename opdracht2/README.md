# Opdracht 2 — Hybride app (Ionic + Vue)

Dit repository bevat de opgave voor de Individuele Oefening — Hybride app.

Checklist / instructies

- [ ] Zorg dat `src/services` de API-client bevat (axios wrapper) en services voor `concerts`, `visitors`, `tickets`.
- [ ] Implementeer CRUD-schermen voor Concerten en Bezoekers.
- [ ] Maak een aankoopflow voor Tickets (meerdere tickets per bezoeker).
- [ ] Voeg `src/views/AboutPage.vue` toe met profielfoto en korte toelichting (al aanwezig).
- [ ] Voeg `demo/` toe met demo-video en `app-debug.apk`.
- [ ] Maak regelmatige commits en deel de repo met de docent (uitnodiging niet ouder dan 7 dagen).

Hoe te gebruiken (dev):

1. Installeer dependencies

```powershell
cd c:\werkenmetionicenvue\opdracht2
npm install
```

2. Start dev server

```powershell
npm run dev
# open http://localhost:5173
```

3. Build en maak een debug APK (Capacitor + Android)

```powershell
npm run build
npx cap sync android
# open Android Studio or run gradlew to build the debug apk
```

Aanvullende info

- Zie `demo/README.md` voor hoe je de demo video toevoegt.
- Voeg in de root een `readme.md` met eventuele extra's die je wilt dat de docent bekijkt.

