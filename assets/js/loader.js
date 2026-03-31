// Standalone Page Loader - No dependencies, runs immediately
(function() {
  "use strict";

  // Get the current language from localStorage
  const currentLanguage = localStorage.getItem("language") || "en";

  // Loading text translations
  const loadingText = {
    en: "Loading...",
    fr: "Chargement...",
  };

  // Theme color mappings (matching CSS variables)
  const themeColors = {
    latte: {
      "--bg": "#eff1f5",
      "--ink": "#1a1a2e",
      "--border": "#8c8fa144",
      "--accent": "#7287fd",
    },
    cocoa: {
      "--bg": "#201000",
      "--ink": "#ddb892",
      "--border": "#ede0d455",
      "--accent": "#ddb892",
    },
    noir: {
      "--bg": "#000000",
      "--ink": "#eeeeee",
      "--border": "#ffffff44",
      "--accent": "#ffffff",
    },
    lila: {
      "--bg": "#f2e9e4",
      "--ink": "#22223b",
      "--border": "#9a8c98",
      "--accent": "#22223b",
    },
    frappe: {
      "--bg": "#303446",
      "--ink": "#c6d0f5",
      "--border": "#838ba7",
      "--accent": "#8caaee",
    },
    macchiato: {
      "--bg": "#24273a",
      "--ink": "#cad3f5",
      "--border": "#8087a2",
      "--accent": "#8caaee",
    },
    mocha: {
      "--bg": "#1e1e2e",
      "--ink": "#cdd6f4",
      "--border": "#7f849c",
      "--accent": "#8caaee",
    },
  };

  // Apply theme to body and loader
  function applyTheme() {
    const currentTheme = localStorage.getItem("theme") || "latte";
    const colors = themeColors[currentTheme] || themeColors.latte;

    // Apply theme class to body
    document.body.classList.add("theme-" + currentTheme);

    // Apply CSS custom properties to root/html for loader to inherit
    const root = document.documentElement;
    Object.keys(colors).forEach((prop) => {
      root.style.setProperty(prop, colors[prop]);
    });
  }

  // Hide the loader with fade-out animation
  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) {
      loader.classList.add("hidden");
    }
    // Re-enable scrolling
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  // Show the loader (in case it was hidden)
  function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) {
      loader.classList.remove("hidden");
    }
    // Disable scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  // Initialize the loader
  function initLoader() {
    // Apply theme BEFORE showing loader
    applyTheme();

    const loaderText = document.querySelector(".loader-text");
    if (loaderText) {
      loaderText.textContent = loadingText[currentLanguage] || loadingText.en;
    }

    // Disable scrolling initially
    showLoader();
  }

  // Expose functions globally for external control
  // Call pageLoader.hide() when content is ready to hide the loader
  window.pageLoader = {
    hide: hideLoader,
    show: showLoader,
    init: initLoader,
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLoader);
  } else {
    initLoader();
  }
})();
