function getCookieValue(name) {
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim();
    if (c.startsWith(name + "=")) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return null;
}

(function initThemeFromCookie() {
  const root = document.documentElement;
  const saved = getCookieValue("theme");
  const theme = saved === "dark" ? "dark" : "light";
  root.classList.toggle("dark", theme === "dark");
})();
