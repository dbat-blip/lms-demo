/* global window, document, fetch */
(function () {
    const els = {
      clientName: document.getElementById("clientName"),
      primaryColor: document.getElementById("primaryColor"),
      accentColor: document.getElementById("accentColor"),
      heroHeadline: document.getElementById("heroHeadline"),
      heroSubhead: document.getElementById("heroSubhead"),
      heroImageUrl: document.getElementById("heroImageUrl"),
      blockList: document.getElementById("blockList"),
      previewFrame: document.getElementById("previewFrame"),
      output: document.getElementById("output"),
      btnCopy: document.getElementById("btnCopy"),
      btnReset: document.getElementById("btnReset"),
    };
  
    const blocks = (window.LMSDEMO_BLOCKS || []).map(b => ({ ...b }));
  
    const state = {
      clientName: els.clientName.value.trim(),
      primaryColor: els.primaryColor.value.trim(),
      accentColor: els.accentColor.value.trim(),
      heroHeadline: els.heroHeadline.value.trim(),
      heroSubhead: els.heroSubhead.value.trim(),
      heroImageUrl: els.heroImageUrl.value.trim(),
      enabled: Object.fromEntries(blocks.map(b => [b.id, !!b.defaultEnabled])),
      order: blocks.map(b => b.id),
      templateHtml: "",
      lmsCss: "",
    };
  
    init();
  
    async function init() {
        state.templateHtml = await loadTemplate();
        state.lmsCss = await loadLmsCss();
        bindInputs();
        renderBlockPicker();
        renderAll();
      }
  
    function bindInputs() {
      [
        "clientName",
        "primaryColor",
        "accentColor",
        "heroHeadline",
        "heroSubhead",
        "heroImageUrl",
      ].forEach((key) => {
        els[key].addEventListener("input", () => {
          state[key] = els[key].value.trim();
          renderAll();
        });
      });
  
      els.btnCopy.addEventListener("click", copyOutput);
      els.btnReset.addEventListener("click", resetDefaults);
    }
  
    function renderBlockPicker() {
      els.blockList.innerHTML = "";
  
      state.order.forEach((blockId, index) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;
  
        const row = document.createElement("div");
        row.className = "block-row";
  
        const left = document.createElement("div");
        left.className = "block-row__left";
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !!state.enabled[block.id];
        checkbox.addEventListener("change", () => {
          state.enabled[block.id] = checkbox.checked;
          renderAll();
        });
  
        const label = document.createElement("div");
        label.className = "block-row__label";
        label.textContent = block.name;
  
        left.appendChild(checkbox);
        left.appendChild(label);
  
        const right = document.createElement("div");
        right.className = "block-row__right";
  
        const up = button("Up", () => move(index, -1));
        const down = button("Down", () => move(index, +1));
  
        right.appendChild(up);
        right.appendChild(down);
  
        row.appendChild(left);
        row.appendChild(right);
  
        els.blockList.appendChild(row);
      });
    }
  
    function move(index, delta) {
      const next = index + delta;
      if (next < 0 || next >= state.order.length) return;
  
      const copy = state.order.slice();
      const tmp = copy[index];
      copy[index] = copy[next];
      copy[next] = tmp;
  
      state.order = copy;
      renderBlockPicker();
      renderAll();
    }
  
    function button(text, onClick) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-small";
      btn.textContent = text;
      btn.addEventListener("click", onClick);
      return btn;
    }
  
    function renderAll() {
      const html = assembleContentHtml();
      const style = buildExportCss();
  
      const exportHtml = state.templateHtml
        .replace("{{STYLE}}", style)
        .replace("{{CONTENT}}", html);
  
      els.output.value = exportHtml;
  
      // Preview: render with the same CSS in-place
      renderPreviewFrame(style, html);
      
      function renderPreviewFrame(exportStyle, contentHtml) {
        const iframe = els.previewFrame;
        if (!iframe) return;
      
        // Use an HTML document that mimics the LMS environment
        const docHtml = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>${state.lmsCss || ""}</style>
        <style>${exportStyle}</style>
      </head>
      <body>
        ${contentHtml}
      </body>
      </html>`;
      
        // srcdoc is simplest + works well for static Pages previews
        iframe.srcdoc = docHtml;
      }
    }
    
  
    function assembleContentHtml() {
      const data = {
        clientName: state.clientName,
        primaryColor: state.primaryColor,
        accentColor: state.accentColor,
        heroHeadline: state.heroHeadline,
        heroSubhead: state.heroSubhead,
        heroImageUrl: state.heroImageUrl,
      };
  
      return state.order
        .filter(id => state.enabled[id])
        .map(id => {
          const block = blocks.find(b => b.id === id);
          return block ? block.render(data) : "";
        })
        .join("\n");
    }
  
    function buildExportCss() {
      // Keep CSS namespaced under .lmsdemo to reduce LMS collisions
      const brand = sanitizeColor(state.primaryColor, "#254677");
      const accent = sanitizeColor(state.accentColor, "#55baea");
  
      return `
  .lmsdemo{
    --brand:${brand};
    --accent:${accent};
    --ink:#111827;
    --muted:#4b5563;
    --border:#e5e7eb;
    --surface:#ffffff;
    --surface2:#f6f8fb;
    --radius:12px;
    --shadow:0 10px 30px rgba(0,0,0,.08);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    color:var(--ink);
  }
  .lmsdemo .lmsdemo-wrap{ width:100%; }
  .lmsdemo .lmsdemo-block{ margin:16px 0; }
  .lmsdemo .lmsdemo-card{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:var(--radius);
    box-shadow:var(--shadow);
  }
  .lmsdemo .lmsdemo-pad{ padding:18px; }
  .lmsdemo .lmsdemo-h1{
    margin:10px 0 10px 0;
    color:var(--brand);
    font-size:28px;
    line-height:1.15;
  }
  .lmsdemo .lmsdemo-h2{
    margin:0 0 8px 0;
    color:var(--brand);
    font-size:18px;
    line-height:1.2;
  }
  .lmsdemo p{
    margin:0 0 12px 0;
    color:var(--muted);
    line-height:1.5;
  }
  .lmsdemo .lmsdemo-meta{
    margin-top:10px;
    font-size:13px;
    font-weight:650;
    color:var(--ink);
  }
  .lmsdemo .lmsdemo-chip{
    display:inline-block;
    padding:6px 10px;
    border-radius:999px;
    border:1px solid var(--border);
    background:var(--surface2);
    color:var(--ink);
    font-size:13px;
    font-weight:700;
  }
  .lmsdemo .lmsdemo-chip--soft{
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
    background: color-mix(in srgb, var(--accent) 12%, var(--surface));
  }
  .lmsdemo .lmsdemo-chiprow{ display:flex; flex-wrap:wrap; gap:10px; margin:12px 0; }
  .lmsdemo .lmsdemo-note{ margin:10px 0 0 0; font-size:13px; }
  
  /* Grid */
  .lmsdemo .lmsdemo-grid{ display:grid; gap:14px; }
  @media (min-width: 860px){
    .lmsdemo .lmsdemo-grid--3{ grid-template-columns:repeat(3,1fr); }
  }
  
  /* Hero */
  .lmsdemo .lmsdemo-hero__card{ display:flex; gap:16px; align-items:stretch; overflow:hidden; }
  .lmsdemo .lmsdemo-hero__content{ padding:18px; flex:1; }
  .lmsdemo .lmsdemo-hero__img{ width:38%; min-width:240px; background:var(--surface2); }
  .lmsdemo .lmsdemo-hero__img img{ width:100%; height:100%; object-fit:cover; display:block; }
  @media (max-width: 859px){
    .lmsdemo .lmsdemo-hero__card{ flex-direction:column; }
    .lmsdemo .lmsdemo-hero__img{ width:100%; min-width:auto; max-height:240px; }
  }
  
  /* Steps */
  .lmsdemo .lmsdemo-steps{ display:grid; gap:12px; margin-top:12px; }
  @media (min-width: 860px){ .lmsdemo .lmsdemo-steps{ grid-template-columns:repeat(2,1fr); } }
  .lmsdemo .lmsdemo-step{ display:flex; gap:12px; }
  .lmsdemo .lmsdemo-step__num{
    width:32px; height:32px; border-radius:999px;
    display:flex; align-items:center; justify-content:center;
    background:var(--brand); color:#fff; font-weight:800;
    flex:0 0 32px;
  }
  .lmsdemo .lmsdemo-step__title{ font-weight:750; color:var(--ink); margin-bottom:2px; }
  .lmsdemo .lmsdemo-step__text{ color:var(--muted); }
  
  /* FAQ (CSS-only accordion) */
  .lmsdemo .lmsdemo-faq{ margin-top:10px; }
  .lmsdemo .lmsdemo-faqitem{ border-top:1px solid var(--border); }
  .lmsdemo .lmsdemo-faqitem:last-child{ border-bottom:1px solid var(--border); }
  .lmsdemo .lmsdemo-faqcheck{ position:absolute; opacity:0; pointer-events:none; }
  .lmsdemo .lmsdemo-faqlabel{
    display:flex; justify-content:space-between; gap:14px;
    padding:12px 0; cursor:pointer;
    font-weight:700; color:var(--ink);
  }
  .lmsdemo .lmsdemo-faqicon{
    display:inline-flex; align-items:center; justify-content:center;
    width:26px; height:26px; border-radius:999px;
    border:1px solid var(--border);
    color:var(--brand);
    flex:0 0 26px;
  }
  .lmsdemo .lmsdemo-faqpanel{
    max-height:0; overflow:hidden;
    transition:max-height .25s ease;
  }
  .lmsdemo .lmsdemo-faqpanel p{ margin:0 0 12px 0; }
  .lmsdemo .lmsdemo-faqcheck:checked + .lmsdemo-faqlabel .lmsdemo-faqicon{ transform:rotate(45deg); }
  .lmsdemo .lmsdemo-faqcheck:checked ~ .lmsdemo-faqpanel{ max-height:240px; }
  `.trim();
    }
  
    function sanitizeColor(value, fallback) {
      const v = (value || "").trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
      if (/^#[0-9a-fA-F]{3}$/.test(v)) return v;
      return fallback;
    }
  
    async function loadTemplate() {
      try {
        const res = await fetch("./export/template.html", { cache: "no-store" });
        if (!res.ok) throw new Error("Template fetch failed");
        return await res.text();
      } catch {
        // Fallback if GitHub Pages caching or paths get weird
        return `<div class="lmsdemo"><style>{{STYLE}}</style><div class="lmsdemo-wrap">{{CONTENT}}</div></div>`;
      }
    }
    async function loadLmsCss() {
        try {
          const res = await fetch("./assets/css/contentbuilder5.css", { cache: "no-store" });
          if (!res.ok) throw new Error("LMS CSS fetch failed");
          return await res.text();
        } catch {
          // If the file isn’t present yet, preview still works, just not LMS-accurate
          return "";
        }
      }
  
    async function copyOutput() {
      const text = els.output.value || "";
      if (!text) return;
  
      try {
        await navigator.clipboard.writeText(text);
        els.btnCopy.textContent = "Copied";
        setTimeout(() => (els.btnCopy.textContent = "Copy HTML"), 900);
      } catch {
        // iOS Safari can be finicky; select text as fallback
        els.output.focus();
        els.output.select();
        els.btnCopy.textContent = "Select + Copy";
        setTimeout(() => (els.btnCopy.textContent = "Copy HTML"), 1200);
      }
    }
  
    function resetDefaults() {
      els.clientName.value = "";
      els.primaryColor.value = "#254677";
      els.accentColor.value = "#55baea";
      els.heroHeadline.value = "Training that holds up in an audit";
      els.heroSubhead.value = "This demo shows how the LMS supports compliance, safety, and onboarding with repeatable programs, clear assignments, and audit-ready reporting.";
      els.heroImageUrl.value = "";
  
      state.clientName = "";
      state.primaryColor = "#254677";
      state.accentColor = "#55baea";
      state.heroHeadline = els.heroHeadline.value;
      state.heroSubhead = els.heroSubhead.value;
      state.heroImageUrl = "";
  
      // Restore block defaults + order
      state.enabled = Object.fromEntries(blocks.map(b => [b.id, !!b.defaultEnabled]));
      state.order = blocks.map(b => b.id);
  
      renderBlockPicker();
      renderAll();
    }
  })();