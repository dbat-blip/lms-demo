/* global window */
(function () {
    const BLOCKS = [
      {
        id: "hero",
        name: "Hero: outcomes + message",
        defaultEnabled: true,
        render: (data) => {
          const client = escapeHtml(data.clientName || "your team");
          const headline = escapeHtml(data.heroHeadline || "Training that holds up in an audit");
          const subhead = escapeHtml(data.heroSubhead || "");
          const heroImageUrl = (data.heroImageUrl || "").trim();
  
          const imgHtml = heroImageUrl
            ? `<div class="lmsdemo-hero__img"><img src="${escapeAttr(heroImageUrl)}" alt="" /></div>`
            : "";
  
          return `
  <section class="lmsdemo-block lmsdemo-hero">
    <div class="lmsdemo-card lmsdemo-hero__card">
      <div class="lmsdemo-hero__content">
        <div class="lmsdemo-chip">Demo page</div>
        <h1 class="lmsdemo-h1">${headline}</h1>
        <p class="lmsdemo-lede">${subhead}</p>
  
        <div class="lmsdemo-chiprow">
          <span class="lmsdemo-chip lmsdemo-chip--soft">Compliance training</span>
          <span class="lmsdemo-chip lmsdemo-chip--soft">Safety training</span>
          <span class="lmsdemo-chip lmsdemo-chip--soft">Onboarding</span>
        </div>
  
        <p class="lmsdemo-note">Configured for ${client}.</p>
      </div>
      ${imgHtml}
    </div>
  </section>`;
        },
      },
  
      {
        id: "outcomes",
        name: "Outcome cards: goal → LMS enablement",
        defaultEnabled: true,
        render: () => `
  <section class="lmsdemo-block">
    <div class="lmsdemo-grid lmsdemo-grid--3">
      <div class="lmsdemo-card lmsdemo-pad">
        <h2 class="lmsdemo-h2">Reduce compliance risk</h2>
        <p>Automate assignments by role and location, track completion, and export audit-ready proof when you need it.</p>
        <div class="lmsdemo-meta">Levers: rules, due dates, attestations, reporting</div>
      </div>
  
      <div class="lmsdemo-card lmsdemo-pad">
        <h2 class="lmsdemo-h2">Keep safety training current</h2>
        <p>Schedule recurring certifications and recertification, validate knowledge, and flag overdue training early.</p>
        <div class="lmsdemo-meta">Levers: certifications, reminders, tests, manager views</div>
      </div>
  
      <div class="lmsdemo-card lmsdemo-pad">
        <h2 class="lmsdemo-h2">Shorten time-to-productivity</h2>
        <p>Standardize onboarding paths that adapt by job family, with clear progress tracking for managers and HR.</p>
        <div class="lmsdemo-meta">Levers: learning paths, groups, progress dashboards</div>
      </div>
    </div>
  </section>`,
      },
  
      {
        id: "workflow",
        name: "Workflow steps: how the program runs",
        defaultEnabled: true,
        render: () => `
  <section class="lmsdemo-block">
    <div class="lmsdemo-card lmsdemo-pad">
      <h2 class="lmsdemo-h2">How it runs</h2>
      <div class="lmsdemo-steps">
        <div class="lmsdemo-step"><div class="lmsdemo-step__num">1</div><div><div class="lmsdemo-step__title">Assign</div><div class="lmsdemo-step__text">Target the right audience by role, location, or team.</div></div></div>
        <div class="lmsdemo-step"><div class="lmsdemo-step__num">2</div><div><div class="lmsdemo-step__title">Notify</div><div class="lmsdemo-step__text">Automated reminders keep learners on track.</div></div></div>
        <div class="lmsdemo-step"><div class="lmsdemo-step__num">3</div><div><div class="lmsdemo-step__title">Learn</div><div class="lmsdemo-step__text">Clear paths and quick access to required training.</div></div></div>
        <div class="lmsdemo-step"><div class="lmsdemo-step__num">4</div><div><div class="lmsdemo-step__title">Validate</div><div class="lmsdemo-step__text">Tests, acknowledgements, and completion rules.</div></div></div>
        <div class="lmsdemo-step"><div class="lmsdemo-step__num">5</div><div><div class="lmsdemo-step__title">Track</div><div class="lmsdemo-step__text">Dashboards for admins and managers.</div></div></div>
        <div class="lmsdemo-step"><div class="lmsdemo-step__num">6</div><div><div class="lmsdemo-step__title">Prove</div><div class="lmsdemo-step__text">Audit-ready exports and reporting.</div></div></div>
      </div>
    </div>
  </section>`,
      },
  
      {
        id: "faq",
        name: "FAQ accordion (CSS-only)",
        defaultEnabled: true,
        render: () => `
  <section class="lmsdemo-block">
    <div class="lmsdemo-card lmsdemo-pad">
      <h2 class="lmsdemo-h2">Common questions</h2>
  
      <div class="lmsdemo-faq">
        ${faqItem("faq1", "What happens when someone is overdue?", "You can surface overdue learners, notify managers, and prioritize follow-up before it becomes a compliance issue.")}
        ${faqItem("faq2", "Can we segment by role and location?", "Yes. The strongest demos tie targeting to a real org model: departments, job families, and locations.")}
        ${faqItem("faq3", "Do we support recurring certifications?", "Yes. You can schedule recertification windows and track compliance status over time.")}
        ${faqItem("faq4", "Can managers see their team’s progress?", "Yes. Manager views reduce admin chasing and help teams stay accountable.")}
      </div>
    </div>
  </section>`,
      },
    ];
  
    function faqItem(id, q, a) {
      return `
  <div class="lmsdemo-faqitem">
    <input class="lmsdemo-faqcheck" type="checkbox" id="${id}">
    <label class="lmsdemo-faqlabel" for="${id}">
      <span>${escapeHtml(q)}</span>
      <span class="lmsdemo-faqicon" aria-hidden="true">+</span>
    </label>
    <div class="lmsdemo-faqpanel">
      <p>${escapeHtml(a)}</p>
    </div>
  </div>`;
    }
  
    function escapeHtml(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  
    function escapeAttr(str) {
      return escapeHtml(str).replaceAll("`", "&#096;");
    }
  
    window.LMSDEMO_BLOCKS = BLOCKS;
  })();