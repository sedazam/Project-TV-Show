function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const grid = document.createElement("div");
  grid.classList.add("episode-grid");

  episodeList.forEach((ep) => {
    const card = document.createElement("div");
    card.classList.add("episode-card");

    // Title and episode code in a rectangle
    const titleBox = document.createElement("div");
    titleBox.classList.add("episode-title-box");

    const title = document.createElement("span");
    title.classList.add("episode-title");
    title.textContent = ep.name;

    const episodeCode = document.createElement("span");
    episodeCode.classList.add("episode-code");
    episodeCode.textContent = `S${ep.season.toString().padStart(2, "0")}E${ep.number.toString().padStart(2, "0")}`;

    titleBox.appendChild(title);
    titleBox.appendChild(document.createTextNode(" – "));
    titleBox.appendChild(episodeCode);

    // Image
    const image = document.createElement("img");
    image.src = ep.image.medium;
    image.alt = ep.name;

    // Summary
    const summary = document.createElement("div");
    summary.classList.add("episode-summary");
    summary.innerHTML = ep.summary;

    // Build card
    card.appendChild(titleBox);
    card.appendChild(image);
    card.appendChild(summary);

    grid.appendChild(card);
  });
  rootElem.appendChild(grid);
}

function setup() {
  const episodes = getAllEpisodes();
  makePageForEpisodes(episodes);
}

window.onload = setup;