(function () {
  // =====================================================================
  // ELEMENT REFS
  // =====================================================================
  const els = {
    clientName:   document.getElementById("clientName"),
    primaryColor: document.getElementById("primaryColor"),
    accentColor:  document.getElementById("accentColor"),
    heroHeadline: document.getElementById("heroHeadline"),
    heroSubhead:  document.getElementById("heroSubhead"),
    heroImageUrl: document.getElementById("heroImageUrl"),
    flatCorners:  document.getElementById("flatCorners"),
    industry:     document.getElementById("industry"),
    blockList:    document.getElementById("blockList"),
    previewFrame: document.getElementById("previewFrame"),
    output:       document.getElementById("output"),
    btnCopy:      document.getElementById("btnCopy"),
    btnReset:     document.getElementById("btnReset"),
  };

  // =====================================================================
  // BLOCKS
  // =====================================================================
  const blocks = (window.LMS_SECTIONS || []).map((b) => ({ ...b }));
  if (!Array.isArray(window.LMS_SECTIONS) || window.LMS_SECTIONS.length === 0) {
    console.warn("LMS_SECTIONS is empty. sections.js may not be loading.");
  }

  // =====================================================================
  // CONSTANTS
  // =====================================================================
  let UNIVERSAL_CSS = "";

  const DEFAULT_HERO_IMAGE   = "https://images2.imgbox.com/1b/d5/X6R7pk31_o.jpeg";
  const DEFAULT_VIDEO_EMBED  = `<iframe width="100%" height="500" src="https://www.youtube.com/embed/sWUiwWwR4BE?si=vS-kSEb9cPoMarCT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

  const DEFAULT_FAQ_ITEMS = [
    {
      question: "How do I report an incident?",
      answer: `Notify your supervisor and call CORE Health immediately, no later than eight hours after the incident. Follow all guidance provided by CORE, both at work and at home. Enter the incident into Vector within 24 hours of the event. Additional documentation, including an Employee Statement Form detailing the incident, must also be submitted.`,
    },
    {
      question: "Who do I contact for support?",
      answer: `Start with your manager for process questions. For access issues or technical support, submit a ticket using the support form.`,
    },
    {
      question: `What does "Complete" mean?`,
      answer: `A learning item is marked complete after you meet the completion criteria (for example, reaching the end of the content or passing the assessment). If you believe something completed but didn't record, reach out to support.`,
    },
  ];

  const SLOT_OPTIONS = [
    { label: "— Empty —",           value: "" },
    { label: "Video Embed",         value: "__SLOT_VIDEO__" },
    { label: "Daily Snapshot",      value: `<div class="gadget-block"><p class="show-editor-only">Daily Snapshot Gadget</p><daily-snapshot></daily-snapshot></div>` },
    { label: "My Learning",         value: `<div class="gadget-block"><p class="show-editor-only">My Learning Gadget</p><training-dashboard></training-dashboard></div>` },
    { label: "Activity Feed",       value: `<div class="gadget-block"><p class="show-editor-only">Activity Feed Gadget</p><activity-feed></activity-feed></div>` },
    { label: "Classes",             value: `<div class="gadget-block"><p class="show-editor-only">Classes Gadget</p><classes></classes></div>` },
    { label: "Company News",        value: `<div class="gadget-block"><p class="show-editor-only">Company News Gadget</p><company-news></company-news></div>` },
    { label: "Forum Posts",         value: `<div class="gadget-block"><p class="show-editor-only">Forum Posts Gadget</p><forum-posts></forum-posts></div>` },
    { label: "Leaderboard",         value: `<div class="gadget-block"><p class="show-editor-only">Leaderboard Gadget</p><leaderboard></leaderboard></div>` },
    { label: "Social Files",        value: `<div class="gadget-block"><p class="show-editor-only">Social Files Gadget</p><social-files></social-files></div>` },
    { label: "Training Stats",      value: `<div class="gadget-block"><p class="show-editor-only">Training Stats Gadget</p><training-stats></training-stats></div>` },
    { label: "Company LinkedIn",    value: `<div class="gadget-block"><p class="show-editor-only">Company LinkedIn Gadget</p><company-linkedin></company-linkedin></div>` },
    { label: "Goals",               value: `<div class="gadget-block"><p class="show-editor-only">Goals Gadget</p><goals></goals></div>` },
    { label: "Certification Plans", value: `<div class="gadget-block"><p class="show-editor-only">Certification Plans Gadget</p><certification-plans></certification-plans></div>` },
    { label: "My Badges",           value: `<div class="gadget-block"><p class="show-editor-only">My Badges Gadget</p><my-badges></my-badges></div>` },
  ];

  const PRESETS = {
    primary: {
      label: "Full Page",
      tooltip: "An example of a landing page. Add or remove sections as needed",
      sections: ["heroSplit", "myLearningAndSnapshot", "learnByRole", "essentialImage", "featuredSplit", "managerToolkit", "faqAccordion"],
    },
    secondary: {
      label: "Core",
      tooltip: "An example of what could go into a secondary page. Add or remove sections as needed",
      sections: ["bannerHero", "quickAccess", "faqAccordion"],
    },
  };

  // =====================================================================
  // TILE CONFIG
  // Each multi-tile section: { default, min, max, type, dataKey }
  // =====================================================================
  const TILE_CONFIG = {
    learnByRole:   { default: 5, min: 2, max: 5, type: "image-cover", dataKey: "learnByRole.cards"    },
    essentialImage:{ default: 3, min: 2, max: 5, type: "image-cover", dataKey: "essentialImage.cards"  },
    essentialIcon: { default: 4, min: 2, max: 5, type: "icon",        dataKey: "essentialIcon.cards"   },
    rolePathways:  { default: 4, min: 2, max: 5, type: "bullet",      dataKey: "rolePathways.cards"    },
    managerToolkit:{ default: 4, min: 2, max: 5, type: "text",        dataKey: "managerToolkit.cards"  },
    resourceHub:   { default: 4, min: 2, max: 5, type: "bullet-list", dataKey: "resourceHub.columns"   },
    complianceHub: { default: 3, min: 2, max: 5, type: "bullet-cta",  dataKey: "complianceHub.columns" },
  };

  // =====================================================================
  // PLACEHOLDER SVG IMAGE
  // =====================================================================
  const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f0f0f0"/>
      <rect x="150" y="80" width="100" height="80" rx="4" fill="#ccc"/>
      <circle cx="175" cy="105" r="15" fill="#999"/>
      <polygon points="150,160 200,110 250,160" fill="#999"/>
      <text x="200" y="210" font-family="Arial" font-size="14" fill="#666" text-anchor="middle">Change this image</text>
      <text x="200" y="230" font-family="Arial" font-size="11" fill="#999" text-anchor="middle">Replace it in the LMS HTML editor</text>
    </svg>
  `)}`;

  const PLACEHOLDER_ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  `;

  // =====================================================================
  // PLACEHOLDER TILE BUILDERS
  // =====================================================================
  function buildPlaceholderTile(type) {
    switch (type) {
      case "image-cover":
        return `
          <div class="column blockgrid" data-placeholder="true">
            <a class="hover-tile" href="#">
              <div class="image-overlay">
                <img class="coverimg" src="${PLACEHOLDER_IMAGE}" alt="Replace this image in the LMS">
              </div>
              <div class="boxp">
                <h3>Title Here</h3>
                <p>Replace this image URL and update this text in the LMS editor.</p>
              </div>
            </a>
          </div>`.trim();

      case "icon":
        return `
          <div class="column blockgrid" data-placeholder="true">
            <a class="hover-tile" href="#">
              <div class="card_box_icon">
                ${PLACEHOLDER_ICON_SVG}
              </div>
              <div class="boxp">
                <h3>Title Here</h3>
                <p>Update this icon and text in the LMS editor.</p>
              </div>
            </a>
          </div>`.trim();

      case "text":
        return `
          <div class="column blockgrid" data-placeholder="true">
            <a class="hover-tile" href="#">
              <div class="boxp">
                <h3>Title Here</h3>
                <p>Update this text in the LMS editor.</p>
              </div>
            </a>
          </div>`.trim();

      case "bullet":
        return `
          <div class="column blockgrid" data-placeholder="true">
            <a class="hover-tile text-left" href="#">
              <div class="boxp">
                <h3>Title Here</h3>
                <ul class="clean-list">
                  <li>Bullet item one</li>
                  <li>Bullet item two</li>
                  <li>Bullet item three</li>
                </ul>
                <span class="text-btn">Learn More</span>
              </div>
            </a>
          </div>`.trim();

      case "bullet-list":
        return `
          <div class="column" data-placeholder="true">
            <a class="hover-tile text-left" href="#">
              <div class="boxp">
                <h3>Title Here</h3>
                <p>Update this text in the LMS editor.</p>
                <ul class="clean-list">
                  <li>Item one</li>
                  <li>Item two</li>
                  <li>Item three</li>
                </ul>
              </div>
            </a>
          </div>`.trim();

      case "bullet-cta":
        return `
          <div class="column" data-placeholder="true">
            <a class="hover-tile text-left" href="#">
              <div class="boxp">
                <h3>Title Here</h3>
                <ul class="clean-list">
                  <li>Item one</li>
                  <li>Item two</li>
                  <li>Item three</li>
                </ul>
                <span class="text-btn">Learn More</span>
              </div>
            </a>
          </div>`.trim();

      default:
        return `
          <div class="column blockgrid" data-placeholder="true">
            <a class="hover-tile" href="#">
              <div class="boxp">
                <h3>Title Here</h3>
                <p>Update this content in the LMS editor.</p>
              </div>
            </a>
          </div>`.trim();
    }
  }

  // =====================================================================
  // STATE
  // =====================================================================
  const state = {
    clientName:      (els.clientName?.value   || "").trim(),
    primaryColor:    (els.primaryColor?.value || "").trim(),
    accentColor:     (els.accentColor?.value  || "").trim(),
    heroHeight:      "40vh",
    heroHeadline:    (els.heroHeadline?.value || "").trim(),
    heroSubhead:     (els.heroSubhead?.value  || "").trim(),
    heroImageUrl:    (els.heroImageUrl?.value || "").trim(),
    industry:        (els.industry?.value     || "").trim(),
    faqItems:        DEFAULT_FAQ_ITEMS.map(item => ({ ...item })),
    flatCorners:     false,
    iconColor:       "",
    videoEmbedCode:  DEFAULT_VIDEO_EMBED,
    splitHalf:       { left: "", right: "", leftEmbed: DEFAULT_VIDEO_EMBED, rightEmbed: DEFAULT_VIDEO_EMBED },
    splitThird:      { left: "", right: "", leftEmbed: DEFAULT_VIDEO_EMBED, rightEmbed: DEFAULT_VIDEO_EMBED },
    enabled:         Object.fromEntries(blocks.map((b) => [b.id, !!b.defaultEnabled])),
    order:           blocks.map((b) => b.id),
    // Tile counts — persisted across reset (count only resets, data stays)
    tileCounts:      Object.fromEntries(Object.entries(TILE_CONFIG).map(([id, cfg]) => [id, cfg.default])),
  };

  window.state = state;

  // =====================================================================
  // INDUSTRY DATA
  // =====================================================================
  function getIndustryData() {
    if (!state.industry) return {};
    return (window.LMS_INDUSTRY_DATA?.[state.industry]) || {};
  }

  // =====================================================================
  // TILE HTML GENERATION
  // Builds tile rows for a given section, respecting current tile count.
  // Tiles beyond industry data default get placeholder HTML.
  // Splits into multiple rows of 4 if count > 5 (not used for quickAccess).
  // =====================================================================
  function buildTileRowsHtml(sectionId) {
    const cfg         = TILE_CONFIG[sectionId];
    if (!cfg) return "";

    const industryData = getIndustryData();
    const count        = state.tileCounts[sectionId] ?? cfg.default;
    const dataKey      = cfg.dataKey;                          // e.g. "learnByRole.cards"
    const sourceArray  = resolveToken(dataKey, industryData);  // array from industry data
    const tilesPerRow  = 4;

    // Build all tile HTML strings
    const tiles = [];
    for (let i = 0; i < count; i++) {
      const tileData = Array.isArray(sourceArray) ? sourceArray[i] : null;
      if (tileData) {
        tiles.push(buildIndustryTile(sectionId, cfg.type, tileData, i));
      } else {
        tiles.push(buildPlaceholderTile(cfg.type));
      }
    }

    // Split tiles into rows
    const rows = [];
    if (count <= 5) {
      rows.push(tiles);
    } else {
      // Split evenly across two rows
      const half = Math.ceil(count / 2);
      rows.push(tiles.slice(0, half));
      rows.push(tiles.slice(half));
    }

    // Wrap each group in a tile-row
    const rowClass = cfg.type === "icon" ? "row tile-row iconcards" : "row tile-row";
    return rows
      .map(group => `
