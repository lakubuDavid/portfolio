// Alpine.js components for new.html (Editorial Magazine)

document.addEventListener("alpine:init", () => {
  // Hero section for new.html
  Alpine.data("heroSection", () => ({
    data: null,
    loading: true,

    async init() {
      this.data = await fetchMe();
      this.loading = false;
    },

    get firstName() {
      const name = this.data?.name || "David";
      return name.split(" ")[0];
    },

    get lastName() {
      const name = this.data?.name || "Lakubu";
      const parts = name.split(" ");
      return parts.length > 1 ? parts.slice(1).join(" ") : "";
    },

    get tagline() {
      return this.data?.tagline?.en || "Backend Architect & System Designer";
    },

    get byline() {
      return "I craft the systems underneath great products — scalable APIs, clean database schemas, and edge-deployed services. Go, TypeScript, SQL, and Lua, shipped on Cloudflare, Vercel, and Docker.";
    },

    get locationText() {
      return this.data?.location_text?.en || "Mauritius Island";
    },

    get githubLink() {
      return this.data?.contact?.github ? "https://" + this.data.contact.github : "https://github.com/lakubudavid";
    },
  }));

  // Main content section for new.html
  Alpine.data("mainContent", () => ({
    experiences: [],
    articles: [],
    skills: [],
    contact: {},
    loading: true,

    async init() {
      const [experiences, articles, skills, meData] = await Promise.all([
        fetchWorkExperiences(),
        fetchBlogArticles(),
        fetchSkills(),
        fetchMe(),
      ]);
      this.experiences = experiences;
      this.articles = articles;
      this.skills = skills;
      this.contact = meData?.contact || {};
      this.loading = false;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    },

    get languageSkills() {
      if (!this.skills || this.skills.length === 0) {
        return [];
      }
      const tech = this.skills.find((s) => s.category === "Technical Skills");
      const lang = tech?.subcategories?.find((s) => s.name === "Languages");
      return (lang?.items || []).slice(0, 6).map(name => ({ name }));
    },

    get frameworks() {
      return ["Gin + sqlc", "Hono", "Drizzle ORM", "Nuxt3 + Vue", "Alpine.js"];
    },

    get infraSkills() {
      return ["Docker", "Cloudflare", "Vercel", "GitHub + Bun"];
    },
  }));

  // Projects strip for new.html
  Alpine.data("projectsStrip", () => ({
    projects: [],
    loading: true,

    async init() {
      this.projects = await fetchProjects();
      this.loading = false;
    },

    getDescription(project) {
      return project?.description?.en || "";
    },
  }));

  // Footer content for new.html
  Alpine.data("footerContent", () => ({
    contact: {},

    async init() {
      const meData = await fetchMe();
      this.contact = meData?.contact || {};
    },
  }));
});
