// const themeSwitcherButton = document.querySelector("button#theme-switcher");
const themeSelector = document.querySelector("select#theme-selector");
const body = document.querySelector("body");
/**
 * @typedef {object} User
 * @property {string} name - The user's full name.
 * @property {string} username - The user's username.
 * @property {string | null} twitter_username - The user's Twitter username, or null if not provided.
 * @property {string | null} github_username - The user's GitHub username, or null if not provided.
 * @property {number} user_id - The user's unique identifier.
 * @property {string | null} website_url - The user's website URL, or null if not provided.
 * @property {string} profile_image - The URL of the user's main profile image.
 * @property {string} profile_image_90 - The URL of the user's 90x90 profile image.
 */

/**
 * @typedef {object} Article
 * @property {string} type_of - The type of the resource (e.g., "article").
 * @property {number} id - The unique identifier for the article.
 * @property {string} title - The title of the article.
 * @property {string} description - A brief description or excerpt of the article.
 * @property {string} readable_publish_date - A human-readable string for the publish date.
 * @property {string} slug - The URL-friendly slug for the article.
 * @property {string} path - The path component of the article's URL on the platform.
 * @property {string} url - The full URL of the article.
 * @property {number} comments_count - The number of comments on the article.
 * @property {number} public_reactions_count - The total number of public reactions (likes, etc.).
 * @property {number | null} collection_id - The ID of the collection the article belongs to, or null.
 * @property {string} published_timestamp - The ISO 8601 formatted timestamp when the article was published.
 * @property {string} language - The language code of the article (e.g., "en").
 * @property {number | null} subforem_id - The ID of the subforem, or null.
 * @property {number} positive_reactions_count - The number of positive reactions.
 * @property {string | null} cover_image - The URL of the cover image, or null if none exists.
 * @property {string | null} social_image - The URL of the social media preview image, or null if none exists.
 * @property {string} canonical_url - The canonical URL for the article.
 * @property {string} created_at - The ISO 8601 formatted timestamp when the article was created.
 * @property {string | null} edited_at - The ISO 8601 formatted timestamp when the article was last edited, or null.
 * @property {string | null} crossposted_at - The ISO 8601 formatted timestamp if the article was crossposted, or null.
 * @property {string} published_at - The ISO 8601 formatted timestamp when the article was published.
 * @property {string} last_comment_at - The ISO 8601 formatted timestamp of the most recent comment.
 * @property {number} reading_time_minutes - The estimated reading time in minutes.
 * @property {string[]} tag_list - An array of tags associated with the article.
 * @property {string} tags - A string containing tags, often comma-separated.
 * @property {User} user - The author of the article.
 */

/**
 * @typedef {object} Project
 * @property {string} name - The name of the project.
 * @property {string} description - A description of the project.
 * @property {string} tech_used - The technologies used in the project.
 * @property {string} status - The current status of the project.
 * @property {string} github_link - The URL to the project's GitHub repository.
 */

/**
 * @typedef {object} SkillSubcategory
 * @property {string} name - The name of the skill subcategory (e.g., "Languages").
 * @property {string[]} items - An array of skills within this subcategory.
 */

/**
 * @typedef {object} SkillCategory
 * @property {string} category - The name of the skill category (e.g., "Technical Skills").
 * @property {SkillSubcategory[]} [subcategories] - An array of skill subcategories (for Technical Skills).
 * @property {string[]} [items] - An array of skills (for Personal Skills).
 */

/**
 * @typedef {SkillCategory[]} SkillsData - The overall structure of the skills.json file.
 */

/**
 * @typedef {object} WorkExperience
 * @property {string} title - The job title.
 * @property {string} duration - The duration of the work experience.
 * @property {string} tech_used - The technologies used.
 * @property {string} description - The description of the role/tasks (can contain HTML like links).
 */

/**
 * @typedef {WorkExperience[]} WorkExperiencesData - The overall structure of the work_experience.json file.
 */

/**
 * @typedef {object} ContactLink
 * @property {string} text - The display text for the link.
 * @property {string} href - The URL for the link.
 */

