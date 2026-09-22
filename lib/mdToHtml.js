/* ============================================================
   Convertidor minimalista de Markdown a HTML
   ------------------------------------------------------------
   No es un parser completo de CommonMark/GFM: cubre solo lo que
   realmente usan las notas del blog (encabezados ##/###, listas,
   negritas/cursivas, enlaces, tablas simples y párrafos). Se usa
   para mandar la nota completa como adjunto al Kindle (lib/resend.js),
   donde no hace falta fidelidad perfecta, solo que se lea bien.
   ============================================================ */

function inline(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function isTableSeparator(line) {
  return /^\|?[\s:|-]+\|?$/.test(line) && line.includes("-");
}

export function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  let listType = null; // "ul" | "ol" | null

  function closeList() {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      i++;
      continue;
    }

    // Tabla: fila con | seguida de una fila separadora ---
    if (trimmed.startsWith("|") && lines[i + 1] && isTableSeparator(lines[i + 1].trim())) {
      closeList();
      const headerCells = trimmed
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      out.push("<table><thead><tr>");
      headerCells.forEach((c) => out.push(`<th>${inline(c)}</th>`));
      out.push("</tr></thead><tbody>");
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i]
          .trim()
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        out.push("<tr>");
        cells.forEach((c) => out.push(`<td>${inline(c)}</td>`));
        out.push("</tr>");
        i++;
      }
      out.push("</tbody></table>");
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inline(bullet[1])}</li>`);
      i++;
      continue;
    }

    const numbered = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inline(numbered[1])}</li>`);
      i++;
      continue;
    }

    if (trimmed.startsWith(">")) {
      closeList();
      out.push(`<blockquote>${inline(trimmed.replace(/^>\s?/, ""))}</blockquote>`);
      i++;
      continue;
    }

    closeList();
    out.push(`<p>${inline(trimmed)}</p>`);
    i++;
  }
  closeList();
  return out.join("\n");
}
