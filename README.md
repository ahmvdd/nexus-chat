# Nexus Chat 🔥

Un LLM chat personnel avec streaming, built avec Next.js 14 + Vercel AI SDK + Anthropic.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel AI SDK** — streaming token par token
- **Anthropic** — claude-sonnet-4-6 / claude-haiku-4-5

## Setup

```bash
# 1. Clone & install
git clone https://github.com/ton-username/nexus-chat
cd nexus-chat
npm install

# 2. Config env
cp .env.local.example .env.local
# Ajoute ta clé Anthropic dans .env.local

# 3. Lance
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Structure

```
nexus-chat/
├── app/
│   ├── api/chat/route.ts    # Streaming endpoint
│   ├── page.tsx             # Page principale
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Sidebar.tsx          # Nav + conversations
│   ├── WelcomeScreen.tsx    # Écran d'accueil (hero cosmique)
│   ├── MessageBubble.tsx    # Bulles de messages + markdown
│   └── InputArea.tsx        # Zone de saisie
├── lib/utils.ts
└── types/index.ts
```

## Deploy

```bash
# Vercel (recommandé)
npx vercel

# Ajoute ANTHROPIC_API_KEY dans les env vars Vercel
```

## Prochaines features

- [ ] Streaming amélioré avec curseur
- [ ] Persistance des conversations (localStorage → DB)
- [ ] Upload de fichiers
- [ ] Plusieurs assistants avec system prompts custom
- [ ] Export des conversations
