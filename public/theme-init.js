(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (_) {
    // Ignore localStorage access errors in restrictive browser modes.
  }
})();
