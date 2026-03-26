export const AppViewTheme = {
  init() {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "light" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: light)").matches)
    ) {
      document.body.classList.add("light-mode");
    }
  },
  toggle(isLight) {
    document.body.classList.toggle("light-mode", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  },
};
