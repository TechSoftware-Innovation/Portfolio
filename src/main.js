import './style.css'

const toggleButton = document.getElementById("toggle-button");
const sidebar = document.querySelector(".sidebar");
const overlay = document.createElement("div");
const closeSideBar = document.getElementById("close-sidebar");

overlay.classList.add("overlay");
document.body.appendChild(overlay);

toggleButton.addEventListener("click", () => {
  sidebar.style.left = "0";
  overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
  sidebar.style.left = "-100%";
  overlay.classList.remove("active");
});

closeSideBar.addEventListener("click", () => {
  sidebar.style.left = "-100%";
  overlay.classList.remove("active");
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    sidebar.style.left = "-100%";
    overlay.classList.remove("active");
  }
});

