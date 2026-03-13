(function () {
    window.LMS_SECTIONS = [
  
      /* ===========================
         HEROES
      =========================== */
      {
        id: "heroSplit",
        name: "Hero — Split",
        defaultEnabled: false,
        html: `
  <div class="row splitransprighthero parallaxbg hero-section" data-section-id="hero-split" style="--bg:url('{{HERO_IMAGE}}');">
    <div class="column"></div>
    <div class="column righttransp flex rounded-left">
      <div class="splitright">
        <h2>Welcome to the {{CLIENT_NAME}} <br>Learning Center</h2>
        <div class="btn-rightcontainer">
          <a href="{{hero.ctaUrl}}" class="btn-right">{{hero.ctaText}}</a>
        </div>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "heroOverlay",
        name: "Hero — Overlay",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="hero-overlay">
    <div class="column fulloverlaybg parallaxbg rtdark" style="--bg:url('{{HERO_IMAGE}}');">
      <div class="fulloverlaycontent">
        <h2>Welcome to the {{CLIENT_NAME}} <br> Learning Center</h2>
        <div class="btn-rightcontainer">
          <a href="{{hero.ctaUrl}}" class="btn-right btn-right-white">{{hero.ctaText}}</a>
        </div>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "bannerHero",
        name: "Banner w/ CTA",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="banner-hero">
    <div class="hero-banner" style="background-image:url('{{HERO_IMAGE}}');">
      <div class="hero-banner-content">
        <h1 class="hero-banner-title">{{hero.bannerTitle}}</h1>
        <a href="{{hero.ctaUrl}}" class="hero-library-btn">{{hero.ctaText}}</a>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "bannerCta",
        name: "Banner — CTA Split",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="banner-cta">
    <div class="banner-cta-section" style="--bg:url('{{bannerCta.imageUrl}}');">
      <div class="banner-cta-overlay"></div>
      <div class="banner-cta-inner">
        <div class="banner-cta-left">
          <h2 class="banner-cta-heading">{{bannerCta.heading}}</h2>
          <p class="banner-cta-subtext">{{bannerCta.subtext}}</p>
        </div>
        <div class="banner-cta-right">
          <a href="{{bannerCta.ctaUrl}}" class="btn-right">{{bannerCta.ctaText}}</a>
        </div>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "myLearningAndSnapshot",
        name: "My Learning + Daily Snapshot Split",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="my-learning-snapshot">
    <div class="column two-third">
      <div class="gadget-block">
        <p class="show-editor-only">Training Dashboard Gadget</p>
        <training-dashboard></training-dashboard>
      </div>
    </div>
    <div class="column third">
      <div class="gadget-block">
        <p class="show-editor-only">Daily Snapshot Gadget</p>
        <daily-snapshot></daily-snapshot>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      /* ===========================
         MULTI-TILE SECTIONS
         HTML is built dynamically in app.js via buildTileSectionHtml()
         Static html property is intentionally omitted
      =========================== */
      { id: "learnByRole",    name: "Learn by Role",            defaultEnabled: false },
      { id: "essentialImage", name: "Essential — Image Cards",  defaultEnabled: false },
      { id: "essentialIcon",  name: "Essential — Icon Cards",   defaultEnabled: false },
      { id: "rolePathways",   name: "Role Pathways",            defaultEnabled: false },
      { id: "managerToolkit", name: "Manager Toolkit",          defaultEnabled: false },
      { id: "resourceHub",    name: "Resource Hub",             defaultEnabled: false },
      { id: "complianceHub",  name: "Compliance Hub",           defaultEnabled: false },
  
      /* ===========================
         OTHER SECTIONS
      =========================== */
      {
        id: "featuredSplit",
        name: "Featured — Split",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="featured-split" class="featured-split">
    <div class="column featuredsingle no-border">
      <div class="row">
        <div class="column">
          <a href="{{featured.href}}"><img src="{{featured.imageUrl}}" alt=""></a>
        </div>
        <div class="column featsinglecont">
          <span>{{featured.eyebrow}}</span>
          <h2>{{featured.title}}</h2>
          <p>{{featured.description}}</p>
          <div class="btn-rightcontainer text-left">
            <a href="{{featured.ctaUrl}}" class="btn-right">{{featured.ctaText}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "featuredSplitFilled",
        name: "Featured — Split Filled",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="featured-split" class="featured-split">
    <div class="column featuredsingle featuredsingle-filled">
      <div class="row">
        <div class="column">
          <a href="{{featured.href}}"><img src="{{featured.imageUrl}}" alt=""></a>
        </div>
        <div class="column featsinglecont">
          <span>{{featured.eyebrow}}</span>
          <h2>{{featured.title}}</h2>
          <p>{{featured.description}}</p>
          <div class="btn-rightcontainer text-left">
            <a href="{{featured.ctaUrl}}" class="btn-right">{{featured.ctaText}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "quickAccess",
        name: "Quick Access",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="quick-access">
    <div class="column sectionheadline">
      <h2>Quick Access</h2>
    </div>
  </div>
  <div class="row tile-row" data-section-id="quick-access-row-1">
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.0.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.0.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.0.title}}</h3></div>
      </a>
    </div>
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.1.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.1.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.1.title}}</h3></div>
      </a>
    </div>
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.2.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.2.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.2.title}}</h3></div>
      </a>
    </div>
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.3.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.3.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.3.title}}</h3></div>
      </a>
    </div>
  </div>
  <div class="row tile-row" data-section-id="quick-access-row-2">
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.4.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.4.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.4.title}}</h3></div>
      </a>
    </div>
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.5.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.5.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.5.title}}</h3></div>
      </a>
    </div>
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.6.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.6.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.6.title}}</h3></div>
      </a>
    </div>
    <div class="column blockgrid">
      <a class="hover-tile" href="{{quickAccess.cards.7.href}}">
        <div class="image-overlay"><img class="coverimg" src="{{quickAccess.cards.7.imageUrl}}" alt=""></div>
        <div class="boxp" style="text-align:center"><h3>{{quickAccess.cards.7.title}}</h3></div>
      </a>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "videoAndSnapshot",
        name: "Video + Snapshot",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="video-and-snapshot">
    <div class="column two-third">
      {{videoAndSnapshot.embedCode}}
    </div>
    <div class="column third">
      <div class="gadget-block">
        <p class="show-editor-only">Daily Snapshot Gadget</p>
        <daily-snapshot></daily-snapshot>
      </div>
    </div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "splitHalf",
        name: "Split — 50/50",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="split-half">
    <div class="column half">{{splitHalf.left}}</div>
    <div class="column half">{{splitHalf.right}}</div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "splitThird",
        name: "Split — 66/33",
        defaultEnabled: false,
        html: `
  <div class="row" data-section-id="split-third">
    <div class="column two-third">{{splitThird.left}}</div>
    <div class="column third">{{splitThird.right}}</div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim(),
      },
  
      {
        id: "faqAccordion",
        name: "FAQ Accordion",
        defaultEnabled: false,
        getHtml() {
          const items = (window.state?.faqItems || [])
            .map((item, i) => `
  <div class="faq-item">
    <input class="faq-toggle" type="checkbox" id="faq-${i + 1}">
    <label class="faq-question" for="faq-${i + 1}">${item.question || ""}</label>
    <div class="faq-answer">
      <div class="faq-answer-inner">
        <p>${(item.answer || "").replace(/\n/g, "<br>")}</p>
      </div>
    </div>
  </div>`).join("");
  
          return `
  <div class="row" data-section-id="faq-accordion">
    <div class="column sectionheadline">
      <h2>Frequently Asked Questions</h2>
      <p>Quick answers to common questions.</p>
    </div>
  </div>
  <div class="row">
    <div class="column">${items}</div>
  </div>
  <div class="row" data-section-id="spacer-40">
    <div class="column"><div class="spacer height-40"></div></div>
  </div>`.trim();
        },
      },
    ];
  
    window.LMS_SECTIONS_BY_ID = window.LMS_SECTIONS.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  })();