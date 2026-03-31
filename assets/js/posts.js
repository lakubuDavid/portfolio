// Blog page specific components

document.addEventListener("alpine:init", () => {
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
