# Nexus

Assistant IA local — 100% gratuit, 100% privé.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Ollama** — modèles locaux (llama3.2, mistral...)
- **Tauri** — app desktop macOS/Windows/Linux

## Prérequis

- [Ollama](https://ollama.com) installé et en cours d'exécution
- Node.js 18+
- Rust (pour Tauri)

## Setup

```bash
# 1. Clone & install
git clone https://github.com/ahmvdd/nexus-chat
cd nexus-chat
npm install

# 2. Télécharge un modèle Ollama
ollama pull llama3.2

# 3. Lance en mode web
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## App desktop (Tauri)

```bash
# Dev
npm run tauri:dev

# Build
npm run tauri:build
```

L'app `.app` sera générée dans `src-tauri/target/release/bundle/macos/`.

## Structure

```
nexus-chat/
├── app/
│   ├── api/chat/route.ts    # Proxy Ollama (mode web)
│   ├── page.tsx             # Page principale
│   └── globals.css
├── components/
│   ├── Sidebar.tsx          # Nav + sélecteur de modèle
│   ├── WelcomeScreen.tsx    # Écran d'accueil
│   ├── MessageBubble.tsx    # Messages + markdown
│   └── InputArea.tsx        # Zone de saisie
├── src-tauri/               # Config Tauri (desktop)
└── types/index.ts
```

## Prochaines features

- [ ] Persistance des conversations (localStorage)
- [ ] Support de tous les modèles Ollama installés
- [ ] Upload de fichiers (RAG)
- [ ] Export des conversations en markdown
