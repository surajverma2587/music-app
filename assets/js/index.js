const playlistContainer = $("#playlists");

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

const renderPlaylists = (playlists) => {};

const renderNotification = (message) => {
  // create component
  const notification = `<div class="notification is-warning">${message}</div>`;

  // append component to playlistContainer
  playlistContainer.append(notification);
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

$(document).ready(onReady);
