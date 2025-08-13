// Cache for fetched data to avoid duplicate requests
const cache = {
  shows: null,
  episodes: {},
};

function pad(num) {
  return num.toString().padStart(2, "0");
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episode-grid";
  rootElem.appendChild(episodesContainer);

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    // Title and episode code box
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

    // Image
    const img = document.createElement("img");
    img.src = episode.image?.medium || "";
    img.alt = episode.name;

    // Summary
    const summary = document.createElement("div");
    summary.className = "episode-summary";
    summary.innerHTML = episode.summary || "";

    // TVMaze link for the episode
    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on TVMaze";

    // Build card
    card.appendChild(titleBox);
    card.appendChild(img);
    card.appendChild(summary);
    card.appendChild(link);

    episodesContainer.appendChild(card);
  });
}

function makePageForShows(showList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const showsContainer = document.createElement("div");
  showsContainer.className = "shows-grid";
  rootElem.appendChild(showsContainer);

  showList.forEach((show) => {
    const card = document.createElement("div");
    card.className = "show-card";

    // Make the card clickable
    card.style.cursor = "pointer";
    card.onclick = () => {
      // We'll implement this click handler in the next step
      console.log("Show clicked:", show.name);
      loadEpisodesForShow(show.id);
    };

    // Show name
    const title = document.createElement("h3");
    title.className = "show-title";
    title.textContent = show.name;

    // Show image
    const img = document.createElement("img");
    img.src = show.image?.medium || "";
    img.alt = show.name;
    img.className = "show-image";

    // Show summary
    const summary = document.createElement("div");
    summary.className = "show-summary";
    summary.innerHTML = show.summary || "No summary available";

    // Show details (genres, status, rating, runtime)
    const details = document.createElement("div");
    details.className = "show-details";

    const genres = document.createElement("p");
    genres.innerHTML = `<strong>Genres:</strong> ${
      show.genres?.join(", ") || "N/A"
    }`;

    const status = document.createElement("p");
    status.innerHTML = `<strong>Status:</strong> ${show.status || "N/A"}`;

    const rating = document.createElement("p");
    rating.innerHTML = `<strong>Rating:</strong> ${
      show.rating?.average || "N/A"
    }`;

    const runtime = document.createElement("p");
    runtime.innerHTML = `<strong>Runtime:</strong> ${
      show.runtime || "N/A"
    } minutes`;

    details.appendChild(genres);
    details.appendChild(status);
    details.appendChild(rating);
    details.appendChild(runtime);

    // Build the card
    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(summary);
    card.appendChild(details);

    showsContainer.appendChild(card);
  });
}

// Function to show/hide different views and navigation
function showView(viewType, showName = null) {
  const navigation = document.getElementById("navigation");
  const controlsDiv = document.querySelector("div[style*='display: flex']"); // Your existing controls
  const currentShowName = document.getElementById("current-show-name");

  if (viewType === "shows") {
    // Hide navigation and episode controls when showing shows list
    navigation.style.display = "none";
    controlsDiv.style.display = "none";
  } else if (viewType === "episodes") {
    // Show navigation and episode controls when showing episodes
    navigation.style.display = "block";
    controlsDiv.style.display = "flex";
    if (showName) {
      currentShowName.textContent = `Episodes for: ${showName}`;
    }
  }
}

// Function to handle going back to shows
function goBackToShows() {
  showView("shows");
  const shows = cache.shows; // Get shows from cache
  makePageForShows(shows);

  // Reset episode-related state
  const episodeSelect = document.getElementById("episode-select");
  const searchInput = document.getElementById("search-input");
  const matchCount = document.getElementById("match-count");

  episodeSelect.innerHTML = '<option value="">Select an episode...</option>';
  searchInput.value = "";
  matchCount.textContent = "";
}
function showMessage(message, isError = false) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.textAlign = "center";
  msg.style.margin = "2em";
  msg.style.fontSize = "1.2em";
  msg.style.color = isError ? "red" : "#222";
  rootElem.appendChild(msg);
}

