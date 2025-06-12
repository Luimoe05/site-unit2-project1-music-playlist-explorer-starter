document.addEventListener("DOMContentLoaded", () => {
  //------------------------------------------------
  // JavaScript for Opening and Closing the Modal
  const modal = document.getElementById("songModal");
  const span = document.getElementsByClassName("close")[0];

  let currentPlaylist = null;
  let originalSongOrder = [];

  //------------------------------------------------------------------------
  function openModal(playlist) {
    currentPlaylist = playlist;
    originalSongOrder = [...playlist.songs]; // Store original order

    document.getElementById("playlistName").innerHTML = playlist.name;
    document.getElementById("playlistImage").src = playlist.imageUrl;
    document.getElementById("playlistMaker").innerHTML = `${playlist.creator}`;

    displaySongs(playlist.songs);

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
  //-------------------------------------------------------------------------

  span.onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  //--------------------------------------------

  //fetching the data from the json file-------------------------
  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Error: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      data.playlists.forEach(createPlaylistTile);
    })
    .catch((err) => {
      console.error("Failed to load playlist: ", err);
    });
  //-------------------------------------------------------------------

  //song card
  function createPlaylistTile(pl) {
    const tile = document.createElement("div");
    tile.className = "playlist-card";
    tile.innerHTML = `
    <div id="tile-container">
        <img class="song-picture" src="${pl.imageUrl}" alt="${pl.name}"/>
        <h2 class="song-name">${pl.name}</h2>
        <p class="song-maker">${pl.creator}</p>
        <div id="likes-container">
            <span class="material-symbols-outlined" id="like-button">favorite</span>
            <p id="likes-counter">${pl.likes}</p>
        </div>
    <div/>
    `;

    document.querySelector(".playlist-cards-container").appendChild(tile);

    const likeButton = tile.querySelector("#like-button");
    const likesCounter = tile.querySelector("#likes-counter");
    let isLiked = false;

    likeButton.addEventListener("click", (e) => {
      e.stopPropagation();

      //flips the isLiked boolean to the opposite (FALSE -> TRUE & TRUE -> FALSE)
      //logic behind liking and unliking
      isLiked = !isLiked;

      likeButton.classList.toggle("liked");

      if (isLiked) pl.likes++;
      else pl.likes--;

      likesCounter.textContent = pl.likes;
    });

    tile.addEventListener("click", (e) => {
      if (!e.target.classList.contains("like-button")) {
        openModal(pl);
      }
    });
  }

  //SHUFFLE BUTTON LOGIC
  function shuffleArray(array) {
    const shuffled = [...array];

    //fisher-yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      //Swap elements at positions i and j
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

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

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("shuffle-button")) {
      if (!currentPlaylist) return;

      const shuffledSongs = shuffleArray(originalSongOrder);
      displaySongs(shuffledSongs);
    }
  });

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
});