<div class="${rowClass}" data-section-id="${sectionId}-tiles">
  ${group.join("\n  ")}
</div>`.trim())
      .join("\n");
  }

  // Builds a single tile from industry data for a given section type
  function buildIndustryTile(sectionId, type, data, index) {
    switch (sectionId) {
      case "learnByRole":
        return `
          <div class="column blockgrid">
            <a class="hover-tile" href="${data.href || "#"}">
              <div class="image-overlay">
                <img class="coverimg" src="${data.iconUrl || PLACEHOLDER_IMAGE}" alt="">
              </div>
              <div class="boxp">
                <h3>${data.title || ""}</h3>
                <p>${data.description || ""}</p>
              </div>
            </a>
          </div>`.trim();

      case "essentialImage":
        return `
          <div class="column blockgrid">
            <a class="hover-tile" href="${data.href || "#"}">
              <div class="image-overlay${index === 1 ? " image-overlay2" : ""}">
                <img class="coverimg" src="${data.imageUrl || PLACEHOLDER_IMAGE}" alt="">
              </div>
              <div class="boxp">
                <h3>${data.title || ""}</h3>
                <p>${data.description || ""}</p>
              </div>
            </a>
          </div>`.trim();

      case "essentialIcon":
        return `
          <div class="column blockgrid">
            <a class="hover-tile" href="${data.href || "#"}">
              <div class="card_box_icon">
                ${data.iconSvg || PLACEHOLDER_ICON_SVG}
              </div>
              <div class="boxp">
                <h3>${data.title || ""}</h3>
                <p>${data.description || ""}</p>
              </div>
            </a>
          </div>`.trim();

      case "rolePathways":
        return `
          <div class="column blockgrid">
            <a class="hover-tile text-left" href="${data.ctaUrl || "#"}">
              <div class="boxp">
                <h3>${data.title || ""}</h3>
                <ul class="clean-list">
                  <li>${data.bullets?.[0] || ""}</li>
                  <li>${data.bullets?.[1] || ""}</li>
                  <li>${data.bullets?.[2] || ""}</li>
                </ul>
                <span class="text-btn">${data.ctaText || "Learn More"}</span>
              </div>
            </a>
          </div>`.trim();

      case "managerToolkit":
        return `
          <div class="column blockgrid">
            <a class="hover-tile" href="${data.href || "#"}">
              <div class="boxp">
                <h3>${data.title || ""}</h3>
                <p>${data.description || ""}</p>
              </div>
            </a>
          </div>`.trim();

      case "resourceHub":
        return `
          <div class="column">
            <a class="hover-tile text-left">
              <div class="boxp">
                <h3>${data.title || ""}</h3>
                <p>${data.description || ""}</p>
                <ul class="clean-list">
                  <li>${data.items?.[0] || ""}</li>
                  <li>${data.items?.[1] || ""}</li>
                  <li>${data.items?.[2] || ""}</li>
                </ul>
              </div>
            </a>
          </div>`.trim();

      case "complianceHub":
        return `
          <div class="column">
            <a class="hover-tile text-left" href="${data.ctaUrl || "#"}">
              <div class="boxp">
                <h3>${data.title || ""}</h3>
                <ul class="clean-list">
                  <li>${data.items?.[0] || ""}</li>
                  <li>${data.items?.[1] || ""}</li>
                  <li>${data.items?.[2] || ""}</li>
                </ul>
                <span class="text-btn">${data.ctaText || "Learn More"}</span>
              </div>
            </a>
          </div>`.trim();

      default:
        return buildPlaceholderTile(type);
    }
  }

  // =====================================================================
  // TILE CONTROLS UI
  // =====================================================================
  function renderTileEditor(blockId) {
    const cfg = TILE_CONFIG[blockId];
    if (!cfg) return;

    const container = document.getElementById(`tileEditor-${blockId}`);
    if (!container) return;

    container.style.display = state.enabled[blockId] ? "block" : "none";
    container.innerHTML     = "";

    const count = state.tileCounts[blockId] ?? cfg.default;

    const wrap = document.createElement("div");
    wrap.className = "icon-editor";
    wrap.innerHTML = `
      <div class="field">
        <label>Number of tiles</label>
        <div class="tile-controls">
          <button
            type="button"
            class="btn btn-small tile-btn-remove"
            data-block="${blockId}"
            ${count <= cfg.min ? "disabled" : ""}
            title="Remove tile">−</button>
          <span class="tile-count-display">${count}</span>
          <button
            type="button"
            class="btn btn-small tile-btn-add"
            data-block="${blockId}"
            ${count >= cfg.max ? "disabled" : ""}
            title="Add tile">+</button>
        </div>
        <div class="hint">Min ${cfg.min} · Max ${cfg.max}. Tiles beyond the industry preset will use placeholder content.</div>
      </div>
    `;

    container.appendChild(wrap);

    wrap.querySelector(".tile-btn-add")?.addEventListener("click", () => {
      if (state.tileCounts[blockId] < cfg.max) {
        state.tileCounts[blockId]++;
        renderTileEditor(blockId);
        renderAll();
      }
    });

    wrap.querySelector(".tile-btn-remove")?.addEventListener("click", () => {
      if (state.tileCounts[blockId] > cfg.min) {
        state.tileCounts[blockId]--;
        renderTileEditor(blockId);
        renderAll();
      }
    });
  }

  // =====================================================================
  // HERO IMAGE
  // =====================================================================
  function resolveHeroImageUrl() {
    const url = (state.heroImageUrl || "").trim();
    if (/^https?:\/\//i.test(url)) return url;
    const industryData = getIndustryData();
    if (industryData.meta?.defaultHeroImage) return industryData.meta.defaultHeroImage;
    return DEFAULT_HERO_IMAGE;
  }

  // =====================================================================
  // SPLIT EDITOR
  // =====================================================================
  function renderSplitEditor(sectionId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.style.display = state.enabled[sectionId] ? "block" : "none";
    container.innerHTML = "";

    const sides = [
      { key: "left",  embedKey: "leftEmbed",  label: sectionId === "splitThird" ? "Left (66%)"  : "Left (50%)"  },
      { key: "right", embedKey: "rightEmbed", label: sectionId === "splitThird" ? "Right (33%)" : "Right (50%)" },
    ];

    sides.forEach(({ key, embedKey, label }) => {
      const field   = document.createElement("div");
      field.className = "field";
      const labelEl = document.createElement("label");
      labelEl.textContent = label;
      field.appendChild(labelEl);

      const select = document.createElement("select");
      SLOT_OPTIONS.forEach(({ label: optLabel, value }) => {
        const opt     = document.createElement("option");
        opt.value     = value;
        opt.textContent = optLabel;
        opt.selected  = state[sectionId][key] === value;
        select.appendChild(opt);
      });

      const embedField = document.createElement("div");
      embedField.className  = "field";
      embedField.style.marginTop = "8px";
      embedField.style.display   = state[sectionId][key] === "__SLOT_VIDEO__" ? "block" : "none";
      embedField.innerHTML  = `
        <label>Embed code</label>
        <textarea rows="3" placeholder="Paste your iframe embed code here...">${escapeHtml(state[sectionId][embedKey] || DEFAULT_VIDEO_EMBED)}</textarea>
        <div class="hint">Paste the full iframe embed code from your video platform.</div>
      `;

      select.addEventListener("change", () => {
        state[sectionId][key] = select.value;
        if (select.value === "__SLOT_VIDEO__" && !state[sectionId][embedKey]) {
          state[sectionId][embedKey] = DEFAULT_VIDEO_EMBED;
          embedField.querySelector("textarea").value = DEFAULT_VIDEO_EMBED;
        }
        embedField.style.display = select.value === "__SLOT_VIDEO__" ? "block" : "none";
        renderAll();
      });

      embedField.querySelector("textarea")?.addEventListener("input", (e) => {
        state[sectionId][embedKey] = e.target.value;
        renderAll();
      });

      field.appendChild(select);
      container.appendChild(field);
      container.appendChild(embedField);
    });
  }

  // =====================================================================
  // TOKEN RESOLUTION
  // =====================================================================
  function resolveToken(path, data) {
    return path.split(".").reduce((acc, key) => {
      if (acc == null || typeof acc !== "object") return undefined;
      return /^\d+$/.test(key) ? acc[Number(key)] : acc[key];
    }, data) ?? "";
  }

  function applyTokens(html) {
    const industryData = getIndustryData();
    html = (html || "").replace(/__VIDEO_EMBED__/g, state.videoEmbedCode || "");
    return html.replace(/\{\{([^}]+)\}\}/g, (_, raw) => {
      const key = raw.trim();
      if (key === "HERO_IMAGE")                 return resolveHeroImageUrl();
      if (key === "CLIENT_NAME")                return (state.clientName || "").trim();
      if (key === "HERO_HEADLINE")              return state.heroHeadline || "";
      if (key === "HERO_SUBHEAD")               return state.heroSubhead  || "";
      if (key === "videoAndSnapshot.embedCode") return state.videoEmbedCode || "";
      if (key === "splitHalf.left")   return state.splitHalf.left   === "__SLOT_VIDEO__" ? (state.splitHalf.leftEmbed   || DEFAULT_VIDEO_EMBED) : (state.splitHalf.left   || "");
      if (key === "splitHalf.right")  return state.splitHalf.right  === "__SLOT_VIDEO__" ? (state.splitHalf.rightEmbed  || DEFAULT_VIDEO_EMBED) : (state.splitHalf.right  || "");
      if (key === "splitThird.left")  return state.splitThird.left  === "__SLOT_VIDEO__" ? (state.splitThird.leftEmbed  || DEFAULT_VIDEO_EMBED) : (state.splitThird.left  || "");
      if (key === "splitThird.right") return state.splitThird.right === "__SLOT_VIDEO__" ? (state.splitThird.rightEmbed || DEFAULT_VIDEO_EMBED) : (state.splitThird.right || "");
      const val = resolveToken(key, industryData);
      return val == null ? "" : String(val);
    });
  }

  // =====================================================================
  // FLOATING COPY BUTTON
  // =====================================================================
  function initFloatingCopyBtn() {
    const btn    = els.btnCopy;
    const header = document.querySelector(".app-header");
    if (!btn || !header) return;
    const observer = new IntersectionObserver(
      ([entry]) => btn.classList.toggle("is-floating", !entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(header);
  }

  // =====================================================================
  // INIT
  // =====================================================================
  els.industry?.addEventListener("change", () => {
    state.industry = (els.industry.value || "").trim();
    renderBlockPicker();
    renderAll();
  });

  init();

  async function init() {
    await loadUniversalCss();
    bindInputs();
    renderBlockPicker();
    renderAll();
    initFloatingCopyBtn();
  }

  async function loadUniversalCss() {
    try {
      const res = await fetch("./assets/css/universal.css", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      UNIVERSAL_CSS = await res.text();
    } catch (e) {
      console.warn("Could not load universal.css", e);
      UNIVERSAL_CSS = "";
    }
  }

  // =====================================================================
  // INPUT BINDING
  // =====================================================================
  function bindInputs() {
    ["clientName", "primaryColor", "accentColor", "heroHeadline", "heroSubhead", "heroImageUrl"].forEach((key) => {
      if (!els[key]) return;
      els[key].addEventListener("input", () => {
        state[key] = (els[key].value || "").trim();
        renderAll();
      });
    });

    els.btnCopy?.addEventListener("click",  copyOutput);
    els.btnReset?.addEventListener("click", resetDefaults);

    els.flatCorners?.addEventListener("change", () => {
      state.flatCorners = els.flatCorners.checked;
      renderAll();
    });

    const selectAll = document.getElementById("selectAll");
    selectAll?.addEventListener("change", () => {
      const checked  = selectAll.checked;
      const heroIds  = ["heroSplit", "heroOverlay"];
      state.order.forEach((id) => {
        if (heroIds.includes(id)) {
          state.enabled[id] = checked ? id === "heroSplit" : false;
        } else {
          state.enabled[id] = checked;
        }
      });
      syncSelectAll();
      renderBlockPicker();
      renderFaqEditor();
      renderIconEditor();
      renderHeroEditor();
      renderAll();
    });

    document.getElementById("presetPrimary")?.addEventListener("click",   () => applyPreset("primary"));
    document.getElementById("presetSecondary")?.addEventListener("click", () => applyPreset("secondary"));
  }

  // =====================================================================
  // PRESETS
  // =====================================================================
  function applyPreset(presetKey) {
    const preset  = PRESETS[presetKey];
    if (!preset) return;
    const heroIds = ["heroSplit", "heroOverlay"];

    state.order.forEach((id) => { state.enabled[id] = false; });

    preset.sections.forEach((id) => {
      if (!state.enabled.hasOwnProperty(id)) return;
      if (heroIds.includes(id)) {
        if (!state.order.some((oid) => heroIds.includes(oid) && state.enabled[oid])) {
          state.enabled[id] = true;
        }
      } else {
        state.enabled[id] = true;
      }
    });

    syncSelectAll();
    renderBlockPicker();
    renderFaqEditor();
    renderIconEditor();
    renderHeroEditor();
    renderVideoEditor();
    renderSplitEditor("splitHalf",  "splitHalfEditor");
    renderSplitEditor("splitThird", "splitThirdEditor");
    Object.keys(TILE_CONFIG).forEach((id) => renderTileEditor(id));
    renderAll();
  }

  // =====================================================================
  // HERO EDITOR
  // =====================================================================
  function renderHeroEditor() {
    const container = document.getElementById("heroEditor");
    if (!container) return;
    const anyHero = ["heroSplit", "heroOverlay"].some((id) => state.enabled[id]);
    container.style.display = anyHero ? "block" : "none";
    container.innerHTML     = "";

    const wrap = document.createElement("div");
    wrap.className = "icon-editor";
    wrap.innerHTML = `
      <div class="field">
        <label>Hero height override</label>
        <input type="text" id="heroHeightInput" value="${escapeAttr(state.heroHeight)}" placeholder="Default: 40vh"/>
        <div class="hint">Accepts vh, px, rem or % — e.g. 60vh, 400px.</div>
      </div>
    `;
    container.appendChild(wrap);

    document.getElementById("heroHeightInput")?.addEventListener("input", (e) => {
      state.heroHeight = e.target.value.trim();
      renderAll();
    });
  }

  // =====================================================================
  // BLOCK PICKER
  // =====================================================================
  function renderBlockPicker() {
    els.blockList.innerHTML = "";
    if (!state.order.length) {
      els.blockList.innerHTML = `<div class="hint">No sections loaded. Check console and confirm sections.js is loading.</div>`;
      return;
    }

    const industrySelected = !!state.industry;

    state.order.forEach((blockId, index) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      const row = document.createElement("div");
      row.className = "block-row";
      if (!industrySelected) row.classList.add("block-row--disabled");

      const left = document.createElement("div");
      left.className = "block-row__left";

      const checkbox    = document.createElement("input");
      checkbox.type     = "checkbox";
      checkbox.checked  = !!state.enabled[block.id];
      checkbox.disabled = !industrySelected;

      checkbox.addEventListener("change", () => {
        if (!industrySelected) return;
        state.enabled[block.id] = checkbox.checked;

        if (block.id === "faqAccordion")                                   renderFaqEditor();
        if (block.id === "essentialIcon")                                  renderIconEditor();
        if (["heroSplit", "heroOverlay"].includes(block.id))               renderHeroEditor();
        if (block.id === "splitHalf")                                      renderSplitEditor("splitHalf",  "splitHalfEditor");
        if (block.id === "splitThird")                                     renderSplitEditor("splitThird", "splitThirdEditor");
        if (block.id === "videoAndSnapshot")                               renderVideoEditor();
        if (TILE_CONFIG[block.id])                                         renderTileEditor(block.id);

        syncSelectAll();
        renderAll();
      });

      const label       = document.createElement("div");
      label.className   = "block-row__label";
      label.textContent = block.name;

      left.appendChild(checkbox);
      left.appendChild(label);

      const right = document.createElement("div");
      right.className = "block-row__right";
      right.appendChild(button("Up",   () => move(index, -1)));
      right.appendChild(button("Down", () => move(index, +1)));

      row.appendChild(left);
      row.appendChild(right);
      els.blockList.appendChild(row);

      // ── Editor mounts ──────────────────────────────────────────────
      if (block.id === "faqAccordion") {
        const mount = document.createElement("div");
        mount.id = "faqEditor";
        els.blockList.appendChild(mount);
        renderFaqEditor();
      }

      if (block.id === "essentialIcon") {
        const mount = document.createElement("div");
        mount.id = "iconEditor";
        els.blockList.appendChild(mount);
        renderIconEditor();
      }

      if (block.id === "splitHalf") {
        const mount = document.createElement("div");
        mount.id = "splitHalfEditor";
        els.blockList.appendChild(mount);
        renderSplitEditor("splitHalf", "splitHalfEditor");
      }

      if (block.id === "splitThird") {
        const mount = document.createElement("div");
        mount.id = "splitThirdEditor";
        els.blockList.appendChild(mount);
        renderSplitEditor("splitThird", "splitThirdEditor");
      }

      if (block.id === "heroOverlay") {
        const mount = document.createElement("div");
        mount.id = "heroEditor";
        els.blockList.appendChild(mount);
        renderHeroEditor();
      }

      if (block.id === "videoAndSnapshot") {
        const mount = document.createElement("div");
        mount.id = "videoEditor";
        els.blockList.appendChild(mount);
        renderVideoEditor();
      }

      // Tile editor mounts for all multi-tile sections
      if (TILE_CONFIG[block.id]) {
        const mount = document.createElement("div");
        mount.id    = `tileEditor-${block.id}`;
        els.blockList.appendChild(mount);
        renderTileEditor(block.id);
      }
    });

    if (!industrySelected) {
      const hint = document.createElement("div");
      hint.className          = "hint";
      hint.style.marginBottom = "10px";
      hint.style.textAlign    = "center";
      hint.textContent        = "Select an industry above to enable block selection.";
      els.blockList.insertBefore(hint, els.blockList.firstChild);
    }

    syncSelectAll();
  }

  // =====================================================================
  // SELECT ALL SYNC
  // =====================================================================
  function syncSelectAll() {
    const selectAll      = document.getElementById("selectAll");
    const selectAllRow   = document.getElementById("selectAllRow");
    const selectAllLabel = document.getElementById("selectAllLabel");
    if (!selectAll) return;

    const industrySelected = !!state.industry;
    selectAll.disabled     = !industrySelected;
    if (selectAllRow) selectAllRow.classList.toggle("disabled", !industrySelected);

    const ignoredIds  = ["heroOverlay"];
    const relevantIds = state.order.filter((id) => !ignoredIds.includes(id));
    const allChecked  = relevantIds.every((id)  => state.enabled[id]);
    const someChecked = relevantIds.some((id)   => state.enabled[id]);

    selectAll.checked       = allChecked;
    selectAll.indeterminate = someChecked && !allChecked;
    if (selectAllLabel) selectAllLabel.textContent = allChecked ? "Deselect All" : "Select All";
  }

  // =====================================================================
  // VIDEO EDITOR
  // =====================================================================
  function renderVideoEditor() {
    const container = document.getElementById("videoEditor");
    if (!container) return;
    container.style.display = state.enabled["videoAndSnapshot"] ? "block" : "none";
    container.innerHTML     = "";

    const wrap = document.createElement("div");
    wrap.className = "icon-editor";
    wrap.innerHTML = `
      <div class="field">
        <label>Video embed code</label>
        <textarea id="videoEmbedInput" rows="4" placeholder="Paste your iframe embed code here...">${escapeHtml(state.videoEmbedCode)}</textarea>
        <div class="hint">Paste the full iframe embed code from your video platform.</div>
      </div>
    `;
    container.appendChild(wrap);

    document.getElementById("videoEmbedInput")?.addEventListener("input", (e) => {
      state.videoEmbedCode = e.target.value;
      renderAll();
    });
  }

  // =====================================================================
  // FAQ EDITOR
  // =====================================================================
  function renderFaqEditor() {
    const container = document.getElementById("faqEditor");
    if (!container) return;
    container.style.display = state.enabled["faqAccordion"] ? "block" : "none";
    container.innerHTML     = "";

    state.faqItems.forEach((item, index) => {
      const wrap = document.createElement("div");
      wrap.className = "faq-editor-item";
      wrap.innerHTML = `
        <div class="faq-editor-item__header">
          <span class="faq-editor-item__label">FAQ ${index + 1}</span>
          <div class="faq-editor-item__controls">
            <button type="button" class="btn btn-small" data-faq-up="${index}"     ${index === 0 ? "disabled" : ""}>↑</button>
            <button type="button" class="btn btn-small" data-faq-down="${index}"   ${index === state.faqItems.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" class="btn btn-small btn-danger" data-faq-remove="${index}" ${state.faqItems.length <= 1 ? "disabled" : ""}>−</button>
          </div>
        </div>
        <div class="field">
          <label>Question</label>
          <input type="text" value="${escapeAttr(item.question)}" placeholder="Enter your question here." data-faq-question="${index}"/>
        </div>
        <div class="field">
          <label>Answer</label>
          <textarea rows="3" placeholder="Enter your answer here." data-faq-answer="${index}">${escapeHtml(item.answer)}</textarea>
        </div>
      `;
      container.appendChild(wrap);
    });

    const addBtn = document.createElement("button");
    addBtn.type      = "button";
    addBtn.className = "btn btn-small";
    addBtn.style.marginTop = "8px";
    addBtn.textContent     = "+ Add FAQ Item";
    addBtn.addEventListener("click", () => {
      state.faqItems.push({ question: "", answer: "" });
      renderFaqEditor();
      renderAll();
    });
    container.appendChild(addBtn);

    container.querySelectorAll("[data-faq-question]").forEach(input => {
      input.addEventListener("input", () => {
        state.faqItems[+input.dataset.faqQuestion].question = input.value;
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-answer]").forEach(textarea => {
      textarea.addEventListener("input", () => {
        state.faqItems[+textarea.dataset.faqAnswer].answer = textarea.value;
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-up]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.faqUp;
        if (i === 0) return;
        [state.faqItems[i - 1], state.faqItems[i]] = [state.faqItems[i], state.faqItems[i - 1]];
        renderFaqEditor();
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-down]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.faqDown;
        if (i === state.faqItems.length - 1) return;
        [state.faqItems[i], state.faqItems[i + 1]] = [state.faqItems[i + 1], state.faqItems[i]];
        renderFaqEditor();
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.faqRemove;
        if (state.faqItems.length <= 1) return;
        state.faqItems.splice(i, 1);
        renderFaqEditor();
        renderAll();
      });
    });
  }

  // =====================================================================
  // ICON EDITOR
  // =====================================================================
  function renderIconEditor() {
    const container = document.getElementById("iconEditor");
    if (!container) return;
    container.style.display = state.enabled["essentialIcon"] ? "block" : "none";
    container.innerHTML     = "";

    const wrap = document.createElement("div");
    wrap.className = "icon-editor";
    wrap.innerHTML = `
      <div class="field">
        <label>Icon color override</label>
        <input type="text" id="iconColorInput" value="${escapeAttr(state.iconColor)}" placeholder="Default: brand color"/>
        <div class="hint">Leave blank to use your brand color.</div>
      </div>
    `;
    container.appendChild(wrap);

    document.getElementById("iconColorInput")?.addEventListener("input", (e) => {
      state.iconColor = e.target.value.trim();
      renderAll();
    });
  }

  // =====================================================================
  // UTILITIES
  // =====================================================================
  function escapeAttr(str) {
    return (str || "").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function escapeHtml(str) {
    return (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function move(index, delta) {
    const next = index + delta;
    if (next < 0 || next >= state.order.length) return;
    const copy    = state.order.slice();
    const tmp     = copy[index];
    copy[index]   = copy[next];
    copy[next]    = tmp;
    state.order   = copy;
    renderBlockPicker();
    renderAll();
  }

  function button(text, onClick) {
    const btn       = document.createElement("button");
    btn.type        = "button";
    btn.className   = "btn btn-small";
    btn.textContent = text;
    btn.addEventListener("click", onClick);
    return btn;
  }

  // =====================================================================
  // RENDER ALL
  // =====================================================================
  function renderAll() {
    const anyEnabled = state.order.some((id) => state.enabled[id]);
    if (!anyEnabled) {
      els.output.value = "";
      renderEmptyState();
      return;
    }
    const html       = assembleContentHtml();
    const css        = buildExportCss();
    const exportHtml = `<style>\n${css}\n</style>\n${html}`.trim();
    els.output.value = exportHtml;
    renderPreviewFrame(css, html);
  }

  // =====================================================================
  // EMPTY STATE
  // =====================================================================
  function renderEmptyState() {
    const iframe = els.previewFrame;
    if (!iframe) return;
    const baseHref = new URL("./", window.location.href).toString();
    iframe.srcdoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <base href="${baseHref}"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{margin:0;background:#faf8f5;font-family:Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
    .empty-state{text-align:center;max-width:480px;padding:48px 32px;background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
    .empty-state__icon{width:56px;height:56px;margin:0 auto 20px;background:#ffe9df;border-radius:50%;display:flex;align-items:center;justify-content:center}
    .empty-state__icon svg{width:28px;height:28px;stroke:#ffa680;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .empty-state__title{font-size:17px;font-weight:700;color:#1a1a1a;margin-bottom:12px;line-height:1.3;text-align:left}
    .empty-state__steps{list-style:none;padding:0;margin:0 0 24px;text-align:left;display:inline-block}
    .empty-state__steps li{font-size:13px;color:#4b5563;padding:6px 0 6px 28px;position:relative;line-height:1.5}
    .empty-state__steps li::before{content:attr(data-step);position:absolute;left:0;top:6px;width:20px;height:20px;background:#37352a;color:#fff;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1}
    .empty-state__hint{font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:16px;margin-top:4px}
    .best-practice__steps{text-align:left;font-size:14px;color:#4b5563;line-height:1.3;padding:0 20px}
    .best-practice__steps li{font-size:13px;color:#4b5563;position:relative;line-height:1.5;margin-top:10px}
  </style>
</head>
<body>
  <div class="empty-state">
    <div class="empty-state__icon">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
    </div>
    <div class="empty-state__title">No blocks selected yet</div>
    <ol class="empty-state__steps">
      <li data-step="1">Enter the client name (optional), and select their industry (required)</li>
      <li data-step="2">Set brand colors</li>
      <li data-step="3">Enter hero image URL if applicable. Imgbox is a great host</li>
      <li data-step="4">Check the blocks you want to include. Some have additional customization options</li>
      <li data-step="5">Click <strong>Copy HTML</strong> to paste into a custom page in the LMS</li>
    </ol>
    <div class="empty-state__title">Best practices</div>
    <ul class="best-practice__steps">
      <li>Determine if this is a landing page or a secondary page. A landing page would use a hero. Secondary pages typically don't — use the Banner w/ CTA as header</li>
      <li>Don't overload your page. Determine your purpose and build for that. Mix up your block selections to keep the page interesting</li>
      <li>Get creative. Change the wording in sections to meet your needs. The LMS editor makes that easy</li>
    </ul>
    <div class="empty-state__hint">The preview will appear here once you select at least one block.</div>
  </div>
</body>
</html>`;
  }

  // =====================================================================
  // PREVIEW FRAME
  // =====================================================================
  function renderPreviewFrame(exportCss, contentHtml) {
    const iframe   = els.previewFrame;
    if (!iframe) return;
    const baseHref = new URL("./", window.location.href).toString();

    const previewOnlyCss = `
      .gadget-block {
        min-height: 180px;
        border: 2px dashed var(--brandColor, #023843) !important;
        border-radius: 8px;
        background: rgba(0,0,0,.03) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative;
      }
      .gadget-block activity-feed,.gadget-block classes,.gadget-block company-news,
      .gadget-block daily-snapshot,.gadget-block forum-posts,.gadget-block leaderboard,
      .gadget-block social-files,.gadget-block training-dashboard,.gadget-block training-stats,
      .gadget-block company-linkedin,.gadget-block goals,.gadget-block certification-plans,
      .gadget-block my-badges { display: none !important; }
      .gadget-block:has(activity-feed)::after       { content: "Gadget: Activity Feed"; }
      .gadget-block:has(classes)::after             { content: "Gadget: Classes"; }
      .gadget-block:has(company-news)::after        { content: "Gadget: Company News"; }
      .gadget-block:has(daily-snapshot)::after      { content: "Gadget: Daily Snapshot"; }
      .gadget-block:has(forum-posts)::after         { content: "Gadget: Forum Posts"; }
      .gadget-block:has(leaderboard)::after         { content: "Gadget: Leaderboard"; }
      .gadget-block:has(social-files)::after        { content: "Gadget: Social Files"; }
      .gadget-block:has(training-dashboard)::after  { content: "Gadget: My Learning"; }
      .gadget-block:has(training-stats)::after      { content: "Gadget: Training Stats"; }
      .gadget-block:has(company-linkedin)::after    { content: "Gadget: Company LinkedIn"; }
      .gadget-block:has(goals)::after               { content: "Gadget: Goals"; }
      .gadget-block:has(certification-plans)::after { content: "Gadget: Certification Plans"; }
      .gadget-block:has(my-badges)::after           { content: "Gadget: My Badges"; }
      .gadget-block::after {
        font-size: 13px; font-weight: 700; color: var(--brandColor, #023843);
        opacity: 0.6; font-family: Arial, Helvetica, sans-serif;
        text-transform: uppercase; letter-spacing: 0.5px;
      }
      [data-placeholder="true"] { outline: 2px dashed #f0a500; outline-offset: -2px; }
    `;

    iframe.srcdoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <base href="${baseHref}"/>
  <link rel="stylesheet" href="./assets/css/cbuilder5.css">
  <style>
    ${exportCss}
    body { margin: 0; background: #fff; font-family: Arial, Helvetica, sans-serif !important; }
    .height-40 { height: 5vh; width: 100%; }
    .lms-preview-shell { width: 100%; max-width: 1100px; margin: 0 auto; padding: 24px; box-sizing: border-box; }
    ${previewOnlyCss}
  </style>
</head>
<body>
  <div class="lms-preview-shell contentbuilder-page">
    ${contentHtml}
  </div>
</body>
</html>`;
  }

  // =====================================================================
  // ASSEMBLE HTML
  // =====================================================================
  function assembleContentHtml() {
    const heroIds = ["heroSplit", "heroOverlay", "bannerHero"];
    const anyHero = heroIds.some((id) => state.enabled[id]);
    const spacer  = `<div class="row" data-section-id="spacer-40">
  <div class="column"><div class="spacer height-40"></div></div>
</div>`;

    const content = state.order
      .filter((id) => state.enabled[id])
      .map((id) => {
        const block = blocks.find((b) => b.id === id);
        if (!block) return "";

        // Multi-tile sections use dynamic HTML builder
        if (TILE_CONFIG[id]) {
          return buildTileSectionHtml(id, block);
        }

        const html = typeof block.getHtml === "function"
          ? block.getHtml()
          : (block.html || "");
        return applyTokens(html);
      })
      .join("\n");

    return anyHero ? content : `${spacer}\n${content}`;
  }

  // Builds the full section HTML for a multi-tile section
  function buildTileSectionHtml(sectionId, block) {
    const industryData = getIndustryData();

    // Section heading rows are still token-driven from industry data
    const headingTokens = {
      learnByRole:    { heading: resolveToken("learnByRole.subheading",    industryData) },
      essentialImage: { heading: resolveToken("essentialImage.subheading", industryData) },
      essentialIcon:  { heading: resolveToken("essentialIcon.subheading",  industryData) },
      rolePathways:   { heading: resolveToken("rolePathways.subheading",   industryData) },
      managerToolkit: { heading: resolveToken("managerToolkit.subheading", industryData) },
      resourceHub:    {
        heading:    resolveToken("resourceHub.heading",    industryData),
        subheading: resolveToken("resourceHub.subheading", industryData),
      },
      complianceHub:  { heading: resolveToken("complianceHub.subheading",  industryData) },
    };

    const t        = headingTokens[sectionId] || {};
    const tileRows = buildTileRowsHtml(sectionId);
    const spacer   = `<div class="row" data-section-id="spacer-40">
  <div class="column"><div class="spacer height-40"></div></div>
</div>`;

    switch (sectionId) {
      case "learnByRole":
        return `
<div class="row" data-section-id="learn-by-role">
  <div class="column sectionheadline">
    <h2>Learn by Role</h2>
    <p>${t.heading}</p>
  </div>
</div>
${tileRows}
${spacer}`.trim();

      case "essentialImage":
        return `
<div class="row" data-section-id="essential-image-cards">
  <div class="column sectionheadline">
    <h2>Essentials</h2>
    <p>${t.heading}</p>
  </div>
</div>
${tileRows}
${spacer}`.trim();

      case "essentialIcon":
        return `
<div class="row" data-section-id="essential-icon-cards">
  <div class="column sectionheadline">
    <h2>Essential Training</h2>
    <p>${t.heading}</p>
  </div>
</div>
${tileRows}
${spacer}`.trim();

      case "rolePathways":
        return `
<div class="row" data-section-id="role-pathways">
  <div class="column sectionheadline">
    <h2>Role-Based Pathways</h2>
    <p>${t.heading}</p>
  </div>
</div>
${tileRows}
${spacer}`.trim();

      case "managerToolkit":
        return `
<div class="row" data-section-id="manager-toolkit">
  <div class="column sectionheadline">
    <h2>Manager Toolkit</h2>
    <p>${t.heading}</p>
  </div>
</div>
${tileRows}
${spacer}`.trim();

      case "resourceHub":
        return `
<div class="row" data-section-id="resource-hub">
  <div class="column sectionheadline">
    <h2>${t.heading}</h2>
    <p>${t.subheading}</p>
  </div>
</div>
${tileRows}
${spacer}`.trim();

      case "complianceHub":
        return `
<div class="row" data-section-id="compliance-hub">
  <div class="column sectionheadline">
    <h2>Compliance Hub</h2>
    <p>${t.heading}</p>
  </div>
</div>
${tileRows}
${spacer}`.trim();

      default:
        return applyTokens(block.html || "");
    }
  }

  // =====================================================================
  // CSS BUILD
  // =====================================================================
  function buildExportCss() {
    const brand  = sanitizeColor(state.primaryColor, "#37352a");
    const accent = sanitizeColor(state.accentColor,  "#ff7a52");
    const heroEnabled = !!(state.enabled["heroSplit"] || state.enabled["heroOverlay"] || state.enabled["bannerHero"]);
    const heroHeight  = heroEnabled
      ? sanitizeHeroHeight((state.heroHeight || "40vh").trim())
      : "40vh";

    const vars = `:root {
  --brandColor:  ${brand};
  --accentColor: ${accent};
  --heroHeight:  ${heroHeight};
}`;

    const flatCss = state.flatCorners ? `
/* =========================================================
   FLAT CORNERS OVERRIDE
   ========================================================= */
*, *::before, *::after { border-radius: 0 !important; }` : "";

    const iconColorCss = state.enabled["essentialIcon"] && sanitizeColor(state.iconColor, "")
      ? `\n\n/* Icon color override */\n.card_box_icon svg path { fill: ${sanitizeColor(state.iconColor, "")} !important; }`
      : "";

    return `${vars}\n\n${UNIVERSAL_CSS}${flatCss}${iconColorCss}`.trim();
  }

  function sanitizeHeroHeight(v) {
    const s = (v || "").trim();
    if (/^\d+(\.\d+)?(vh|vw|px|rem|%)$/.test(s)) return s;
    return "40vh";
  }

  function sanitizeColor(value, fallback) {
    const v = (value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    if (/^#[0-9a-fA-F]{3}$/.test(v)) return v;
    return fallback;
  }

  // =====================================================================
  // COPY
  // =====================================================================
  async function copyOutput() {
    const text = els.output.value || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      els.btnCopy.textContent = "Copied!";
      setTimeout(() => (els.btnCopy.textContent = "Copy HTML"), 900);
    } catch {
      els.output.focus();
      els.output.select();
      els.btnCopy.textContent = "Select + Copy";
      setTimeout(() => (els.btnCopy.textContent = "Copy HTML"), 1200);
    }
  }

  // =====================================================================
  // RESET
  // =====================================================================
  function resetDefaults() {
    // DOM resets
    els.clientName.value   = "";
    els.primaryColor.value = "#37352a";
    els.accentColor.value  = "#ff7a52";
    els.heroImageUrl.value = "";
    els.industry.value     = "";
    if (els.flatCorners)   els.flatCorners.checked = false;
    if (els.heroHeadline)  els.heroHeadline.value  = "Training that holds up in an audit";
    if (els.heroSubhead)   els.heroSubhead.value   = "This demo shows how the LMS supports compliance, safety, and onboarding with repeatable programs, clear assignments, and audit-ready reporting.";

    // State resets
    state.clientName     = "";
    state.primaryColor   = "#37352a";
    state.accentColor    = "#ff7a52";
    state.heroHeadline   = "Training that holds up in an audit";
    state.heroSubhead    = "This demo shows how the LMS supports compliance, safety, and onboarding with repeatable programs, clear assignments, and audit-ready reporting.";
    state.heroImageUrl   = "";
    state.flatCorners    = false;
    state.iconColor      = "";
    state.industry       = "";
    state.heroHeight     = "40vh";
    state.videoEmbedCode = DEFAULT_VIDEO_EMBED;
    state.splitHalf      = { left: "", right: "", leftEmbed: DEFAULT_VIDEO_EMBED, rightEmbed: DEFAULT_VIDEO_EMBED };
    state.splitThird     = { left: "", right: "", leftEmbed: DEFAULT_VIDEO_EMBED, rightEmbed: DEFAULT_VIDEO_EMBED };
    state.enabled        = Object.fromEntries(blocks.map((b) => [b.id, !!b.defaultEnabled]));
    state.order          = blocks.map((b) => b.id);
    state.faqItems       = DEFAULT_FAQ_ITEMS.map(item => ({ ...item }));

    // Reset tile counts to defaults — data is preserved
    Object.entries(TILE_CONFIG).forEach(([id, cfg]) => {
      state.tileCounts[id] = cfg.default;
    });

    const selectAll = document.getElementById("selectAll");
    if (selectAll) { selectAll.checked = false; selectAll.indeterminate = false; }

    renderBlockPicker();
    renderFaqEditor();
    renderIconEditor();
    renderHeroEditor();
    renderVideoEditor();
    renderSplitEditor("splitHalf",  "splitHalfEditor");
    renderSplitEditor("splitThird", "splitThirdEditor");
    Object.keys(TILE_CONFIG).forEach((id) => renderTileEditor(id));
    renderAll();
  }

})();