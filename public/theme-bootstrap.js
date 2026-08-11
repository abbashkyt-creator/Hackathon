(() => {
  try {
    const stored = localStorage.getItem("ttg_theme");
    const theme =
      stored === "light" || stored === "dark"
        ? stored
        : matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#171a30" : "#fbfaff");
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
