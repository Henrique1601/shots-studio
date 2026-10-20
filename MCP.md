# 🔌 FrameCraft Studio MCP Server (Model Context Protocol)

O **FrameCraft Studio MCP Server** permite que inteligências artificiais (Claude Desktop, Antigravity, Cursor, agentes autônomos ou scripts CLI) automatizem a criação de mockups profissionais, posts para redes sociais e apresentações de código sem precisar abrir o navegador manualmente.

---

## ⚡ Início Rápido

Para iniciar o servidor MCP diretamente pelo terminal:

```bash
npm run mcp
```

Ou usando `node`:

```bash
node --experimental-strip-types mcp-server/index.ts
```

---

## 🛠️ Configuração em Clientes de IA

### 1. Claude Desktop (`claude_desktop_config.json`)

No Windows: `%APPDATA%\Claude\claude_desktop_config.json`  
No macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "framecraft-studio": {
      "command": "node",
      "args": [
        "--experimental-strip-types",
        "c:/Users/Public/Downloads/framecraft-studio/mcp-server/index.ts"
      ]
    }
  }
}
```

### 2. Antigravity / Cursor MCP Settings

Adicione nas configurações de MCP (`mcp.json`):

```json
{
  "mcpServers": {
    "framecraft-studio": {
      "command": "node",
      "args": [
        "--experimental-strip-types",
        "c:\\Users\\Public\\Downloads\\framecraft-studio\\mcp-server\\index.ts"
      ]
    }
  }
}
```

---

## 🧰 Ferramentas Disponíveis (Tools)

### 1. `framecraft_social_post`
Cria automaticamente um post de rede social otimizado com dimensões exatas, staging 3D, sombras e paleta harmoniosa.

* **Parâmetros:**
  * `platform`: `"twitter"` | `"instagram"` | `"linkedin"` | `"dribbble"` | `"youtube"` | `"producthunt"`
  * `image`: URL ou caminho local da imagem
  * `headline`: Título principal do post (ex: *"Nova versão 2.0 lançada!"*)
  * `subtitle`: Subtítulo descritivo
  * `badge`: Tag em destaque (ex: `"NOVO"`, `"v2.0"`, `"SAAS"`)
  * `device`: `"iphone-17"` | `"macbook"` | `"browser"` | `"code"` | `"screenshot"`
  * `theme`: `"dark"` | `"glass"` | `"tahoe"` | `"vibrant"` | `"cosmic"`

* **Exemplo de Chamada pela IA:**
  ```json
  {
    "platform": "twitter",
    "image": "https://meu-app.com/preview.png",
    "headline": "Apresentando o FrameCraft Studio v2.0",
    "subtitle": "Crie mockups impressionantes em segundos",
    "badge": "LANÇAMENTO",
    "device": "macbook",
    "theme": "glass"
  }
  ```

---

### 2. `framecraft_code_snippet`
Gera mockups de código estilo Ray.so / Carbon com janela macOS, realce de sintaxe, numeração de linhas e temas modernos.

* **Parâmetros:**
  * `code`: String com o código-fonte
  * `language`: `"typescript"` | `"python"` | `"rust"` | `"go"` | `"sql"` | `"javascript"` | `"html"` | `"css"` | `"json"`
  * `theme`: `"one-dark"` | `"dracula"` | `"tokyo-night"` | `"github-dark"` | `"monokai"`
  * `title`: Nome do arquivo na barra de título (ex: `"auth.service.ts"`)
  * `showLineNumbers`: `true` ou `false`
  * `background`: `"obsidian"` | `"glass"` | `"mesh"` | `"gradient"`

---

### 3. `framecraft_create_mockup`
Criação com controle total de aparelhos, ângulo 3D, profundidade de campo e efeitos.

* **Parâmetros:**
  * `image`: URL ou caminho da imagem
  * `frameType`: `"iphone-17"` | `"iphone-16-pro"` | `"macbook"` | `"ipad-pro"` | `"watch"` | `"browser"` | `"code"` | `"screenshot"`
  * `tiltX`: Ângulo vertical 3D (-45° a 45°)
  * `tiltY`: Rotação horizontal 3D (-45° a 45°)
  * `backgroundBlur`: Efeito Bokeh fotográfico de estúdio (0 a 40px)
  * `grainIntensity`: Granulação analógica de filme (0 a 100%)
  * `headline`: Texto de topo
  * `aspectRatio`: `"16:9"` | `"1:1"` | `"4:5"` | `"9:16"` | `"3:1"` | `"custom"`

---

### 4. `framecraft_magic_palette`
Gera 4 gradientes de estúdio harmônicos (Mesh, Ambient Glow, Linear Duo, Deep Velvet Contrast) a partir de cores hexadecimais fornecidas.

---

### 5. `framecraft_list_presets`
Lista todos os aparelhos suportados, formatos de tela para mídias sociais, coleções 3D e layouts disponíveis.
