# 🎨 FrameCraft Studio — Mockup Generator 3D

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-65%20Passing-brightgreen?style=for-the-badge)](package.json)
[![SEO](https://img.shields.io/badge/SEO-Lighthouse%2090%2B-orange?style=for-the-badge)](src/app/sitemap.ts)
[![Security](https://img.shields.io/badge/OWASP-Secured-darkgreen?style=for-the-badge)](next.config.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> Estúdio web moderno e profissional para criação de mockups 3D de alta fidelidade para apresentações, redes sociais, portfólios e páginas de produto.

🔗 **Demonstração ao Vivo:** [https://framecraft.app](https://framecraft.app)  
📦 **Repositório Oficial:** [https://github.com/Henrique1601/shots-studio](https://github.com/Henrique1601/shots-studio)

---

## 🎯 Por que o FrameCraft Studio?

O **FrameCraft Studio** reproduz a experiência completa de desktop app diretamente no navegador:
1. **Zero Scrollbars:** Visual de software nativo com rolagem fluida e sem barras de rolagem cinzas visíveis.
2. **Auto-Contain Inteligente:** Cálculo dinâmico entre o aspecto do frame e do mockup que garante que capturas de tela verticais, panorâmicas e fotos de celulares **nunca vazem para fora da tela**.
3. **Dispositivos Fotorrealistas:** Modelos com recortes milimétricos de visor (*screen cutouts*) e máscaras SVG oficiais da Apple para cantos curvos e recortes de tela.
4. **Layout Responsivo com Mobile Drawer:** Experiência dedicada em smartphones com dock flutuante inferior e gaveta deslizante (*Bottom Sheet*) sem espremer o canvas.
5. **Multi-Slide Carousel & Batch ZIP:** Crie sequências completas de slides e exporte todas de uma só vez.

---

## ✨ Recursos & Funcionalidades

### 📱 Dispositivos e Molduras Fotorrealistas (100% Calibrados)
- **Calibração Subpixel Perfeita:** Recortes milimétricos com zero sangramento de fundo (*zero background bleed*).
- **iPhone 17 & iPhone 16 Pro:** Proporção 1508 × 3278 com Dynamic Island e máscara SVG de display com cantos curvos.
- **MacBook Pro 16:** Tampa de alumínio, base de teclado, proporção 4893 × 3164 e recorte milimétrico perfeito.
- **iPad Pro 13:** Borda ultrafina simétrica e display 2048 × 3415.
- **Apple Watch Ultra:** Caixa de titânio robusta e visor calibrado.
- **Minimal Desktop:** Janela moderna 16:10 com botões de controle de janela nativos e título dinâmico.
- **Screenshot & Browser:** Molduras configuráveis com estilos *Glass Dark*, *Glass Light*, *Liquid Glass*, *Inset Light*, *Inset Dark*, *Border* e *Outline*, com barra de URL/Título totalmente personalizável.

### 🎨 Backgrounds e Cenários 3D (Ultra-HD 4K)
- **Gradients Oficiais:** Paleta de gradientes vibrantes (*FrameCraft Official, Sunset Glow, Pastel Dream, Sky Coral, Mint Punch, Cosmic, Hyper Violet, Aurora Borealis, Midnight Obsidian, Cyberpunk Neon, Hyperion Gold*).
- **Paper Glass Textures (Ultra-HD):** Fundos de vidro prismático vetorial com refração e ruído iridescente (*Prism Glass, Frosted Silk, Obsidian Glass, Liquid Cyber, Aurora Glass*).
- **macOS Tahoe & Landscape 4K:** Fotografias e paisagens em altíssima resolução 2560px Retina (*Tahoe Valley 4K, Sierra Night 4K, Alpine Mist 4K, Pacific Horizon 4K*).
- **Cores Sólidas:** Fundos minimalistas de alto contraste (*Deep Black, Studio Dark, Cyber Slate, Clean White*).
- **3D Shapes Scene (7 Packs em Resolução Completa):** Modelos volumétricos 3D descompactados em 4K (*Glass Blue, Glass Pink, Metal 3D, Dark Metal, Light Metal, Inflatable, Plushy*) com 6 layouts espaciais (*Corners, Cluster, Diagonal, Orbit, Cascade, Framing*).

### 🗄️ "Meus Frames" — Biblioteca Local com Dexie (IndexedDB)
- **Persistência Completa sem Login:** Salve suas composições com 1 clique direto no navegador.
- **Gerenciador de Projetos:** Reabra, renomeie e continue editando projetos anteriores instantaneamente.

### 🎬 Presets de Animação 3D, Video Timeline & Exportação WebM
- **Exportação de Vídeo (.webm):** Gravação nativa a 30 FPS diretamente no browser sem servidor.
- **Presets Cinematográficos em Tempo Real:** *Float*, *Spin 3D (Turntable)*, *Breathe (Pulse)*, *Orbit*.
- **Linha do Tempo Interativa:** Play/Pause com timer em décimos de segundo (`0:00.0 / 0:05.0`), barra de progresso deslizável (*scrubber*) e modo Loop.

### ⚡ Exportação Client-Side de Alta Resolução
- Formatos: **PNG**, **JPEG**, **WebP**, **GIF animado**, **Vídeo WebM**, **Lote ZIP**.
- Qualidade: **FHD (1x)**, **4K (2x)**, **6K (3x)** com cálculo dinâmico da resolução final em pixels.
- Animação de confetes ao concluir o download.
- Botão de cópia direta para a área de transferência (*Copy to Clipboard*).

---

## ⌨️ Atalhos de Teclado Universais

| Atalho | Ação |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>V</kbd> / <kbd>Cmd</kbd> + <kbd>V</kbd> | Colar imagem da área de transferência com auto-ajuste de aspecto |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Cmd</kbd> + <kbd>Z</kbd> | Desfazer última alteração (*Undo*) |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Refazer alteração (*Redo*) |
| <kbd>D</kbd> | Abrir modal de seleção de dispositivos |
| <kbd>T</kbd> | Abrir catálogo de templates |
| <kbd>1</kbd> | Alternar para aba Mockup |
| <kbd>2</kbd> | Alternar para aba Frame |
| <kbd>Ctrl</kbd> + <kbd>E</kbd> | Exportação rápida do mockup |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | Limpar/remover a imagem atual do mockup |
| <kbd>Esc</kbd> | Fechar modais de seleção de dispositivos ou gavetas |

---

## 🏛️ Arquitetura do Projeto

```text
shots-app/
├── public/
│   └── shots-assets/        # Recursos gráficos, devices e texturas
│       ├── 3d-shapes/       # Formas volumétricas 3D iridescentes
│       ├── devices/         # Bezels PNG transparentes e máscaras SVG
│       └── noise.svg        # Efeito de granulação de filme (VFX Noise)
├── src/
│   ├── app/
│   │   ├── globals.css      # Regras de scrollbar invisível e glassmorphism
│   │   ├── layout.tsx       # Root layout com fontes Inter / Geist
│   │   └── page.tsx         # Workspace principal com ouvintes de teclado
│   ├── components/
│   │   ├── DeviceModal.tsx     # Modal com catálogo filtrável de dispositivos
│   │   ├── LeftSidebar.tsx     # Painel flutuante de 228px (Mockup & Frame)
│   │   ├── MobileDrawer.tsx    # Dock e Bottom Sheet deslizante para celulares
│   │   ├── MockupCanvas.tsx    # Motor de renderização com Auto-Contain 3D
│   │   ├── RightSidebar.tsx    # Spatial Pad 3D, Presets e Exportação
│   │   ├── ToastContainer.tsx  # Sistema de notificações flutuantes
│   │   ├── TopBar.tsx          # Command Bar (7 ações) + Resolução dinâmica
│   │   └── VideoTimeline.tsx   # Linha do tempo de animação
│   ├── store/
│   │   └── mockupStore.ts   # Estado global Zustand com histórico de Undo/Redo
│   ├── types/
│   │   └── mockup.ts        # Interfaces tipadas e especificações de dispositivos
│   └── lib/
│       ├── db.ts            # Dexie IndexedDB (FrameCraftStudioDB)
│       └── projectBundle.ts # Formato exportável .framecraft
└── package.json
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Gerenciador de pacotes `npm` ou `pnpm`

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Henrique1601/shots-studio.git

# 2. Acesse a pasta do projeto
cd shots-studio/shots-app

# 3. Instale as dependências
npm install

# 4. Execute a suíte de testes automatizados (65 testes em 14 suítes)
npm test

# 5. Inicie o servidor de desenvolvimento com Turbopack
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Testes Automatizados & Qualidade (QA)

O projeto possui uma suíte de testes de alta performance desenvolvida com o runner nativo do Node.js:
- **Cálculo de Aspect Ratio & Auto-Contain:** Validação matemática de enquadramento inteligente e proporções sociais/padrão.
- **Fórmulas de Sombra FrameCraft:** Validação dos modos *none*, *spread*, *hug* e a sombra de 4 camadas *adaptive*.
- **Integridade de Presets & Devices:** Verificação de todos os specs físicos, `screenBounds` e gradientes lineares.
- **Formato .framecraft Bundle:** Validação de integridade e exportabilidade de projetos.

Para rodar os testes:
```bash
npm test
```

---

## 🛡️ Segurança & Headers OWASP

Configurado em `next.config.ts`:
- **X-Frame-Options:** `SAMEORIGIN` contra clickjacking.
- **X-Content-Type-Options:** `nosniff` contra MIME-sniffing.
- **Referrer-Policy:** `strict-origin-when-cross-origin`.
- **Permissions-Policy:** Bloqueio estrito de câmera, microfone e geolocalização.
- **Next.js Turbopack Optimization:** `optimizePackageImports` para pacotes pesados (`lucide-react`, `framer-motion`).

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

Desenvolvido por **[Henrique Bezerra Dos Santos](https://github.com/Henrique1601)**.
