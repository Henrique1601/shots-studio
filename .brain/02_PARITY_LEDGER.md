# ⚖️ 02_PARITY_LEDGER.md — Livro-Razão de Paridade & Qualidade Visual FrameCraft Studio

Este documento audita item a item a paridade funcional e visual da nossa implementação com os mais altos padrões de design de estúdio profissional, baseando-se nas capturas de tela reais armazenadas no cérebro (`.user_uploaded/media_*.png`).

---

## 📊 Matriz de Paridade

| Recurso / Seção | Padrão Studio Original | Implementação FrameCraft | Status |
| :--- | :--- | :--- | :---: |
| **Grid de Estilos** | 3 colunas com 12 acabamentos visuais + botão `•••` | 3 colunas (`grid-cols-3`), 12 estilos ativos + `•••` | 🟢 100% |
| **Seção Details** | Exibe `Device` e `Screen pixels` no rodapé da aba Mockup | Card `DETAILS` dinâmico em `LeftSidebar.tsx` | 🟢 100% |
| **Controle de Sombras** | 4 presets (`None`, `Spread`, `Hug`, `Adaptive`), Opacity em pílula | 4 presets em cards + Opacity em cápsula + `Adjust Light` | 🟢 100% |
| **Reflexo de Luz** | Ângulo de luz (`Soft Studio`, `Top-Left`, `Top-Right`, `Dramatic`) | Gradientes especulares e controle de intensidade (5-100%) | 🟢 100% |
| **Modal de Dispositivos** | Popover com abas (`All`, `Phone`, `Tablet`, `Laptop`, `Monitor`, `Watch`) e seções `Essentials` e `iPhone 17 Lineup` | Reestruturado exatamente com seções e previews | 🟢 100% |
| **iPhone 17 Lineup** | iPhone 17 (`402 / 874`) e iPhone 17 Air (`420 / 912`) | Modelos iPhone 17 e iPhone 17 Air com SVG Masks dedicados | 🟢 100% |
| **Pad Espacial 3D** | Card inclinado em perspectiva com botão circular e texto `Hold ⇧ for precision` | Pad interativo com captura de ponteiro, rotação e atalho Shift | 🟢 100% |
| **Custom Layout Card** | Card no topo de Layout Presets com pílula `✕ Custom Layout` para reset | Aparece ao inclinar e reseta instantaneamente ao clicar no `✕` | 🟢 100% |
| **Base Layout Title** | Quando plano (0°), a seção se chama `BASE LAYOUT` | Rótulo dinâmico `BASE LAYOUT` vs `LAYOUT PRESETS` | 🟢 100% |
| **Scrollbars** | 100% invisíveis no layout inteiro desktop | `scrollbar-width: none` e `::-webkit-scrollbar { display: none }` | 🟢 100% |
| **Carrossel de Abas** | Deslizamento horizontal suave entre Mockup e Frame (`scrollLeft`) | Container flex horizontal com `scrollLeft: 0` vs `228px` | 🟢 100% |
| **Command Bar Central** | 7 ações: `Undo`, `Redo`, `Shuffle`, `Start Over`, `Fullscreen`, `Chat`, `Perf` | TopBar com todos os 7 botões oficiais reativos | 🟢 100% |

---

## 🔬 Análise Detalhada dos 12 Estilos Oficiais

1. **Default:** Sombra sutil de estúdio, cantos curvos e fundo neutro sem acabamentos adicionais.
2. **Glass Light:** Vidro fosco claro translúcido (`backdrop-blur-xl bg-white/40 border border-white/40`).
3. **Glass Dark:** Acabamento em acrílico escuro translúcido com reflexo de borda.
4. **Liquid Glass:** Efeito assinatura com refração de borda âmbar/quente e reflexos fluidos.
5. **Inset Light:** Chanfro interno suave com relevo negativo e borda cinza clara.
6. **Inset Dark:** Relevo negativo em grafite profundo com sombra interna cavada.
7. **Outline:** Linha de traço duplo nítido de alta visibilidade.
8. **Border:** Contorno unificado encorpado ao redor do chassi da janela.
9. **Retro:** Moldura retrô clássica inspirada em monitores e molduras fotográficas antigas.
10. **Card:** Estilo estúdio/polaroid com margem inferior generosa e fundo branco flutuante.
11. **Stack:** Três cartões sobrepostos em cascata com profundidade z-index.
12. **Stack 2:** Cartões sobrepostos com rotação angular em leque (3° e -2°).
