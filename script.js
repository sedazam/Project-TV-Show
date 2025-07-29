//You can edit ALL of the code here
function setup() {
  const allEpisodes = allEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeContainer = document.createElement("div");
    episodeContainer.className = "episode";

    const episodeCode = `S${String(episode.season)}).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

    const titleElem = document.createElement("h2");
    titleElem.textContent = `${episodeCode} - ${episode.name}`;

    const imageElem = document.createElement("img");
    imageElem.src = episode.image.medium;
    imageElem.alt = episode.name;

    const summaryElem = document.createElement("div");
    summaryElem.innerHTML = episode.summary;

    const linkElem = document.createElement("a");
    linkElem.href = episode.url;
    linkElem.textContent = "Vie on TVmaze";
    linkElem.target = "_blank";

    episodeContainer.appendChild(titleElem);
    episodeContainer.appendChild(imageElem);
    episodeContainer.appendChild(summaryElem);
    episodeContainer.appendChild(linkElem);

    rootElem.appendChild(episodeContainer);
  });

  const footer = document.createElement("footer");
  footer.innerHTML = `Data originally from <a href="https://www.tvmaze.com/">TVmaze</a>`;
  document.body.appendChild(footer);
}

window.onload = setup;
