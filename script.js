//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
const rootElem = document.getElementById("root");
rootElem.textContent = "Got ${episodeList.length} episode(s)";

episodeList.forEach((episode) => {
  const episodeCode = `S${season}E${number}`;
  episodeDiv.textContent = `${episodeCode} - ${episode.name}`;

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
