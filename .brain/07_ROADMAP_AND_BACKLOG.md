# 🚀 07_ROADMAP_AND_BACKLOG.md — Roadmap Estratégico & Backlog de Engenharia

Planejamento estratégico de evolução para o **Shots Studio**, consolidado pela mesa diretora do **`global-master-agent`** com foco em engenharia de excelência, paridade 1:1, performance de 60fps e acabamento de estúdio nível Apple/Linear.

---

## 📅 Roadmap de Versões

### 🟢 Fase 1: Paridade Visual & Estúdio Essencial (Concluída - v1.0.0-elite)
- [x] Design System fiel ao Shots.so com dark theme exclusivo.
- [x] 12 Estilos oficiais em grid de 4 colunas (Default, Glass Light/Dark, Liquid Glass, Inset Light/Dark, Outline, Border, Retro, Card, Stack, Stack 2).
- [x] Catálogo completo de aparelhos incluindo iPhone 17 e iPhone 17 Air com Dynamic Island.
- [x] Pad 3D interativo com captura de rotação física e reset via Custom Layout e duplo-clique.
- [x] Fórmulas de sombra multi-camada adaptativa e ajuste de luz especular.
- [x] Carrossel multi-slide com download em ZIP em até 6K.
- [x] Linha do tempo de animação integrada (Turntable, Float, Pulse, Orbit).
- [x] Card DETAILS no rodapé do Mockup com resolução em tempo real.
- [x] Eliminação de 100% das barras de rolagem nativas visíveis.
- [x] 61 testes automatizados cobrindo fórmulas matemáticas e specs.

---

### 🟢 Fase 1.2: Refatoração Arquitetural & Modularização (Concluída)
- [x] **LeftSidebar.tsx**: Desacoplado de 2.549 para 85 linhas (atuando estritamente como orquestrador).
- [x] **MockupTab.tsx**: Sub-componente isolado (762 linhas) para seleção de aparelho, estilos, bordas, sombras e luz.
- [x] **FrameTab.tsx**: Sub-componente isolado (1.109 linhas) para proporções, dimensões WxH e paletas 4K.
- [x] **MiniSidebars.tsx**: Sub-componente isolado (718 linhas) para as 5 mini-sidebars flutuantes (VFX, Lighting, Watermark, Shapes).
- [x] **useCanvasOrbit.ts**: Custom hook (86 linhas) para captura de ponteiro, rotação 3D com tecla Shift e reset.
- [x] **CanvasOverlays.tsx**: Sub-componente isolado (216 linhas) para camadas atmosféricas e anotações.
- [x] **src/constants/presets.ts & shapes.ts**: Separação total de tipos TypeScript e dados estáticos.

---

### 🟡 Fase 2: Excelência de Código, Performance & Engenharia (v1.3.0 - Backlog Ativo)

#### 1. 🧱 Modularização & Clean Architecture
- [ ] **Desacoplar `useExportStudio.ts` de `TopBar.tsx`**:
  - Extrair os 4 pipelines de exportação (`handleExport`, `handleExportVideo`, `handleExportGif`, `handleExportAllSlidesZip`) para um custom hook dedicado `src/hooks/useExportStudio.ts`.
  - Reduzir `TopBar.tsx` de 647 para menos de 180 linhas puramente declarativas.
