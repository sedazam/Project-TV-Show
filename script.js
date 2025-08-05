function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const episodesContainer = document.createElement("div");
  episodesContainer.id = "episodes-container";
  rootElem.appendChild(episodesContainer);

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";
    card.id = `episode-${episode.id}`;

    const titleBox = document.createElement("div");
    titleBox.className = "episode-title-box";

    const title = document.createElement("span");
    title.className = "episode-title";
    title.textContent = episode.name;

    const episodeCode = document.createElement("span");
    episodeCode.className = "episode-code";
    episodeCode.textContent = `S${pad(episode.season)}E${pad(episode.number)}`;

    titleBox.appendChild(title);
    titleBox.appendChild(document.createTextNode(" – "));
    titleBox.appendChild(episodeCode);

    const img = document.createElement("img");
    img.src = episode.image?.medium || "";
    img.alt = episode.name;

    const summary = document.createElement("div");
    summary.className = "episode-summary";
    summary.innerHTML = episode.summary || "";

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on TVMaze";

    card.appendChild(titleBox);
    card.appendChild(img);
    card.appendChild(summary);
    card.appendChild(link);

    episodesContainer.appendChild(card);
  });

  const credit = document.createElement("p");
  credit.style.textAlign = "center";
  credit.style.margin = "2em 0";
  credit.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a>`;
  rootElem.appendChild(credit);
}

function setupEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
  const showAllBtn = document.getElementById("show-all-button");

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  episodes.forEach((episode, index) => {
    const option = document.createElement("option");
    const code = `S${pad(episode.season)}E${pad(episode.number)}`;
    option.value = index;
    option.textContent = `${code} - ${episode.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    const selectedIndex = this.value;
    if (selectedIndex === "") return;

    const selectedEpisode = [episodes[selectedIndex]];
    makePageForEpisodes(selectedEpisode);
    showAllBtn.style.display = "inline-block";
  });

  showAllBtn.addEventListener("click", () => {
    makePageForEpisodes(episodes);
    select.value = "";
    showAllBtn.style.display = "none";
  });
}

function setup() {
  const episodes = getAllEpisodes();
  makePageForEpisodes(episodes);
  setupEpisodeSelect(episodes);
}

window.onload = setup;
