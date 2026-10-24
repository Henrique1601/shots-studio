# 🧪 06_TESTING_AND_QUALITY.md — Qualidade, Testes & Verificação

Regras de qualidade, suíte de testes unitários e rotina de validação contínua.

---

## 🎯 Cobertura e Estrutura dos Testes

O projeto adota o motor nativo de testes do Node.js (`node --experimental-strip-types --test`), garantindo execução ultra-rápida (menos de 500ms para toda a suíte):

```bash
cd shots-app
npm test
```

### Suítes Ativas (61 Testes em 12 Arquivos):

| Arquivo de Teste | Área Testada | Quantidade |
| :--- | :--- | :---: |
| `aspect-contain.test.ts` | Fórmulas de proporção, contenção estrita e bounds | 11 testes |
| `device-specs.test.ts` | Integridade das especificações de aparelhos e gradientes | 4 testes |
| `parity-refinements.test.ts` | 12 estilos, iPhone 17 Air, detalhes e detecção de layout customizado | 4 testes |
| `animation-motion.test.ts` | Presets de movimento 3D, cálculos de progresso da timeline | 3 testes |
| `elite-features.test.ts` | Magic palette, extração de cores, social presets e fundos 4K | 6 testes |
| `frame-redesign.test.ts` | Mini-sidebars, fundos sólidos e iluminação portrait | 7 testes |
| `new-devices-carousel.test.ts` | Pixel 9 Pro, Ultrawide, iMac M4 e carrossel de slides | 9 testes |
| `new-features.test.ts` | Modos de luz, acabamentos de titânio, watermark e pad 3D | 5 testes |
| `shadow-formula.test.ts` | Equações de 4 camadas de sombra (Adaptive, Spread, Hug) | 4 testes |
| `templates-duo.test.ts` | Templates curados, modo Duo e anotações no canvas | 8 testes |
| **Total** | **Todas as funcionalidades críticas verificadas** | **61 pass / 0 fail** |

---

## 🚦 Checklist Pré-Commit e Pré-Deploy

Antes de qualquer entrega ou deploy em produção, todas as seguintes etapas devem passar sem exceção:

1. [x] **Testes Unitários:** `npm test` deve retornar `0 fail`.
2. [x] **Verificação de Tipos TypeScript:** Nenhuma quebra de tipagem no Next.js App Router.
3. [x] **Build Turbopack de Produção:** `npm run build` deve compilar em menos de 10s e gerar todas as rotas estáticas.
4. [x] **Sincronização Git:** Commits semânticos no padrão conventional commits (`feat:`, `fix:`, `refactor:`).
5. [x] **Deploy Vercel:** Deploy promovido à URL de produção com alias oficial.
