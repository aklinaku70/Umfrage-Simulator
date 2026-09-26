# 📞 Callcenter Simulator — Cold Call Trainer (Gjermanisht)

Aplikacion web për të praktikuar **cold calls** në gjermanisht, si në një call
center real: zgjedh një klient nga lista, "e thërret", lexon skriptin me radhë
dhe dëgjon përgjigjen e klientit (të simuluar me zë — Text-to-Speech).

Ndërtuar me **Next.js (App Router)**, **React**, **Tailwind CSS** dhe
**Prisma + SQLite**.

## ✨ Çka përmban

- 🔐 **Regjistrim / Kyçje / Dalje** — fjalëkalimet ruhen të enkriptuara (bcrypt).
- 🍪 **Sesione me cookie HTTP-only** — përdoruesi mbetet i kyçur në mënyrë të sigurt.
- 🛡️ **Dashboard i mbrojtur** — `/dashboard` hapet vetëm nëse je i kyçur (kontrollohet me `middleware.js`).
- ☎️ **Simulator i thirrjeve**:
  - 15 klientë të ndryshëm (emri, mbiemri, numri, adresa) — disa refuzojnë menjëherë
    ("mos telefononi më"), disa nuk përgjigjen, disa e plotësojnë anketën.
  - Fusha për të shkruar numrin e telefonit para se të thirret.
  - Skripti (4 pyetjet e verës + mbiemri/emri i shkronjëzuar + mbyllja) me
    butona **CHECK** që duhen shtypur me radhë.
  - Zëri i klientit simulohet me **Web Speech API** (gjermanisht, `de-DE`).
  - Transkript i bisedës + historik i rezultateve për çdo klient.

## 🧰 Teknologjitë

- [Next.js 16](https://nextjs.org/) (App Router, Route Handlers, Middleware)
- React 19 + Tailwind CSS 4
- Prisma ORM + SQLite (lokalisht; mund të kalohet lehtë në PostgreSQL)
- `bcryptjs` për hash të fjalëkalimeve
- `jose` për token-a JWT të sesionit

## ✅ Parakushtet

- [Node.js](https://nodejs.org/) versioni **18.18** ose më i ri (rekomandohet 20+)
- `npm` (vjen bashkë me Node.js)

## 🚀 Instalimi dhe ekzekutimi lokal

```bash
# 1. Klono repository-n
git clone https://github.com/<username-juaj>/<repo-name>.git
cd <repo-name>

# 2. Instalo dependencat (kjo gjeneron edhe Prisma Client automatikisht,
#    falë skriptit "postinstall")
npm install

# 3. Kopjo skedarin e variablave të mjedisit
cp .env.example .env
# (opsionale) hap .env dhe ndrysho JWT_SECRET me një varg sekret të gjatë e rastësor

# 4. Krijo databazën SQLite lokale sipas schema-s Prisma
npm run db:push

# 5. Nis serverin e zhvillimit
npm run dev
```

Hap [http://localhost:3000](http://localhost:3000) — do të ridrejtohesh te
`/login`. Kliko **Regjistrohu**, krijo një llogari, dhe do të hysh
automatikisht në `/dashboard` ku gjendet simulatori.

> 💡 **Zëri i klientit** përdor Web Speech API të browser-it (funksionon më
> mirë në **Chrome** ose **Edge**; Safari/Firefox mund të kenë zëra gjermanë
> më të kufizuar ose mungojnë fare).

## 🏗️ Build për prodhim

```bash
npm run build
npm run start
```

## 📁 Struktura e projektit

```
callcenter-simulator/
├── app/
│   ├── api/auth/           # route handlers: register, login, logout
│   ├── dashboard/          # faqja e mbrojtur me simulatorin
│   ├── login/, register/   # format e autentifikimit
│   ├── layout.js, page.js
│   └── globals.css
├── components/
│   ├── CallSimulator.jsx   # logjika kryesore e thirrjes (dialer, skript, TTS)
│   ├── ClientList.jsx      # lista e 15 klientëve
│   └── LogoutButton.jsx
├── data/
│   ├── clients.js          # 15 klientët e simuluar
│   └── script.js           # hapat e skriptit + "motori" i përgjigjeve
├── lib/
│   ├── auth.js             # hash fjalëkalimesh, JWT sesionesh, cookie
│   ├── prisma.js           # Prisma Client singleton
│   └── tts.js              # Web Speech API helper
├── middleware.js           # mbron /dashboard, /login, /register
├── prisma/schema.prisma    # modeli i databazës (User)
└── .env.example
```

## 🔧 Kalimi nga SQLite në PostgreSQL (opsionale)

Në `prisma/schema.prisma` ndrysho:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

dhe vendos `DATABASE_URL` në `.env` me connection string-un e PostgreSQL, pastaj:

```bash
npm run db:push
```

## 📤 Publikimi në GitHub

```bash
git init
git add .
git commit -m "Callcenter simulator - fillimi"
git branch -M main
git remote add origin https://github.com/<username-juaj>/<repo-name>.git
git push -u origin main
```

`.env` dhe databaza SQLite (`prisma/*.db`) janë tashmë në `.gitignore`, pra
nuk do të publikohen (vetëm `.env.example` publikohet, si shabllon).

## 📝 Skripti i thirrjes (referencë)

1. Hapja: *"Guten Tag, entschuldigen Sie die Störung, ich habe 4 Fragen für
   Sie, es dauert 20 Sekunden."*
2. 4 pyetjet mbi ushqimin/verën (kuzhina, mishi/peshku/vegjetarian,
   verë e kuqe/e bardhë/rosé, verë e lehtë/e rëndë)
3. Mbiemri + shkronjëzimi, Emri + shkronjëzimi
4. Mbyllja: *"Als Dankeschön bekommen Sie noch einen Anruf von uns! Vielen
   Dank für Ihre Zeit."*

## 📄 Licenca

Projekt praktik/edukativ — përdore lirshëm dhe ndrysho sipas nevojës.
