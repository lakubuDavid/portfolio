// Alpine.js components for new2.html (Constructivist)

document.addEventListener("alpine:init", () => {
  // Hero section for new2.html
  Alpine.data("heroSection2", () => ({
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

    get locationText() {
      return this.data?.location_text?.en || "Mauritius";
    },

    get byline() {
      return "Backend engineer crafting scalable APIs, clean architecture, and data pipelines. Go, TypeScript, SQL — shipped on the edge.";
    },

    get githubLink() {
      return this.data?.contact?.github ? "https://" + this.data.contact.github : "https://github.com/lakubudavid";
    },
  }));

  // Main content section for new2.html
  Alpine.data("mainContent2", () => ({
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

    formatBlogDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }).toUpperCase();
    },

    getYear(duration) {
      const match = duration.match(/\d{4}/);
      return match ? match[0] : "";
    },

    get languageSkills() {
      if (!this.skills || this.skills.length === 0) {
        return [];
      }
      const tech = this.skills.find((s) => s.category === "Technical Skills");
      const lang = tech?.subcategories?.find((s) => s.name === "Languages");
      return (lang?.items || []).slice(0, 6);
    },

    get frameworks() {
      return ["Gin · sqlc (Go)", "Hono · Drizzle (TS)", "Nuxt3 · Vue", "Alpine.js"];
    },

    get infraSkills() {
      return ["Docker · GitHub", "Cloudflare Workers", "Vercel · Bun", "PostgreSQL · SQLite"];
    },
  }));

  // Projects strip for new2.html
  Alpine.data("projectsStrip2", () => ({
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

  // Topbar links for new2.html
  Alpine.data("topbarLinks", () => ({
    data: null,

    async init() {
      this.data = await fetchMe();
    },

    get email() {
      return this.data?.contact?.email || "lakubudavid@gmail.com";
    },

    get github() {
      return this.data?.contact?.github || "github.com/lakubudavid";
    },

    get linkedin() {
      return this.data?.contact?.linkedin || "linkedin.com/in/david-lakubu";
    },
  }));

  // Footer links for new2.html
  Alpine.data("footerLinks", () => ({
    data: null,

    async init() {
      this.data = await fetchMe();
    },

    get email() {
      return this.data?.contact?.email || "lakubudavid@gmail.com";
    },

    get github() {
      return this.data?.contact?.github || "github.com/lakubudavid";
    },

    get linkedin() {
      return this.data?.contact?.linkedin || "linkedin.com/in/david-lakubu";
    },
  }));
});
