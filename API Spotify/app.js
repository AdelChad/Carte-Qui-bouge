let isFetching = false;
let accessToken;
let tracksContainer = document.querySelector(".tracks");
let button = document.querySelector(".reload");
let flag = false;

const getUrlParameter = (sParam) => {
  let sPageURL = window.location.search.substring(1), ////substring will take everything after the https link and split the #/&
    sURLVariables =
      sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split("#") : [],
    sParameterName,
    i;
  let split_str =
    window.location.href.length > 0 ? window.location.href.split("#") : [];
  sURLVariables =
    split_str != undefined && split_str.length > 1 && split_str[1].length > 0
      ? split_str[1].split("&")
      : [];
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};

const auth = () => {
  accessToken = getUrlParameter("access_token");
  let client_id = "496e11f187d14a8496226a7288f244ec";
  let redirect_uri = "http://127.0.0.1:5500/";

  const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
  // Don't authorize if we have an access token already
  if (accessToken == null || accessToken == "" || accessToken == undefined) {
    window.location.replace(redirect);
  }
};

const getRecommandations = async () => {
  console.log("isFetching", isFetching);
  if (isFetching) return;
  isFetching = true;

  tracksContainer.innerHTML = "";

  const params = {
    params: {
      limit: 9,
      market: "FR",
      popularity: "80",
      seed_genres: "hip-hop",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await axios.get(
    "https://api.spotify.com/v1/recommendations",
    params
  );
  const recommendations = response.data;

  isFetching = false;

  recommendations.tracks.forEach((track) => {
    createTrack(track);
  });
};

const createTrack = (track) => {
  const el = document.createElement("div");
  el.classList.add("track");

  const album = track.album;
  const artists = track.artists.map((artist) => {
    return artist.name;
  });

  const audio_player = track.preview_url
    ? `<audio class="track__audio" controls= "ture" src="${track.preview_url}" hidden>
  </audio>`
    : '';
  const inner = /*html*/ `
      ${audio_player}
      <div class="track__album">
        <img src="${album.images[0].url}" alt="">
      </div>
      <div class="track__infos">
        <p class="name">${track.name}</p>

        <div class="artists">${artists}</div>
      </div>
  `;
  el.innerHTML = inner;

  tracksContainer.append(el);
  el.addEventListener('click', () => {
    if(audio_player != ''){
      if(flag == false){
      flag = true;
      playAudio(el)
      }
    else{
      flag = false;
      pauseAudio(el)
    }
  }
  })
};

function playAudio(el){
  const audioSelected = el.querySelector(".track__audio")
  audioSelected.volume = 0.1
  audioSelected.play()
  console.log(audioSelected);
}

function pauseAudio(el) {
  const audioSelected = el.querySelector(".track__audio")
  audioSelected.pause()
}

auth();

if (accessToken) {
  getRecommandations();

  const btn = document.querySelector(".reload");
  btn.addEventListener("click", getRecommandations);
}
// getRecommandations();