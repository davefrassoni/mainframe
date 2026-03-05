const projects = [
  {
    name: "Horar",
    url: "https://horar.io",
    description: "Scheduling web app monorepo built with Vue, Django, DRF, and Nginx."
  },
  {
    name: "La Mejor Guia",
    url: "https://lamejorguia.com",
    description: "Mobile-first tourism platform with city subdomains, auth, favorites, and payments."
  },
  {
    name: "QMySong",
    url: "https://qmysong.com",
    description: "Realtime party queue where users add songs, vote, and chat in live lobbies."
  },
  {
    name: "Se Fue La Luz",
    url: "https://sefuelaluz.com",
    description: "Power outage monitor web app for tracking and validating service cuts."
  },
  {
    name: "TalentHire",
    url: "https://talenthire.cloud",
    description: "AI-assisted hiring platform that matches CVs with job postings."
  },
  {
    name: "IBM Mainframe Emulator",
    url: "https://davefrassoni.com/mainframe",
    description: "Browser z/OS TSO simulator with command workflows and ISPF-style editing."
  }
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

  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description;

  link.append(name, description, url);
  return link;
}

function renderCarousel() {
  const doubledProjects = [...projects, ...projects, ...projects];
  doubledProjects.forEach((project) => {
    track.appendChild(createCard(project));
  });
}

renderCarousel();
