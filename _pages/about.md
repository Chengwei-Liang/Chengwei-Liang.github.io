
---
permalink: /
title: "Welcome"
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

<div class="home-intro">

  <div class="home-intro__text">

    <h2>Chengwei Liang</h2>

    <p class="home-intro__subtitle">
      Astronomy Undergraduate · Guangzhou University
    </p>

    <p>
      Hi! I am Chengwei Liang, a senior Astronomy undergraduate
      student at Guangzhou University with about three years of
      research experience in fast radio bursts (FRBs).
    </p>

    <p>
      I am a member of the
      <a href="https://frb.bao.ac.cn/#">
        FAST FRB Key Science Project (KSP)
      </a>
      and CRAFT collaborations. My work focuses on FRB observations
      and large-sample analysis.
    </p>

    <div class="home-intro__info">

      <div class="home-intro__info-title">
        CONTACT & AFFILIATION
      </div>

      <p>
        <i class="fas fa-fw fa-university"></i>
        {{ site.author.employer }}
      </p>

      <p>
        <i class="fas fa-fw fa-envelope"></i>
        <a href="mailto:{{ site.author.email }}">
          {{ site.author.email }}
        </a>
      </p>

      <p>
        <i class="ai ai-orcid ai-fw"></i>
        <a href="{{ site.author.orcid }}" target="_blank" rel="noopener">
          ORCID
        </a>
      </p>

      <p>
        <i class="fas fa-fw fa-location-dot"></i>
        {{ site.author.location }}
      </p>

    </div>

  </div>

  <div class="home-intro__photo">
    <img
      src="{{ site.author.avatar | prepend: '/images/' | relative_url }}"
      alt="{{ site.author.name }}"
    >
  </div>

</div>