/**
 * @typedef {object} ProfileImage
 * @property {string} src - The source URL of the image.
 * @property {string} alt - The alt text for the image.
 * @property {string} [width] - The width attribute for the image.
 * @property {string} [height] - The height attribute for the image.
 */

/**
 * @typedef {object} MeData
 * @property {string} name - The name to display.
 * @property {string} location_text - The location text.
 * @property {string[]} role_parts - An array of strings for the role description.
 * @property {ContactLink[]} contact_links - An array of contact link objects.
 * @property {ProfileImage} profile_image - Object containing profile image details.
 */

const themes = [
  "latte",
  "lila",
  "frappe",
  // "macchiato",
  "cocoa",
  // "mocha",
  "noir",
];

let theme = localStorage.getItem("theme") ?? themes[0];
// Create options for select element if they don't exist
if (themeSelector.children.length === 0) {
  themes.forEach((themeName) => {
    const option = document.createElement("option");
    option.value = themeName;
    option.textContent = themeName;
    themeSelector.appendChild(option);
  });
}

// Set initial selected value
themeSelector.value = theme;

reloadTheme();
loadLayouts(); // This function now calls loadMe, loadProjects, loadSkills, and loadWorkExperiences

themeSelector.addEventListener("change", (event) => {
  theme = event.target.value;
  reloadTheme();
  console.log(`Theme changed to: ${theme}`);
});

function reloadTheme() {
  localStorage.setItem("theme", theme);
  body.classList = [];
  body.classList.add(`theme-${theme}`);
  // themeSwitcherButton.textContent = `theme : ${theme}`;
}

function loadLayouts() {
  // Handle collapse triggers
  document.querySelectorAll(".collapse-trigger").forEach((el) => {
    const target = el.getAttribute("data-collapse-target");
    const collapseContainer = document.querySelector(target);
    if (collapseContainer) {
      // Check if target exists
      const savedState = localStorage.getItem(`layout-state:${target}`);
      collapseContainer.setAttribute("data-collapsed", savedState ?? "on");
      // Update button text based on saved state
      el.textContent =
        collapseContainer.getAttribute("data-collapsed") == "on"
          ? "hide"
          : "show";
    } else {
      console.warn(`Collapse target "${target}" not found.`);
    }
  });

  // Load "Me" section
  loadMe();

  // Load articles
  const blogList = document.querySelector("#blogs-list");
  if (blogList) {
    // Check if element exists before trying to populate
    getArticles().then((articles) => {
      // Clear existing content before populating
      blogList.innerHTML = "";
      articles.forEach((art) => {
        const element = document.createElement("div");
        element.classList.add("blog-list-item");
        element.innerHTML = `
            <div class="col">
              <strong><a href="${art.url}">${art.title}</a></strong>
              <small>${new Date(art.published_at).toDateString()}</small>
            </div>
            <img width="auto" src="${art.cover_image || art.social_image}"/>
          `;
        blogList.appendChild(element);
      });
    });
  } else {
    console.warn("Blogs list container (#blogs-list) not found.");
  }

  // Load projects
  loadProjects();

  // Load skills
  loadSkills();

  // Load work experiences
  loadWorkExperiences();
}

async function getArticles() {
  const response = await fetch(
    "https://dev.to/api/articles?username=lakubudavid",
    {
      cache: "reload",
    },
  );
  if (response.ok) {
    /** @type {Article[]} */
    const articles = await response.json();
    return articles;
  } else {
    console.error("Failed to fetch articles:", response.statusText);
    return [];
  }
}

async function getProjects() {
  try {
    const response = await fetch("assets/projects.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    /** @type {Project[]} */
    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return an empty array in case of error
  }
}

async function loadProjects() {
  const projectsContainer = document.querySelector("#personal-projects"); // Target the div by its ID
  if (!projectsContainer) {
    console.error("Projects grid container (#personal-projects) not found.");
    return;
  }

  // Clear existing content before populating
  projectsContainer.innerHTML = "";

  const projects = await getProjects();

  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("p-group", "collapsible"); // Add classes as in your HTML

    projectElement.innerHTML = `
              <h2><strong>${project.name}</strong></h2>
              <span>${project.description}</span>
              <br>
              <span><strong>Tech Used :</strong> ${project.tech_used}</span><br>
              <span><strong>Status :</strong> ${project.status}</span>
              <br>
              <span>See on <a href="${project.github_link}">github</a></span>
          `;

    projectsContainer.appendChild(projectElement);
  });
}

