/* to elements - setting objects */
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

// index
let index;

// Loop
let loop;

//decode or parse
const songsList = [
  {
    name: "Hotel California",
    link: "assets/Eagleshotel.mp3",
    artist: "Eagles",
    image: "assets/Eagles1.png",
  },
  {
    name: "Cry Me a River",
    link: "assets/JustinCry.mp3",
    artist: "Justin Timberlake",
    image: "assets/Justin1.png",
  },
  {
    name: "Shape of My Heart",
    link: "assets/StingShape.mp3",
    artist: "Sting",
    image: "assets/sting2.webp",
  },
  {
    name: "Poor Misguided Fool",
    link: "assets/StarsailorPoor.mp3",
    artist: "Starsailor",
    image: "assets/starsailor1.jpg",
  },
  {
    name: "Clocks",
    link: "assets/ColdplayClocks.mp3",
    artist: "Coldplay",
    image: "assets/Coldplay1.jpg",
  },
];

// events tab
let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (error) {
    deviceType = "mouse";
    return false;
  }
};

// timing format
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// set song

const setSong = (arrayIndex) => {
  // tum ozellikler
  console.log(arrayIndex);
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  // song duration
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration); //320
  };
  playListContainer.classList.add("hide");
  playAudio();
};

// play the song
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); //gorund
  playButton.classList.add("hide"); //kaybol
};

// repeat the song
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    console.log("tekrar kapatildi");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    console.log("tekrar acik");
  }
});

// next song 
const nextSong = () => {
  // eger dongu acik caliyorsa
  if (loop) {
    if (index == songsList.length - 1) {
      // sondaysa basa sar
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    console.log(randIndex);
    setSong(randIndex);
  }
  playAudio();
};

// stop playing
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// previous song 
const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

// next song
audio.onended = () => {
  nextSong();
};

// shuffle list
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("karistirma kapali");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("karistirma acik");
  }
});

// play button
playButton.addEventListener("click", playAudio);

// next button
nextButton.addEventListener("click", nextSong);

// pause button
pauseButton.addEventListener("click", pauseAudio);

// prev button
prevButton.addEventListener("click", previousSong);

isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  // start progress bar
  let coordStart = progressBar.getBoundingClientRect().left;

  // click control
  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  // set width
  currentProgress.style.width = progress * 100 + "%";

  // set timer
  audio.currentTime = progress * audio.duration;

  // play
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// refresh during song
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

// time update
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

window.onload = () => {
  index = 0;
  setSong(index);
  initPlayList();
};

const initPlayList = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-album">
            ${songsList[i].artist}
            </span>
        </div>
        </li>
        `;
  }
};

// show list
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

// close list
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});
