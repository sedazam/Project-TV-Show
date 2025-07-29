//You can edit ALL of the code here
function setup() {
  const allEpisodes = allEpisodes();
  makePageForEpisodes(allEpisodes);
}
const rootElem = document.getElementById("root");
rootElem.textContent = "Got ${episodeList.length} episode(s)";

episodeList.forEach((episode) => {
  const episodeCode = `S${season}E${number}`;
  episode.textContent = `${episodeCode} - ${episode.name}`;

  const imageElem = document.createElement("img");
  imageElem.src = episode.image.medium;
  episode.appendChild(imageElem);

  episodeSummary.textContent = episode.summary;
  episode.appendChild(episodeSummary);
  rootElem.appendChild(episode);
});
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
