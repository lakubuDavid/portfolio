// Invoker API polyfill + Contact form AJAX handler

// --- Invoker API Polyfill ---
// Native support: Chrome 131+, Edge 131+. Polyfill for Firefox / Safari.
(function invokerPolyfill() {
  // Feature-detect: if <button invoketarget> already works, bail out
  var testBtn = document.createElement("button");
  testBtn.setAttribute("invoketarget", "x");
  testBtn.setAttribute("invokes", "show-modal");
  if ("invokeTargetElement" in testBtn) return; // native support

  // Polyfill
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[invoketarget]");
    if (!btn) return;

    var id = btn.getAttribute("invoketarget");
    var target = document.getElementById(id);
    if (!target || typeof target.showModal !== "function") return;

    var action = btn.getAttribute("invokes") || "show-modal";
    e.preventDefault();
    e.stopImmediatePropagation();

    if (action === "show-modal") {
      target.showModal();
    } else if (action === "show") {
      target.show();
    } else if (action === "close") {
      target.close();
    }
  });

  // Also polyfill the `invokes` attribute on <form> submit buttons (for reset/close)
  document.addEventListener("submit", function (e) {
    var btn = e.submitter;
    if (!btn || !btn.hasAttribute("invoketarget")) return;

    var id = btn.getAttribute("invoketarget");
    var target = document.getElementById(id);
    if (!target || typeof target.close !== "function") return;

    var action = btn.getAttribute("invokes") || "close";
    if (action === "close") {
      e.preventDefault();
      target.close();
    }
  });
})();

// --- Contact Form: AJAX submit + toast ---
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contact-form");
  var dialog = document.getElementById("contact-dialog");
  if (!form || !dialog) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("[type='submit']");
    var originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    var data = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        dialog.close();
        form.reset();
        showToast("Message sent — thank you!");
      })
      .catch(function (err) {
        console.error("Contact form error:", err);
        showToast("Failed to send. Please try again.", "error");
      })
      .finally(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
});

// --- Toast ---
function showToast(message, type) {
  // Remove any existing toast
  var existing = document.querySelector(".toast");
  if (existing) existing.remove();

  var toast = document.createElement("div");
  toast.className = "toast toast--" + (type || "success");
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add("toast--show");
    });
  });

  // Auto-dismiss after 3.5s
  setTimeout(function () {
    toast.classList.remove("toast--show");
    toast.addEventListener(
      "transitionend",
      function () {
        toast.remove();
      },
      { once: true }
    );
  }, 3500);
}
