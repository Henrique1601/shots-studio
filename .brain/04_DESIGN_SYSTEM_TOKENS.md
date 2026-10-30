# 🎨 04_DESIGN_SYSTEM_TOKENS.md — Design System & Tokens Oficiais

Tokens de cores, fórmulas matemáticas de sombras, tipografia e parâmetros de física do **FrameCraft Studio**.

---

## 🎨 Paleta de Cores do Estúdio (Dark Theme Exclusivo)

| Nome do Token | Valor Hex | Finalidade de Uso |
| :--- | :--- | :--- |
| `--studio-bg` | `#0d0d0d` | Fundo principal da aplicação |
| `--canvas-bg` | `#000000` | Fundo do container exterior do canvas |
| `--sidebar-bg` | `#1c1c1c` | Fundo das sidebars esquerda e direita |
| `--card-bg` | `#222222` | Cards de estilo, presets e opções |
| `--card-hover` | `#282828` | Estado hover de botões e cards |
| `--input-bg` | `#242424` | Pílulas de sliders, opacidade e inputs de dimensão |
| `--border-subtle` | `rgba(255, 255, 255, 0.05)` | Divisores e bordas discretas |
| `--border-active` | `rgba(255, 255, 255, 0.80)` | Itens selecionados ou com foco |
| `--accent-cyan` | `#22d3ee` | Indicador de rotação do Pad 3D e órbita |
| `--accent-indigo` | `#6366f1` | Dropzone ativa e anotações |

---

## 🌑 Fórmulas Matemáticas de Sombra (4-Layer Shadows)

As sombras do FrameCraft Studio utilizam equações multi-camadas que simulam a iluminação difusa de um estúdio de fotografia real:

### 1. Adaptive Shadow (Fórmula Oficial de 4 Camadas)
Dada a opacidade base configurada pelo usuário $O \in [0.10, 0.70]$:

$$\alpha = \left(\frac{O}{100}\right) \times 0.40$$

$$\text{box-shadow} = \begin{cases}
0\text{px } 10.472\text{px } 15.708\text{px } -23.8\text{px } \text{rgba}(0, 0, 0, \alpha), \\
0\text{px } 31.416\text{px } 47.124\text{px } -23.8\text{px } \text{rgba}(0, 0, 0, \alpha), \\
0\text{px } 62.832\text{px } 94.248\text{px } -23.8\text{px } \text{rgba}(0, 0, 0, \alpha), \\
0\text{px } 104.72\text{px } 157.08\text{px } -23.8\text{px } \text{rgba}(0, 0, 0, \alpha)
\end{cases}$$

### 2. Spread Shadow
$$\text{box-shadow} = 0\text{px } 25\text{px } 50\text{px } -12\text{px } \text{rgba}(0, 0, 0, 1.5\alpha), \quad 0\text{px } 0\text{px } 30\text{px } 0\text{px } \text{rgba}(0, 0, 0, \alpha)$$

### 3. Hug Shadow
$$\text{box-shadow} = 0\text{px } 8\text{px } 24\text{px } -4\text{px } \text{rgba}(0, 0, 0, 1.8\alpha), \quad 0\text{px } 2\text{px } 6\text{px } 0\text{px } \text{rgba}(0, 0, 0, \alpha)$$

---

## ⚡ Físicas de Animação e Molas (Springs)

Todas as transformações 3D e transições de tela no canvas utilizam o motor de mola do **Framer Motion**:

```typescript
const springConfig = {
  type: "spring",
  stiffness: 320,  // Rigidez alta para resposta imediata
  damping: 28,     // Amortecimento calibrado sem oscilações excessivas
  mass: 0.8        // Sensação de peso leve e responsivo
};
```
