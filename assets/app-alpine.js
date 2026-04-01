// Alpine.js Portfolio Application - Base stores and shared components
// Note: Page-specific components are in assets/js/<page>.js

// Initialize Alpine stores and components before Alpine starts
document.addEventListener("alpine:init", () => {
  // i18n store - manages language selection
  Alpine.store("i18n", {
    languages: ["en", "fr"],
    current: localStorage.getItem("language") || "en",

    init() {
      this.current = localStorage.getItem("language") || "en";
    },

    // UI translations
    translations: {
      en: {
        aboutMe: "About Me",
        education: "Education",
        currentlyIn: "Currently in",
        contactMe: "Contact me :",
        skills: "Skills",
        technicalSkills: "Technical Skills",
        personalSkills: "Personal Skills",
        workExperiences: "Work Experiences",
        awardsCertificates: "Awards & Certificates",
        blogArticles: "Blog Articles",
        personalProjects: "Personal Projects",
        techUsed: "Tech Used :",
        status: "Status :",
        seeOnGithub: "See on",
        visitSite: "Visit",
        hide: "hide",
        show: "show",
        loading: "Loading...",
        noArticles: "No articles found.",
        visitBlog: "Visit my blog",
        allArticles: "See all articles",
        backToHome: "Back to Home",
        backToList: "Back to list",
      },
      fr: {
        aboutMe: "À propos",
        education: "Éducation",
        currentlyIn: "Actuellement à",
        contactMe: "Me contacter :",
        skills: "Compétences",
        technicalSkills: "Compétences Techniques",
        personalSkills: "Compétences Personnelles",
        workExperiences: "Expériences Professionnelles",
        awardsCertificates: "Prix & Certificats",
        blogArticles: "Articles de Blog",
        personalProjects: "Projets Personnels",
        techUsed: "Technologies :",
        status: "Statut :",
        seeOnGithub: "Voir sur",
        visitSite: "Voir",
        hide: "masquer",
        show: "afficher",
        loading: "Chargement...",
        noArticles: "Aucun article trouvé.",
        visitBlog: "Visiter mon blog",
        allArticles: "Voir tous les articles",
        backToHome: "Retour à l'accueil",
        backToList: "Retour à la liste",
      },
    },

    setLanguage(lang) {
      if (this.languages.includes(lang)) {
        this.current = lang;
        localStorage.setItem("language", lang);
      }
    },

    t(key) {
      return this.translations[this.current]?.[key] || key;
    },

    // Helper to get localized value from an object with { en: ..., fr: ... }
    localize(obj) {
      if (obj === null || obj === undefined) return "";
      if (typeof obj === "string") return obj;
      if (typeof obj === "object" && (obj.en || obj.fr)) {
        return obj[this.current] || obj.en || "";
      }
      return obj;
    },
  });

  // Theme store - global state for theme management
  Alpine.store("theme", {
    themes: ["latte", "lila", "frappe", "cocoa", "noir"],
    current: localStorage.getItem("theme") || "latte",

    init() {
      this.current = localStorage.getItem("theme") || "latte";
      this.updateBodyClass();
    },

    get() {
      return this.current;
    },

    set(themeName) {
      this.current = themeName;
      localStorage.setItem("theme", themeName);
      this.updateBodyClass();
    },

    updateBodyClass() {
      document.body.className = `theme-${this.current}`;
    },
  });

  // Collapse state store - manages collapsible sections
  Alpine.store("collapse", {
    states: {},

    init() {
      const targets = ["#me", "#about", "#education", "#experience", "#skills", "#awards", "#blogs", "#project"];
      targets.forEach((target) => {
        const savedState = localStorage.getItem(`collapse:${target}`);
        this.states[target] = savedState || "on";
      });
    },

    toggle(target) {
      const currentState = this.states[target] || "on";
      const newState = currentState === "on" ? "off" : "on";
      this.states[target] = newState;
      localStorage.setItem(`collapse:${target}`, newState);
    },

    isCollapsed(target) {
      return this.states[target] === "on";
    },

    getButtonText(target) {
      const i18n = Alpine.store("i18n");
      return this.states[target] === "on" ? i18n.t("hide") : i18n.t("show");
    },
  });

  // Global theme manager - provides reactive theme class for body
  Alpine.data("themeManager", () => ({
    init() {
      Alpine.store("theme").init();
      Alpine.store("collapse").init();
    },

    get theme() {
      return Alpine.store("theme").current;
    },

    get themeClass() {
      return `theme-${Alpine.store("theme").current}`;
    },

    setTheme(themeName) {
      Alpine.store("theme").set(themeName);
    },
  }));

  // Theme selector component
  Alpine.data("themeSelector", () => ({
    open: false,

    get themes() {
      return Alpine.store("theme").themes;
    },

    get currentTheme() {
      return Alpine.store("theme").current;
    },

    setCurrentTheme(value) {
      Alpine.store("theme").set(value);
      this.open = false;
    },
  }));

  // Language selector component
  Alpine.data("languageSelector", () => ({
    open: false,

    get languages() {
      return Alpine.store("i18n").languages;
    },

    get currentLanguage() {
      return Alpine.store("i18n").current;
    },

    setCurrentLanguage(value) {
      Alpine.store("i18n").setLanguage(value);
      this.open = false;
    },

    getLanguageLabel(lang) {
      const labels = { en: "English", fr: "Français" };
      return labels[lang] || lang;
    },
  }));

  // Me Section component (for index.html)
  Alpine.data("meSection", () => ({
    data: null,
    loading: true,

    async init() {
      this.data = await fetchMe();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    get name() {
      return this.data?.name || "";
    },

    get locationText() {
      return this.i18n.localize(this.data?.location_text) || "";
    },

    get roleParts() {
      const roles = this.data?.role_parts;
      if (!roles) return [];
      return this.i18n.localize(roles) || [];
    },

    get description() {
      return this.i18n.localize(this.data?.description) || "";
    },

    get contactLinks() {
      return this.data?.contact_links || [];
    },

    get profileImage() {
      const img = this.data?.profile_image || {};
      return {
        ...img,
        alt: this.i18n.localize(img.alt) || "profile picture",
      };
    },

    isCollapsed() {
      return Alpine.store("collapse").isCollapsed("#me");
    },

    toggleCollapse() {
      Alpine.store("collapse").toggle("#me");
    },

    get buttonText() {
      return Alpine.store("collapse").getButtonText("#me");
    },
  }));

  // Combined init for new_home.html - initializes both theme and me data
    Alpine.data("combinedInit", () => ({
      data: null,
      loading: true,

      async init() {
        Alpine.store("theme").init();
        Alpine.store("collapse").init();
        this.data = await fetchMe();
        this.loading = false;
        if (window.pageLoader) {
          window.pageLoader.hide();
        }
      },

      get i18n() {
        return Alpine.store("i18n");
      },

      get theme() {
        return Alpine.store("theme").current;
      },

      get themeClass() {
       return `theme-${Alpine.store("theme").current}`;
     },

     get name() {
       return this.data?.name || "";
     },

     get locationText() {
       return this.i18n.localize(this.data?.location_text) || "";
     },

     get roleParts() {
       const roles = this.data?.role_parts;
       if (!roles) return [];
       return this.i18n.localize(roles) || [];
     },

     get description() {
       return this.i18n.localize(this.data?.description) || "";
     },

     get profileImage() {
       const img = this.data?.profile_image || {};
       return {
         ...img,
         alt: this.i18n.localize(img.alt) || "profile picture",
       };
     },
   }));

  // Skills Section component
  Alpine.data("skillsSection", () => ({
    skills: [],
    loading: true,

    async init() {
      this.skills = await fetchSkills();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    get technicalSkills() {
      const tech = this.skills.find((s) => s.category === "Technical Skills");
      return tech?.subcategories || [];
    },

    get languageSkills() {
      if (!this.skills || this.skills.length === 0) {
        return [];
      }
      const tech = this.skills.find((s) => s.category === "Technical Skills");
      const lang = tech?.subcategories?.find((s) => s.name === "Languages");
      return lang?.items || [];
    },

    get librariesAndTools() {
      const tech = this.skills?.find((s) => s.category === "Technical Skills");
      if (!tech) return [];
      const lib = tech.subcategories?.find((s) => s.name === "Libraries & Tools");
      return lib?.items || [];
    },

    get infraAndPlatforms() {
      const tech = this.skills?.find((s) => s.category === "Technical Skills");
      if (!tech) return [];
      const infra = tech.subcategories?.find((s) => s.name === "Infra & Platforms");
      return infra?.items || [];
    },

    get personalSkills() {
      const personal = this.skills.find((s) => s.category === "Personal Skills");
      return personal?.items || [];
    },

    isCollapsed() {
      return Alpine.store("collapse").isCollapsed("#skills");
    },

    toggleCollapse() {
      Alpine.store("collapse").toggle("#skills");
    },

    get buttonText() {
      return Alpine.store("collapse").getButtonText("#skills");
    },
  }));

  // Work Experience Section component
   Alpine.data("workExperienceSection", () => ({
     experiences: [],
     loading: true,

     async init() {
       this.experiences = await fetchWorkExperiences();
       this.loading = false;
     },

      get i18n() {
        return Alpine.store("i18n");
      },

      hasExternalLink(experience) {
        return !!experience.external_link;
      },

      getExternalLinkUrl(experience) {
        return experience.external_link?.url || "";
      },

      getExternalLinkName(experience) {
        const link = experience.external_link;
        if (!link) return "";
        if (typeof link === "string") return "Visit";
        return link.name || "Visit";
      },

      isCollapsed() {
       return Alpine.store("collapse").isCollapsed("#about");
     },

     toggleCollapse() {
       Alpine.store("collapse").toggle("#about");
     },

     get buttonText() {
       return Alpine.store("collapse").getButtonText("#about");
     },
   }));

  // Blogs Section component
  Alpine.data("blogsSection", () => ({
    articles: [],
    loading: true,

    async init() {
      this.articles = await fetchBlogArticles();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const lang = Alpine.store("i18n").current;
      return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    isCollapsed() {
      return Alpine.store("collapse").isCollapsed("#blogs");
    },

    toggleCollapse() {
      Alpine.store("collapse").toggle("#blogs");
    },

    get buttonText() {
      return Alpine.store("collapse").getButtonText("#blogs");
    },
  }));

  // Projects Section component
   Alpine.data("projectsSection", () => ({
     projects: [],
     loading: true,

     async init() {
       this.projects = await fetchProjects();
       this.loading = false;
     },

      get i18n() {
        return Alpine.store("i18n");
      },

      getDescription(project) {
        return this.i18n.localize(project.description);
      },

      getStatus(project) {
        return this.i18n.localize(project.status);
      },

      hasExternalLink(project) {
        return !!project.external_link;
      },

      getExternalLinkUrl(project) {
        return project.external_link?.url || "";
      },

      getExternalLinkName(project) {
        const link = project.external_link;
        if (!link) return "";
        if (typeof link === "string") return "Visit";
        return link.name || "Visit";
      },

      isCollapsed() {
        return Alpine.store("collapse").isCollapsed("#project");
      },

     toggleCollapse() {
       Alpine.store("collapse").toggle("#project");
     },

     get buttonText() {
       return Alpine.store("collapse").getButtonText("#project");
     },
   }));

  // Awards Section component
  Alpine.data("awardsSection", () => ({
    awards: [],
    loading: true,

    async init() {
      this.awards = await fetchAwards();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },
  }));

  // About Me Section component (for portfolio.html)
  Alpine.data("aboutMeSection", () => ({
    data: null,
    loading: true,

    async init() {
      this.data = await fetchMe();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    get name() {
      return this.data?.name || "";
    },

    get tagline() {
      return this.i18n.localize(this.data?.tagline) || "";
    },

    get locationText() {
      return this.i18n.localize(this.data?.location_text) || "";
    },

    get contact() {
      return this.data?.contact || {};
    },

    get profileImage() {
      const img = this.data?.profile_image || {};
      return {
        ...img,
        alt: this.i18n.localize(img.alt) || "profile picture",
      };
    },

    isCollapsed() {
      return Alpine.store("collapse").isCollapsed("#about");
    },

    toggleCollapse() {
      Alpine.store("collapse").toggle("#about");
    },

    get buttonText() {
      return Alpine.store("collapse").getButtonText("#about");
    },
  }));

  // Education Section component
  Alpine.data("educationSection", () => ({
    education: [],
    loading: true,

    async init() {
      this.education = await fetchEducation();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    isCollapsed() {
      return Alpine.store("collapse").isCollapsed("#education");
    },

    toggleCollapse() {
      Alpine.store("collapse").toggle("#education");
    },

    get buttonText() {
      return Alpine.store("collapse").getButtonText("#education");
    },
  }));

  // Awards Section component
  Alpine.data("awardsSection", () => ({
    awards: [],
    loading: true,

    async init() {
      this.awards = await fetchAwards();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    isCollapsed() {
      return Alpine.store("collapse").isCollapsed("#awards");
    },

    toggleCollapse() {
      Alpine.store("collapse").toggle("#awards");
    },

    get buttonText() {
      return Alpine.store("collapse").getButtonText("#awards");
    },
  }));

  // Scroll Indicator component
  Alpine.data("scrollIndicator", () => ({
    showIndicator: false,
    scrollProgress: 0,

    init() {
      this.handleScroll();
    },

    handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.showIndicator = scrollTop > 200;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  }));

  // Blog Section component (for blog posts)
  Alpine.data("blogSection", () => ({
    articles: [],
    loading: true,
    currentPostId: null,
    renderedContent: "",
    postMetadata: null,
    tocHeadings: [],

    async init() {
      const urlParams = new URLSearchParams(window.location.search);
      this.currentPostId = urlParams.get("blog_post");

      if (this.currentPostId) {
        await this.loadPost();
      } else {
        await this.loadArticles();
      }
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    async loadArticles() {
      this.articles = await fetchBlogArticles();
    },

    async loadPost() {
      const post = await fetchBlogPost(this.currentPostId);
      if (post) {
        this.renderedContent = marked?.parse(post.content) || post.content;
        this.postMetadata = post.metadata;
        this.$nextTick(() => this.generateToc());
      }
    },

    generateToc() {
      const article = document.querySelector(".blog-post");
      if (!article) return;

      const headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6");
      this.tocHeadings = [];

      headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;

        this.tocHeadings.push({
          id: id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1)),
        });
      });
    },

    scrollToHeading(event, id) {
      event.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const lang = Alpine.store("i18n").current;
      return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  }));
});

// Data fetching functions
async function fetchMe() {
  try {
    const response = await fetch("assets/me.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching 'me' data:", error);
    return null;
  }
}

async function fetchSkills() {
  try {
    const response = await fetch("assets/skills.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

async function fetchProjects() {
  try {
    const response = await fetch("assets/projects.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function fetchWorkExperiences() {
  try {
    const response = await fetch("assets/work_experience.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return [];
  }
}

async function fetchBlogArticles() {
  try {
    const response = await fetch("assets/blog-posts.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog articles:", error);
    return [];
  }
}

async function fetchBlogPost(id) {
  try {
    const response = await fetch(`blog/content/${id}.md`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    const metadata = parseBlogPostMetadata(content);
    return {
      content: content.replace(/^\+\+\+[\s\S]*?\+\+\+/, "").trim(),
      metadata: metadata,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

async function fetchEducation() {
  try {
    const response = await fetch("assets/education.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
}

async function fetchAwards() {
  try {
    const response = await fetch("assets/awards.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching awards:", error);
    return [];
  }
}

function parseBlogPostMetadata(content) {
  const match = content.match(/^\+\+\+([\s\S]*?)\+\+\+/);
  if (!match) return {};

  const metadata = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const equalIndex = line.indexOf("=");
    if (equalIndex > -1) {
      const key = line.substring(0, equalIndex).trim();
      let value = line.substring(equalIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (key) {
        metadata[key] = value;
      }
    }
  }

  return metadata;
}
