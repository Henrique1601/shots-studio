# 📸 Shots Studio (Clone Oficial Shots.so)

Aplicativo web completo de criação e customização de mockups 3D de alta fidelidade para capturas de tela, dispositivos móveis e redes sociais, inspirado e engenheirado a partir do [Shots.so](https://shots.so/).

---

## ✨ Funcionalidades Principais

- **Dual Sidebars Flutuantes (228px):** Design system exato do Shots.so com carrossel suave entre os modos `Mockup` e `Frame`.
- **Zero Scrollbars:** Visual 100% desktop app com rolagem nativa invisível.
- **Cenários 3D (3D Shapes Scene):** Elementos geométricos tridimensionais volumétricos com profundidade de campo (*depth-of-field blur*) e reflexos iridescentes.
- **Fórmula Quádrupla de Sombras:** Difusão suave idêntica à do Shots.so (`Spread`, `Hug`, `Adaptive`).
- **Command Bar com 7 Ações:** Suporte a Undo (`Ctrl + Z`), Redo (`Ctrl + Y`), Randomize/Shuffle, Start Over, Fullscreen, Feedback e Performance Mode.
- **Formatos e Resoluções Pro:** Exportação client-side com suporte a `PNG`, `JPEG`, `WebP` em resoluções `FHD (1x)`, `4K (2x)` e `6K (3x)`.
- **Presets de Redes Sociais:** `Post (1:1)`, `Portrait (4:5)`, `Story (9:16)`, `Tweet (16:9)`, `Cover (3:1)`, `Banner (16:9)`, `Shot (4:3)`.

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Lucide Icons
- **Estado Global:** Zustand
- **Renderização de Canvas:** html-to-image + Canvas Confetti
- **Deploy:** Vercel

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/Henrique1601/shots-studio.git

# Acesse o diretório
cd shots-studio

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
