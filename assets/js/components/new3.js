// Alpine.js components for new3.html (Newspaper Brutalist)

document.addEventListener("alpine:init", () => {
  // Newspaper header component
  Alpine.data("newspaperHeader", () => ({
    data: null,

    async init() {
      this.data = await fetchMe();
    },

    get firstName() {
      return (this.data?.name || "David").split(" ")[0];
    },

    get lastName() {
      const parts = (this.data?.name || "Lakubu").split(" ");
      return parts.length > 1 ? parts.slice(1).join(" ") : "";
    },

    get tagline() {
      return `${this.data?.tagline?.en || "Software Engineer"} · ${this.data?.location_text?.en || "Mauritius Island"}`;
    },
  }));

  // Newspaper content component
  Alpine.data("newspaperContent", () => ({
    experiences: [],
    articles: [],
    projects: [],
    skills: [],
    contact: {},
    loading: true,

    async init() {
      const [experiences, articles, projects, skills, meData] = await Promise.all([
        fetchWorkExperiences(),
        fetchBlogArticles(),
        fetchProjects(),
        fetchSkills(),
        fetchMe(),
      ]);
      this.experiences = experiences;
      this.articles = articles;
      this.projects = projects;
      this.skills = skills;
      this.contact = meData?.contact || {};
      this.loading = false;
    },

    formatBlogDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }).toUpperCase().replace(".", "");
    },

    get languageSkills() {
      if (!this.skills || this.skills.length === 0) {
        return [];
      }
      const tech = this.skills.find((s) => s.category === "Technical Skills");
      const lang = tech?.subcategories?.find((s) => s.name === "Languages");
      return (lang?.items || []).slice(0, 7);
    },

    get frameworks() {
      if (!this.skills || this.skills.length === 0) {
        return [];
      }
      const tech = this.skills.find((s) => s.category === "Technical Skills");
      const libs = tech?.subcategories?.find((s) => s.name === "Libraries & Tools");
      return (libs?.items || []).slice(0, 6);
    },

    get infraSkills() {
      if (!this.skills || this.skills.length === 0) {
        return [];
      }
      const tech = this.skills.find((s) => s.category === "Technical Skills");
      const infra = tech?.subcategories?.find((s) => s.name === "Infra & Platforms");
      return (infra?.items || []).slice(0, 5);
    },

    getDescription(project) {
      return project?.description?.en || "";
    },
  }));

  // Footer strip component
  Alpine.data("footerStrip", () => ({
    contact: {},

    async init() {
      const meData = await fetchMe();
      this.contact = meData?.contact || {};
    },
  }));

  // Current date component
  Alpine.data("currentDate", () => {
    const date = new Date();
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  });
});
