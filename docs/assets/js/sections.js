(function ()
{
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
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
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
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
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
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
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
		    <div class="column">
		      <div class="spacer height-40"></div>
		    </div>
		  </div>
		    `.trim(),
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
                <div class="column">
                    <div class="spacer height-40"></div>
                </div>
            </div>
      `.trim(),
		},
        
		{
			id: "learnByRole",
			name: "Learn by Role",
			defaultEnabled: false,
			html: `
<div class="row" data-section-id="learn-by-role">
  <div class="column sectionheadline">
    <h2>Learn by Role</h2>
    <p>{{learnByRole.subheading}}</p>
  </div>
</div>

<div class="row tile-row iconcards" data-section-id="learn-by-role-cards">
  <div class="column blockgrid">
    <a class="hover-tile" href="{{learnByRole.cards.0.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{learnByRole.cards.0.iconUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{learnByRole.cards.0.title}}</h3>
        <p>{{learnByRole.cards.0.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{learnByRole.cards.1.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{learnByRole.cards.1.iconUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{learnByRole.cards.1.title}}</h3>
        <p>{{learnByRole.cards.1.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{learnByRole.cards.2.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{learnByRole.cards.2.iconUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{learnByRole.cards.2.title}}</h3>
        <p>{{learnByRole.cards.2.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{learnByRole.cards.3.href}}">
      <div class="image-overlay">
        <img class="coverimg"  src="{{learnByRole.cards.3.iconUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{learnByRole.cards.3.title}}</h3>
        <p>{{learnByRole.cards.3.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{learnByRole.cards.4.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{learnByRole.cards.4.iconUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{learnByRole.cards.4.title}}</h3>
        <p>{{learnByRole.cards.4.description}}</p>
      </div>
    </a>
  </div>
</div>

<div class="row" data-section-id="spacer-40">
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
		},
/*** ESSENTIALS IMAGE
 ***/   
		{
			id: "essentialImage",
			name: "Essential — Image Cards",
			defaultEnabled: false,
			html: `
<div class="row" data-section-id="essential-image-cards">
  <div class="column sectionheadline">
    <h2>Essentials</h2>
    <p>{{essentialImage.subheading}}</p>
  </div>
</div>

<div class="row tile-row" data-section-id="essential-image-cards-grid">
  <div class="column blockgrid">
    <a class="hover-tile" href="{{essentialImage.cards.0.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{essentialImage.cards.0.imageUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{essentialImage.cards.0.title}}</h3>
        <p>{{essentialImage.cards.0.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{essentialImage.cards.1.href}}">
      <div class="image-overlay image-overlay2">
        <img class="coverimg" src="{{essentialImage.cards.1.imageUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{essentialImage.cards.1.title}}</h3>
        <p>{{essentialImage.cards.1.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{essentialImage.cards.2.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{essentialImage.cards.2.imageUrl}}" alt="">
      </div>
      <div class="boxp">
        <h3>{{essentialImage.cards.2.title}}</h3>
        <p>{{essentialImage.cards.2.description}}</p>
      </div>
    </a>
  </div>
</div>

<div class="row" data-section-id="spacer-40">
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
		},

/*** ESSENTIAL ICONS
 ***/   

		{
			id: "essentialIcon",
			name: "Essential — Icon Cards",
			defaultEnabled: false,
			html: `
<div class="row" data-section-id="essential-icon-cards">
  <div class="column sectionheadline">
    <h2>Essential Training</h2>
    <p>{{essentialIcon.subheading}}</p>
  </div>
</div>
<div class="row iconcards tile-row" data-section-id="essential-icon-cards-grid">
  <div class="column blockgrid">
    <a class="hover-tile" href="{{essentialIcon.cards.0.href}}">
      <div class="card_box_icon">
        {{essentialIcon.cards.0.iconSvg}}
      </div>
      <div class="boxp">
        <h3>{{essentialIcon.cards.0.title}}</h3>
        <p>{{essentialIcon.cards.0.description}}</p>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{essentialIcon.cards.1.href}}">
      <div class="card_box_icon">
        {{essentialIcon.cards.1.iconSvg}}
      </div>
      <div class="boxp">
        <h3>{{essentialIcon.cards.1.title}}</h3>
        <p>{{essentialIcon.cards.1.description}}</p>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{essentialIcon.cards.2.href}}">
      <div class="card_box_icon">
        {{essentialIcon.cards.2.iconSvg}}
      </div>
      <div class="boxp">
        <h3>{{essentialIcon.cards.2.title}}</h3>
        <p>{{essentialIcon.cards.2.description}}</p>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{essentialIcon.cards.3.href}}">
      <div class="card_box_icon">
        {{essentialIcon.cards.3.iconSvg}}
      </div>
      <div class="boxp">
        <h3>{{essentialIcon.cards.3.title}}</h3>
        <p>{{essentialIcon.cards.3.description}}</p>
      </div>
    </a>
  </div>
</div>
<div class="row" data-section-id="spacer-40">
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
  `.trim(),
		},

/*** ROLE PATHWAYS
***/   
		{
			id: "rolePathways",
			name: "Role Pathways",
			defaultEnabled: false,
			html: `
<div class="row" data-section-id="role-pathways">
  <div class="column sectionheadline">
    <h2>Role-Based Pathways</h2>
    <p>{{rolePathways.subheading}}</p>
  </div>
</div>

<div class="row tile-row" data-section-id="role-pathways-grid">
  <div class="column blockgrid">
    <a class="hover-tile text-left" href="{{rolePathways.cards.0.ctaUrl}}">
      <div class="boxp">
        <h3>{{rolePathways.cards.0.title}}</h3>
        <ul class="clean-list">
          <li>{{rolePathways.cards.0.bullets.0}}</li>
          <li>{{rolePathways.cards.0.bullets.1}}</li>
          <li>{{rolePathways.cards.0.bullets.2}}</li>
        </ul>
        <span class="text-btn">{{rolePathways.cards.0.ctaText}}</span>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile text-left" href="{{rolePathways.cards.1.ctaUrl}}">
      <div class="boxp">
        <h3>{{rolePathways.cards.1.title}}</h3>
        <ul class="clean-list">
          <li>{{rolePathways.cards.1.bullets.0}}</li>
          <li>{{rolePathways.cards.1.bullets.1}}</li>
          <li>{{rolePathways.cards.1.bullets.2}}</li>
        </ul>
        <span class="text-btn">{{rolePathways.cards.1.ctaText}}</span>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile text-left" href="{{rolePathways.cards.2.ctaUrl}}">
      <div class="boxp">
        <h3>{{rolePathways.cards.2.title}}</h3>
        <ul class="clean-list">
          <li>{{rolePathways.cards.2.bullets.0}}</li>
          <li>{{rolePathways.cards.2.bullets.1}}</li>
          <li>{{rolePathways.cards.2.bullets.2}}</li>
        </ul>
        <span class="text-btn">{{rolePathways.cards.2.ctaText}}</span>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile text-left" href="{{rolePathways.cards.3.ctaUrl}}">
      <div class="boxp">
        <h3>{{rolePathways.cards.3.title}}</h3>
        <ul class="clean-list">
          <li>{{rolePathways.cards.3.bullets.0}}</li>
          <li>{{rolePathways.cards.3.bullets.1}}</li>
          <li>{{rolePathways.cards.3.bullets.2}}</li>
        </ul>
        <span class="text-btn">{{rolePathways.cards.3.ctaText}}</span>
      </div>
    </a>
  </div>
</div>

<div class="row" data-section-id="spacer-40">
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
		},

        /*** MANAGER TOOLKIT
 ***/   
		{
			id: "managerToolkit",
			name: "Manager Toolkit",
			defaultEnabled: false,
			html: `
<div class="row" data-section-id="manager-toolkit">
  <div class="column sectionheadline">
    <h2>Manager Toolkit</h2>
    <p>{{managerToolkit.subheading}}</p>
  </div>
</div>

<div class="row tile-row iconcards" data-section-id="manager-toolkit-grid">
  <div class="column blockgrid">
    <a class="hover-tile" href="{{managerToolkit.cards.0.href}}">
      <div class="boxp">
        <h3>{{managerToolkit.cards.0.title}}</h3>
        <p>{{managerToolkit.cards.0.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{managerToolkit.cards.1.href}}">
      <div class="boxp">
        <h3>{{managerToolkit.cards.1.title}}</h3>
        <p>{{managerToolkit.cards.1.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{managerToolkit.cards.2.href}}">
      <div class="boxp">
        <h3>{{managerToolkit.cards.2.title}}</h3>
        <p>{{managerToolkit.cards.2.description}}</p>
      </div>
    </a>
  </div>

  <div class="column blockgrid">
    <a class="hover-tile" href="{{managerToolkit.cards.3.href}}">
      <div class="boxp">
        <h3>{{managerToolkit.cards.3.title}}</h3>
        <p>{{managerToolkit.cards.3.description}}</p>
      </div>
    </a>
  </div>
</div>

<div class="row" data-section-id="spacer-40">
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
		},

/*** FEATURED SPLIT
 ***/   
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
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
      `.trim(),
		},

/*** FEATURED SPLIT FILLED
 ***/   
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
            <div class="column">
            <div class="spacer height-40"></div>
            </div>
            </div>
            `.trim(),
        },

/*** RESOURCE HUB
 ***/   
		{
			id: "resourceHub",
			name: "Resource Hub",
			defaultEnabled: false,
			html: `
        <div class="row" data-section-id="resource-hub">
          <div class="column sectionheadline">
            <h2>{{resourceHub.heading}}</h2>
            <p>{{resourceHub.subheading}}</p>
          </div>
        </div>
        
        <div class="row tile-row" data-section-id="resource-hub-grid">
          <div class="column">
            <a class="hover-tile text-left">
              <div class="boxp">
                <h3>{{resourceHub.columns.0.title}}</h3>
                <p>{{resourceHub.columns.0.description}}</p>
                <ul class="clean-list">
                  <li>{{resourceHub.columns.0.items.0}}</li>
                  <li>{{resourceHub.columns.0.items.1}}</li>
                  <li>{{resourceHub.columns.0.items.2}}</li>
                </ul>
              </div>
            </a>
          </div>
        
          <div class="column">
            <a class="hover-tile text-left">
              <div class="boxp">
                <h3>{{resourceHub.columns.1.title}}</h3>
                <p>{{resourceHub.columns.1.description}}</p>
                <ul class="clean-list">
                  <li>{{resourceHub.columns.1.items.0}}</li>
                  <li>{{resourceHub.columns.1.items.1}}</li>
                  <li>{{resourceHub.columns.1.items.2}}</li>
                </ul>
              </div>
            </a>
          </div>
        
          <div class="column">
            <a class="hover-tile text-left">
              <div class="boxp">
                <h3>{{resourceHub.columns.2.title}}</h3>
                <p>{{resourceHub.columns.2.description}}</p>
                <ul class="clean-list">
                  <li>{{resourceHub.columns.2.items.0}}</li>
                  <li>{{resourceHub.columns.2.items.1}}</li>
                  <li>{{resourceHub.columns.2.items.2}}</li>
                </ul>
              </div>
            </a>
          </div>
        
          <div class="column">
            <a class="hover-tile text-left">
              <div class="boxp">
                <h3>{{resourceHub.columns.3.title}}</h3>
                <p>{{resourceHub.columns.3.description}}</p>
                <ul class="clean-list">
                  <li>{{resourceHub.columns.3.items.0}}</li>
                  <li>{{resourceHub.columns.3.items.1}}</li>
                  <li>{{resourceHub.columns.3.items.2}}</li>
                </ul>
              </div>
            </a>
          </div>
        </div>
        
        <div class="row" data-section-id="spacer-40">
          <div class="column">
            <div class="spacer height-40"></div>
          </div>
        </div>
      `.trim(),
		},
/*** COMPLIANCE HUB
 ***/   
		{
			id: "complianceHub",
			name: "Compliance Hub",
			defaultEnabled: false,
			html: `
       <div class="row" data-section-id="complianceHub">
        <div class="column sectionheadline">
          <h2>Compliance Hub</h2>
          <p>{{complianceHub.subheading}}</p>
        </div>
      </div>
    <div class="row tile-row" data-section-id="compliance-hub-grid">
    <div class="column">
        <a class="hover-tile text-left" href="{{complianceHub.columns.0.ctaUrl}}">
        <div class="boxp">
            <h3>{{complianceHub.columns.0.title}}</h3>
            <ul class="clean-list">
            <li>{{complianceHub.columns.0.items.0}}</li>
            <li>{{complianceHub.columns.0.items.1}}</li>
            <li>{{complianceHub.columns.0.items.2}}</li>
            </ul>
            <span class="text-btn">{{complianceHub.columns.0.ctaText}}</span>
        </div>
        </a>
    </div>
    <div class="column">
        <a class="hover-tile text-left" href="{{complianceHub.columns.1.ctaUrl}}">
        <div class="boxp">
            <h3>{{complianceHub.columns.1.title}}</h3>
            <ul class="clean-list">
            <li>{{complianceHub.columns.1.items.0}}</li>
            <li>{{complianceHub.columns.1.items.1}}</li>
            <li>{{complianceHub.columns.1.items.2}}</li>
            </ul>
            <span class="text-btn">{{complianceHub.columns.1.ctaText}}</span>
        </div>
        </a>
    </div>
    <div class="column">
        <a class="hover-tile text-left" href="{{complianceHub.columns.2.ctaUrl}}">
        <div class="boxp">
            <h3>{{complianceHub.columns.2.title}}</h3>
            <ul class="clean-list">
            <li>{{complianceHub.columns.2.items.0}}</li>
            <li>{{complianceHub.columns.2.items.1}}</li>
            <li>{{complianceHub.columns.2.items.2}}</li>
            </ul>
            <span class="text-btn">{{complianceHub.columns.2.ctaText}}</span>
        </div>
        </a>
    </div>
    </div>
      <div class="row" data-section-id="spacer-40">
        <div class="column">
          <div class="spacer height-40"></div>
        </div>
      </div>
      `.trim(),
		},
		

/*** QUICK ACCESS
 ***/        
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
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.0.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.0.title}}</h3>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{quickAccess.cards.1.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.1.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.1.title}}</h3>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{quickAccess.cards.2.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.2.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.2.title}}</h3>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{quickAccess.cards.3.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.3.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.3.title}}</h3>
      </div>
    </a>
  </div>