async function getSkills() {
  try {
    const response = await fetch("assets/skills.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    /** @type {SkillsData} */
    const skillsData = await response.json();
    return skillsData;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return []; // Return an empty array in case of error
  }
}

async function loadSkills() {
  const skillsSection = document.querySelector("#skills");
  if (!skillsSection) {
    console.error("Skills section (#skills) not found.");
    return;
  }

  const skillsData = await getSkills();

  // Find the containers for technical and personal skills by their IDs
  const technicalSkillsContentContainer =
    document.querySelector("#technical-skills");
  const personalSkillsContentContainer =
    document.querySelector("#personal-skills");

  if (technicalSkillsContentContainer) {
    // Clear existing content within the technical skills container
    technicalSkillsContentContainer.innerHTML = "";
  } else {
    console.warn(
      "Technical skills content container (#technical-skills-container) not found.",
    );
  }

  if (personalSkillsContentContainer) {
    personalSkillsContentContainer.innerHTML = ""; // Clear personal skills list container
  } else {
    console.warn(
      "Personal skills content container (#personal-skills-container) not found.",
    );
  }

  skillsData.forEach((categoryData) => {
    if (
      categoryData.category === "Technical Skills" &&
      technicalSkillsContentContainer
    ) {
      if (categoryData.subcategories) {
        categoryData.subcategories.forEach((sub) => {
          const subCategoryDiv = document.createElement("div");
          const h3 = document.createElement("h3");
          h3.textContent = sub.name;
          subCategoryDiv.appendChild(h3);

          if (sub.items && Array.isArray(sub.items)) {
            const ul = document.createElement("ul");
            sub.items.forEach((item) => {
              const li = document.createElement("li");
              li.textContent = item;
              ul.appendChild(li);
            });
            subCategoryDiv.appendChild(ul);
          }

          technicalSkillsContentContainer.appendChild(subCategoryDiv);
        });
      }
    } else if (
      categoryData.category === "Personal Skills" &&
      personalSkillsContentContainer
    ) {
      if (categoryData.items && Array.isArray(categoryData.items)) {
        const ul = document.createElement("ul");
        categoryData.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        personalSkillsContentContainer.appendChild(ul);
      }
    } else {
      console.warn(
        `Unexpected skill category or container not found during loading: ${categoryData.category}`,
      );
    }
  });
}

async function getWorkExperiences() {
  try {
    const response = await fetch("assets/work_experience.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    /** @type {WorkExperiencesData} */
    const workExperienceData = await response.json();
    return workExperienceData;
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return []; // Return an empty array in case of error
  }
}

async function loadWorkExperiences() {
  const workExperienceSection = document.querySelector("#about"); // The section is the container
  if (!workExperienceSection) {
    console.error("Work experience section (#about) not found.");
    return;
  }

  // Find and remove all existing .p-group elements within the #about section
  // Start from the first child after the H1 to preserve the H1 and trigger link
  const existingExperienceElements =
    workExperienceSection.querySelectorAll(".p-group");
  existingExperienceElements.forEach((el) => el.remove());

  const workExperiences = await getWorkExperiences();

  workExperiences.forEach((experience) => {
    const experienceElement = document.createElement("div");
    experienceElement.classList.add("p-group", "collapsible"); // Add classes as in your HTML

    experienceElement.innerHTML = `
              <h2><strong>${experience.title}</strong></h2>
              <span>${experience.duration}</span>
              <br>
              <span><strong>Tech Used :</strong> ${experience.tech_used}</span>
              <br>
              <span>
                  <p>${experience.description}</p>
              </span>
          `;
    // Append the new experience element directly to the #about section
    workExperienceSection.appendChild(experienceElement);
  });
}

async function getMe() {
  try {
    const response = await fetch("assets/me.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    /** @type {MeData} */
    const meData = await response.json();
    return meData;
  } catch (error) {
    console.error("Error fetching 'me' data:", error);
    return null; // Return null or an empty object in case of error
  }
}

async function loadMe() {
  const meSection = document.querySelector("#me");
  const meInfoContainer = document.querySelector("#me-info"); // The div.col for info
  const profileImageElement = document.querySelector("#me-profile-image"); // The img element
  const locationTextElement = document.querySelector("#me-location-text"); // The span for location text

  if (
    !meSection ||
    !meInfoContainer ||
    !profileImageElement ||
    !locationTextElement
  ) {
    console.error("'Me' section elements not found.");
    return;
  }

  const meData = await getMe();

  if (!meData) {
    console.warn("No 'me' data loaded.");
    return;
  }

  // Clear existing content within the me-info container, except for the location span with SVG
  // We'll clear everything *except* the span that contains the SVG
  // const elementsToClear = meInfoContainer.querySelectorAll(":scope > *:and(:not(span),:not(svg)");
  // elementsToClear.forEach(el => el.remove());

  // Populate Location Text
  locationTextElement.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.06298 10.063 6.27212 12.2721 6.27212C14.4813 6.27212 16.2721 8.06298 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16755 11.1676 8.27212 12.2721 8.27212C13.3767 8.27212 14.2721 9.16755 14.2721 10.2721Z"
                fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.39409 5.48178 3.79417C8.90918 0.194243 14.6059 0.054383 18.2059 3.48178C21.8058 6.90918 21.9457 12.6059 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.97318 6.93028 5.17324C9.59603 2.3733 14.0268 2.26452 16.8268 4.93028C19.6267 7.59603 19.7355 12.0268 17.0698 14.8268Z"
                fill="currentColor" />
            </svg>
            Currently in ${meData.location_text}`;

  // Populate Role(s)
  if (meData.role_parts && Array.isArray(meData.role_parts)) {
    const roleSpan = document.createElement("span");
    roleSpan.innerHTML = meData.role_parts
      .map((part) => `<span>${part}</span>`)
      .join(" | ");
    meInfoContainer.append(roleSpan); // Insert after the location span
  }

  // Populate Contact Links
  if (
    meData.contact_links &&
    Array.isArray(meData.contact_links) &&
    meData.contact_links.length > 0
  ) {
    const linksDiv = document.createElement("div");
    linksDiv.classList.add("links");
    const ul = document.createElement("ul");

    const contactMeLi = document.createElement("li");
    contactMeLi.textContent = "Contact me :";
    ul.appendChild(contactMeLi);

    meData.contact_links.forEach((link, index) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      li.appendChild(a);
      ul.appendChild(li);

      if (index < meData.contact_links.length - 1) {
        // Add '-' separator between links (except the last one)
        const separatorLi = document.createElement("li");
        separatorLi.textContent = "-";
        ul.appendChild(separatorLi);
      }
    });
    linksDiv.appendChild(ul);
    meInfoContainer.appendChild(linksDiv); // Add links at the bottom of the info col
  }

  // Populate Profile Image
  if (meData.profile_image) {
    profileImageElement.src = meData.profile_image.src;
    profileImageElement.alt = meData.profile_image.alt;
    if (meData.profile_image.width)
      profileImageElement.width = parseInt(meData.profile_image.width); // Ensure integer
    if (meData.profile_image.height)
      profileImageElement.height = parseInt(meData.profile_image.height); // Ensure integer
  }
}

document.querySelectorAll(".collapse-trigger").forEach((el) => {
  const target = el.getAttribute("data-collapse-target");
  el.addEventListener("click", (_) => {
    const collapseContainer = document.querySelector(target);
    if (collapseContainer) {
      // Check if target exists
      const currentState = collapseContainer.getAttribute("data-collapsed");
      const newState = currentState == "on" ? "off" : "on";

      collapseContainer.setAttribute("data-collapsed", newState);
      el.textContent = newState == "on" ? "hide" : "show";

      localStorage.setItem(`layout-state:${target}`, newState);
    } else {
      console.warn(`Collapse target "${target}" not found for click handler.`);
    }
  });
});