- [ ] **Desacoplar `DeviceFrameRenderer.tsx` de `MockupCanvas.tsx`**:
  - Isolar a renderização física dos chassis metálicos (Pixel 9 Pro, iMac 24", Ultrawide, Foldable, iPhone 17) em `src/components/canvas/DeviceFrameRenderer.tsx`.
  - Reduzir `MockupCanvas.tsx` para menos de 300 linhas focadas no container espacial e drag & drop.
- [ ] **Modularizar `DeviceModal.tsx` (559 linhas)**:
  - Criar `DeviceCategoryNav.tsx` e `DeviceCard.tsx` com animações suaves de entrada (stagger children).

#### 2. ⚡ Performance Extrema & Render em Background
- [ ] **OffscreenCanvas & Background Processing**:
  - Mover gravação de vídeo/GIF para `OffscreenCanvas` com Web Workers, garantindo que o render 4K não bloqueie a thread principal da UI (mantendo 60fps constantes).
  - Suporte a compressão client-side em WebP com taxa de compressão configurável.
- [ ] **Lazy Loading & Preloading de Modelos e Ativos 3D**:
  - Implementar prefetch inteligente dos assets de 3D Shapes e device frames mais populares para eliminar delay ao alternar dispositivos.

#### 3. ⌨️ Atalhos de Teclado Globais & Histórico (Undo / Redo)
- [ ] **Global Keyboard Shortcuts Engine**:
  - `D`: Abre modal de aparelhos (*DeviceModal*).
  - `T`: Abre galeria de templates (*TemplatesModal*).
  - `1` / `2`: Alterna instantaneamente entre tabs Mockup e Frame.
  - `Ctrl/Cmd + E`: Dispara exportação rápida da imagem atual.
  - `Ctrl/Cmd + C`: Copia mockup renderizado em PNG direto para a área de transferência (`ClipboardItem API`).
  - `Espaço + Arrastar`: Modo Pan para navegar em telas ampliadas com zoom.
- [ ] **Histórico Temporal (Undo / Redo)**:
  - Adicionar middleware `temporal` do Zustand no `mockupStore.ts` com suporte nativo a `Ctrl + Z` e `Ctrl + Shift + Z`.

#### 4. 🧪 QA & Testes End-to-End (Playwright)
- [ ] **Suíte E2E Automatizada**:
  - Instalar Playwright e criar `tests/e2e/canvas-export.spec.ts` cobrindo o fluxo crítico: upload de screenshot -> rotação 3D espacial -> troca de aparelho -> disparo de exportação e integridade do buffer baixado.
  - Elevar suíte unitária de 61 para 85+ testes cobrindo os novos hooks `useCanvasOrbit` e `useExportStudio`.

#### 5. 🌐 SEO, Metadados & OpenGraph Dinâmico
- [ ] **Geração Dinâmica de OpenGraph (`@vercel/og`)**:
  - Implementar rota `app/api/og/route.tsx` gerando preview social dinâmico em 1200x630px baseado na configuração do mockup.
  - Enriquecer metadados com schema `SoftwareApplication` em JSON-LD, tags Twitter Cards `summary_large_image` e canonical URLs.

---

### 🟣 Fase 2.5: Novas Capacidades de Estúdio & Mídia Rica (v1.3.5)

#### 1. 📋 Cópia Instantânea para Área de Transferência (Clipboard API)
- [ ] **Copy to Clipboard (PNG/WebP)**:
  - Adicionar botão "Copy Image" no TopBar e atalho `Ctrl+C`.
  - Converter canvas via `toBlob('image/png')` e escrever no clipboard com `navigator.clipboard.write([new ClipboardItem(...)])` sem forçar download em disco.

#### 2. 🎛️ Filtros de Imagem em Tempo Real (CSS Image Grading)
- [ ] **Controles de Tratamento de Imagem no MockupTab**:
  - Slider de Brilho (50% a 150%).
  - Slider de Contraste (50% a 150%).
  - Slider de Saturação (0% a 200%).
  - Toggle de Escala de Cinza / P&B Artístico.
  - Filtro de Nitidez / Unsharp Mask via SVG filter overlay.

#### 3. 🎥 Suporte a Vídeos (MP4 & WebM) Dentro dos Mockups
- [ ] **Video Frame Player**:
  - Aceitar arquivos `.mp4` e `.webm` no dropzone.
  - Renderizar tag `<video>` com `autoPlay`, `loop`, `muted` e `playsInline` adaptando-se perfeitamente aos chassis curvos dos dispositivos.
  - Sincronizar reprodução de vídeo com a rotação 3D do canvas.

#### 4. 🪟 Molduras de Sistema Operacional Adicionais
- [ ] **Windows 11 Mica / Acrylic Frame**:
  - Barra de título estilo Windows 11 com cantos arredondados, botões minimizar/maximizar/fechar à direita e efeito translúcido Mica.
- [ ] **iPad Pro com Apple Pencil & Magic Keyboard**:
  - Novo mockup mostrando o iPad acoplado no Magic Keyboard com trackpad.

#### 5. 🎨 Extrator Inteligente de Gradiente por Ponto Médio
- [ ] **Smart Color Sampling**:
  - Conta-gotas interativo (*EyeDropper API*) permitindo clicar em qualquer pixel da imagem inserida para transformar em cor de fundo ou gradiente harmônico instantaneamente.

---

### 🔵 Fase 3: Nuvem, Colaboração & Comunidade (v1.4.0+)
- [ ] **Persistência em Nuvem (Supabase / Neon Postgres)**:
  - Extensão do banco Dexie local para sincronização em nuvem autenticada (OAuth via Google/GitHub).
  - Compartilhamento de mockups via URLs curtas públicas (`shots.app/s/xyz123`).
- [ ] **Extensão Oficial para Chrome & Firefox**:
  - Captura direta da aba visível ou elemento inspecionado enviando em 1 clique para o Shots Studio com mockup já selecionado.
- [ ] **API de Exportação Headless (Serverless Render)**:
  - Endpoint `POST /api/render` para geração automatizada de mockups via webhook (ideal para geradores de banners em CI/CD).
