function pad(num) {
  return num.toString().padStart(2, "0");
}

// Caches to avoid duplicate fetches
const showCache = new Map();
const episodesCache = new Map();

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const episodesContainer = document.createElement("div");
  episodesContainer.id = "episodes-container";
  rootElem.appendChild(episodesContainer);

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
    img.src = episode.image?.medium || "https://via.placeholder.com/250x140?text=No+Image";
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

function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
  select.innerHTML = '<option value="">Select an episode...</option>';
  episodes.forEach((episode, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = `S${pad(episode.season)}E${pad(episode.number)} - ${episode.name}`;
    select.appendChild(option);
  });
}

function setupSearchInput(episodes) {
  const input = document.getElementById("search-input");
  const matchCount = document.getElementById("match-count");
  const select = document.getElementById("episode-select");

  input.addEventListener("input", function () {
    const searchTerm = input.value.toLowerCase().trim();
    const filtered = episodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(searchTerm) ||
        (ep.summary && ep.summary.toLowerCase().includes(searchTerm))
    );
    makePageForEpisodes(filtered);
    if (matchCount) {
      matchCount.textContent = `Displaying ${filtered.length}/${episodes.length} episodes.`;
    }
    select.value = "";
  });
}

function setupEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
  select.addEventListener("change", function () {
    if (this.value === "") {
      makePageForEpisodes(episodes);
      return;
    }
    const idx = parseInt(this.value, 10);
    makePageForEpisodes([episodes[idx]]);
    document.getElementById("search-input").value = "";
  });
}

function fetchShows() {
  if (showCache.size > 0) return Promise.resolve(Array.from(showCache.values()));
  return fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((shows) => {
      shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      shows.forEach((show) => showCache.set(show.id, show));
      return shows;
    });
}

function fetchEpisodesForShow(showId) {
  if (episodesCache.has(showId)) return Promise.resolve(episodesCache.get(showId));
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((episodes) => {
      episodesCache.set(showId, episodes);
      return episodes;
    });
}

function setupShowSelect() {
  const showSelect = document.getElementById("show-select");
  showSelect.disabled = true;
  fetchShows().then((shows) => {
    showSelect.innerHTML = '<option value="">Select a show...</option>';
    shows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });
    showSelect.disabled = false;

    // Optionally, select the first show by default
    if (shows.length > 0) {
      showSelect.value = shows[0].id;
      showSelect.dispatchEvent(new Event("change"));
    }
  });

  showSelect.addEventListener("change", function () {
    const showId = this.value;
    if (!showId) return;
    fetchEpisodesForShow(showId).then((episodes) => {
      makePageForEpisodes(episodes);
      populateEpisodeSelect(episodes);
      setupSearchInput(episodes);
      setupEpisodeSelect(episodes);
      document.getElementById("search-input").value = "";
      document.getElementById("episode-select").value = "";
      const matchCount = document.getElementById("match-count");
      if (matchCount) matchCount.textContent = `Displaying ${episodes.length}/${episodes.length} episodes.`;
    });
  });
}

window.onload = function () {
  setupShowSelect();
};