const projects = [
  { name: "Horar", url: "https://horar.io" },
  { name: "La Mejor Guia", url: "https://lamejorguia.com" },
  { name: "QMySong", url: "https://qmysong.com" },
  { name: "Se Fue La Luz", url: "https://sefuelaluz.com" },
  { name: "TalentHire", url: "https://talenthire.cloud" },
  { name: "IBM Mainframe Emulator", url: "https://davefrassoni.com/mainframe" }
];

const track = document.getElementById("carousel-track");

function createCard(project) {
  const link = document.createElement("a");
  link.className = "project-card";
  link.href = project.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const name = document.createElement("p");
  name.className = "project-name";
  name.textContent = project.name;

  const url = document.createElement("p");
  url.className = "project-url";
  url.textContent = project.url;

  link.append(name, url);
  return link;
}

function renderCarousel() {
  const doubledProjects = [...projects, ...projects, ...projects];
  doubledProjects.forEach((project) => {
    track.appendChild(createCard(project));
  });
}

renderCarousel();