</div>
<div class="row tile-row" data-section-id="quick-access-row-2">
  <div class="column blockgrid">
    <a class="hover-tile" href="{{quickAccess.cards.4.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.4.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.4.title}}</h3>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{quickAccess.cards.5.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.5.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.5.title}}</h3>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{quickAccess.cards.6.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.6.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.6.title}}</h3>
      </div>
    </a>
  </div>
  <div class="column blockgrid">
    <a class="hover-tile" href="{{quickAccess.cards.7.href}}">
      <div class="image-overlay">
        <img class="coverimg" src="{{quickAccess.cards.7.imageUrl}}" alt="">
      </div>
      <div class="boxp" style="text-align:center">
        <h3>{{quickAccess.cards.7.title}}</h3>
      </div>
    </a>
  </div>
</div>
<div class="row" data-section-id="spacer-40">
  <div class="column">
    <div class="spacer height-40"></div>
  </div>
</div>
  `.trim(),
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
            <div class="column">
              <div class="spacer height-40"></div>
            </div>
          </div>
            `.trim(),
          },

		
        {
            id: "splitHalf",
            name: "Split — 50/50",
            defaultEnabled: false,
            html: `
          <div class="row" data-section-id="split-half">
            <div class="column half">
              {{splitHalf.left}}
            </div>
            <div class="column half">
              {{splitHalf.right}}
            </div>
          </div>
          <div class="row" data-section-id="spacer-40">
            <div class="column">
              <div class="spacer height-40"></div>
            </div>
          </div>
            `.trim(),
          },
          
          {
            id: "splitThird",
            name: "Split — 66/33",
            defaultEnabled: false,
            html: `
          <div class="row" data-section-id="split-third">
            <div class="column two-third">
              {{splitThird.left}}
            </div>
            <div class="column third">
              {{splitThird.right}}
            </div>
          </div>
          <div class="row" data-section-id="spacer-40">
            <div class="column">
              <div class="spacer height-40"></div>
            </div>
          </div>
            `.trim(),
          },
        /*** FAQ ACCORDION
         ***/   
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
                </div>
                `).join("");

            return `
                <div class="row" data-section-id="faq-accordion">
                <div class="column sectionheadline">
                    <h2>Frequently Asked Questions</h2>
                    <p>Quick answers to common questions.</p>
                </div>
                </div>
                <div class="row">
                <div class="column">
                    ${items}
                </div>
                </div>
                <div class="row" data-section-id="spacer-40">
                <div class="column">
                    <div class="spacer height-40"></div>
                </div>
                </div>
            `.trim();
            },
        },
	];
    

	window.LMS_SECTIONS_BY_ID = window.LMS_SECTIONS.reduce((acc, s) =>
	{
		acc[s.id] = s;
		return acc;
	},
	{});
})();
