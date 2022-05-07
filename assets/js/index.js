const API_KEY = "15da2cff6amshd1d5cc2632e414ep10847cjsn54d431a7a66e";

const playlistContainer = $("#playlists");
const musicContainer = $("#music-container");
const searchForm = $("#search-form");
const searchInput = $("#search-query-input");

const readFromLocalStorage = (key, defaultValue) => {
  // get from LS using key name
  const dataFromLS = localStorage.getItem(key);

  // parse data from LS
  const parsedData = JSON.parse(dataFromLS);

  if (parsedData) {
    return parsedData;
  } else {
    return defaultValue;
  }
};

const constructUrl = (baseUrl, params) => {
  const queryParams = new URLSearchParams(params).toString();

  return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
};

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getArtists = (artists) => {
  return artists.map((artist) => artist.profile.name).join(" | ");
};

const renderPlaylists = (playlists) => {
  const createPlaylist = (playlist) => {
    return `<li class="panel-block">
      <span class="panel-icon">
        <i class="fas fa-music" aria-hidden="true"></i>
      </span>
      ${playlist}
    </li>`;
  };

  // create playlists
  const playlistsComponent = `<ul>
    ${playlists.map(createPlaylist).join("")}
  </ul>`;

  // append playlists to playlistContainer
  playlistContainer.append(playlistsComponent);
};

const renderNotification = (message) => {
  // create component
  const notificationComponent = `<div class="notification is-warning">${message}</div>`;

  // append component to playlistContainer
  playlistContainer.append(notificationComponent);
};

const renderError = (message) => {
  // create component
  const errorComponent = `<div class="notification is-danger is-light">
    <i class="fa-solid fa-triangle-exclamation"></i> ${message}
  </div>`;

  // append component to musicContainer
  musicContainer.append(errorComponent);
};

const renderTracks = (tracks) => {
  if (tracks.length) {
    const createTrack = (track) => {
      const albumCover = track.data.albumOfTrack.coverArt.sources[0].url;
      const artistName = getArtists(track?.data?.artists?.items || []);
      const trackTitle = track.data.name;
      const spotifyUrl = track.data.albumOfTrack.sharingInfo.shareUrl;

      const trackCard = `<div class="card music-card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img
              src=${albumCover}
              alt="album cover image"
            />
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">${trackTitle}</p>
              <p class="subtitle is-6">${artistName}</p>
            </div>
          </div>
        </div>
        <footer class="card-footer">
          <button class="button is-ghost card-footer-item">
            <i class="fa-solid fa-plus"></i>
          </button>
          <a
            href=${spotifyUrl}
            class="card-footer-item"
            ><i class="fa-brands fa-spotify"></i
          ></a>
        </footer>
      </div>`;

      return trackCard;
    };

    const allTracks = tracks.map(createTrack).join("");

    musicContainer.empty();

    musicContainer.append(allTracks);
  } else {
    // render error
    renderError("No results found.");
  }
};

const handleSearchInputChange = (event) => {
  const target = $(event.target);

  // check if danger class already present and remove it
  if (target.hasClass("is-danger")) {
    target.removeClass("is-danger");
  }
};

const handleFormSubmit = async (event) => {
  try {
    event.preventDefault();

    // get form values
    const searchQuery = searchInput.val();
    const searchType = $('input[name="type"]:checked').val();

    // validate form
    if (searchQuery && searchType) {
      // construct the URL
      const baseUrl = "https://spotify23.p.rapidapi.com/search/";

      const url = constructUrl(baseUrl, { q: searchQuery, type: searchType });

      // construct fetch options
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
          "X-RapidAPI-Key": API_KEY,
        },
      };

      // fetch data from API
      const data = await fetchData(url, options);

      if (searchType === "tracks") {
        // render tracks
        renderTracks(data?.tracks?.items || []);
      }
    } else {
      // target input and set class is-danger
      searchInput.addClass("is-danger");
    }
  } catch (error) {
    renderError("Sorry something went wrong and we are working on fixing it.");
  }
};

const onReady = () => {
  // get playlists from LS
  const playlists = readFromLocalStorage("playlists", []);

  if (playlists.length) {
    // render playlists
    renderPlaylists(playlists);
  } else {
    // render notification
    renderNotification("You have no playlists.");
  }
};

searchInput.on("keyup", handleSearchInputChange);
searchForm.submit(handleFormSubmit);
$(document).ready(onReady);
