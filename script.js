//You can edit ALL of the code here
function setup() {
  const allEpisodes = allEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
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



const footer = document.createElement("footer");
footer.innerHTML = `Data from <a href="https://www.tvmaze.com/">TVmaze</a>`;
document.body.appendChild(footer);
}

window.onload = setup;
