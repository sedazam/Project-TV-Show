//You can edit ALL of the code here

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 
  const grid = document.createElement("div");
  grid.classList.add("episode-grid");

  episodeList.forEach((ep) => {
    const card = document.createElement("div");
    card.classList.add("episode-card");

    
    const header = document.createElement("div");
    header.classList.add("episode-header");

    const title = document.createElement("h2");

    const episodeTitle = document.createElement("span");
    episodeTitle.textContent = ep.name;
    episodeTitle.classList.add("episode-title");

    const episodeCode = document.createElement("span");
    episodeCode.textContent = ` - S${formatEpisodeCode(ep.season, ep.number)}`;
    episodeCode.classList.add("episode-code");

    title.appendChild(episodeTitle);
    title.appendChild(episodeCode);
    header.appendChild(title);

    // Episode image
    const image = document.createElement("img");
    image.src = ep.image.medium;
    image.alt = ep.name;

    // Episode summary
    const summary = document.createElement("div");
    summary.innerHTML = ep.summary;

    // Link to TVmaze
    const link = document.createElement("a");
    link.href = ep.url;
    link.textContent = "View on TVmaze";
    link.target = "_blank";

    // Build card
    card.appendChild(header);
    card.appendChild(image);
    card.appendChild(summary);
    card.appendChild(link);

    grid.appendChild(card);
  });
  rootElem.appendChild(grid);
}

function formatEpisodeCode(season, number) {
  const s = season.toString().padStart(2, "0");
  const e = number.toString().padStart(2, "0");
  return `${s}E${e}`;
}

function setup() {
  const episodes = getAllEpisodes();
  makePageForEpisodes(episodes);
}

window.onload = setup;
