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

  const DEFAULT_HERO_IMAGE  = "https://images2.imgbox.com/1b/d5/X6R7pk31_o.jpeg";
  const DEFAULT_VIDEO_EMBED = `<iframe width="100%" height="500" src="https://www.youtube.com/embed/sWUiwWwR4BE?si=vS-kSEb9cPoMarCT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

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
  // =====================================================================
  const TILE_CONFIG = {
    learnByRole:    { default: 5, min: 2, max: 5, type: "image-cover", dataKey: "learnByRole.cards"    },
    essentialImage: { default: 3, min: 2, max: 5, type: "image-cover", dataKey: "essentialImage.cards"  },
    essentialIcon:  { default: 4, min: 2, max: 5, type: "icon",        dataKey: "essentialIcon.cards"   },
    rolePathways:   { default: 4, min: 2, max: 5, type: "bullet",      dataKey: "rolePathways.cards"    },
    managerToolkit: { default: 4, min: 2, max: 5, type: "text",        dataKey: "managerToolkit.cards"  },
    resourceHub:    { default: 4, min: 2, max: 5, type: "bullet-list", dataKey: "resourceHub.columns"   },
    complianceHub:  { default: 3, min: 2, max: 5, type: "bullet-cta",  dataKey: "complianceHub.columns" },
  };

  // =====================================================================
  // DUPLICATABLE SECTIONS + TOOLTIP DESCRIPTIONS
  // =====================================================================
  const DUPLICATABLE_IDS = new Set([
    "bannerCta", "featuredSplit", "featuredSplitFilled",
    "splitHalf", "splitThird", "learnByRole", "essentialImage",
    "essentialIcon", "rolePathways", "managerToolkit", "resourceHub",
    "complianceHub", "quickAccess", "faqAccordion", "bannerHero",
  ]);

  const SECTION_TOOLTIPS = {
    heroSplit:             "Full-width background image with a right-aligned content panel. Best used as the primary landing page opener.",
    heroOverlay:           "Full-width darkened image with a centered headline and CTA button. Bold and direct landing page opener.",
    bannerHero:            "Shorter image banner with a title and link. Works well as a secondary page header.",
    bannerCta:             "Image background with a heading and subtext on the left and a CTA button on the right. Good for driving a single action.",
    myLearningAndSnapshot: "Two-column gadget row. Shows a learner's assigned training dashboard alongside their daily activity snapshot.",
    learnByRole:           "Image tile grid for organizing learning by job function. Each tile can link to a path, tag, or learning object.",
    essentialImage:        "Image tile grid for highlighting priority courses or learning objects. Good for featured or required content.",
    essentialIcon:         "Icon tile grid for key training topics. Icons inherit your brand color. Each tile links to a path, tag, or learning object.",
    rolePathways:          "Text-based card grid with bullet points. Suited for structured multi-step learning journeys by role.",
    managerToolkit:        "Simple text tile grid for manager-specific resources, learning paths, or tools.",
    resourceHub:           "Text cards with bullet lists for organizing reference material, job aids, or resources by category.",
    complianceHub:         "Text cards with bullet lists and CTAs. Focused on compliance topics and required training.",
    quickAccess:           "Two-row image tile grid for fast navigation to frequently visited content, tools, or learning objects.",
    featuredSplit:         "Single featured item with an image on the left and title, description, and CTA on the right.",
    featuredSplitFilled:   "Same as Featured Split with a filled brand-color background treatment for more visual impact.",
    videoAndSnapshot:      "Two-column layout with a video embed on the left and the daily snapshot gadget on the right.",
    splitHalf:             "Two equal 50/50 columns. Each side can hold a gadget, video embed, or be left empty.",
    splitThird:            "Two columns at a 66/33 split. Useful for a video or main content with a narrower sidebar gadget.",
    faqAccordion:          "Expandable question and answer accordion. Items are fully editable from the builder.",
  };

  // =====================================================================
  // PLACEHOLDER SVG
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
              <div class="card_box_icon">${PLACEHOLDER_ICON_SVG}</div>
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
    clientName:     (els.clientName?.value   || "").trim(),
    primaryColor:   (els.primaryColor?.value || "").trim(),
    accentColor:    (els.accentColor?.value  || "").trim(),
    heroHeight:     "40vh",
    heroHeadline:   (els.heroHeadline?.value || "").trim(),
    heroSubhead:    (els.heroSubhead?.value  || "").trim(),
    heroImageUrl:   (els.heroImageUrl?.value || "").trim(),
    industry:       (els.industry?.value     || "").trim(),
    faqItems:       DEFAULT_FAQ_ITEMS.map(item => ({ ...item })),
    flatCorners:    false,
    iconColor:      "",
    videoEmbedCode: DEFAULT_VIDEO_EMBED,
    splitHalf:      { left: "", right: "", leftEmbed: DEFAULT_VIDEO_EMBED, rightEmbed: DEFAULT_VIDEO_EMBED },
    splitThird:     { left: "", right: "", leftEmbed: DEFAULT_VIDEO_EMBED, rightEmbed: DEFAULT_VIDEO_EMBED },
    enabled:        Object.fromEntries(blocks.map((b) => [b.id, !!b.defaultEnabled])),
    order:          blocks.map((b) => b.id),
    tileCounts:     Object.fromEntries(Object.entries(TILE_CONFIG).map(([id, cfg]) => [id, cfg.default])),
    // Duplicate section state keyed by instanceId e.g. "featuredSplit__2"
    duplicates:     {},
  };

  window.state = state;

  // =====================================================================
  // DUPLICATE HELPERS
  // =====================================================================

  // Returns the base ID from an instance ID e.g. "featuredSplit__2" → "featuredSplit"
  function baseId(instanceId) {
    return instanceId.split("__")[0];
  }

  // Returns all instance IDs for a base ID (including the original)
  function instancesOf(bId) {
    return state.order.filter((id) => baseId(id) === bId);
  }

  // Creates a duplicate entry in state
  function createDuplicate(bId) {
    const existing = instancesOf(bId);
    if (existing.length >= 3) return;

    const nextNum   = existing.length + 1;
    const newId     = `${bId}__${nextNum}`;
    const origBlock = blocks.find((b) => b.id === bId);
    if (!origBlock) return;

    // Register new block instance
    blocks.push({ ...origBlock, id: newId, _isDuplicate: true, _baseId: bId });

    // Copy state from original
    state.enabled[newId] = true;
    state.duplicates[newId] = {
      splitSlots: bId === "splitHalf" || bId === "splitThird"
        ? { ...state[bId] }
        : null,
      tileCount: TILE_CONFIG[bId] ? state.tileCounts[bId] : null,
      faqItems:  bId === "faqAccordion" ? state.faqItems.map(i => ({ ...i })) : null,
    };

    // Insert immediately after the last instance of this base ID
    const lastIdx = state.order.lastIndexOf(existing[existing.length - 1]);
    state.order.splice(lastIdx + 1, 0, newId);

    renderBlockPicker();
    renderAll();
  }

  function removeDuplicate(instanceId) {
    delete state.enabled[instanceId];
    delete state.duplicates[instanceId];
    state.order = state.order.filter((id) => id !== instanceId);
    const blockIdx = blocks.findIndex((b) => b.id === instanceId);
    if (blockIdx !== -1) blocks.splice(blockIdx, 1);
    renderBlockPicker();
    renderAll();
  }

  // Gets the effective state for a duplicate split section
  function getDuplicateSplitState(instanceId) {
    if (state.duplicates[instanceId]?.splitSlots) {
      return state.duplicates[instanceId].splitSlots;
    }
    const bId = baseId(instanceId);
    return state[bId] || { left: "", right: "", leftEmbed: DEFAULT_VIDEO_EMBED, rightEmbed: DEFAULT_VIDEO_EMBED };
  }

  // Gets the effective tile count for a duplicate tile section
  function getDuplicateTileCount(instanceId) {
    if (state.duplicates[instanceId]?.tileCount != null) {
      return state.duplicates[instanceId].tileCount;
    }
    return TILE_CONFIG[baseId(instanceId)]?.default ?? 3;
  }

  // Gets the effective FAQ items for a duplicate FAQ section
  function getDuplicateFaqItems(instanceId) {
    if (state.duplicates[instanceId]?.faqItems) {
      return state.duplicates[instanceId].faqItems;
    }
    return state.faqItems;
  }

  // =====================================================================
  // WARNINGS
  // =====================================================================
  const WARNING_DEFS = {
    twoHeroes: {
      id:      "twoHeroes",
      message: "Two hero sections are enabled. Only one hero should be active at a time.",
    },
    placeholderTiles: {
      id:      "placeholderTiles",
      message: "One or more sections contain placeholder tiles. Remember to replace image URLs and update links in the LMS editor.",
    },
    defaultColors: {
      id:      "defaultColors",
      message: "Brand colors are still set to the default values. Update them to match your client.",
    },
  };

  // Closed state persists — only reopens when a NEW warning appears
  const warningState = {
    active:   new Set(),   // currently active warning IDs
    seen:     new Set(),   // warnings the user has already been shown
    closed:   false,
  };

  function evaluateWarnings() {
    const prev    = new Set(warningState.active);
    const next    = new Set();
    const heroIds = ["heroSplit", "heroOverlay", "bannerHero"];

    // Two heroes
    const enabledHeroes = heroIds.filter((id) => state.enabled[id]);
    if (enabledHeroes.length > 1) next.add("twoHeroes");

    // Placeholder tiles — any enabled tile section with count > industry data coverage
    Object.entries(TILE_CONFIG).forEach(([id, cfg]) => {
      const count       = state.tileCounts[id] ?? cfg.default;
      const industryData = getIndustryData();
      const source       = resolveToken(cfg.dataKey, industryData);
      const dataCount    = Array.isArray(source) ? source.length : 0;
      if (state.enabled[id] && count > dataCount) next.add("placeholderTiles");
    });

    // Default colors
    const defaultPrimary = "#37352a";
    const defaultAccent  = "#ff7a52";
    if (
      (!state.primaryColor || state.primaryColor === defaultPrimary) &&
      (!state.accentColor  || state.accentColor  === defaultAccent)
    ) next.add("defaultColors");

    // Check if any NEW warnings appeared
    const hasNew = [...next].some((id) => !prev.has(id));

    warningState.active = next;

    // Reopen panel if there are new warnings
    if (hasNew && next.size > 0) {
      warningState.closed = false;
    }

    // Remove warnings that cleared
    [...prev].forEach((id) => {
      if (!next.has(id)) warningState.seen.delete(id);
    });

    renderWarnings();
  }

  function renderWarnings() {
    let panel = document.getElementById("warningPanel");
  
    if (warningState.active.size === 0) {
      if (panel) {
        panel.classList.add("warning-panel--exit");
        panel.addEventListener("animationend", () => panel.remove(), { once: true });
      }
      return;
    }
  
    if (!panel) {
      panel = document.createElement("div");
      panel.id        = "warningPanel";
      panel.className = "warning-panel";
      // ← Insert into body instead of near the copy button
      document.body.appendChild(panel);
    }
  
    panel.classList.toggle("warning-panel--hidden", warningState.closed);
    panel.classList.remove("warning-panel--exit");
  
    panel.innerHTML = `
      <div class="warning-panel__header">
        <span class="warning-panel__title">⚠️ Heads up</span>
        <button type="button" class="warning-panel__close" id="warningClose" title="Dismiss">✕</button>
      </div>
      <ul class="warning-panel__list">
        ${[...warningState.active].map((id) => `
          <li class="warning-panel__item">${WARNING_DEFS[id].message}</li>
        `).join("")}
      </ul>
    `;
  
    document.getElementById("warningClose")?.addEventListener("click", () => {
      warningState.closed = true;
      panel.classList.add("warning-panel--hidden");
    });
  }

  // =====================================================================
  // INDUSTRY DATA
  // =====================================================================
  function getIndustryData() {
    if (!state.industry) return {};
    return (window.LMS_INDUSTRY_DATA?.[state.industry]) || {};
  }

  // =====================================================================
  // TILE HTML GENERATION
  // =====================================================================
  function buildTileRowsHtml(sectionId, instanceId) {
    const cfg          = TILE_CONFIG[sectionId];
    if (!cfg) return "";

    const industryData = getIndustryData();
    const isDuplicate  = !!instanceId && instanceId !== sectionId;
    const count        = isDuplicate
      ? getDuplicateTileCount(instanceId)
      : (state.tileCounts[sectionId] ?? cfg.default);

    const sourceArray  = resolveToken(cfg.dataKey, industryData);
    const tilesPerRow  = 4;

    const tiles = [];
    for (let i = 0; i < count; i++) {
      const tileData = Array.isArray(sourceArray) ? sourceArray[i] : null;
      tiles.push(tileData
        ? buildIndustryTile(sectionId, cfg.type, tileData, i)
        : buildPlaceholderTile(cfg.type)
      );
    }

    const rows = count <= 5
      ? [tiles]
      : [tiles.slice(0, Math.ceil(count / 2)), tiles.slice(Math.ceil(count / 2))];

    const rowClass = cfg.type === "icon" ? "row tile-row iconcards" : "row tile-row";
    return rows
      .map(group => `
