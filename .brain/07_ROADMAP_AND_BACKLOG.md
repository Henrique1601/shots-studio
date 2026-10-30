# 🚀 07_ROADMAP_AND_BACKLOG.md — Master Roadmap & Backlog de Engenharia

Planejamento estratégico e catálogo exaustivo de evolução para o **FrameCraft Studio**, consolidado pela mesa diretora do **`global-master-agent`** com foco em engenharia de excelência, performance de 60fps, inteligência artificial integrada e acabamento de estúdio nível Apple/Linear/Stripe.

---

## 📅 Roadmap de Versões

### 🟢 Fase 1: Paridade Visual & Estúdio Essencial (Concluída - v1.0.0-elite)
- [x] Design System fiel ao padrão de estúdio profissional com dark theme exclusivo.
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

## 🟡 Fase 2: Excelência de Código, Performance & Engenharia (v1.3.0)

### 1. 🧱 Arquitetura, Modularização & Clean Code
- [x] **Desacoplar `useExportStudio.ts` de `TopBar.tsx`** (Concluído em v1.2.1):
  - Extrair os 4 pipelines de exportação (`handleExport`, `handleExportVideo`, `handleExportGif`, `handleExportAllSlidesZip`) para `src/hooks/useExportStudio.ts`.
  - Reduzir `TopBar.tsx` de 647 para menos de 180 linhas puramente declarativas.
