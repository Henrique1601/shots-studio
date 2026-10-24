# 🚀 07_ROADMAP_AND_BACKLOG.md — Roadmap Estratégico & Backlog de Engenharia

Planejamento estratégico de evolução para o **Shots Studio**, consolidado pela mesa diretora do **`global-master-agent`**.

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

### 🟡 Fase 2: Excelência de Código & Produtividade Viral (v1.3.0 - Backlog Prioritário)

#### 1. 🧱 Arquitetura & Clean Code (TopBar & Canvas)
- [ ] **Desacoplar `useExportStudio.ts` de `TopBar.tsx`**:
  - Extrair os 4 pipelines de exportação (`handleExport`, `handleExportVideo`, `handleExportGif`, `handleExportAllSlidesZip`) para um custom hook dedicado `src/hooks/useExportStudio.ts`.
  - Reduzir `TopBar.tsx` de 647 para menos de 180 linhas puramente declarativas.
- [ ] **Desacoplar `DeviceFrameRenderer.tsx` de `MockupCanvas.tsx`**:
  - Isolar a renderização física dos chassis metálicos (Pixel 9 Pro, iMac 24", Ultrawide, Foldable, iPhone 17) em `src/components/canvas/DeviceFrameRenderer.tsx`.
  - Reduzir `MockupCanvas.tsx` para menos de 300 linhas focadas no container espacial e drag & drop.

#### 2. ⚡ Performance & Caching
- [ ] **OffscreenCanvas & Background Processing**:
  - Mover gravação de vídeo/GIF para `OffscreenCanvas` com Web Workers, garantindo que o render 4K não bloqueie a thread principal da UI (mantendo 60fps constantes).
  - Suporte a compressão client-side em WebP com taxa de compressão configurável.

#### 3. ⌨️ Atalhos de Teclado Globais & Histórico (Undo / Redo)
- [ ] **Global Keyboard Shortcuts**:
  - `D`: Abre modal de aparelhos (*DeviceModal*).
  - `T`: Abre galeria de templates (*TemplatesModal*).
  - `1` / `2`: Alterna instantaneamente entre tabs Mockup e Frame.
  - `Ctrl/Cmd + E`: Dispara exportação rápida da imagem atual.
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

### 🔵 Fase 3: Mídia Dinâmica, Filtros & Nuvem (v1.4.0+)
- [ ] **Copiar Imagem Direto para o Clipboard (`ClipboardItem API`)**: Botão de cópia rápida sem download.
- [ ] **Filtros de Imagem em Tempo Real**: Brilho, contraste, saturação e escala de cinza via CSS filters.
- [ ] **Suporte a Vídeos (MP4/WebM) no Frame**: Autoplay em loop mutado dentro de telas de smartphones e monitores.
- [ ] **Sincronização opcional com Supabase / Neon Postgres**: Persistência de workspaces e coleções de mockups na nuvem.
- [ ] **Extensão para Google Chrome**: Captura de abas com 1 clique diretamente para o editor Shots Studio.
