/* =============================================================
   ClearLearn Legacy → v5 Page Converter
   Applies all v5 layout rules to pasted legacy HTML
   Retains all inline styles and <style> blocks unless they
   directly control row/column/flex page structure
   ============================================================= */

   (function () {

    // ─── Structural CSS properties to strip from inline styles ──
    // ONLY these are considered "layout-structural" and removed.
    // Everything else is preserved exactly.
    const STRUCTURAL_PROPS = new Set([
      "display",
      "flex",
      "flex-direction",
      "flex-wrap",
      "flex-flow",
      "justify-content",
      "align-items",
      "align-content",
      "grid",
      "grid-template",
      "grid-template-columns",
      "grid-template-rows",
      "grid-column",
      "grid-row",
      "grid-area",
      "float",
      "width",
      "max-width",
      "min-width",
      "box-sizing",
      "columns",
      "column-count",
      "column-gap",
      "gap",
      "row-gap",
      "column-rule",
      "clear",
    ]);
  
    // ─── EXCEPTION: these elements are allowed to keep their
    //     structural inline styles because they are content-level
    //     (not row/column wrappers).
    //     Hero wrapper, tile anchors, image wrappers etc.
    const STRUCTURAL_STYLE_EXEMPT_SELECTORS = [
      "a",
      "img",
      "button",
      "span",
      "p",
      "h1","h2","h3","h4","h5","h6",
      "li",
      "td","th",
    ];
  
    // ─── CSS class patterns that indicate layout structure ───────
    // Only these are stripped from <style> block rules.
    const STRUCTURAL_CSS_PATTERN = /\.(row|column|clearfix|full|s12|l\d+|blockgrid|third|fourth|half|two-third|flex|grid)[\s,{:>+~[]/;
  
    // ─── Entry point ────────────────────────────────────────────
    function convertLegacyPage(rawHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");
      const body = doc.body;
  
      // Collect and filter all <style> blocks from the source
      const styleBlocks = collectStyleBlocks(doc);
  
      cleanLegacyClasses(body);
      const sections = extractSections(body);
      const outputParts = [];
  
      // 1. Hero CSS — always first
      outputParts.push(buildHeroCSS());
  
      // 2. Retained <style> blocks (non-structural rules preserved)
      if (styleBlocks) {
        outputParts.push(styleBlocks);
      }
  
      // 3. Converted sections
      sections.forEach((section) => {
        outputParts.push(convertSection(section));
      });
  
      return outputParts.filter(Boolean).join("\n");
    }
  
    // ─── Collect <style> blocks, strip only structural rules ────
    function collectStyleBlocks(doc) {
      const styleEls = Array.from(doc.querySelectorAll("style"));
      if (!styleEls.length) return "";
  
      const filtered = styleEls.map((styleEl) => {
        const lines = styleEl.textContent.split("\n");
        const kept = [];
        let skipBlock = false;
        let braceDepth = 0;
  
        lines.forEach((line) => {
          const trimmed = line.trim();
  
          // Detect start of a structural rule block
          if (!skipBlock && STRUCTURAL_CSS_PATTERN.test(trimmed)) {
            skipBlock = true;
          }
  
          if (skipBlock) {
            // Track brace depth to know when the block ends
            for (const ch of trimmed) {
              if (ch === "{") braceDepth++;
              if (ch === "}") braceDepth--;
            }
            if (braceDepth <= 0) {
              skipBlock = false;
              braceDepth = 0;
            }
            // Do not push this line
            return;
          }
  
          kept.push(line);
        });
  
        const cleaned = kept.join("\n").trim();
        return cleaned ? `<style>\n${cleaned}\n</style>` : "";
      });
  
      return filtered.filter(Boolean).join("\n");
    }
  
    // ─── Strip structural inline styles from row/column wrappers ─
    // Content-level elements (a, img, p, h2 etc.) keep everything.
    function stripStructuralInlineStyle(el) {
      if (!el.hasAttribute("style")) return;
  
      const tag = el.tagName.toLowerCase();
  
      // Exempt content-level elements — keep all their inline styles
      if (STRUCTURAL_STYLE_EXEMPT_SELECTORS.includes(tag)) return;
  
      // For wrapper elements (div, section, article etc.),
      // remove only structural properties
      const styleStr = el.getAttribute("style");
      const declarations = styleStr.split(";").map(s => s.trim()).filter(Boolean);
  
      const kept = declarations.filter((decl) => {
        const prop = decl.split(":")[0].trim().toLowerCase();
        return !STRUCTURAL_PROPS.has(prop);
      });
  
      if (kept.length === 0) {
        el.removeAttribute("style");
      } else {
        el.setAttribute("style", kept.join("; ") + ";");
      }
    }
  
    // ─── Hero CSS block ─────────────────────────────────────────
    function buildHeroCSS() {
      return `<style>
  .hero-library-btn{
    padding:10px 36px;
    border-radius:8px;
    background:#ffffff;
    color:#000000;
    font-weight:700;
    text-decoration:none;
    display:inline-block;
    white-space:nowrap;
    transition:all .3s ease-in-out;
  }
  .hero-library-btn:hover{
    background:rgb(65,116,141);
    color:#ffffff !important;
  }
  </style>`;
    }
  
    // ─── Strip legacy layout classes ────────────────────────────
    const LEGACY_CLASSES = [
      "clearfix", "full", "s12",
      "l1","l2","l3","l4","l5","l6","l7","l8","l9","l10","l11","l12",
      "blockgrid", "third", "fourth", "half", "two-third",
      "boxhover", "featured", "card_box_wrap",
    ];
  
    function cleanLegacyClasses(root) {
      root.querySelectorAll("*").forEach((el) => {
        LEGACY_CLASSES.forEach((cls) => el.classList.remove(cls));
        if (el.classList.length === 0) el.removeAttribute("class");
  
        // Strip structural inline styles from wrapper-level elements only
        stripStructuralInlineStyle(el);
      });
    }
  
    // ─── Section detection ──────────────────────────────────────
    function extractSections(body) {
      const sections = [];
      const children = Array.from(body.children);
      let buffer = [];
  
      const flushBuffer = () => {
        if (buffer.length) {
          sections.push({ type: "raw", nodes: [...buffer] });
          buffer = [];
        }
      };
  
      children.forEach((child) => {
        // Skip <style> elements — already collected separately
        if (child.tagName === "STYLE") return;
        if (child.classList && child.classList.contains("row")) {
          flushBuffer();
          sections.push({ type: "row", node: child });
        } else {
          buffer.push(child);
        }
      });
      flushBuffer();
  
      return sections;
    }
  
    // ─── Convert a section ──────────────────────────────────────
    function convertSection(section) {
      if (section.type === "raw") {
        return section.nodes.map((n) => n.outerHTML).join("\n");
      }
  
      const row = section.node;
      const sectionId = row.dataset.sectionId || detectSectionType(row);
  
      if (isSpacerRow(row))                                   return buildSpacerRow();
      if (row.querySelector("hr"))                            return buildSpacerRow();
      if (sectionId === "hero"      || isHeroRow(row))        return convertHeroRow(row);
      if (sectionId === "faq-accordion" || isFaqRow(row))     return convertFaqSection(row);
      if (sectionId === "quick-links" || isQuickLinksRow(row)) return convertQuickLinksSection(row);
      if (hasTiles(row))                                      return convertTileSection(row);
  
      return convertGenericRow(row);
    }
  
    // ─── Detection helpers ──────────────────────────────────────
    function isSpacerRow(row) {
      if (row.textContent.trim() === "") return true;
      if (row.querySelector(".spacer")) return true;
      return false;
    }
  
    function isHeroRow(row) {
      const img = row.querySelector("img");
      if (!img) return false;
      const classStr = row.className + " " + row.innerHTML;
      return (
        /hero|banner|fulloverlay|coverimg/.test(classStr.toLowerCase()) ||
        row.querySelector(".hero-section, .fulloverlaybg") !== null
      );
    }
  
    function isFaqRow(row) {
      return (
        row.querySelector(".faq-item, .faq-question, .faq-toggle") !== null ||
        /faq/i.test(row.dataset.sectionId || "")
      );
    }
  
    function isQuickLinksRow(row) {
      return (
        /quick.?link/i.test(row.dataset.sectionId || "") ||
        (
          row.querySelectorAll("a[href]").length >= 2 &&
          row.querySelectorAll(".column").length >= 2 &&
          row.querySelectorAll("img").length === 0
        )
      );
    }
  
    function hasTiles(row) {
      return (
        row.querySelector(".card_box, .hover-tile, [class*='tile']") !== null
      );
    }
  
    function detectSectionType(row) {
      const html = row.innerHTML.toLowerCase();
      if (/hero|banner|fulloverlay/.test(html))  return "hero";
      if (/faq/.test(html))                      return "faq-accordion";
      if (/quick.?link/.test(html))              return "quick-links";
      return "generic";
    }
  
    // ─── Spacer ─────────────────────────────────────────────────
    function buildSpacerRow() {
      return `<div class="row">
    <div class="column">
      <div class="spacer height-40"></div>
    </div>
  </div>`;
    }
  
    // ─── Hero ────────────────────────────────────────────────────
    function convertHeroRow(row) {
      const img    = row.querySelector("img");
      const imgSrc = img ? img.getAttribute("src") : "";
      const imgAlt = img ? (img.getAttribute("alt") || "") : "";
  
      // Preserve any non-structural inline styles on the img itself
      const imgStyle = img ? buildRetainedStyle(img, true) : "width:100%; height:auto; display:block;";
  
      const btn     = row.querySelector("a.hero-library-btn, a[class*='library'], a[class*='hero']");
      const btnHref = btn ? btn.getAttribute("href") : "#";
      const btnText = btn ? btn.textContent.trim() : "LIBRARY";
  
      return `<div class="row">
    <div style="position:relative; display:inline-block; width:100%;">
      <img src="${imgSrc}" alt="${imgAlt}" style="${imgStyle}">
      <div style="position:absolute; left:0; right:0; bottom:13%; z-index:5;" class="flex justify-center">
        <a class="hero-library-btn" href="${btnHref}">${btnText}</a>
      </div>
    </div>
  </div>`;
    }
  
    // ─── Build a retained style string for an element ───────────
    // forceStructural: if true, keep structural props too (used for
    // content-level elements like img inside hero where position is needed)
    function buildRetainedStyle(el, forceStructural) {
      const existing = el.getAttribute("style") || "";
      if (forceStructural) {
        // Return as-is — it's a content element, keep everything
        return existing || "width:100%; height:auto; display:block;";
      }
      // Non-structural only
      const declarations = existing.split(";").map(s => s.trim()).filter(Boolean);
      const kept = declarations.filter((decl) => {
        const prop = decl.split(":")[0].trim().toLowerCase();
        return !STRUCTURAL_PROPS.has(prop);
      });
      return kept.join("; ");
    }
  
    // ─── FAQ ─────────────────────────────────────────────────────
    function convertFaqSection(row) {
      const items = [];
  
      // Format A: existing .faq-item elements
      row.querySelectorAll(".faq-item").forEach((item) => {
        const q = item.querySelector(".faq-question, label, h3, h4, strong");
        const a = item.querySelector(".faq-answer, .faq-answer-inner, p");
        if (q) items.push({ question: q.textContent.trim(), answer: a ? a.innerHTML.trim() : "" });
      });
  
      // Format B: definition list
      if (!items.length) {
        row.querySelectorAll("dt").forEach((dt) => {
          const dd = dt.nextElementSibling;
          items.push({ question: dt.textContent.trim(), answer: dd ? dd.innerHTML.trim() : "" });
        });
      }
  
      // Format C: table rows
      if (!items.length) {
        row.querySelectorAll("tr").forEach((tr) => {
          const cells = tr.querySelectorAll("td, th");
          if (cells.length >= 2) {
            items.push({ question: cells[0].textContent.trim(), answer: cells[1].innerHTML.trim() });
          }
        });
      }
  
      if (!items.length) return convertGenericRow(row);
  
      const headingEl  = row.querySelector("h2, h3, .sectionheadline");
      const heading    = headingEl ? headingEl.textContent.trim() : "FAQ";
  
      // Retain any non-structural inline styles on the faq-item wrappers
      const faqCSS = `<style>
  .faq-item{ margin:0 0 15px 10px; padding:15px 20px; border:solid 1px #f4f4f4; border-radius:10px; }
  .faq-toggle{ position:absolute; opacity:0; pointer-events:none; }
  .faq-item:has(.faq-toggle:checked){ background:var(--accent15,#f0f7fa); }
  .faq-question{ display:flex; justify-content:space-between; align-items:center; cursor:pointer; font-weight:700; }
  .faq-question::after{ content:"▾"; transition:transform .3s; }
  .faq-item:has(.faq-toggle:checked) .faq-question::after{ transform:rotate(-180deg); }
  .faq-answer{ display:grid; grid-template-rows:0fr; transition:grid-template-rows .35s ease; }
  .faq-item:has(.faq-toggle:checked) .faq-answer{ grid-template-rows:1fr; }
  .faq-answer-inner{ overflow:hidden; padding-top:0; }
  .faq-item:has(.faq-toggle:checked) .faq-answer-inner{ padding-top:10px; }
  </style>`;
  
      const itemsHtml = items.map((item, i) => `    <div class="faq-item">
        <input class="faq-toggle" type="checkbox" id="faq-${i + 1}">
        <label class="faq-question" for="faq-${i + 1}">${item.question}</label>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>${item.answer}</p>
          </div>
        </div>
      </div>`).join("\n");
  
      return `${faqCSS}
  <div class="row">
    <div class="column">
      <h2>${heading}</h2>
  ${itemsHtml}
    </div>
  </div>`;
    }
  
    // ─── Quick Links ─────────────────────────────────────────────
    function convertQuickLinksSection(row) {
      const allLinks = [];
  
      row.querySelectorAll(".column").forEach((col) => {
        const a     = col.querySelector("a[href]");
        const label = col.querySelector("p, span, h3, h4, strong");
        if (a) {
          allLinks.push({
            label: label ? label.textContent.trim() : "",
            text:  a.textContent.trim(),
            href:  a.getAttribute("href"),
          });
        }
      });
  
      const COLS_PER_ROW = 3;
      const chunks = [];
      for (let i = 0; i < allLinks.length; i += COLS_PER_ROW) {
        chunks.push(allLinks.slice(i, i + COLS_PER_ROW));
      }
  
      const headingEl  = row.querySelector("h2, h3, .sectionheadline");
      const headingHtml = headingEl
        ? `<div class="row">\n  <div class="column">\n    <h2>${headingEl.textContent.trim()}</h2>\n  </div>\n</div>\n`
        : "";
  
      const rowsHtml = chunks.map((chunk) => {
        const cols = chunk.map((link) =>
          `  <div class="column">
      ${link.label ? `<p style="text-align:center;">${link.label}</p>` : ""}
      <a href="${link.href}" style="display:block; width:75%; margin:0 auto; text-align:center; padding:10px; background:#42748d; text-decoration:none; font-weight:700; color:white;">${link.text}</a>
    </div>`
        ).join("\n");
        return `<div class="row">\n${cols}\n</div>`;
      }).join(`\n${buildSpacerRow()}\n`);
  
      return `${headingHtml}${rowsHtml}`;
    }
  
    // ─── Tile / Card Grid ────────────────────────────────────────
    function convertTileSection(row) {
      const tileEls = Array.from(
        row.querySelectorAll(".card_box, .hover-tile, .column > a")
      );
  
      const uniqueTiles = tileEls.filter((el) =>
        !tileEls.some((other) => other !== el && other.contains(el))
      );
  
      if (!uniqueTiles.length) return convertGenericRow(row);
  
      const headingEl   = row.querySelector("h2, h3, .sectionheadline");
      const headingHtml = headingEl
        ? `<div class="row">\n  <div class="column">\n    <h2>${headingEl.textContent.trim()}</h2>\n  </div>\n</div>\n`
        : "";
  
      const distribution = getTileDistribution(uniqueTiles.length);
      const maxCols      = Math.max(...distribution);
      const tileHtmlList = uniqueTiles.map((tile) => convertTileElement(tile));
  
      const rows = [];
      let tileIndex = 0;
  
      distribution.forEach((colCount) => {
        const cols = [];
        for (let c = 0; c < maxCols; c++) {
          if (c < colCount && tileIndex < tileHtmlList.length) {
            cols.push(`  <div class="column">\n${tileHtmlList[tileIndex]}\n  </div>`);
            tileIndex++;
          } else {
            cols.push(`  <div class="column"></div>`);
          }
        }
        rows.push(`<div class="row">\n${cols.join("\n")}\n</div>`);
      });
  
      return `${headingHtml}${rows.join("\n")}`;
    }
  
    function getTileDistribution(total) {
      if (total <= 4)  return [total];
      if (total === 5) return [3, 2];
      if (total === 6) return [3, 3];
      if (total === 7) return [4, 3];
      if (total === 8) return [4, 4];
      if (total === 9) return [3, 3, 3];
      if (total === 10) return [4, 3, 3];
      if (total === 11) return [4, 4, 3];
      if (total === 12) return [4, 4, 4];
      const rows = [];
      let remaining = total;
      while (remaining > 0) { rows.push(Math.min(4, remaining)); remaining -= 4; }
      return rows;
    }
  
    function convertTileElement(el) {
      const anchor  = el.tagName === "A" ? el : el.querySelector("a");
      const href    = anchor ? anchor.getAttribute("href") : "#";
  
      // Get inner content
      let innerHtml = el.tagName === "A"
        ? el.innerHTML
        : anchor ? anchor.innerHTML : el.innerHTML;
  
      // Clean legacy classes inside content but preserve all inline styles
      const tmp = document.createElement("div");
      tmp.innerHTML = innerHtml;
      ["card_box", "boxhover", "featured", "card_box_wrap"].forEach((cls) => {
        tmp.querySelectorAll(`.${cls}`).forEach((node) => {
          node.classList.remove(cls);
          if (node.classList.length === 0) node.removeAttribute("class");
          // ↑ inline styles on these nodes are untouched
        });
      });
  
      return `    <a class="hover-tile" href="${href}" style="text-decoration:none; margin:10px; display:inline-block; transition:all .3s ease-in-out;">
  ${tmp.innerHTML.trim()}
      </a>`;
    }
  
    // ─── Generic row conversion ──────────────────────────────────
    function convertGenericRow(row) {
      const columns = Array.from(row.querySelectorAll(":scope > .column"));
  
      if (!columns.length) {
        const content = row.innerHTML.trim();
        if (!content) return buildSpacerRow();
        return `<div class="row">
    <div class="column">
      ${content}
    </div>
  </div>`;
      }
  
      const colsHtml = columns.map((col) => {
        // Preserve non-structural inline styles on the column div itself
        const retainedStyle = buildRetainedStyle(col, false);
        const styleAttr     = retainedStyle ? ` style="${retainedStyle}"` : "";
  
        // Reset to only "column" class — layout modifiers removed
        return `  <div class="column"${styleAttr}>\n    ${col.innerHTML.trim()}\n  </div>`;
      }).join("\n");
  
      return `<div class="row">\n${colsHtml}\n</div>`;
    }
  
    // ─── Expose ──────────────────────────────────────────────────
    window.convertLegacyPage = convertLegacyPage;
  
  })();