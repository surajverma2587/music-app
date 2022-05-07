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

      console.log(data);
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
