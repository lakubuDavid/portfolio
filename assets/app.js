// const themeSwitcherButton = document.querySelector("button#theme-switcher");
const themeSelector = document.querySelector("select#theme-selector");
const body = document.querySelector("body");

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
loadLayouts();

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
  document.querySelectorAll(".collapse-trigger").forEach((el) => {
    const target = el.getAttribute("data-collapse-target");

    const collapseContainer = document.querySelector(target);
    const savedState = localStorage.getItem(`layout-state:${target}`);
    console.log(savedState)
    collapseContainer.setAttribute("data-collapsed", savedState ?? "on");
  });
}

document.querySelectorAll(".collapse-trigger").forEach((el) => {
  console.log(el);
  const target = el.getAttribute("data-collapse-target");
  console.log(target);
  el.addEventListener("click", (_) => {
    const collapseContainer = document.querySelector(target);
    console.log(collapseContainer);
    collapseContainer.setAttribute(
      "data-collapsed",
      collapseContainer.getAttribute("data-collapsed") == "on" ? "off" : "on",
    );
    el.textContent =
      collapseContainer.getAttribute("data-collapsed") == "on"
        ? "hide"
        : "show";

    localStorage.setItem(
      `layout-state:${target}`,
      collapseContainer.getAttribute("data-collapsed"),
    );
    console.log("cli");
  });
});