function setup(shows, episodes = null) {
  console.log(
    "Setup called with:",
    shows.length,
    "shows and",
    episodes?.length || 0,
    "episodes"
  );

  // ==================== USE EXISTING HTML CONTROLS ====================
  // Get references to existing HTML elements instead of creating new ones
  const showSelect = document.getElementById("show-select");
  const episodeSelect = document.getElementById("episode-select");
  const searchInput = document.getElementById("search-input");
  const matchCount = document.getElementById("match-count");

  // ==================== POPULATION FUNCTIONS ====================

  // Function to populate show dropdown
  function populateShowSelect(showsToDisplay) {
    showSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a show...";
    showSelect.appendChild(defaultOption);

    showsToDisplay.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });
  }

  // Function to populate episode dropdown
  function populateEpisodeSelect(episodesToDisplay) {
    console.log(
      "Populating episode dropdown with:",
      episodesToDisplay?.length || 0,
      "episodes"
    );
    episodeSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent =
      episodesToDisplay && episodesToDisplay.length > 0
        ? "Select an episode..."
        : "No episodes available";
    episodeSelect.appendChild(defaultOption);

    if (episodesToDisplay && episodesToDisplay.length > 0) {
      episodesToDisplay.forEach((episode, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = `S${pad(episode.season)}E${pad(
          episode.number
        )} - ${episode.name}`;
        episodeSelect.appendChild(option);
      });
      console.log("Added", episodesToDisplay.length, "episodes to dropdown");
    }
  }

  // Function to update display and count
  function updateDisplay(filteredEpisodes) {
    if (filteredEpisodes && filteredEpisodes.length > 0) {
      makePageForEpisodes(filteredEpisodes);
      matchCount.textContent = `Displaying ${filteredEpisodes.length}/${
        episodes ? episodes.length : 0
      } episodes.`;
    } else if (episodes && episodes.length > 0) {
      makePageForEpisodes(episodes);
      matchCount.textContent = `Displaying ${episodes.length}/${episodes.length} episodes.`;
    } else {
      matchCount.textContent = "Select a show to view episodes.";
    }
  }

  // Initial population
  populateShowSelect(shows);
  populateEpisodeSelect(episodes);
  updateDisplay(episodes);

  // ==================== EVENT LISTENERS ====================

  // Unified search - searches both shows and episodes
  searchInput.addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (!episodes || episodes.length === 0) {
      // If no episodes loaded, search shows only
      const filteredShows = shows.filter((show) =>
        show.name.toLowerCase().includes(searchTerm)
      );
      populateShowSelect(filteredShows);
    } else {
      // If episodes are loaded, search episodes
      const filteredEpisodes = episodes.filter(
        (episode) =>
          episode.name.toLowerCase().includes(searchTerm) ||
          episode.summary?.toLowerCase().includes(searchTerm)
      );
      populateEpisodeSelect(filteredEpisodes);
      updateDisplay(filteredEpisodes);
      episodeSelect.value = "";
    }
  });

  // Show selection event
  showSelect.addEventListener("change", function (event) {
    const selectedShowId = event.target.value;
    if (selectedShowId === "") {
      const rootElem = document.getElementById("root");
      rootElem.innerHTML = "";
      populateEpisodeSelect([]);
      updateDisplay([]);
      return;
    }
    loadEpisodesForShow(selectedShowId);
  });

  // Episode selection event
  episodeSelect.addEventListener("change", function (event) {
    const selectedIndex = event.target.value;
    console.log("Episode selected, index:", selectedIndex);

    if (selectedIndex === "" || !episodes || episodes.length === 0) {
      console.log("No valid episode selected, showing all episodes");
      updateDisplay(episodes);
      return;
    }

    const selectedEpisode = [episodes[parseInt(selectedIndex)]];
    console.log("Selected episode:", selectedEpisode[0]?.name);
    updateDisplay(selectedEpisode);
    searchInput.value = "";
  });
}

async function loadShows() {
  if (cache.shows) return cache.shows;
  const response = await fetch("https://api.tvmaze.com/shows");
  if (!response.ok) throw new Error("Network response was not ok");
  const shows = await response.json();
  shows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  cache.shows = shows; // Cache the shows
  return shows;
}
// Test function to validate episode data structure
function validateEpisodeData(episodes) {
  if (!episodes || !Array.isArray(episodes)) {
    console.error("Episodes is not a valid array:", episodes);
    return false;
  }

  const firstEpisode = episodes[0];
  if (!firstEpisode) {
    console.error("No episodes in array");
    return false;
  }

  const requiredFields = ["name", "season", "number"];
  const missingFields = requiredFields.filter(
    (field) => !firstEpisode.hasOwnProperty(field)
  );

  if (missingFields.length > 0) {
    console.error("Missing required fields in episode data:", missingFields);
    return false;
  }

  console.log("Episode data validation passed. Sample episode:", {
    name: firstEpisode.name,
    season: firstEpisode.season,
    number: firstEpisode.number,
  });

  return true;
}

async function loadEpisodesForShow(showId) {
  console.log("Loading episodes for show ID:", showId);

  const show = cache.shows.find((s) => s.id === showId);
  const showName = show ? show.name : "Unknown Show";

  if (cache.episodes[showId]) {
    console.log(
      "Episodes found in cache:",
      cache.episodes[showId].length,
      "episodes"
    );
    const shows = await loadShows(); // Get shows from cache
    makePageForEpisodes(cache.episodes[showId]);
    setup(shows, cache.episodes[showId]);
    return;
  }

  showMessage("Loading episodes...");
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const episodes = await response.json();

    console.log("Loaded episodes from API:", episodes.length, "episodes");

    // Validate episode data structure
    if (!validateEpisodeData(episodes)) {
      throw new Error("Invalid episode data structure");
    }

    cache.episodes[showId] = episodes; // Cache the episodes for this show
    const shows = await loadShows();
    setup(shows, episodes);
  } catch (error) {
    console.error("Error loading episodes:", error);
    showMessage("Error loading episodes. Please try again later.", true);
  }
}

window.onload = async function () {
  showMessage("Loading shows...");
  try {
    const shows = await loadShows();
    showView("shows");
    makePageForShows(shows);

    const backButton = document.getElementById("back-to-shows");
    backButton.addEventListener("click", goBackToShows);

    setup(shows);
  } catch (error) {
    showMessage("Error loading shows. Please try again later.", true);
  }
};
