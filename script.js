//You can edit ALL of the code here
function setup() {
  const allEpisodes = allEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
}

episodeList.forEach((episode) => {
  const episodeContainer = document.createElement("div");
  episodeContainer.className = "episode";

  const episodeCode = `S${String(episode.season}).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
  
  episode.textContent = `${episodeCode} - ${episode.name}`;

  const imageElem = document.createElement("img");
  imageElem.src = episode.image.medium;
  episode.appendChild(imageElem);

  episodeSummary.textContent = episode.summary;
  episode.appendChild(episodeSummary);
  rootElem.appendChild(episode);

  const rootElem = document.getElementById("root");
rootElem.textContent = "Got ${episodeList.length} episode(s)";
});



const footer = document.createElement("footer");
footer.innerHTML = `Data originally from <a href="https://www.tvmaze.com/">TVmaze</a>`;
document.body.appendChild(footer);
}

window.onload = setup;
