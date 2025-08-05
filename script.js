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
    card.id = `episode-${episode.id}`; // optional

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
    img.src =
      episode.image?.medium ||
      "https://via.placeholder.com/250x140?text=No+Image";
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

  select.innerHTML = '<option value="">Select an episode...</option>';

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
    document.getElementById("search-input").value = "";
    document.getElementById("match-count").textContent = "";
  });
}

function setupSearchInput(episodes) {
  const input = document.getElementById("search-input");
  const matchCount = document.getElementById("match-count");
  const showAllBtn = document.getElementById("show-all-button");
  const select = document.getElementById("episode-select");

  input.addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    const filteredEpisodes = episodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary?.toLowerCase().includes(searchTerm)
      );
    });

    makePageForEpisodes(filteredEpisodes);
    matchCount.textContent = `${filteredEpisodes.length} of ${episodes.length} episodes match your search.`;
    showAllBtn.style.display =
      filteredEpisodes.length < episodes.length ? "inline-block" : "none";
    select.value = "";
  });
}

function setup() {
  const loadingMessage = document.getElementById("loading-message");

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((episodes) => {
      loadingMessage?.remove();
      makePageForEpisodes(episodes);
      setupEpisodeSelect(episodes);
      setupSearchInput(episodes);
    })
    .catch((error) => {
      console.error(error);
      const root = document.getElementById("root");
      root.innerHTML = `<p style="text-align:center; color:red; font-weight:bold;">⚠️ Failed to load episodes. Please try again later.</p>`;
    });
}

window.onload = setup;
