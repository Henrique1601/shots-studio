# 📜 05_DECISION_RECORDS_ADR.md — Registros de Decisões Arquiteturais (ADRs)

Este documento registra as decisões críticas tomadas durante a engenharia reversa e desenvolvimento do **Shots Studio**.

---

## 🏛️ ADR-001: Adoção do Zustand em Substituição a Context API / Redux

- **Status:** Aceito
- **Contexto:** O canvas realiza re-renderizações em tempo real a 60fps durante arrasto no Pad 3D e órbita manual.
- **Decisão:** Optou-se por **Zustand** com seletores refinados e histórico linear de até 50 passos para `undo`/`redo`.
- **Consequências:**
  - Evitou re-renderizações desnecessárias em painéis estáticos.
  - O código de estado é 100% tipado sem boilerplate complexo.

---

## 🏛️ ADR-002: Máscaras Concêntricas Vetoriais (SVG Display Masks) para Aparelhos Físicos

- **Status:** Aceito
- **Contexto:** Ao colocar uma foto dentro de um iPhone 17 ou MacBook, o gradiente do canvas frequentemente vazava nas bordas do aparelho ou a imagem ultrapassava as curvas dos cantos.
- **Decisão:** Implementação de um sistema de 3 camadas:
  1. *Placa de fundo opaca* (`bg-[#020202] z-5`) que barra completamente a transparência.
  2. *Container de mídia mascarado* (`maskImage: url("...display.svg") z-10`) com o recorte vetorial do display exato da fabricante.
  3. *Chassi exterior overlay* (`z-20`) com recortes transparentes e reflexo de bordas em titânio.
- **Consequências:** Paridade visual perfeita e zero vazamento de cor.

---

## 🏛️ ADR-003: Renderização 4K Client-Side via `html-to-image` com Escala Dinâmica

- **Status:** Aceito
- **Contexto:** Exportar mockups de alta qualidade sem depender de servidores caros de renderização backend.
- **Decisão:** Uso do `html-to-image` com multiplicador `pixelRatio: config.exportScale` (1x = FHD, 2x = 4K, 3x = 6K).
- **Consequências:**
  - Zero custo de infraestrutura de renderização.
  - Suporte a download de imagens individuais e empacotamento ZIP de múltiplos slides via `JSZip`.

---

## 🏛️ ADR-004: Eliminação Global de Scrollbars Visíveis

- **Status:** Aceito
- **Contexto:** Barras de rolagem nativas cinzas do navegador quebram a imersão de desktop app do Shots.so.
- **Decisão:** Aplicação de regras globais em `globals.css`:
  ```css
  * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  *::-webkit-scrollbar {
    width: 0px !important;
    height: 0px !important;
    display: none !important;
  }
  ```
- **Consequências:** Estética limpa, elegante e moderna em todos os navegadores.