<div class="${rowClass}" data-section-id="${sectionId}-tiles">
  ${group.join("\n  ")}
</div>`.trim())
      .join("\n");
  }

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
              <div class="card_box_icon">${data.iconSvg || PLACEHOLDER_ICON_SVG}</div>
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
  // TILE EDITOR
  // =====================================================================
  function renderTileEditor(instanceId) {
    const bId = baseId(instanceId);
    const cfg = TILE_CONFIG[bId];
    if (!cfg) return;

    const container = document.getElementById(`tileEditor-${instanceId}`);
    if (!container) return;

    container.style.display = state.enabled[instanceId] ? "block" : "none";
    container.innerHTML     = "";

    const isDuplicate = instanceId !== bId;
    const count = isDuplicate
      ? getDuplicateTileCount(instanceId)
      : (state.tileCounts[bId] ?? cfg.default);

    const wrap = document.createElement("div");
    wrap.className = "icon-editor";
    wrap.innerHTML = `
      <div class="field">
        <label>Number of tiles</label>
        <div class="tile-controls">
          <button type="button" class="btn btn-small tile-btn-remove" data-instance="${instanceId}" ${count <= cfg.min ? "disabled" : ""} title="Remove tile">−</button>
          <span class="tile-count-display">${count}</span>
          <button type="button" class="btn btn-small tile-btn-add"    data-instance="${instanceId}" ${count >= cfg.max ? "disabled" : ""} title="Add tile">+</button>
        </div>
        <div class="hint">Min ${cfg.min} · Max ${cfg.max}. Tiles beyond the industry preset will use placeholder content.</div>
      </div>
    `;

    container.appendChild(wrap);

    wrap.querySelector(".tile-btn-add")?.addEventListener("click", () => {
      if (isDuplicate) {
        if (state.duplicates[instanceId].tileCount < cfg.max) {
          state.duplicates[instanceId].tileCount++;
          renderTileEditor(instanceId);
          renderAll();
        }
      } else {
        if (state.tileCounts[bId] < cfg.max) {
          state.tileCounts[bId]++;
          renderTileEditor(instanceId);
          renderAll();
        }
      }
    });

    wrap.querySelector(".tile-btn-remove")?.addEventListener("click", () => {
      if (isDuplicate) {
        if (state.duplicates[instanceId].tileCount > cfg.min) {
          state.duplicates[instanceId].tileCount--;
          renderTileEditor(instanceId);
          renderAll();
        }
      } else {
        if (state.tileCounts[bId] > cfg.min) {
          state.tileCounts[bId]--;
          renderTileEditor(instanceId);
          renderAll();
        }
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
  // HERO IMAGE PREVIEW
  // =====================================================================
  function renderHeroImagePreview() {
    const container = document.getElementById("heroImagePreview");
    if (!container) return;

    const url = resolveHeroImageUrl();
    if (!url) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="hero-image-preview">
        <img
          src="${escapeAttr(url)}"
          alt="Hero preview"
          onerror="this.parentElement.innerHTML='<span class=hero-image-preview__error>Could not load image</span>'"
        />
      </div>
    `;
  }

  // =====================================================================
  // SPLIT EDITOR
  // =====================================================================
  function renderSplitEditor(sectionId, containerId, instanceId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const iid        = instanceId || sectionId;
    const isDuplicate = iid !== sectionId;
    const slotState  = isDuplicate ? getDuplicateSplitState(iid) : state[sectionId];

    container.style.display = state.enabled[iid] ? "block" : "none";
    container.innerHTML     = "";

    const sides = [
      { key: "left",  embedKey: "leftEmbed",  label: sectionId === "splitThird" ? "Left (66%)"  : "Left (50%)"  },
      { key: "right", embedKey: "rightEmbed", label: sectionId === "splitThird" ? "Right (33%)" : "Right (50%)" },
    ];

    sides.forEach(({ key, embedKey, label }) => {
      const field    = document.createElement("div");
      field.className = "field";
      const labelEl  = document.createElement("label");
      labelEl.textContent = label;
      field.appendChild(labelEl);

      const select = document.createElement("select");
      SLOT_OPTIONS.forEach(({ label: optLabel, value }) => {
        const opt       = document.createElement("option");
        opt.value       = value;
        opt.textContent = optLabel;
        opt.selected    = slotState[key] === value;
        select.appendChild(opt);
      });

      const embedField = document.createElement("div");
      embedField.className       = "field";
      embedField.style.marginTop = "8px";
      embedField.style.display   = slotState[key] === "__SLOT_VIDEO__" ? "block" : "none";
      embedField.innerHTML = `
        <label>Embed code</label>
        <textarea rows="3" placeholder="Paste your iframe embed code here...">${escapeHtml(slotState[embedKey] || DEFAULT_VIDEO_EMBED)}</textarea>
        <div class="hint">Paste the full iframe embed code from your video platform.</div>
      `;

      select.addEventListener("change", () => {
        slotState[key] = select.value;
        if (select.value === "__SLOT_VIDEO__" && !slotState[embedKey]) {
          slotState[embedKey] = DEFAULT_VIDEO_EMBED;
          embedField.querySelector("textarea").value = DEFAULT_VIDEO_EMBED;
        }
        embedField.style.display = select.value === "__SLOT_VIDEO__" ? "block" : "none";
        renderAll();
      });

      embedField.querySelector("textarea")?.addEventListener("input", (e) => {
        slotState[embedKey] = e.target.value;
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

  function applyTokens(html, instanceId) {
    const industryData = getIndustryData();
    html = (html || "").replace(/__VIDEO_EMBED__/g, state.videoEmbedCode || "");

    return html.replace(/\{\{([^}]+)\}\}/g, (_, raw) => {
      const key = raw.trim();
      if (key === "HERO_IMAGE")                 return resolveHeroImageUrl();
      if (key === "CLIENT_NAME")                return (state.clientName || "").trim();
      if (key === "HERO_HEADLINE")              return state.heroHeadline || "";
      if (key === "HERO_SUBHEAD")               return state.heroSubhead  || "";
      if (key === "videoAndSnapshot.embedCode") return state.videoEmbedCode || "";

      // Split slots — respect duplicate state
      if (key === "splitHalf.left" || key === "splitHalf.right" || key === "splitThird.left" || key === "splitThird.right") {
        const [sid, side] = key.split(".");
        const embedKey    = side === "left" ? "leftEmbed" : "rightEmbed";
        const iid         = instanceId || sid;
        const slotState   = (iid !== sid && state.duplicates[iid]?.splitSlots)
          ? state.duplicates[iid].splitSlots
          : state[sid];
        return slotState[side] === "__SLOT_VIDEO__"
          ? (slotState[embedKey] || DEFAULT_VIDEO_EMBED)
          : (slotState[side] || "");
      }

      const val = resolveToken(key, industryData);
      return val == null ? "" : String(val);
    });
  }

  // =====================================================================
  // PAGE OUTLINE
  // =====================================================================
  let outlineOpen = false;

  function renderOutline() {
    const container = document.getElementById("outlineBody");
    const toggle    = document.getElementById("outlineToggle");
    if (!container || !toggle) return;

    const enabledIds = state.order.filter((id) => state.enabled[id]);

    container.style.display = outlineOpen ? "block" : "none";
    toggle.textContent      = outlineOpen ? "Page Outline ↑" : "Page Outline ↓";

    if (!enabledIds.length) {
      container.innerHTML = `<p class="outline-empty">No sections enabled.</p>`;
      return;
    }

    container.innerHTML = enabledIds.map((id) => {
      const bId   = baseId(id);
      const block = blocks.find((b) => b.id === id);
      if (!block) return "";

      const hasPlaceholder = (() => {
        const cfg = TILE_CONFIG[bId];
        if (!cfg || !state.enabled[id]) return false;
        const count      = id !== bId ? getDuplicateTileCount(id) : (state.tileCounts[bId] ?? cfg.default);
        const source     = resolveToken(cfg.dataKey, getIndustryData());
        const dataCount  = Array.isArray(source) ? source.length : 0;
        return count > dataCount;
      })();

      let meta = "";
      if (TILE_CONFIG[bId]) {
        const count = id !== bId ? getDuplicateTileCount(id) : (state.tileCounts[bId] ?? TILE_CONFIG[bId].default);
        meta = `<span class="outline-meta">${count} tile${count !== 1 ? "s" : ""}${hasPlaceholder ? " · ⚠️ placeholder" : ""}</span>`;
      } else if (bId === "faqAccordion") {
        const items = id !== bId ? getDuplicateFaqItems(id) : state.faqItems;
        meta = `<span class="outline-meta">${items.length} item${items.length !== 1 ? "s" : ""}</span>`;
      }

      const label = block._isDuplicate
        ? `${blocks.find((b) => b.id === bId)?.name || bId} (${id.split("__")[1]})`
        : block.name;

      return `
        <div class="outline-row">
          <span class="outline-check">✅</span>
          <span class="outline-label">${label}</span>
          ${meta}
        </div>
      `;
    }).join("");
  }

  // =====================================================================
  // FLOATING COPY BUTTON
  // =====================================================================
  function initFloatingCopyBtn() {
    const btn    = els.btnCopy;
    const header = document.querySelector(".app-header");
    if (!btn || !header) return;
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Warning panel no longer needs floating toggle
        btn.classList.toggle("is-floating", !entry.isIntersecting);
      },
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
    initOutlineToggle();
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

  function initOutlineToggle() {
    const toggle = document.getElementById("outlineToggle");
    toggle?.addEventListener("click", () => {
      outlineOpen = !outlineOpen;
      renderOutline();
    });
  }

  // =====================================================================
  // INPUT BINDING
  // =====================================================================
  function bindInputs() {
    ["clientName", "primaryColor", "accentColor", "heroHeadline", "heroSubhead", "heroImageUrl"].forEach((key) => {
      if (!els[key]) return;
      els[key].addEventListener("input", () => {
        state[key] = (els[key].value || "").trim();
        if (key === "heroImageUrl") renderHeroImagePreview();
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
      const checked = selectAll.checked;
      const heroIds = ["heroSplit", "heroOverlay"];
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

    // Print button
    document.getElementById("btnPrint")?.addEventListener("click", () => {
      if (typeof window.openPrintSummary === "function") {
        window.openPrintSummary(state, blocks, TILE_CONFIG, getIndustryData, getDuplicateTileCount, getDuplicateFaqItems, baseId, instancesOf);
      }
    });
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

    state.order.forEach((instanceId, index) => {
      const bId   = baseId(instanceId);
      const block = blocks.find((b) => b.id === instanceId);
      if (!block) return;

      const isDuplicate    = block._isDuplicate === true;
      const instanceCount  = instancesOf(bId).length;
      const canDuplicate   = DUPLICATABLE_IDS.has(bId) && instanceCount < 3 && !isDuplicate;
      const tooltip        = SECTION_TOOLTIPS[bId] || "";

      const row = document.createElement("div");
      row.className = "block-row";
      if (!industrySelected) row.classList.add("block-row--disabled");

      // ── Left: checkbox + label + tooltip ─────────────────────────
      const left       = document.createElement("div");
      left.className   = "block-row__left";

      const checkbox   = document.createElement("input");
      checkbox.type    = "checkbox";
      checkbox.checked = !!state.enabled[instanceId];
      checkbox.disabled = !industrySelected;

      const labelWrap  = document.createElement("div");
      labelWrap.className = "block-row__label-wrap";

      const labelEl    = document.createElement("div");
      labelEl.className   = "block-row__label";
      labelEl.textContent = isDuplicate
        ? `${blocks.find((b) => b.id === bId)?.name || bId} (${instanceId.split("__")[1]})`
        : block.name;

      labelWrap.appendChild(labelEl);

      // Tooltip info icon
      if (tooltip && !isDuplicate) {
        const info = document.createElement("span");
        info.className   = "block-row__info";
        info.textContent = "ℹ";
        info.setAttribute("data-tooltip", tooltip);
        labelWrap.appendChild(info);
      }

      left.appendChild(checkbox);
      left.appendChild(labelWrap);

      // ── Right: Up/Down + Duplicate + Remove ───────────────────────
      const right       = document.createElement("div");
      right.className   = "block-row__right";

      right.appendChild(button("↑", () => move(index, -1)));
      right.appendChild(button("↓", () => move(index, +1)));

      if (canDuplicate) {
        const dupBtn = button("⊕", () => createDuplicate(bId));
        dupBtn.title = "Duplicate section";
        dupBtn.classList.add("btn-duplicate");
        right.appendChild(dupBtn);
      }

      if (isDuplicate) {
        // Show ⊕ only if not at max
        if (instanceCount < 3) {
          const dupBtn = button("⊕", () => createDuplicate(bId));
          dupBtn.title = "Duplicate section";
          dupBtn.classList.add("btn-duplicate");
          right.appendChild(dupBtn);
        }
        const removeBtn = button("✕", () => removeDuplicate(instanceId));
        removeBtn.title = "Remove duplicate";
        removeBtn.classList.add("btn-remove-duplicate");
        right.appendChild(removeBtn);
      }

      row.appendChild(left);
      row.appendChild(right);

      checkbox.addEventListener("change", () => {
        if (!industrySelected) return;
        state.enabled[instanceId] = checkbox.checked;

        if (bId === "faqAccordion")                                    renderFaqEditor(instanceId);
        if (bId === "essentialIcon")                                   renderIconEditor();
        if (["heroSplit", "heroOverlay"].includes(bId))                renderHeroEditor();
        if (bId === "splitHalf")                                       renderSplitEditor("splitHalf",  `splitHalfEditor-${instanceId}`,  instanceId);
        if (bId === "splitThird")                                      renderSplitEditor("splitThird", `splitThirdEditor-${instanceId}`, instanceId);
        if (bId === "videoAndSnapshot")                                renderVideoEditor();
        if (TILE_CONFIG[bId])                                          renderTileEditor(instanceId);

        syncSelectAll();
        renderAll();
      });

      els.blockList.appendChild(row);

      // ── Editor mounts ──────────────────────────────────────────────
      if (bId === "faqAccordion") {
        const mount = document.createElement("div");
        mount.id    = `faqEditor-${instanceId}`;
        els.blockList.appendChild(mount);
        renderFaqEditor(instanceId);
      }

      if (bId === "essentialIcon" && !isDuplicate) {
        const mount = document.createElement("div");
        mount.id    = "iconEditor";
        els.blockList.appendChild(mount);
        renderIconEditor();
      }

      if (bId === "splitHalf") {
        const mount = document.createElement("div");
        mount.id    = `splitHalfEditor-${instanceId}`;
        els.blockList.appendChild(mount);
        renderSplitEditor("splitHalf", `splitHalfEditor-${instanceId}`, instanceId);
      }

      if (bId === "splitThird") {
        const mount = document.createElement("div");
        mount.id    = `splitThirdEditor-${instanceId}`;
        els.blockList.appendChild(mount);
        renderSplitEditor("splitThird", `splitThirdEditor-${instanceId}`, instanceId);
      }

      if (bId === "heroOverlay" && !isDuplicate) {
        const mount = document.createElement("div");
        mount.id    = "heroEditor";
        els.blockList.appendChild(mount);
        renderHeroEditor();
      }

      if (bId === "videoAndSnapshot" && !isDuplicate) {
        const mount = document.createElement("div");
        mount.id    = "videoEditor";
        els.blockList.appendChild(mount);
        renderVideoEditor();
      }

      if (TILE_CONFIG[bId]) {
        const mount = document.createElement("div");
        mount.id    = `tileEditor-${instanceId}`;
        els.blockList.appendChild(mount);
        renderTileEditor(instanceId);
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
    const allChecked  = relevantIds.every((id) => state.enabled[id]);
    const someChecked = relevantIds.some((id)  => state.enabled[id]);

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
  function renderFaqEditor(instanceId) {
    const iid       = instanceId || "faqAccordion";
    const containerId = `faqEditor-${iid}`;
    const container   = document.getElementById(containerId);
    if (!container) return;

    const isDuplicate = iid !== "faqAccordion";
    const items       = isDuplicate ? getDuplicateFaqItems(iid) : state.faqItems;

    container.style.display = state.enabled[iid] ? "block" : "none";
    container.innerHTML     = "";

    items.forEach((item, index) => {
      const wrap = document.createElement("div");
      wrap.className = "faq-editor-item";
      wrap.innerHTML = `
        <div class="faq-editor-item__header">
          <span class="faq-editor-item__label">FAQ ${index + 1}</span>
          <div class="faq-editor-item__controls">
            <button type="button" class="btn btn-small" data-faq-up="${index}"     ${index === 0 ? "disabled" : ""}>↑</button>
            <button type="button" class="btn btn-small" data-faq-down="${index}"   ${index === items.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" class="btn btn-small btn-danger" data-faq-remove="${index}" ${items.length <= 1 ? "disabled" : ""}>−</button>
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
    addBtn.type        = "button";
    addBtn.className   = "btn btn-small";
    addBtn.style.marginTop = "8px";
    addBtn.textContent = "+ Add FAQ Item";
    addBtn.addEventListener("click", () => {
      items.push({ question: "", answer: "" });
      renderFaqEditor(iid);
      renderAll();
    });
    container.appendChild(addBtn);

    container.querySelectorAll("[data-faq-question]").forEach(input => {
      input.addEventListener("input", () => {
        items[+input.dataset.faqQuestion].question = input.value;
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-answer]").forEach(textarea => {
      textarea.addEventListener("input", () => {
        items[+textarea.dataset.faqAnswer].answer = textarea.value;
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-up]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.faqUp;
        if (i === 0) return;
        [items[i - 1], items[i]] = [items[i], items[i - 1]];
        renderFaqEditor(iid);
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-down]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.faqDown;
        if (i === items.length - 1) return;
        [items[i], items[i + 1]] = [items[i + 1], items[i]];
        renderFaqEditor(iid);
        renderAll();
      });
    });
    container.querySelectorAll("[data-faq-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.faqRemove;
        if (items.length <= 1) return;
        items.splice(i, 1);
        renderFaqEditor(iid);
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
    const copy  = state.order.slice();
    [copy[index], copy[next]] = [copy[next], copy[index]];
    state.order = copy;
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
      evaluateWarnings();
      renderOutline();
      return;
    }
    const html       = assembleContentHtml();
    const css        = buildExportCss();
    const exportHtml = `<style>\n${css}\n</style>\n${html}`.trim();
    els.output.value = exportHtml;
    renderPreviewFrame(css, html);
    evaluateWarnings();
    renderOutline();
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
        min-height: 180px; border: 2px dashed var(--brandColor, #023843) !important;
        border-radius: 8px; background: rgba(0,0,0,.03) !important;
        display: flex !important; align-items: center !important;
        justify-content: center !important; position: relative;
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

    const enabledSections = state.order.filter((id) => state.enabled[id]);

    // Build page title comment
    const pageComment = `<!--\n  Page Sections:\n${enabledSections.map((id) => {
      const bId   = baseId(id);
      const block = blocks.find((b) => b.id === id);
      return `  - ${block?.name || bId}`;
    }).join("\n")}\n  Built with ClearLearn Custom Page Generator\n-->`;

    const content = enabledSections
      .map((instanceId) => {
        const bId   = baseId(instanceId);
        const block = blocks.find((b) => b.id === instanceId);
        if (!block) return "";

        if (TILE_CONFIG[bId]) {
          return buildTileSectionHtml(bId, block, instanceId);
        }

        const html = typeof block.getHtml === "function"
          ? block.getHtml(instanceId)
          : (block.html || "");
        return applyTokens(html, instanceId);
      })
      .join("\n");

    const body = anyHero ? content : `${spacer}\n${content}`;
    return `${pageComment}\n${body}`;
  }

  function buildTileSectionHtml(sectionId, block, instanceId) {
    const industryData = getIndustryData();
    const iid          = instanceId || sectionId;

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
    const tileRows = buildTileRowsHtml(sectionId, iid);
    const spacer   = `<div class="row" data-section-id="spacer-40">
  <div class="column"><div class="spacer height-40"></div></div>
</div>`;

    switch (sectionId) {
      case "learnByRole":
        return `<div class="row" data-section-id="learn-by-role"><div class="column sectionheadline"><h2>Learn by Role</h2><p>${t.heading}</p></div></div>\n${tileRows}\n${spacer}`;
      case "essentialImage":
        return `<div class="row" data-section-id="essential-image-cards"><div class="column sectionheadline"><h2>Essentials</h2><p>${t.heading}</p></div></div>\n${tileRows}\n${spacer}`;
      case "essentialIcon":
        return `<div class="row" data-section-id="essential-icon-cards"><div class="column sectionheadline"><h2>Essential Training</h2><p>${t.heading}</p></div></div>\n${tileRows}\n${spacer}`;
      case "rolePathways":
        return `<div class="row" data-section-id="role-pathways"><div class="column sectionheadline"><h2>Role-Based Pathways</h2><p>${t.heading}</p></div></div>\n${tileRows}\n${spacer}`;
      case "managerToolkit":
        return `<div class="row" data-section-id="manager-toolkit"><div class="column sectionheadline"><h2>Manager Toolkit</h2><p>${t.heading}</p></div></div>\n${tileRows}\n${spacer}`;
      case "resourceHub":
        return `<div class="row" data-section-id="resource-hub"><div class="column sectionheadline"><h2>${t.heading}</h2><p>${t.subheading}</p></div></div>\n${tileRows}\n${spacer}`;
      case "complianceHub":
        return `<div class="row" data-section-id="compliance-hub"><div class="column sectionheadline"><h2>Compliance Hub</h2><p>${t.heading}</p></div></div>\n${tileRows}\n${spacer}`;
      default:
        return applyTokens(block.html || "", iid);
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

    const vars = `:root {\n  --brandColor:  ${brand};\n  --accentColor: ${accent};\n  --heroHeight:  ${heroHeight};\n}`;

    const flatCss = state.flatCorners ? `\n/* FLAT CORNERS OVERRIDE */\n*, *::before, *::after { border-radius: 0 !important; }` : "";

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
    els.clientName.value   = "";
    els.primaryColor.value = "#37352a";
    els.accentColor.value  = "#ff7a52";
    els.heroImageUrl.value = "";
    els.industry.value     = "";
    if (els.flatCorners)  els.flatCorners.checked = false;
    if (els.heroHeadline) els.heroHeadline.value  = "Training that holds up in an audit";
    if (els.heroSubhead)  els.heroSubhead.value   = "This demo shows how the LMS supports compliance, safety, and onboarding with repeatable programs, clear assignments, and audit-ready reporting.";

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
    state.faqItems       = DEFAULT_FAQ_ITEMS.map(item => ({ ...item }));

    // Remove all duplicates from order and blocks
    const dupIds = state.order.filter((id) => id.includes("__"));
    dupIds.forEach((id) => {
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx !== -1) blocks.splice(idx, 1);
    });
    state.duplicates = {};
    state.enabled    = Object.fromEntries(blocks.map((b) => [b.id, !!b.defaultEnabled]));
    state.order      = blocks.map((b) => b.id);

    // Reset tile counts to defaults
    Object.entries(TILE_CONFIG).forEach(([id, cfg]) => {
      state.tileCounts[id] = cfg.default;
    });

    const selectAll = document.getElementById("selectAll");
    if (selectAll) { selectAll.checked = false; selectAll.indeterminate = false; }

    renderHeroImagePreview();
    renderBlockPicker();
    renderFaqEditor("faqAccordion");
    renderIconEditor();
    renderHeroEditor();
    renderVideoEditor();
    renderSplitEditor("splitHalf",  "splitHalfEditor-splitHalf");
    renderSplitEditor("splitThird", "splitThirdEditor-splitThird");
    Object.keys(TILE_CONFIG).forEach((id) => renderTileEditor(id));
    renderAll();
  }

})();