/* =============================================================
   ClearLearn Legacy → v5 Page Converter
   ============================================================= */

   (function () {

    // ─── Structural CSS properties to strip from inline styles ──
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
  
    // ─── Content-level elements — keep ALL their inline styles ──
    const STRUCTURAL_STYLE_EXEMPT_TAGS = new Set([
      "a","img","button","span","p",
      "h1","h2","h3","h4","h5","h6",
      "li","td","th","input","label","i","b","strong","em","ul","ol",
    ]);
  
    // ─── Layout class patterns to strip from <style> blocks ─────
    const STRUCTURAL_SELECTOR_PATTERN =
      /\.(row|col|column|clearfix|full|s\d+|l\d+|m\d+|xl\d+|s5ths|m5ths|l5ths|xl5ths|blockgrid|third|fourth|half|two-third|flex(?!\s*\{)(?!-)|grid(?!\s*\{)(?!-))\b/;
  
    // ─── Entry point ────────────────────────────────────────────
    function convertLegacyPage(rawHtml) {
      const parser = new DOMParser();
      const doc    = parser.parseFromString(rawHtml, "text/html");
      const body   = doc.body;
  
      const styleBlocks = collectStyleBlocks(doc);
      cleanLegacyClasses(body);
  
      const sections    = extractSections(body);
      const outputParts = [];
  
      outputParts.push(buildHeroCSS());
      if (styleBlocks) outputParts.push(styleBlocks);
  
      // Convert sections, then collapse runs of consecutive spacers
      const converted = sections.map(convertSection).filter(Boolean);
      const collapsed = collapseSpacers(converted);
  
      collapsed.forEach((part) => outputParts.push(part));
  
      return outputParts.filter(Boolean).join("\n");
    }
  
    // ─── Collapse consecutive spacer rows into one ──────────────
    // Prevents a run of empty legacy rows producing a stack of
    // height-40 divs in the output.
    function collapseSpacers(parts) {
      const SPACER = buildSpacerRow();
      const result = [];
      let lastWasSpacer = false;
  
      parts.forEach((part) => {
        const isSpacer = part.trim() === SPACER.trim();
        if (isSpacer) {
          if (!lastWasSpacer) result.push(part);
          lastWasSpacer = true;
        } else {
          result.push(part);
          lastWasSpacer = false;
        }
      });
  
      return result;
    }
  
    // ─── Collect and filter <style> blocks ──────────────────────
    function collectStyleBlocks(doc) {
      const styleEls = Array.from(doc.querySelectorAll("style"));
      if (!styleEls.length) return "";
  
      const filtered = styleEls.map((styleEl) => {
        let css = styleEl.textContent;
        css = css.replace(/\/\*\*/g, "/*").replace(/\*\*\//g, "*/");
  
        const lines    = css.split("\n");
        const kept     = [];
        let skipBlock  = false;
        let braceDepth = 0;
        let inComment  = false;
  
        lines.forEach((line) => {
          const trimmed = line.trim();
  
          if (!inComment && trimmed.includes("/*")) inComment = true;
          if (inComment) {
            kept.push(line);
            if (trimmed.includes("*/")) inComment = false;
            return;
          }
  
          if (!skipBlock && STRUCTURAL_SELECTOR_PATTERN.test(trimmed)) {
            skipBlock  = true;
            braceDepth = 0;
          }
  
          if (skipBlock) {
            for (const ch of trimmed) {
              if (ch === "{") braceDepth++;
              if (ch === "}") braceDepth--;
            }
            if (braceDepth <= 0 && trimmed.includes("}")) {
              skipBlock  = false;
              braceDepth = 0;
            }
            return;
          }
  
          kept.push(line);
        });
  
        const cleaned = kept.join("\n").trim();
        return cleaned ? `<style>\n${cleaned}\n</style>` : "";
      });
  
      return filtered.filter(Boolean).join("\n");
    }
  
    // ─── Strip structural inline styles from wrapper divs only ──
    function stripStructuralInlineStyle(el) {
      if (!el.hasAttribute("style")) return;
      if (STRUCTURAL_STYLE_EXEMPT_TAGS.has(el.tagName.toLowerCase())) return;
  
      const declarations = el.getAttribute("style")
        .split(";").map(s => s.trim()).filter(Boolean);
  
      const kept = declarations.filter((decl) => {
        const prop = decl.split(":")[0].trim().toLowerCase();
        return !STRUCTURAL_PROPS.has(prop);
      });
  
      if (kept.length === 0) el.removeAttribute("style");
      else el.setAttribute("style", kept.join("; ") + ";");
    }
  
    // ─── Hero CSS ────────────────────────────────────────────────
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
      "clearfix","full","center",
      "s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12",
      "l1","l2","l3","l4","l5","l6","l7","l8","l9","l10","l11","l12",
      "m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","m11","m12",
      "blockgrid","third","fourth","half","two-third",
      "boxhover","featured","card_box_wrap","col",
      // Old page-builder typography helpers — layout-only, not visual
      "size-80","size-48","size-21",
      "is-title1-48","is-title-lite","is-lite",
      // Old button classes — visual styles retained via inline/css,
      // but the class names themselves are legacy
      "is-btn","is-btn-ghost1","is-btn-ghost2",
      "is-upper","is-rounded-30","is-btn-small",
      // Old layout display helpers
      "display",
    ];
  
    function cleanLegacyClasses(root) {
      root.querySelectorAll("*").forEach((el) => {
        LEGACY_CLASSES.forEach((cls) => el.classList.remove(cls));
        if (el.classList.length === 0) el.removeAttribute("class");
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
  
    // ─── Route each section ─────────────────────────────────────
    function convertSection(section) {
      if (section.type === "raw") {
        return section.nodes.map((n) => n.outerHTML).join("\n");
      }
  
      const row       = section.node;
      const sectionId = row.dataset.sectionId || detectSectionType(row);
  
      if (isSpacerRow(row))                                     return buildSpacerRow();
      if (row.querySelector(":scope > hr"))                     return buildSpacerRow();
      if (sectionId === "hero"          || isHeroRow(row))      return convertHeroRow(row);
      if (sectionId === "faq-accordion" || isFaqRow(row))       return convertFaqSection(row);
      if (sectionId === "quick-links"   || isQuickLinksRow(row)) return convertQuickLinksSection(row);
      if (hasTiles(row))                                        return convertTileSection(row);
  
      return convertGenericRow(row);
    }
  
    // ─── Spacer detection ────────────────────────────────────────
    // A row is ONLY a spacer if it has no meaningful content at all.
    // A row that contains a spacer div AND other real content is NOT
    // a spacer row — the spacer div inside it will be preserved as-is.
    function isSpacerRow(row) {
      // Truly empty rows (nothing inside at all)
      if (row.innerHTML.trim() === "") return true;
  
      // Rows whose ONLY content is whitespace and/or .spacer divs
      // Clone and remove all .spacer elements, then check if anything remains
      const clone = row.cloneNode(true);
      clone.querySelectorAll(".spacer").forEach((el) => el.remove());
  
      const remainingText    = clone.textContent.trim();
      const remainingElements = clone.querySelectorAll(
        "img, a, h1, h2, h3, h4, h5, h6, p, ul, ol, li, span, i, b, strong, em, input, button, div"
      );
  
      // It is a spacer row only if removing spacers leaves nothing
      return remainingText === "" && remainingElements.length === 0;
    }
  
    // ─── Hero detection ─────────────────────────────────────────
    function isHeroRow(row) {
      const html     = row.innerHTML.toLowerCase();
      const classStr = (row.getAttribute("class") || "") + " " + html;
  
      if (
        row.querySelector(".halfheroleft, .halfheroright, .parallax, .fulloverlaybg, .transpheadbar, .splitranspright, .splitransprighthero") ||
        /halfheroleft|halfheroright|parallax|fulloverlaybg|transpheadbar|splitranspright/.test(classStr)
      ) return true;
  
      const img = row.querySelector("img");
      if (img) {
        const alt      = (img.getAttribute("alt") || "").toLowerCase();
        const src      = (img.getAttribute("src") || "").toLowerCase();
        const isLogo   = /logo|icon/.test(alt) || /logo|icon/.test(src);
        const isBanner = /hero|banner|cover|bg|background/.test(classStr) ||
                         row.querySelector(".hero-section, .fulloverlaybg, .headerbar") !== null;
        if (!isLogo && isBanner) return true;
      }
  
      return false;
    }
  
    function isFaqRow(row) {
      return (
        row.querySelector(".faq-item, .faq-question, .faq-toggle") !== null ||
        /faq/i.test(row.dataset.sectionId || "")
      );
    }
  
    // ─── Quick Links detection ───────────────────────────────────
    // Tightened: only trigger on an explicit data-section-id or a
    // heading/label that literally contains "quick link/links".
    // Generic content columns with anchors must NOT be treated as
    // quick links just because they happen to contain buttons.
    function isQuickLinksRow(row) {
      const sectionId = row.dataset.sectionId || "";
      if (/quick.?link/i.test(sectionId)) return true;
  
      // Check heading text inside the row
      const heading = row.querySelector("h1, h2, h3");
      if (heading && /quick.?link/i.test(heading.textContent)) return true;
  
      return false;
    }
  
    function hasTiles(row) {
      return row.querySelector(".card_box, .hover-tile") !== null;
    }
  
    function detectSectionType(row) {
      const html = row.innerHTML.toLowerCase();
      if (/halfheroleft|halfheroright|parallax|fulloverlaybg|transpheadbar/.test(html)) return "hero";
      if (/faq/.test(html))        return "faq-accordion";
      if (/quick.?link/.test(html)) return "quick-links";
      return "generic";
    }
  
    // ─── Spacer row builder ──────────────────────────────────────
    function buildSpacerRow() {
      return `<div class="row">
    <div class="column">
      <div class="spacer height-40"></div>
    </div>
  </div>`;
    }
  
    // ─── Hero ────────────────────────────────────────────────────
    function convertHeroRow(row) {
      const leftEl  = row.querySelector(".halfheroleft");
      const rightEl = row.querySelector(".halfheroright, .gradbgright");
  
      if (leftEl || rightEl) return convertSplitHero(leftEl, rightEl, row);
  
      const img      = row.querySelector("img");
      const imgSrc   = img ? img.getAttribute("src") : "";
      const imgAlt   = img ? (img.getAttribute("alt") || "") : "";
      const imgStyle = img
        ? (img.getAttribute("style") || "width:100%; height:auto; display:block;")
        : "width:100%; height:auto; display:block;";
  
      const btn     = findHeroButton(row);
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
  
    function convertSplitHero(leftEl, rightEl, row) {
      const leftClass  = leftEl ? (leftEl.getAttribute("class") || "halfheroleft") : "halfheroleft";
      const leftHtml   = leftEl ? leftEl.innerHTML.trim() : "";
      const rightClass = rightEl ? (rightEl.getAttribute("class") || "") : "";
      const rightContent = rightEl ? rightEl.innerHTML.trim() : "";
  
      return `<div class="row">
    <div class="column">
      <div class="${leftClass}">${leftHtml}</div>
    </div>
    <div class="column">
      <div class="${rightClass}">
        ${rightContent}
      </div>
    </div>
  </div>`;
    }
  
    function findHeroButton(container) {
      return (
        container.querySelector("a.btn-right") ||
        container.querySelector("a.hero-library-btn") ||
        container.querySelector(".btn-rightcontainer a") ||
        container.querySelector("a[href]")
      );
    }
  
    // ─── FAQ ─────────────────────────────────────────────────────
    function convertFaqSection(row) {
      const items = [];
  
      row.querySelectorAll(".faq-item").forEach((item) => {
        const q = item.querySelector(".faq-question, label, h3, h4, strong");
        const a = item.querySelector(".faq-answer, .faq-answer-inner, p");
        if (q) items.push({ question: q.textContent.trim(), answer: a ? a.innerHTML.trim() : "" });
      });
  
      if (!items.length) {
        row.querySelectorAll("dt").forEach((dt) => {
          const dd = dt.nextElementSibling;
          items.push({ question: dt.textContent.trim(), answer: dd ? dd.innerHTML.trim() : "" });
        });
      }
  
      if (!items.length) {
        row.querySelectorAll("tr").forEach((tr) => {
          const cells = tr.querySelectorAll("td, th");
          if (cells.length >= 2) {
            items.push({ question: cells[0].textContent.trim(), answer: cells[1].innerHTML.trim() });
          }
        });
      }
  
      if (!items.length) return convertGenericRow(row);
  
      const headingEl = row.querySelector("h2, h3, .sectionheadline");
      const heading   = headingEl ? headingEl.textContent.trim() : "FAQ";
  
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
  
      const itemsHtml = items.map((item, i) =>
  `    <div class="faq-item">
        <input class="faq-toggle" type="checkbox" id="faq-${i + 1}">
        <label class="faq-question" for="faq-${i + 1}">${item.question}</label>
        <div class="faq-answer">
          <div class="faq-answer-inner"><p>${item.answer}</p></div>
        </div>
      </div>`
      ).join("\n");
  
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
  
      if (!allLinks.length) return convertGenericRow(row);
  
      const COLS_PER_ROW = 3;
      const chunks = [];
      for (let i = 0; i < allLinks.length; i += COLS_PER_ROW) {
        chunks.push(allLinks.slice(i, i + COLS_PER_ROW));
      }
  
      const headingEl   = row.querySelector("h2, h3, .sectionheadline");
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
      const tileEls = Array.from(row.querySelectorAll(".card_box, .hover-tile"));
  
      const tileAnchors = tileEls.map((el) => {
        let node = el;
        while (node && node !== row) {
          if (node.tagName === "A") return node;
          node = node.parentElement;
        }
        return el;
      });
  
      const seen   = new Set();
      const unique = tileAnchors.filter((el) => {
        if (seen.has(el)) return false;
        seen.add(el);
        return true;
      });
  
      if (!unique.length) return convertGenericRow(row);
  
      const headingEl   = row.querySelector("h2, h3, .sectionheadline");
      const headingHtml = headingEl
        ? `<div class="row">\n  <div class="column">\n    <h2>${headingEl.textContent.trim()}</h2>\n  </div>\n</div>\n`
        : "";
  
      const distribution = getTileDistribution(unique.length);
      const maxCols      = Math.max(...distribution);
      const tileHtmlList = unique.map(convertTileElement);
  
      const rows    = [];
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
      if (total <= 4)   return [total];
      if (total === 5)  return [3, 2];
      if (total === 6)  return [3, 3];
      if (total === 7)  return [4, 3];
      if (total === 8)  return [4, 4];
      if (total === 9)  return [3, 3, 3];
      if (total === 10) return [4, 3, 3];
      if (total === 11) return [4, 4, 3];
      if (total === 12) return [4, 4, 4];
      const rows = [];
      let rem = total;
      while (rem > 0) { rows.push(Math.min(4, rem)); rem -= 4; }
      return rows;
    }
  
    function convertTileElement(el) {
      const isAnchor = el.tagName === "A";
      const href     = isAnchor
        ? el.getAttribute("href")
        : (el.querySelector("a") ? el.querySelector("a").getAttribute("href") : "#");
  
      let innerHtml = isAnchor ? el.innerHTML : el.outerHTML;
  
      const tmp = document.createElement("div");
      tmp.innerHTML = innerHtml;
      ["card_box", "boxhover", "featured", "card_box_wrap"].forEach((cls) => {
        tmp.querySelectorAll(`.${cls}`).forEach((node) => {
          node.classList.remove(cls);
          if (node.classList.length === 0) node.removeAttribute("class");
        });
      });
  
      return `    <a class="hover-tile" href="${href || "#"}" style="text-decoration:none; margin:10px; display:inline-block; transition:all .3s ease-in-out;">
  ${tmp.innerHTML.trim()}
      </a>`;
    }
  
    // ─── Generic row ─────────────────────────────────────────────
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
        const retained  = buildRetainedStyle(col);
        const styleAttr = retained ? ` style="${retained}"` : "";
        return `  <div class="column"${styleAttr}>\n    ${col.innerHTML.trim()}\n  </div>`;
      }).join("\n");
  
      return `<div class="row">\n${colsHtml}\n</div>`;
    }
  
    function buildRetainedStyle(el) {
      const existing = el.getAttribute("style") || "";
      const kept = existing.split(";")
        .map(s => s.trim())
        .filter(Boolean)
        .filter((decl) => {
          const prop = decl.split(":")[0].trim().toLowerCase();
          return !STRUCTURAL_PROPS.has(prop);
        });
      return kept.join("; ");
    }
  
    // ─── Expose ──────────────────────────────────────────────────
    window.convertLegacyPage = convertLegacyPage;
  
  })();