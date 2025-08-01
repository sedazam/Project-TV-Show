function setup() {
  const allEpisodes = getAllEpisodes();

  // Create a search and selector container
  const searchContainer = document.createElement("div");
  searchContainer.style.margin = "24px";

  // Episode selector
  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";
  episodeSelect.style.marginRight = "16px";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Show all episodes";
  episodeSelect.appendChild(allOption);

  allEpisodes.forEach((ep, idx) => {
    const code = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = `${code} - ${ep.name}`;
    episodeSelect.appendChild(option);
  });

  // Select handler
  episodeSelect.addEventListener("change", function () {
    if (episodeSelect.value === "all") {
      makePageForEpisodes(allEpisodes);
      updateMatchCount(allEpisodes.length, allEpisodes.length);
    } else {
      const selected = allEpisodes[episodeSelect.value];
      makePageForEpisodes([selected]);
      updateMatchCount(1, allEpisodes.length);
    }
    document.getElementById("search-box").value = "";
  });

  // Search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search for an episode...";
  searchInput.style.width = "300px";
  searchInput.style.padding = "8px";
  searchInput.id = "search-box";

  // create match count display
  const matchCount = document.createElement("span");
  matchCount.id = "match-count";
  matchCount.style.marginLeft = "16px";
  matchCount.style.fontSize = "16px";
  matchCount.style.fontWeight = "bold";

  searchContainer.appendChild(episodeSelect);
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(matchCount);

  // Insert search above episodes
  const rootElem = document.getElementById("root");
  rootElem.parentNode.insertBefore(searchContainer, rootElem);

  // Initial render
  makePageForEpisodes(allEpisodes);
  updateMatchCount(allEpisodes.length, allEpisodes.length);

  // Live search handler
  searchInput.addEventListener("input", function () {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = allEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(term) ||
      (ep.summary && ep.summary.toLowerCase().includes(term))
    );
    makePageForEpisodes(filtered);
    updateMatchCount(filtered.length, allEpisodes.length);
    episodeSelect.value = "all";
  });
}

function updateMatchCount(count, total) {
  const matchCount = document.getElementById("match-count");
  matchCount.textContent = `Showing ${count} of ${total} episodes`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  rootElem.className = "episode-grid";

  episodeList.forEach((episode) => {
    const episodeContainer = document.createElement("div");
    episodeContainer.className = "episode";

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

    const titleElem = document.createElement("h2");
    titleElem.textContent = `${episodeCode} - ${episode.name}`;

    const imageElem = document.createElement("img");
    imageElem.src = episode.image?.medium || "https://via.placeholder.com/250x140?text=No+Image";
    imageElem.alt = episode.name || "No title";

    const summaryElem = document.createElement("div");
    summaryElem.innerHTML = episode.summary || "<em>No summary available.</em>";

    const linkElem = document.createElement("a");
    linkElem.href = episode.url;
    linkElem.textContent = "View on TVmaze";
    linkElem.target = "_blank";

    episodeContainer.appendChild(titleElem);
    episodeContainer.appendChild(imageElem);
    episodeContainer.appendChild(summaryElem);
    episodeContainer.appendChild(linkElem);

    rootElem.appendChild(episodeContainer);
  });

  // Remove existing footer if present
  const oldFooter = document.getElementById("tvmaze-footer");
  if (oldFooter) oldFooter.remove();

  const footer = document.createElement("footer");
  footer.id = "tvmaze-footer";
  footer.innerHTML = `Data originally from <a href="https://www.tvmaze.com/">TVmaze</a>`;
  document.body.appendChild(footer);
}

window.onload = setup;