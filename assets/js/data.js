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
