const cache = {
  shows: [],
  episodes: {},
  allGenres: new Set(),
};

let currentView = "shows";
let currentShowId = null;
let currentShowName = "";
let filteredShows = [];
let filteredEpisodes = [];

document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  loadAllShows();
});

function setupEventListeners() {
  document.getElementById("back-link").addEventListener("click", (e) => {
    e.preventDefault();
    showShowsView();
  });

  document
    .getElementById("search-input")
    .addEventListener("input", filterShows);
  document
    .getElementById("show-select")
    .addEventListener("change", filterShows);

  document
    .getElementById("episode-select")
    .addEventListener("change", filterEpisodes);
  document
    .getElementById("episode-search")
    .addEventListener("input", filterEpisodes);
}

async function loadAllShows() {
  if (cache.shows.length > 0) {
    displayShows(cache.shows);
    return;
  }

  try {
    showLoading("Loading shows...");

    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const shows = await response.json();
    console.log(`Loaded ${shows.length} shows`);

    cache.shows = shows;
    filteredShows = shows;

    shows.forEach((show) => {
      if (show.genres) {
        show.genres.forEach((genre) => cache.allGenres.add(genre));
      }
    });

    populateShowSelect();
    displayShows(shows);
    updateShowCount(shows.length);
  } catch (error) {
    console.error("Error loading shows:", error);
    showError("Error loading shows. Please try again.");
  }
}

async function loadEpisodes(showId, showName) {
  if (cache.episodes[showId]) {
    showEpisodesView(showName, cache.episodes[showId]);
    return;
  }

  try {
    showLoading("Loading episodes...");

    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const episodes = await response.json();
    console.log(`Loaded ${episodes.length} episodes for ${showName}`);

    cache.episodes[showId] = episodes;
    showEpisodesView(showName, episodes);
  } catch (error) {
    console.error("Error loading episodes:", error);
    showError("Error loading episodes. Please try again.");
  }
}

function showShowsView() {
  currentView = "shows";
  currentShowId = null;

  document.getElementById("back-nav").classList.add("hidden");
  document.getElementById("episode-controls").classList.add("hidden");
  document.getElementById("search-controls").classList.remove("hidden");

  document.getElementById("episode-search").value = "";
  document.getElementById("episode-select").value = "";

  displayShows(filteredShows);
  updateShowCount(filteredShows.length);
}

function showEpisodesView(showName, episodes) {
  currentView = "episodes";
  currentShowName = showName;
  filteredEpisodes = episodes;

  document.getElementById("back-nav").classList.remove("hidden");
  document.getElementById("episode-controls").classList.remove("hidden");
  document.getElementById("search-controls").classList.add("hidden");

  populateEpisodeSelect(episodes);
  displayEpisodes(episodes);
  updateEpisodeCount(episodes.length);
}

function populateShowSelect() {
  const select = document.getElementById("show-select");
  select.innerHTML = '<option value="">All shows</option>';

  const sortedGenres = Array.from(cache.allGenres).sort();
  sortedGenres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    select.appendChild(option);
  });
}

function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
  select.innerHTML = '<option value="">All episodes</option>';

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    const seasonEp = `S${(episode.season || 0).toString().padStart(2, "0")}E${(
      episode.number || 0
    )
      .toString()
      .padStart(2, "0")}`;
    option.textContent = `${seasonEp} ${episode.name || "Untitled"}`;
    select.appendChild(option);
  });
}

function filterShows() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const selectedGenre = document.getElementById("show-select").value;

  filteredShows = cache.shows.filter((show) => {
    const matchesSearch =
      !searchTerm ||
      show.name.toLowerCase().includes(searchTerm) ||
      (show.summary &&
        stripHTML(show.summary).toLowerCase().includes(searchTerm)) ||
      (show.genres &&
        show.genres.some((g) => g.toLowerCase().includes(searchTerm)));

    const matchesGenre =
      !selectedGenre || (show.genres && show.genres.includes(selectedGenre));

    return matchesSearch && matchesGenre;
  });

  displayShows(filteredShows);
  updateShowCount(filteredShows.length);
}

