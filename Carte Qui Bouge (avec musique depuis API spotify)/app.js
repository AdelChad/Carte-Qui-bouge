const btnPrev = document.querySelector('.fleche--prev')
const btnNext = document.querySelector('.fleche--next')
const cards_container = document.querySelector('.cartes')
let cards = []
let currentCardIndex = 0
//----------------------------------------------------------//
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

  cards_container.innerHTML = "";

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
  el.classList.add("carte");

  const album = track.album;

  let background = album.images[0].url
  el.style.setProperty('--background', `url(${background})`)

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
      </div>
      <div class="track__infos">
        <p class="name">${track.name}</p>

        <div class="artists">${artists}</div>
      </div>
  `;
  el.innerHTML = inner;
  
  cards_container.append(el);
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
  cards_container.append(el)
  cards.push(el)
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

const init = () => {


  const nbCards = cards.length - 1
  cards.forEach((card, i) => {
    if (i===0){
      card.classList.add('active')
    }

    const isEven = i % 2 ===0

    // 10, c'est l'offset entre chaque carte

    const mult =  (isEven? 1 : -1)

    const spaceX = (0.4 * Math.random() * mult) + 4
    const spaceY = (3 * Math.random() * mult) + 2

    const offsetX = `${i * spaceX}px`
    const offsetY = `${i * spaceY}px`

    card.style.setProperty('--offsetX', offsetX)
    card.style.setProperty('--offsetY', offsetY)

    const color = `rgb(${180 - (i/30 * 255)}, 0, 200)`
    card.style.setProperty('--color', color)

    const z = nbCards - i
    card.style.setProperty('--zIndex', z)

    const rota = (isEven ? (Math.PI * 0.1) : (Math.PI * -0.1))
    const rotationX = (i + 1) * rota
    card.style.setProperty('--rotationX', `${rotationX}deg`)

    let contenue = document.createElement('span')
    contenue.classList.add('contenue')
    carte.appendChild(contenue)
    contenue.textContent = Math.round(Math.random() * 150)
    //contenue.textContent(
  })
}

const goNext = (isNext) => { 
  if (currentCardIndex === cards.length){
    resetCard()
    return
  }
  const activeCard = cards[currentCardIndex]
  
  const z =  cards.length +currentCardIndex 
  console.log(z)
  cards[currentCardIndex].style.setProperty('--zIndex', z)

  const left = isNext ? 80 : 20
  activeCard.style.setProperty('--left', `${left}%`)

  currentCardIndex += 1
  currentCardIndex = Math.min(currentCardIndex, cards.length)

  const nextCard = cards[currentCardIndex]  

}

const resetCard = () => {
  currentCardIndex = 0
  
  cards.forEach((card, i) => {
    const z = cards.length - i

    card.style.setProperty('--left', `50%`)
    card.style.setProperty('--zIndex', z)
  })
}

const addListeners = () => {
  btnPrev.addEventListener('click', () => {
    goNext(false)
  })
  btnNext.addEventListener('click',  () => {
    goNext(true)
  })
  document.onkeydown = function(e) {
    switch (e.keyCode) {
          case 37:
            goNext(false)
            break;
        case 39:
          goNext(true)
            break;
        case 40:
          resetCard()
          break;
        case 38:
          resetCard()
        break;
    };
  }
}

auth()
if (accessToken) {
  getRecommandations();
}
addListeners()