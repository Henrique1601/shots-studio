"use client";

import React, { useMemo } from "react";
import { CodeLanguage, CodeTheme } from "@/types/mockup";

interface CodeSnippetFrameProps {
  code: string;
  language?: CodeLanguage;
  theme?: CodeTheme;
  showLineNumbers?: boolean;
  title?: string;
  borderRadius?: number;
}

const THEME_STYLES: Record<
  CodeTheme,
  {
    bg: string;
    border: string;
    header: string;
    text: string;
    lineNumber: string;
    keyword: string;
    type: string;
    string: string;
    comment: string;
    number: string;
    fn: string;
  }
> = {
  "one-dark": {
    bg: "#282c34",
    border: "rgba(255, 255, 255, 0.12)",
    header: "rgba(0, 0, 0, 0.25)",
    text: "#abb2bf",
    lineNumber: "#5c6370",
    keyword: "#c678dd",
    type: "#e5c07b",
    string: "#98c379",
    comment: "#5c6370",
    number: "#d19a66",
    fn: "#61afef",
  },
  dracula: {
    bg: "#282a36",
    border: "rgba(255, 255, 255, 0.14)",
    header: "rgba(0, 0, 0, 0.28)",
    text: "#f8f8f2",
    lineNumber: "#6272a4",
    keyword: "#ff79c6",
    type: "#8be9fd",
    string: "#f1fa8c",
    comment: "#6272a4",
    number: "#bd93f9",
    fn: "#50fa7b",
  },
  "tokyo-night": {
    bg: "#1a1b26",
    border: "rgba(122, 162, 247, 0.18)",
    header: "rgba(0, 0, 0, 0.32)",
    text: "#c0caf5",
    lineNumber: "#565f89",
    keyword: "#bb9af7",
    type: "#2ac3de",
    string: "#9ece6a",
    comment: "#565f89",
    number: "#ff9e64",
    fn: "#7aa2f7",
  },
  "github-dark": {
    bg: "#0d1117",
    border: "rgba(240, 246, 252, 0.12)",
    header: "rgba(255, 255, 255, 0.03)",
    text: "#c9d1d9",
    lineNumber: "#6e7681",
    keyword: "#ff7b72",
    type: "#79c0ff",
    string: "#a5d6ff",
    comment: "#8b949e",
    number: "#79c0ff",
    fn: "#d2a8ff",
  },
  monokai: {
    bg: "#272822",
    border: "rgba(255, 255, 255, 0.1)",
    header: "rgba(0, 0, 0, 0.22)",
    text: "#f8f8f2",
    lineNumber: "#75715e",
    keyword: "#f92672",
    type: "#66d9ef",
    string: "#e6db74",
    comment: "#75715e",
    number: "#ae81ff",
    fn: "#a6e22e",
  },
};

const KEYWORDS = new Set([
  "function", "const", "let", "var", "return", "if", "else", "for", "while",
  "import", "export", "from", "default", "class", "extends", "async", "await",
  "def", "class", "try", "catch", "throw", "new", "this", "typeof", "interface",
  "type", "public", "private", "protected", "select", "where", "group", "by",
  "order", "limit", "fn", "pub", "struct", "impl", "mut", "match", "val"
]);

export const CodeSnippetFrame: React.FC<CodeSnippetFrameProps> = ({
  code,
  language = "typescript",
  theme = "one-dark",
  showLineNumbers = true,
  title,
  borderRadius = 16,
}) => {
  const currentTheme = THEME_STYLES[theme] || THEME_STYLES["one-dark"];

  // Split lines and tokenize tokens
  const lines = useMemo(() => {
    return code.split("\n");
  }, [code]);

  const highlightToken = (token: string, idx: number) => {
    // String literals
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith("`") && token.endsWith("`"))
    ) {
      return (
        <span key={idx} style={{ color: currentTheme.string }}>
          {token}
        </span>
      );
    }

    // Comments
    if (token.startsWith("//") || token.startsWith("#") || token.startsWith("/*")) {
      return (
        <span key={idx} style={{ color: currentTheme.comment, fontStyle: "italic" }}>
          {token}
        </span>
      );
    }

    // Numbers & Booleans
    if (/^\d+(\.\d+)?$/.test(token) || token === "true" || token === "false" || token === "null" || token === "undefined") {
      return (
        <span key={idx} style={{ color: currentTheme.number }}>
          {token}
        </span>
      );
    }

    // Keywords
    if (KEYWORDS.has(token.toLowerCase())) {
      return (
        <span key={idx} style={{ color: currentTheme.keyword, fontWeight: 600 }}>
          {token}
        </span>
      );
    }

    // Types / PascalCase
    if (/^[A-Z][a-zA-Z0-9_]*$/.test(token)) {
      return (
        <span key={idx} style={{ color: currentTheme.type, fontWeight: 500 }}>
          {token}
        </span>
      );
    }

    // Function calls (word before opening parenthesis)
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*\(?$/.test(token) && token.endsWith("(")) {
      return (
        <span key={idx}>
          <span style={{ color: currentTheme.fn }}>{token.slice(0, -1)}</span>(
        </span>
      );
    }

    return (
      <span key={idx} style={{ color: currentTheme.text }}>
        {token}
      </span>
    );
  };

  const renderLine = (line: string) => {
    // If full line comment
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
      return (
        <span style={{ color: currentTheme.comment, fontStyle: "italic" }}>
          {line}
        </span>
      );
    }

    // Match tokens (quoted strings, punctuation, words, or whitespace)
    const tokenRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*$|[a-zA-Z0-9_$]+|\s+|[^\s\w])/g;
    const tokens = line.match(tokenRegex) || [line];

    return tokens.map((token, idx) => highlightToken(token, idx));
  };

  return (
    <div
      style={{
        backgroundColor: currentTheme.bg,
        borderColor: currentTheme.border,
        borderRadius: `${borderRadius}px`,
      }}
      className="w-full h-full flex flex-col overflow-hidden border shadow-2xl transition-all duration-300 font-mono text-[13px] leading-relaxed select-text"
    >
      {/* macOS Window Title Bar */}
      <div
        style={{
          backgroundColor: currentTheme.header,
          borderColor: currentTheme.border,
        }}
        className="px-4 py-3 flex items-center justify-between border-b select-none shrink-0"
      >
        {/* Traffic Light Dots */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-sm" />
        </div>

        {/* File Name / Title */}
        <div className="text-xs font-medium tracking-wide opacity-75 truncate max-w-[200px]" style={{ color: currentTheme.text }}>
          {title || `${language}.${language === "python" ? "py" : language === "rust" ? "rs" : "ts"}`}
        </div>

        {/* Language Badge */}
        <div className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/80 border border-white/10">
          {language}
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="p-4 sm:p-5 overflow-auto flex-1 flex text-left font-mono">
        {/* Line Numbers Gutter */}
        {showLineNumbers && (
          <div
            style={{ color: currentTheme.lineNumber }}
            className="pr-4 select-none text-right font-mono text-xs opacity-50 flex flex-col space-y-[2px]"
          >
            {lines.map((_, i) => (
              <span key={i} className="leading-relaxed">
                {i + 1}
              </span>
            ))}
          </div>
        )}

        {/* Code Content */}
        <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-xs sm:text-[13px] m-0 p-0 flex flex-col space-y-[2px]">
          {lines.map((line, i) => (
            <div key={i} className="leading-relaxed min-h-[1.25rem]">
              {renderLine(line)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