- [ ] **Desacoplar `DeviceFrameRenderer.tsx` de `MockupCanvas.tsx`**:
  - Isolar a renderização física dos chassis metálicos (Pixel 9 Pro, iMac 24", Ultrawide, Foldable, iPhone 17) em `src/components/canvas/DeviceFrameRenderer.tsx`.
  - Reduzir `MockupCanvas.tsx` para menos de 300 linhas focadas no container espacial e drag & drop.
- [ ] **Modularizar `DeviceModal.tsx` (559 linhas)**:
  - Criar `DeviceCategoryNav.tsx` e `DeviceCard.tsx` com animações suaves de entrada (stagger children).
- [ ] **Modularizar `RightSidebar.tsx` (364 linhas)**:
  - Extrair `SpatialTiltPad.tsx` (wireframe 3D, drag de rotação, sliders e reset) e `LayoutPresetsGrid.tsx`.

### 2. ⚡ Performance Extrema & Render em Background
- [x] **Pipeline de Exportação com Web Worker (src/workers/exportWorker.ts)** (Concluído em v1.2.3):
  - Mover gravação de vídeo/GIF para `OffscreenCanvas` com Web Workers, garantindo que o render 4K não bloqueie a thread principal da UI (mantendo 60fps constantes).
- [ ] **Compressão Client-Side Inteligente**:
  - Suporte a compressão nativa em WebP e AVIF com slider de qualidade (80% a 100%) para downloads mais leves sem perda perceptível.
- [ ] **Lazy Loading & Preloading de Modelos e Ativos 3D**:
  - Implementar prefetch inteligente dos assets de 3D Shapes e device frames mais populares para eliminar delay ao alternar dispositivos.
- [ ] **Virtualização de Listas de Imagens & Unsplash Search**:
  - Integração com busca paginada e virtualizada no Unsplash API para backgrounds com debounce e sem memory leak.

### 3. ⌨️ Atalhos de Teclado Globais & Histórico (Undo / Redo)
- [x] **Global Keyboard Shortcuts Engine** (Concluído em v1.2.2):
  - `D`: Abre modal de aparelhos (*DeviceModal*).
  - `T`: Abre galeria de templates (*TemplatesModal*).
  - `1` / `2`: Alterna instantaneamente entre tabs Mockup e Frame.
  - `Ctrl/Cmd + E`: Dispara exportação rápida da imagem atual.
  - `Ctrl/Cmd + C`: Copia mockup renderizado em PNG direto para a área de transferência (`ClipboardItem API`).
  - `Ctrl/Cmd + V`: Colagem direta de screenshots da área de transferência direto no mockup ativo.
  - `Espaço + Arrastar`: Modo Pan para navegar em telas ampliadas com zoom.
- [ ] **Histórico Temporal (Undo / Redo)**:
  - Adicionar middleware `temporal` do Zustand no `mockupStore.ts` com suporte nativo a `Ctrl + Z` e `Ctrl + Shift + Z` (guardando histórico de até 50 estados com debounce).

### 4. 🧪 QA & Testes End-to-End (Playwright)
- [ ] **Suíte E2E Automatizada**:
  - Instalar Playwright e criar `tests/e2e/canvas-export.spec.ts` cobrindo o fluxo crítico: upload de screenshot -> rotação 3D espacial -> troca de aparelho -> disparo de exportação e integridade do buffer baixado.
  - Elevar suíte unitária de 61 para 85+ testes cobrindo os novos hooks `useCanvasOrbit` e `useExportStudio`.
- [ ] **Testes de Regressão Visual (Visual Regression Testing)**:
  - Comparação de snapshots de canvas com tolerância de pixel para garantir que nenhuma refatoração altere as sombras ou chassis dos aparelhos.

---

## 🟣 Fase 3: Mídia Rica, Tratamento de Imagem & Estúdio Criativo (v1.4.0)

### 1. 🎛️ Filtros de Imagem em Tempo Real (Image Grading)
- [x] **Controles de Tratamento de Imagem no MockupTab** (Concluído em v1.2.1):
  - Slider de Brilho (50% a 150%).
  - Slider de Contraste (50% a 150%).
  - Slider de Saturação (0% a 200%).
  - Slider de Matiz / Hue-Rotate (0° a 360°).
  - Toggle de Escala de Cinza / P&B Artístico.
  - Filtro de Nitidez / Unsharp Mask via SVG filter overlay.
  - Efeito Granulação Fotográfica (Film Grain) com slider de intensidade.

### 2. 🎥 Suporte a Vídeos (MP4 & WebM) Dentro dos Mockups
- [ ] **Video Frame Player**:
  - Aceitar arquivos `.mp4` e `.webm` no dropzone de upload.
  - Renderizar tag `<video>` com `autoPlay`, `loop`, `muted` e `playsInline` adaptando-se perfeitamente aos chassis curvos dos dispositivos.
  - Controles de reprodução: Play/Pause, scrubber de tempo e captura de frame estático favorito (*Freeze Frame*).
  - Exportação de animações com o vídeo reproduzindo dentro do dispositivo.

### 3. 📋 Cópia Instantânea para Área de Transferência (Clipboard API)
- [x] **Copy to Clipboard (PNG/WebP)** (Concluído em v1.2.2):
  - Botão "Copy Image" no TopBar e atalho `Ctrl+C`.
  - Converter canvas via `toBlob('image/png')` e escrever no clipboard com `navigator.clipboard.write([new ClipboardItem(...)])` sem download em disco.

### 4. 🪟 Molduras de Sistema Operacional Adicionais
- [ ] **Windows 11 Mica / Acrylic Frame**:
  - Barra de título estilo Windows 11 com cantos arredondados, botões minimizar/maximizar/fechar à direita e efeito translúcido Mica.
- [ ] **iPad Pro com Apple Pencil & Magic Keyboard**:
  - Mockup exibindo iPad Pro acoplado no Magic Keyboard com trackpad.
- [ ] **Smartwatches Adicionais**:
  - Galaxy Watch Ultra e Apple Watch Series 10 com pulseiras esportivas e milanesas.
- [ ] **Dispositivos Dobráveis e Gaming**:
  - Nintendo Switch OLED / Steam Deck OLED com joysticks laterais.
  - Galaxy Z Flip aberto em 90 graus (Flex Mode).

### 5. 🎨 Extrator Inteligente de Cor & Ferramentas Criativas
- [ ] **Smart Color Sampling (*EyeDropper API*)**:
  - Conta-gotas interativo permitindo clicar em qualquer pixel da imagem inserida para transformar em cor de fundo ou gradiente harmônico instantaneamente.
- [ ] **Gerador de Sombras Customizadas (Advanced Shadow Builder)**:
  - Controle independente de ângulo da luz (0° a 360°), elevação z-index, difusão e cor da luz ambiente da sombra.
- [ ] **Badges de Loja de Aplicativos (App Store / Google Play)**:
  - Carimbo vetorizado "Disponível na App Store" e "Disponível no Google Play" posicionado nos cantos do canvas.

---

## 🤖 Fase 4: Inteligência Artificial Integrada (v1.5.0)

### 1. 🪄 Remoção e Otimização Inteligente de Imagem
- [ ] **Background Removal com WebAssembly (Zero-Server)**:
  - Remoção automática de fundo de capturas e fotos utilizando modelos leves rodando 100% no navegador via transformers.js / ONNX runtime WebAssembly (sem custo de API).
- [ ] **Upscaling e Nitidez via Super-Resolution**:
  - Aumento de resolução de capturas de tela antigas ou em baixa resolução para 4K nítido antes de renderizar no mockup.
- [ ] **Auto-Crop Inteligente (Saliency Detection)**:
  - Detecção da área de maior interesse visual na imagem (botão, texto, gráfico) para enquadramento automático (*Smart Pan & Zoom*).

### 2. ✨ Assistente Criativo de Estilo (AI Studio Matcher)
- [ ] **Geração de Paleta Temática por Prompt**:
  - Campo onde o usuário digita *"Cyberpunk neon dark"*, *"Fintech minimalista clean"* ou *"Sunset pastel"* e a IA configura background, iluminação, reflexo e sombras correspondentes.
- [ ] **Auto-Caption & Títulos de Marketing**:
  - Geração automática de títulos e subtítulos de impacto para posts de lançamento de produtos no Product Hunt e X/Twitter baseados no conteúdo da imagem.

---

## 👥 Fase 5: Nuvem, Colaboração, Comunidade & APIs (v1.6.0+)

### 1. ☁️ Persistência em Nuvem & Compartilhamento Social
- [ ] **Sincronização com Supabase / Neon Postgres**:
  - Evolução do banco local Dexie para sincronização em nuvem autenticada (OAuth via Google/GitHub).
  - Compartilhamento de mockups via URLs curtas públicas (`framecraft.app/s/xyz123`).
  - Modo visualizador (*View-Only*) interativo permitindo que clientes e colegas girem o mockup 3D em tempo real pelo link.
- [ ] **Galeria Comunitária & Templates Públicos**:
  - Feed exploratório de criações da comunidade com botão "Remixar Template" com 1 clique.

### 2. 🔌 Extensões e Automação para Desenvolvedores
- [ ] **Extensão Oficial para Chrome, Firefox e Arc**:
  - Captura direta da aba visível, tela inteira ou elemento inspecionado enviando em 1 clique para o FrameCraft Studio com mockup já selecionado.
- [ ] **API de Exportação Headless (Serverless Render)**:
  - Endpoint `POST /api/render` para geração automatizada de mockups via webhook (ideal para automação de banners em CI/CD, GitHub Actions e blogs).
- [ ] **Exportação para Código (Code Snippet Generator)**:
  - Botão "Copy JSX / Tailwind" gerando o código React exato para renderizar aquele mesmo visual dentro de qualquer projeto web.
- [ ] **Plugin para Figma**:
  - Sincronização direta de frames do Figma diretamente para o FrameCraft Studio sem precisar exportar arquivos manuais.
