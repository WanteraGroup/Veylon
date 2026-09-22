# Veylon

AI weboldal-generátor. A megrendelő beírja egy mondatban, mit szeretne — a platform megtervezi, felépíti és kirajzolja a kész oldalt.

Nem sablon: a szövegek, a színek, a betűtípusok és a szekciók mind a briefből származnak.

## Folyam

```
brief ──► vey-generate (Edge Function) ──► blokklista ──► SitePreview
```

Egy hívás, egy dokumentum. A generálás a Supabase Edge Functionben fut, a kulcs szerveroldalon marad.

## Stack

Vite + React 18 + TypeScript + Tailwind. Egy Edge Function (`vey-generate`), egy külső szolgáltatás a modellhez (Groq).

## Indítás

```bash
npm install
cp .env.example .env
npm run dev
```

## Az Edge Function telepítése

```bash
supabase link --project-ref ovbzoxwwurklwawdvudf
supabase secrets set GROQ_API_KEY=...
supabase functions deploy vey-generate
```

## Felépítés

```
src/
  pages/Home.tsx              a brief mező, a generálás és az eredmény
  components/SitePreview.tsx  a blokklista renderelője
  lib/api.ts                  a generátor hívása
  lib/site-schema.ts          a blokklista típusai és a parse
functions/vey-generate/       az Edge Function
```

## Miért blokklista, és nem HTML

A modell **blokklistát** ad vissza, nem markupot. A renderelő birtokol minden elemet, ami a lapra kerül, tehát a generált szöveg mindig szöveges csomópont — soha nem HTML. A `parseSite` kidobja az allow-listen kívüli blokktípusokat, így egy félig hibás válasz rövidebb oldalt ad, nem hibát dob.

Engedélyezett blokktípusok: `hero`, `features`, `about`, `services`, `pricing`, `gallery`, `testimonials`, `faq`, `contact`, `cta`, `footer`.

## A prompt

A rendszer-prompt a `functions/vey-generate/index.ts`-ben él, szerveroldalon — a böngészőből nem átírható. Ez a szabály, ami a használható eredményt a generikustól elválasztja.
