(function () {
    window.openPrintSummary = function (
      state,
      blocks,
      TILE_CONFIG,
      getIndustryData,
      getDuplicateTileCount,
      getDuplicateFaqItems,
      baseId,
      instancesOf
    ) {
      const win = window.open("", "_blank");
      if (!win) return;
  
      const client    = state.clientName || "—";
      const industry  = state.industry   || "—";
      const primary   = state.primaryColor || "#37352a";
      const accent    = state.accentColor  || "#ff7a52";
      const date      = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
      const enabledIds = state.order.filter((id) => state.enabled[id]);
  
      // ── Section rows ────────────────────────────────────────────────
      const sectionRows = enabledIds.map((instanceId) => {
        const bId   = baseId(instanceId);
        const block = blocks.find((b) => b.id === instanceId);
        if (!block) return "";
  
        const isDuplicate = instanceId.includes("__");
        const label       = isDuplicate
          ? `${blocks.find((b) => b.id === bId)?.name || bId} (${instanceId.split("__")[1]})`
          : block.name;
  
        let meta = "—";
        if (TILE_CONFIG[bId]) {
          const count = isDuplicate
            ? getDuplicateTileCount(instanceId)
            : (state.tileCounts[bId] ?? TILE_CONFIG[bId].default);
          const industryData = getIndustryData();
          const source       = (industryData[bId] && Array.isArray(Object.values(industryData[bId])[0]))
            ? Object.values(industryData[bId])[0]
            : null;
          const dataCount    = Array.isArray(source) ? source.length : count;
          const placeholder  = count > dataCount ? ` <span class="badge-warn">⚠ ${count - dataCount} placeholder</span>` : "";
          meta = `${count} tile${count !== 1 ? "s" : ""}${placeholder}`;
        } else if (bId === "faqAccordion") {
          const items = isDuplicate ? getDuplicateFaqItems(instanceId) : state.faqItems;
          meta = `${items.length} item${items.length !== 1 ? "s" : ""}`;
        }
  
        return `
          <tr>
            <td>${label}</td>
            <td>${meta}</td>
          </tr>
        `;
      }).join("");
  
      // ── Links checklist ─────────────────────────────────────────────
      // Scan enabled sections for tiles with href="#" or placeholder tiles
      const linkItems = [];
      enabledIds.forEach((instanceId) => {
        const bId = baseId(instanceId);
        const cfg = TILE_CONFIG[bId];
        if (!cfg) return;
        const isDuplicate  = instanceId.includes("__");
        const count        = isDuplicate
          ? getDuplicateTileCount(instanceId)
          : (state.tileCounts[bId] ?? cfg.default);
        const industryData = getIndustryData();
        const source       = industryData?.[bId]
          ? Object.values(industryData[bId]).find(Array.isArray)
          : null;
        const dataCount = Array.isArray(source) ? source.length : count;
        const blockLabel = blocks.find((b) => b.id === instanceId)?.name || bId;
  
        for (let i = 0; i < count; i++) {
          const tileData = Array.isArray(source) ? source[i] : null;
          const href     = tileData?.href || tileData?.ctaUrl || "#";
          const title    = tileData?.title || `Tile ${i + 1}`;
          if (!tileData || href === "#" || href === "") {
            linkItems.push(`<li><strong>${blockLabel}</strong> — ${title}: <em>Set link URL in LMS editor</em></li>`);
          }
        }
      });
  
      // Also flag hero CTAs
      const heroIds = ["heroSplit", "heroOverlay", "bannerHero", "bannerCta"];
      heroIds.forEach((id) => {
        if (!state.enabled[id]) return;
        const industryData = getIndustryData();
        const ctaUrl = industryData?.hero?.ctaUrl || industryData?.bannerCta?.ctaUrl || "#";
        if (ctaUrl === "#" || !ctaUrl) {
          const block = blocks.find((b) => b.id === id);
          linkItems.push(`<li><strong>${block?.name || id}</strong> — CTA button: <em>Set link URL in LMS editor</em></li>`);
        }
      });
  
      const linksHtml = linkItems.length
        ? `<ul class="link-list">${linkItems.join("")}</ul>`
        : `<p class="no-links">No placeholder links detected.</p>`;
  
      // ── FAQ summary ─────────────────────────────────────────────────
      const faqSections = enabledIds.filter((id) => baseId(id) === "faqAccordion");
      const faqHtml = faqSections.length ? faqSections.map((instanceId) => {
        const isDuplicate = instanceId.includes("__");
        const items       = isDuplicate ? getDuplicateFaqItems(instanceId) : state.faqItems;
        const label       = isDuplicate ? `FAQ Accordion (${instanceId.split("__")[1]})` : "FAQ Accordion";
        return `
          <h3 class="section-subhead">${label}</h3>
          ${items.map((item, i) => `
            <div class="faq-print-item">
              <div class="faq-print-q">Q${i + 1}: ${item.question || "(no question)"}</div>
              <div class="faq-print-a">${item.answer || "(no answer)"}</div>
            </div>
          `).join("")}
        `;
      }).join("") : "";
  
      // ── Full document ───────────────────────────────────────────────
      win.document.write(`<!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Page Summary — ${client}</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 14px;
        color: #1a1a1a;
        background: #faf8f5;
      }
  
      /* ── Header ── */
      .print-header {
        background: #37352a;
        color: rgba(255,255,255,.90);
        padding: 18px 32px;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .print-header__logo svg { display: block; }
      .print-header__title {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: .1px;
      }
      .print-header__meta {
        font-size: 12px;
        color: rgba(255,255,255,.55);
        margin-top: 3px;
      }
  
      /* ── Body ── */
      .print-body {
        max-width: 860px;
        margin: 0 auto;
        padding: 32px 32px 60px;
      }
  
      .section-head {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .5px;
        color: #6b7280;
        margin: 32px 0 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(0,0,0,.10);
      }
      .section-subhead {
        font-size: 13px;
        font-weight: 700;
        color: #37352a;
        margin: 18px 0 8px;
      }
  
      /* ── Colors ── */
      .color-row {
        display: flex;
        gap: 16px;
        margin-top: 4px;
      }
      .color-chip {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
      }
      .color-chip__swatch {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 1px solid rgba(0,0,0,.12);
      }
  
      /* ── Sections table ── */
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      th {
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .4px;
        color: #6b7280;
        padding: 8px 10px;
        background: #f3f4f6;
        border-bottom: 1px solid rgba(0,0,0,.10);
      }
      td {
        padding: 9px 10px;
        border-bottom: 1px solid rgba(0,0,0,.06);
        vertical-align: top;
      }
      tr:last-child td { border-bottom: none; }
  
      .badge-warn {
        display: inline-block;
        background: #fff7ed;
        color: #b45309;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid #fed7aa;
      }
  
      /* ── Links checklist ── */
      .link-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 4px;
      }
      .link-list li {
        font-size: 13px;
        padding: 8px 12px;
        background: #fff7ed;
        border: 1px solid #fed7aa;
        border-radius: 6px;
        color: #92400e;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .link-list li::before {
        content: "☐";
        font-size: 14px;
        flex-shrink: 0;
      }
      .no-links {
        font-size: 13px;
        color: #6b7280;
        font-style: italic;
      }
  
      /* ── FAQ ── */
      .faq-print-item {
        margin-bottom: 12px;
        padding: 10px 12px;
        background: #ffffff;
        border: 1px solid rgba(0,0,0,.08);
        border-radius: 6px;
      }
      .faq-print-q {
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 4px;
      }
      .faq-print-a {
        font-size: 13px;
        color: #4b5563;
        line-height: 1.5;
      }
  
      /* ── Print styles ── */
      @media print {
        body { background: #fff; }
        .print-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .color-chip__swatch { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .badge-warn, .link-list li { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
  </head>
  <body>
  
    <header class="print-header">
      <div class="print-header__logo">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect width="40" height="40" rx="8" ry="8" style="fill:#f2744e;"/>
          <path d="M32.54,12.28l-11.83-6.41c-.45-.24-.98-.24-1.43,0l-11.83,6.41c-.48.26-.78.76-.78,1.31s.3,1.06.78,1.32l3.49,1.89,3.15,1.71,5.19,2.81c.22.12.47.18.72.18s.49-.06.71-.18l5.2-2.82,3.15-1.7,3.48-1.89c.48-.26.79-.76.79-1.32s-.31-1.05-.79-1.31ZM20,18.29l-8.68-4.7,8.68-4.69,8.68,4.69-8.68,4.7Z" style="fill:#fff;"/>
          <g style="opacity:.66;">
            <path d="M33.33,20c0,.55-.3,1.06-.79,1.32l-3.47,1.88-3.15,1.7-5.21,2.82c-.22.12-.46.18-.71.18s-.49-.06-.71-.18l-5.2-2.81-3.15-1.71-3.48-1.88c-.49-.26-.79-.77-.79-1.32s.3-1.06.79-1.32l3.48-1.88,3.15,1.71-2.77,1.49,3.35,1.82c.06.02.12.06.18.09l5.15,2.78,8.68-4.69-2.77-1.5,3.15-1.7,3.48,1.88c.49.26.79.77.79,1.32Z" style="fill:#fff;"/>
          </g>
          <g style="opacity:.33;">
            <path d="M33.33,26.4c0,.55-.3,1.06-.78,1.32l-11.83,6.41c-.23.12-.47.18-.72.18s-.49-.06-.71-.18l-11.83-6.41c-.49-.26-.79-.77-.79-1.32s.3-1.06.79-1.32l3.48-1.88,3.15,1.71-2.77,1.49,8.68,4.7,8.68-4.7-2.76-1.5,3.15-1.7,3.47,1.88c.49.26.79.77.79,1.32Z" style="fill:#fff;"/>
          </g>
        </svg>
      </div>
      <div>
        <div class="print-header__title">ClearLearn Custom Page Generator</div>
        <div class="print-header__meta">
          ${client !== "—" ? `Client: ${client} &nbsp;·&nbsp; ` : ""}
          Industry: ${industry} &nbsp;·&nbsp;
          Generated: ${date}
        </div>
      </div>
    </header>
  
    <div class="print-body">
  
      <!-- Brand Colors -->
      <div class="section-head">Brand Colors</div>
      <div class="color-row">
        <div class="color-chip">
          <div class="color-chip__swatch" style="background:${primary};"></div>
          <span>Primary: ${primary}</span>
        </div>
        <div class="color-chip">
          <div class="color-chip__swatch" style="background:${accent};"></div>
          <span>Accent: ${accent}</span>
        </div>
      </div>
  
      <!-- Sections -->
      <div class="section-head">Page Sections (in order)</div>
      <table>
        <thead>
          <tr>
            <th>Section</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${sectionRows}
        </tbody>
      </table>
  
      <!-- Links to Update -->
      <div class="section-head">Links to Update in LMS</div>
      ${linksHtml}
  
      ${faqHtml ? `
      <!-- FAQ Content -->
      <div class="section-head">FAQ Content</div>
      ${faqHtml}
      ` : ""}
  
    </div>
  
    <script>
      window.onload = function () { window.print(); };
    </script>
  </body>
  </html>`);
  
      win.document.close();
    };
  })();