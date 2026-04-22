/* =============================================================
   ClearLearn Legacy → v5 Page Converter
   Applies all v5 layout rules to pasted legacy HTML
   ============================================================= */

   (function () {

    // ─── Entry point ────────────────────────────────────────────
    function convertLegacyPage(rawHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");
      const body = doc.body;
  
      cleanLegacyClasses(body);
      const sections = extractSections(body);
      const outputParts = [];
  
      // Hero CSS always prepended
      outputParts.push(buildHeroCSS());
  
      sections.forEach((section) => {
        outputParts.push(convertSection(section));
      });
  
      return outputParts.filter(Boolean).join("\n");
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
  
    // ─── Strip legacy classes from every element ────────────────
    const LEGACY_CLASSES = [
      "clearfix", "full", "s12", "l1", "l2", "l3", "l4", "l5",
      "l6", "l7", "l8", "l9", "l10", "l11", "l12",
      "blockgrid", "third", "fourth", "half", "two-third",
      "boxhover", "featured", "card_box_wrap",
    ];
  
    function cleanLegacyClasses(root) {
      root.querySelectorAll("*").forEach((el) => {
        LEGACY_CLASSES.forEach((cls) => el.classList.remove(cls));
        // Remove empty class attributes
        if (el.classList.length === 0) el.removeAttribute("class");
      });
    }
  
    // ─── Section detection ──────────────────────────────────────
    // Treat each top-level .row (or equivalent block) as a section
    function extractSections(body) {
      const sections = [];
      const children = Array.from(body.children);
  
      // Group consecutive non-row elements into anonymous sections
      let buffer = [];
  
      const flushBuffer = () => {
        if (buffer.length) {
          sections.push({ type: "raw", nodes: [...buffer] });
          buffer = [];
        }
      };
  
      children.forEach((child) => {
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
  
      // ── Spacer rows ──
      if (isSpacerRow(row)) return buildSpacerRow();
  
      // ── HR elements → spacer ──
      if (row.querySelector("hr")) return buildSpacerRow();
  
      // ── Hero section ──
      if (sectionId === "hero" || isHeroRow(row)) return convertHeroRow(row);
  
      // ── FAQ section ──
      if (sectionId === "faq-accordion" || isFaqRow(row)) return convertFaqSection(row);
  
      // ── Quick Links ──
      if (sectionId === "quick-links" || isQuickLinksRow(row)) return convertQuickLinksSection(row);
  
      // ── Tile / card grid ──
      if (hasTiles(row)) return convertTileSection(row);
  
      // ── Standard content row ──
      return convertGenericRow(row);
    }
  
    // ─── Detection helpers ──────────────────────────────────────
    function isSpacerRow(row) {
      const text = row.textContent.trim();
      if (text === "") return true;
      if (row.querySelector(".spacer")) return true;
      return false;
    }
  
    function isHeroRow(row) {
      const img = row.querySelector("img");
      if (!img) return false;
      const src = (img.getAttribute("src") || "").toLowerCase();
      // Heuristic: large banner image, or hero/banner in class or data attrs
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
        /quick.?link/i.test(row.textContent) === false &&
        row.querySelectorAll("a[href]").length >= 2 &&
        row.querySelectorAll(".column").length >= 2 &&
        row.querySelectorAll("img").length === 0
      );
    }
  
    function hasTiles(row) {
      return (
        row.querySelector(".card_box, .hover-tile, .blockgrid, [class*='tile']") !== null
      );
    }
  
    function detectSectionType(row) {
      const html = row.innerHTML.toLowerCase();
      if (/hero|banner|fulloverlay/.test(html)) return "hero";
      if (/faq/.test(html)) return "faq-accordion";
      if (/quick.?link/.test(html)) return "quick-links";
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
      const img = row.querySelector("img");
      const imgSrc = img ? img.getAttribute("src") : "";
      const imgAlt = img ? (img.getAttribute("alt") || "") : "";
  
      // Find library button if present
      const btn = row.querySelector("a.hero-library-btn, a[class*='library'], a[class*='hero']");
      const btnHref = btn ? btn.getAttribute("href") : "#";
      const btnText = btn ? btn.textContent.trim() : "LIBRARY";
  
      return `<div class="row">
    <div style="position:relative; display:inline-block; width:100%;">
      <img src="${imgSrc}" alt="${imgAlt}" style="width:100%; height:auto; display:block;">
      <div style="position:absolute; left:0; right:0; bottom:13%; z-index:5;" class="flex justify-center">
        <a class="hero-library-btn" href="${btnHref}">${btnText}</a>
      </div>
    </div>
  </div>`;
    }
  
    // ─── FAQ ─────────────────────────────────────────────────────
    function convertFaqSection(row) {
      // Collect all FAQ items — support legacy formats
      const items = [];
  
      // Format A: existing .faq-item elements
      row.querySelectorAll(".faq-item").forEach((item) => {
        const q = item.querySelector(".faq-question, label, h3, h4, strong");
        const a = item.querySelector(".faq-answer, .faq-answer-inner, p");
        if (q) {
          items.push({
            question: q.textContent.trim(),
            answer: a ? a.innerHTML.trim() : "",
          });
        }
      });
  
      // Format B: definition list
      if (items.length === 0) {
        row.querySelectorAll("dt").forEach((dt, i) => {
          const dd = dt.nextElementSibling;
          items.push({
            question: dt.textContent.trim(),
            answer: dd ? dd.innerHTML.trim() : "",
          });
        });
      }
  
      // Format C: table rows (Q | A)
      if (items.length === 0) {
        row.querySelectorAll("tr").forEach((tr) => {
          const cells = tr.querySelectorAll("td, th");
          if (cells.length >= 2) {
            items.push({
              question: cells[0].textContent.trim(),
              answer: cells[1].innerHTML.trim(),
            });
          }
        });
      }
  
      if (items.length === 0) return convertGenericRow(row);
  
      // Heading if present
      const headingEl = row.querySelector("h2, h3, .sectionheadline");
      const heading = headingEl ? headingEl.textContent.trim() : "FAQ";
  
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
  
      const itemsHtml = items
        .map(
          (item, i) => `    <div class="faq-item">
        <input class="faq-toggle" type="checkbox" id="faq-${i + 1}">
        <label class="faq-question" for="faq-${i + 1}">${item.question}</label>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>${item.answer}</p>
          </div>
        </div>
      </div>`
        )
        .join("\n");
  
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
      // Collect all link-column pairs from this row and sibling QL rows
      const allLinks = [];
  
      const extractFromRow = (r) => {
        r.querySelectorAll(".column").forEach((col) => {
          const a = col.querySelector("a[href]");
          const label = col.querySelector("p, span, h3, h4, strong");
          if (a) {
            allLinks.push({
              label: label ? label.textContent.trim() : "",
              text: a.textContent.trim(),
              href: a.getAttribute("href"),
            });
          }
        });
      };
  
      extractFromRow(row);
  
      // Group into rows of 3
      const COLS_PER_ROW = 3;
      const chunks = [];
      for (let i = 0; i < allLinks.length; i += COLS_PER_ROW) {
        chunks.push(allLinks.slice(i, i + COLS_PER_ROW));
      }
  
      // Build heading if present
      const headingEl = row.querySelector("h2, h3, .sectionheadline");
      const headingHtml = headingEl
        ? `<div class="row">\n  <div class="column">\n    <h2>${headingEl.textContent.trim()}</h2>\n  </div>\n</div>\n`
        : "";
  
      const rowsHtml = chunks
        .map((chunk) => {
          const cols = chunk
            .map(
              (link) => `  <div class="column">
      ${link.label ? `<p style="text-align:center;">${link.label}</p>` : ""}
      <a href="${link.href}" style="display:block; width:75%; margin:0 auto; text-align:center; padding:10px; background:#42748d; text-decoration:none; font-weight:700; color:white;">${link.text}</a>
    </div>`
            )
            .join("\n");
          return `<div class="row">\n${cols}\n</div>`;
        })
        .join(`\n${buildSpacerRow()}\n`);
  
      return `${headingHtml}${rowsHtml}`;
    }
  
    // ─── Tile / Card Grid ────────────────────────────────────────
    function convertTileSection(row) {
      // Gather ALL tiles from this row
      const tileEls = Array.from(
        row.querySelectorAll(".card_box, .hover-tile, .column.blockgrid, .column > a")
      );
  
      // De-duplicate (card_box may be child of hover-tile)
      const uniqueTiles = [];
      tileEls.forEach((el) => {
        const dominated = tileEls.some(
          (other) => other !== el && other.contains(el)
        );
        if (!dominated) uniqueTiles.push(el);
      });
  
      if (uniqueTiles.length === 0) return convertGenericRow(row);
  
      // Heading if present
      const headingEl = row.querySelector("h2, h3, .sectionheadline");
      const headingHtml = headingEl
        ? `<div class="row">\n  <div class="column">\n    <h2>${headingEl.textContent.trim()}</h2>\n  </div>\n</div>\n`
        : "";
  
      // Determine row distribution
      const total = uniqueTiles.length;
      const distribution = getTileDistribution(total);
      const maxCols = Math.max(...distribution);
  
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
            // Empty column to maintain sizing
            cols.push(`  <div class="column"></div>`);
          }
        }
        rows.push(`<div class="row">\n${cols.join("\n")}\n</div>`);
      });
  
      return `${headingHtml}${rows.join("\n")}`;
    }
  
    function getTileDistribution(total) {
      if (total <= 4) return [total];
      if (total === 5) return [3, 2];
      if (total === 6) return [3, 3];
      if (total === 7) return [4, 3];
      if (total === 8) return [4, 4];
      if (total === 9) return [3, 3, 3];
      if (total === 10) return [4, 3, 3];
      if (total === 11) return [4, 4, 3];
      if (total === 12) return [4, 4, 4];
      // Fallback: rows of 4
      const rows = [];
      let remaining = total;
      while (remaining > 0) {
        rows.push(Math.min(4, remaining));
        remaining -= 4;
      }
      return rows;
    }
  
    function convertTileElement(el) {
      // Find or create anchor
      let anchor = el.tagName === "A" ? el : el.querySelector("a");
      const href = anchor ? anchor.getAttribute("href") : "#";
  
      // Get inner content — remove the anchor wrapper if present, keep children
      let innerHtml;
      if (el.tagName === "A") {
        innerHtml = el.innerHTML;
      } else if (anchor) {
        innerHtml = anchor.innerHTML;
      } else {
        innerHtml = el.innerHTML;
      }
  
      // Clean class remnants inside inner HTML via a temp element
      const tmp = document.createElement("div");
      tmp.innerHTML = innerHtml;
      ["card_box", "boxhover", "featured", "card_box_wrap"].forEach((cls) => {
        tmp.querySelectorAll(`.${cls}`).forEach((node) => node.classList.remove(cls));
      });
  
      return `    <a class="hover-tile" href="${href}" style="text-decoration:none; margin:10px; display:inline-block; transition:all .3s ease-in-out;">
  ${tmp.innerHTML.trim()}
      </a>`;
    }
  
    // ─── Generic row conversion ──────────────────────────────────
    function convertGenericRow(row) {
      const columns = Array.from(row.querySelectorAll(":scope > .column"));
  
      if (columns.length === 0) {
        // Row has no columns — wrap content in one
        const content = row.innerHTML.trim();
        if (!content) return buildSpacerRow();
        return `<div class="row">
    <div class="column">
      ${content}
    </div>
  </div>`;
      }
  
      const colsHtml = columns
        .map((col) => {
          // Strip only layout modifier classes, keep everything else
          col.className = "column";
          return `  <div class="column">\n    ${col.innerHTML.trim()}\n  </div>`;
        })
        .join("\n");
  
      return `<div class="row">\n${colsHtml}\n</div>`;
    }
  
    // ─── Expose ──────────────────────────────────────────────────
    window.convertLegacyPage = convertLegacyPage;
  
  })();