(() => {
  "use strict";

  const GITHUB_USER = "danicejasmine29-crypto";
  const API = "https://api.github.com";
  const THEME_KEY = "dn-theme";

  const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    PHP: "#4F5D95",
    Java: "#b07219",
    Python: "#3572A5",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Swift: "#F05138",
    Dart: "#00B4AB",
    Kotlin: "#A97BFF",
    Shell: "#89e051",
    Vue: "#41b883",
    Svelte: "#ff3e00"
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function icon(paths, size = 18) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.style.width = size + "px";
    svg.style.height = size + "px";
    for (const d of paths) {
      const p = document.createElementNS(ns, "path");
      p.setAttribute("d", d);
      svg.append(p);
    }
    return svg;
  }

  /* ---------------------------------------------------------
     Theme
  --------------------------------------------------------- */

  const themeToggle = $("#themeToggle");
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) document.documentElement.setAttribute("data-theme", storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------------------------------------------------------
     Header, mobile nav, back to top
  --------------------------------------------------------- */

  const header = $("#siteHeader");
  const nav = $("#primaryNav");
  const navToggle = $("#navToggle");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 24);
    if (toTop) toTop.classList.toggle("show", y > 620);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (nav) {
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a") && nav.classList.contains("open")) closeNav();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------- */

  const revealables = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((n) => n.classList.add("in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach((n) => revealObserver.observe(n));
  }

  /* ---------------------------------------------------------
     Active nav link
  --------------------------------------------------------- */

  const sections = ["about", "stack", "projects", "github", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = $$(".nav-link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------
     Tech icon fallback (offline CDN)
  --------------------------------------------------------- */

  $$(".chip img").forEach((img) => {
    img.addEventListener("error", () => {
      const fb = el("span", "fb", img.dataset.fb || img.alt.charAt(0));
      img.replaceWith(fb);
    });
  });

  /* ---------------------------------------------------------
     Pending Figma links
  --------------------------------------------------------- */

  $$("[data-figma]").forEach((link) => {
    const url = (link.dataset.figma || "").trim();
    if (!url) {
      link.classList.add("pending");
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.setAttribute("aria-disabled", "true");
      link.title = "Add your Figma link in index.html (data-figma)";
    }
  });

  /* ---------------------------------------------------------
     Copy email
  --------------------------------------------------------- */

  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const value = copyBtn.dataset.copy || "";
      const original = copyBtn.textContent;
      try {
        await navigator.clipboard.writeText(value);
        copyBtn.textContent = "Copied";
      } catch {
        const ta = el("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.append(ta);
        ta.select();
        try {
          document.execCommand("copy");
          copyBtn.textContent = "Copied";
        } catch {
          copyBtn.textContent = "Copy failed";
        }
        ta.remove();
      }
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1800);
    });
  }

  /* ---------------------------------------------------------
     GitHub integration
  --------------------------------------------------------- */

  const ghHead = $("#ghHead");
  const statGrid = $("#statGrid");
  const repoGrid = $("#repoGrid");
  const langsBox = $("#langs");
  const langBar = $("#langBar");
  const langLegend = $("#langLegend");
  const ghNote = $("#ghNote");
  const ghNoteText = $("#ghNoteText");
  const ghRetry = $("#ghRetry");
  const heroAvatar = $("#avatar");

  function getJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    return fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          const err = new Error(res.status === 403 || res.status === 429 ? "rate-limited" : "http-" + res.status);
          throw err;
        }
        return res.json();
      })
      .finally(() => clearTimeout(timer));
  }

  function setNote(message) {
    if (!ghNote) return;
    ghNote.hidden = !message;
    if (ghNoteText) ghNoteText.textContent = message;
  }

  function renderIdentity(user) {
    if (!ghHead) return;
    ghHead.textContent = "";

    const avatar = el("div", "gh-avatar", (user.name || user.login).slice(0, 1).toUpperCase());
    if (user.avatar_url) {
      const img = el("img");
      img.alt = "";
      img.loading = "lazy";
      img.src = user.avatar_url;
      img.addEventListener("error", () => img.remove());
      avatar.textContent = "";
      avatar.append(img);
    }

    const id = el("div", "gh-id");
    id.append(
      el("p", "gh-name", user.name || user.login),
      el("p", "gh-login", "@" + user.login)
    );
    if (user.bio) id.append(el("p", "gh-bio", user.bio));

    const link = el("a", "btn btn-ghost btn-sm", "Open GitHub");
    link.href = user.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    ghHead.append(avatar, id, link);
  }

  function renderHeroAvatar(user) {
    if (!heroAvatar || !user || !user.avatar_url) return;
    const img = el("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = user.avatar_url;
    img.addEventListener("load", () => {
      heroAvatar.textContent = "";
      heroAvatar.append(img);
    });
    img.addEventListener("error", () => img.remove());
  }

  function renderStats(user, repos) {
    if (!statGrid) return;
    const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const stats = [
      { label: "Public repos", value: user.public_repos ?? repos.length },
      { label: "Followers", value: user.followers ?? 0 },
      { label: "Following", value: user.following ?? 0 },
      { label: "Total stars", value: stars }
    ];

    statGrid.textContent = "";
    stats.forEach((s) => {
      const card = el("div", "stat");
      card.append(el("span", "stat-value", s.value), el("span", "stat-label", s.label));
      statGrid.append(card);
    });
  }

  function renderLanguages(repos) {
    if (!langsBox || !langBar || !langLegend) return;
    const bytes = new Map();
    for (const repo of repos) {
      if (!repo.language) continue;
      bytes.set(repo.language, (bytes.get(repo.language) || 0) + (repo.size || 0));
    }

    const entries = Array.from(bytes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const total = entries.reduce((sum, e) => sum + e[1], 0);

    if (!entries.length || !total) {
      langsBox.hidden = true;
      return;
    }

    langBar.textContent = "";
    langLegend.textContent = "";
    entries.forEach(([lang, size]) => {
      const pct = Math.max(3, Math.round((size / total) * 100));
      const color = LANG_COLORS[lang] || "#f472b6";
      const seg = el("span");
      seg.style.width = pct + "%";
      seg.style.background = color;
      seg.title = lang + " " + pct + "%";
      langBar.append(seg);

      const item = el("li");
      const dot = el("i");
      dot.style.background = color;
      item.append(dot, el("span", null, lang + " " + pct + "%"));
      langLegend.append(item);
    });

    langsBox.hidden = false;
  }

  function relativeDate(iso) {
    if (!iso) return "";
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + "d ago";
    if (days < 365) return Math.floor(days / 30) + "mo ago";
    return Math.floor(days / 365) + "y ago";
  }

  function renderRepos(repos) {
    if (!repoGrid) return;
    repoGrid.textContent = "";

    const picked = repos
      .filter((r) => !r.fork)
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0) || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    if (!picked.length) {
      repoGrid.append(el("p", "placeholder", "No public repositories yet — check back soon."));
      return;
    }

    picked.forEach((repo) => {
      const card = el("a", "repo");
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      const name = el("p", "repo-name");
      name.append(icon(["M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.8 6.7 19.7l1.1-6.1L3.4 9.4l6-.8z"], 16), el("span", null, repo.name));

      const foot = el("div", "repo-foot");
      if (repo.language) {
        const lang = el("span");
        const dot = el("i");
        dot.style.background = LANG_COLORS[repo.language] || "#f472b6";
        lang.append(dot, el("span", null, repo.language));
        foot.append(lang);
      }
      foot.append(el("span", null, "★ " + (repo.stargazers_count || 0)));
      const updated = el("span", null, relativeDate(repo.updated_at));
      updated.style.marginLeft = "auto";
      foot.append(updated);

      card.append(name);
      if (repo.description) card.append(el("p", "repo-desc", repo.description));
      card.append(foot);
      repoGrid.append(card);
    });
  }

  function linkProjectsToRepos(repos) {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    $$("[data-repo-keywords]").forEach((card) => {
      const link = $("[data-repo-link]", card);
      if (!link) return;
      const keys = (card.dataset.repoKeywords || "").split(/\s+/).map(normalize).filter(Boolean);
      const hit = repos.find((repo) => {
        const haystack = normalize(repo.name + " " + (repo.description || ""));
        return keys.some((k) => haystack.includes(k));
      });
      if (hit) {
        link.href = hit.html_url;
        link.title = "Open " + hit.name + " on GitHub";
        link.dataset.matched = "true";
      } else {
        link.dataset.matched = "false";
        link.title = "Your repositories on GitHub";
      }
    });
  }

  function renderFailure(message) {
    if (statGrid) statGrid.textContent = "";
    if (repoGrid) {
      repoGrid.textContent = "";
      repoGrid.append(el("p", "placeholder", "Live GitHub data is unavailable right now."));
    }
    if (langsBox) langsBox.hidden = true;
    setNote(message);
  }

  function loadGitHub() {
    if (ghNote) ghNote.hidden = true;
    if (repoGrid && !repoGrid.childElementCount) {
      repoGrid.textContent = "";
      for (let i = 0; i < 3; i++) {
        const sk = el("div", "repo");
        sk.append(el("span", "skeleton sk-line w60"), el("span", "skeleton sk-line"), el("span", "skeleton sk-line w40"));
        repoGrid.append(sk);
      }
    }

    Promise.all([
      getJSON(API + "/users/" + GITHUB_USER),
      getJSON(API + "/users/" + GITHUB_USER + "/repos?per_page=100&sort=updated")
    ])
      .then(([user, repos]) => {
        renderIdentity(user);
        renderHeroAvatar(user);
        renderStats(user, repos);
        renderLanguages(repos);
        renderRepos(repos);
        linkProjectsToRepos(repos);
        setNote("");
      })
      .catch((err) => {
        const msg =
          err && err.message === "rate-limited"
            ? "GitHub API rate limit reached — try again in a few minutes."
            : "Could not reach the GitHub API (offline or blocked).";
        renderFailure(msg);
      });
  }

  if (ghRetry) ghRetry.addEventListener("click", loadGitHub);
  loadGitHub();
})();