function filterEpisodes() {
  const selectedEpisodeId = document.getElementById("episode-select").value;
  const searchTerm = document
    .getElementById("episode-search")
    .value.toLowerCase();
  const allEpisodes = cache.episodes[currentShowId] || [];

  if (selectedEpisodeId) {
    filteredEpisodes = allEpisodes.filter((ep) => ep.id == selectedEpisodeId);
  } else if (searchTerm) {
    filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary &&
          stripHTML(episode.summary).toLowerCase().includes(searchTerm))
    );
  } else {
    filteredEpisodes = allEpisodes;
  }

  displayEpisodes(filteredEpisodes);
  updateEpisodeCount(filteredEpisodes.length);
}

function displayShows(shows) {
  const root = document.getElementById("root");

  if (!shows.length) {
    root.innerHTML = '<div class="no-results">No shows found.</div>';
    return;
  }

  root.innerHTML = `
        <div class="shows-grid">
            ${shows.map(createShowHTML).join("")}
        </div>
    `;

  shows.forEach((show) => {
    document.getElementById(`show-${show.id}`).addEventListener("click", () => {
      currentShowId = show.id;
      loadEpisodes(show.id, show.name);
    });
  });
}

function displayEpisodes(episodes) {
  const root = document.getElementById("root");

  if (!episodes.length) {
    root.innerHTML = '<div class="no-results">No episodes found.</div>';
    return;
  }

  root.innerHTML = `
        <div class="episodes-grid">
            ${episodes.map(createEpisodeHTML).join("")}
        </div>
    `;
}

function createShowHTML(show) {
  const image =
    show.image?.medium || "https://via.placeholder.com/100x140?text=No+Image";
  const summary = show.summary
    ? stripHTML(show.summary)
    : "No summary available.";
  const rating = show.rating?.average || "N/A";
  const genres = show.genres?.join(", ") || "Unknown";
  const status = show.status || "Unknown";
  const runtime = show.runtime ? `${show.runtime} min` : "N/A";

  return `
    <div class="show-item" id="show-${show.id}">
      <div class="show-image-column">
        <div class="show-title">${show.name}</div>
        <img src="${image}" alt="${show.name}" class="show-image">
      </div>
      <div class="show-content-row">
        <div class="show-content">
          <div class="show-summary">${summary}</div>
        </div>
        <div class="show-details">
          <div><strong>Rated:</strong> <span class="show-rating">${rating}</span></div>
          <div><strong>Genres:</strong> <span class="show-genres">${genres}</span></div>
          <div><strong>Status:</strong> ${status}</div>
          <div><strong>Runtime:</strong> ${runtime}</div>
        </div>
      </div>
    </div>
  `;
}

function createEpisodeHTML(episode) {
  const image =
    episode.image?.medium ||
    "https://via.placeholder.com/350x200?text=No+Image";
  const summary = episode.summary
    ? stripHTML(episode.summary)
    : "No summary available.";
  const seasonEp = `Season ${episode.season || 0}, Episode ${
    episode.number || 0
  }`;

  return `
        <div class="episode-item">
            <img src="${image}" alt="${episode.name}" class="episode-image">
            <div class="episode-content">
                <div class="episode-title">${
                  episode.name || "Untitled Episode"
                }</div>
                <div class="episode-info">${seasonEp}</div>
                <div class="episode-summary">${summary}</div>
            </div>
        </div>
    `;
}

function updateShowCount(count) {
  document.getElementById("show-count").textContent = `Found ${count} shows`;
}

function updateEpisodeCount(count) {
  document.getElementById(
    "episode-count"
  ).textContent = `Displaying ${count} episodes`;
}

function showLoading(message) {
  document.getElementById(
    "root"
  ).innerHTML = `<div class="loading">${message}</div>`;
}

function showError(message) {
  document.getElementById(
    "root"
  ).innerHTML = `<div class="no-results">${message}</div>`;
}

function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
