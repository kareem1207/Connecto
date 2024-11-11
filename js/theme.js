document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
});

function toggleTheme() {
  const currentTheme = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  const emoji = document.getElementById("emoji-menu");
  if (emoji) {
    emoji.className = newTheme;
  }
  localStorage.setItem("theme", newTheme);
}

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    document.getElementById("theme-toggle").textContent = "🌞";
    document.getElementById("title").src = "../images/Connecto title dark.png";
    const homeInfo = document.getElementById("homeInfo");
    if (homeInfo) {
      homeInfo.src = "../images/Connecto title dark.png";
    }
  } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
    document.getElementById("theme-toggle").textContent = "🌙";
    document.getElementById("title").src = "../images/Connecto title.png";
    const homeInfo = document.getElementById("homeInfo");
    if (homeInfo) {
      homeInfo.src = "../images/Connecto title.png";
    }
  }
}
