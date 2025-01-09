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

// CAROUSEL FUNCTIONALITY
const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  carousel.scrollBy({ left: -510, behavior: "smooth" });
});

nextBtn.addEventListener("click", () => {
  carousel.scrollBy({ left: 510, behavior: "smooth" });
});

// LOAD PROJECTS FROM JSON FILE
const projectsContainer = document.getElementById("carousel");

async function loadProjects() {
  try {
    const response = await fetch('./src/assets/data/projects.json');
    const data = await response.json();
    
    data.projects.forEach(project => {
      const card = document.createElement("article");
      card.className = "projects-card";

      const img = document.createElement("img");
      img.className = "projects-card-image";
      img.src = project.image;
      img.alt = `Image for ${project.name}`;

      const cardInfo = document.createElement("div");
      cardInfo.className = "projects-card-info";

      const title = document.createElement("h4");
      title.className = "projects-card-title";
      title.textContent = project.name;

      const divider = document.createElement("hr");
      divider.className = "projects-card-divider";

      const description = document.createElement("h6");
      description.className = "projects-card-description";
      description.textContent = project.description;

      const button = document.createElement("button");
      button.className = "projects-card-button";
      const link = document.createElement("a");
      link.href = project.link;
      link.textContent = "Ver proyecto";
      link.target = "";
      button.appendChild(link);

      cardInfo.appendChild(title);
      cardInfo.appendChild(divider);
      cardInfo.appendChild(description);
      cardInfo.appendChild(button);

      card.appendChild(img);
      card.appendChild(cardInfo);

      carousel.appendChild(card); // Añadir la card al carrusel
    });

    // Ahora que las tarjetas se han cargado, obtenemos su ancho
    const cardWidth = document.querySelector(".projects-card").offsetWidth + 16;

    // Agregar los listeners de los botones de desplazamiento
    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -cardWidth, behavior: "smooth" }); // Desplazarse a la izquierda por el ancho de una card
    });

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: cardWidth, behavior: "smooth" }); // Desplazarse a la derecha por el ancho de una card
    });

  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

loadProjects();
