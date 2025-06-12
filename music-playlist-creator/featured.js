document.addEventListener("DOMContentLoaded", () => {
  //fetching the data from the json file
  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const randomIndex = generateRandomNumber(data.playlists.length);
      const randomPlayList = data.playlists[randomIndex];

      featuredPicture.src = randomPlayList.imageUrl;
      featuredAlbumName.innerHTML = randomPlayList.name;
      featuredAlbumCreator.innerHTML = randomPlayList.creator;

      displaySongs(randomPlayList.songs);
    })
    .catch((err) => {
      console.error("Failed to load playlist: ", err);
    });

  const featuredPicture = document.getElementById("featured-picture");
  const featuredAlbumName = document.getElementById("featured-album-name");
  const featuredAlbumCreator = document.getElementById(
    "featured-album-creator"
  );

  function generateRandomNumber(maxLength) {
    const randomNum = Math.floor(Math.random() * maxLength);
    return randomNum;
  }

  const visualMode = document.querySelector(".darkmode-lightmode");

  //if its false then its in LIGHT MODE
  let visualStatus = false;

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("darkmode-lightmode")) {
      if (visualStatus) {
        visualMode.textContent = "☀️";
      } else {
        visualMode.textContent = "🌙";
      }

      visualStatus = !visualStatus;

      if (visualStatus) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    }
  });

  //default in light mode and you can switch it
  visualMode.textContent = "☀️";

  function displaySongs(songs) {
    const songListContainer = document.getElementById("songList");
    songListContainer.innerHTML = "";

    songs.forEach((song) => {
      const songDiv = document.createElement("div");
      songDiv.className = "song-item";

      songDiv.innerHTML = `
      <div id="song-container">
          <img id="song-image" src="${song.imageUrl}" alt="${song.title}"/>
          <div class="song-info-container">
            <div class="song-info">
                <h2 class="song-title">${song.title}</h2>
                <h4 class="artist-name">${song.artist}</h4>
            </div>
            <h4 class="song-length">${song.length}</h4>
          </div>
      </div>
      `;

      songListContainer.appendChild(songDiv);
    });
  }
});
