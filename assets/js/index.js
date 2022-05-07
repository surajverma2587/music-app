const playlistContainer = $("#playlists");
const searchForm = $("#search-form");

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

const handleFormSubmit = (event) => {
  event.preventDefault();

  // get form values
  const searchQuery = $("#search-query-input").val();
  const searchType = $('input[name="type"]:checked').val();

  // validate form
  if (searchQuery && searchType) {
    console.log("perform search");
  } else {
    console.log("handle error");
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

searchForm.submit(handleFormSubmit);
$(document).ready(onReady);
