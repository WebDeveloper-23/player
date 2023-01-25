const wrapper = document.querySelector('.wrapper'),
musicImg = wrapper.querySelector('.img_area img'),
musicName = wrapper.querySelector('.song_details .name'),
musicArtist = wrapper.querySelector('.song_details .artist'),
mainAudio = wrapper.querySelector('#main_audio'),
playPauseBtn = wrapper.querySelector('.play_pause'),
prevBtn = wrapper.querySelector('#prev'),
nextBtn = wrapper.querySelector('#next'),
progressArea = wrapper.querySelector('.progress_area'),
progressBar = wrapper.querySelector('.progress_bar'),
musicList = wrapper.querySelector('.music_list'),
showMoreBtn = wrapper.querySelector('#more_music'),
hideMusicListBtn = musicList.querySelector('#close'),
menuBtn = wrapper.querySelector('#menu'),
menu = wrapper.querySelector('.menu'),
lightDarkBtn = menu.querySelector('li'),
lightDarkBtnSpan = lightDarkBtn.querySelector('span');

let musicIndex = 1;

window.addEventListener('load', () => {
     loadMusic(musicIndex)
});

function loadMusic (indexNumb) { 
     musicName.innerText = allMusic[indexNumb - 1].name;
     musicArtist.innerText = allMusic[indexNumb - 1].artist;
     musicImg.src = allMusic[indexNumb - 1].img;

     if(allMusic[indexNumb - 1].img === undefined || allMusic[indexNumb - 1].img === null || allMusic[indexNumb - 1].img === ''){
          musicImg.src = '../icons/music.jpg'
     }

     mainAudio.src = allMusic[indexNumb - 1].src;
};

//play music func
function playMusic () {
     playPauseBtn.classList.add('paused');
     playPauseBtn.querySelector('i').classList.replace('fa-play','fa-pause')
     mainAudio.play();
};

// pause music func
function pauseMusic() {
     playPauseBtn.classList.remove('paused');
     playPauseBtn.querySelector('i').classList.replace('fa-pause','fa-play')
     mainAudio.pause();
};

/// playpauseBtn event
playPauseBtn.addEventListener('click', () => {
     const isMusicPaused = playPauseBtn.classList.contains('paused');
     isMusicPaused ? pauseMusic() : playMusic();
});

///next music function
function nextMusic() {
     musicIndex += 1;
     /// if musicindex > allmusic array length, musicindex index will be 1,so play first song
     musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex 
     loadMusic(musicIndex)
     playMusic(musicIndex)
};

// prev music function
function prevMusic() {
     musicIndex -= 1;
     /// if musicindex < 1, musicindex index will be array length,so play last song
     musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex 
     loadMusic(musicIndex)
     playMusic(musicIndex)
};

/// next btn event
nextBtn.addEventListener('click', () => {
     nextMusic(); // next music function
});

// prev btn event
prevBtn.addEventListener('click', () => {
     prevMusic(); // prev music function
});   

/// update progress bar width
mainAudio.addEventListener('timeupdate', (e) => {
     const currentTime = e.target.currentTime; // getting current time song
     const duration = e.target.duration; // geting song dutration

     let progressWidth = (currentTime / duration) * 100;
     progressBar.style.width = `${progressWidth}%`;

     let musicCurrentTime = wrapper.querySelector('.current'),
     musicDurationTime = wrapper.querySelector('.duration');

     mainAudio.addEventListener('loadeddata', () => {
          //update song duration time
          let audioDuration = mainAudio.duration;
          let totalMin = Math.floor(audioDuration / 60);
          let totalSec = Math.floor(audioDuration % 60);

          if(totalSec < 10){ /// adding 0 if second less than 10
               totalSec = `0${totalSec}`;
          }
          musicDurationTime.innerText = `${totalMin}:${totalSec}`;
     });
     //update song current time
     let currentMin = Math.floor(currentTime / 60);
     let currentSec = Math.floor(currentTime % 60);
               
     if(currentSec < 10){ /// adding 0 if second less than 10
          currentSec = `0${currentSec}`;
     }
     musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

/// click progress bar event 
progressArea.addEventListener('click', (e) => {
     let progressWidthVal = progressArea.clientWidth; /// getting progress width
     let clickedOffsetX = e.offsetX; /// getting offsetX value
     let songDuration = mainAudio.duration; /// getting song dauration 

     mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
});


/// repeat button function  
const repeatBtn = wrapper.querySelector('#repeat')
repeatBtn.addEventListener('click', () => {
     let getClassText = repeatBtn.classList[1]
     /// switch 
     switch (getClassText) {
          case 'bi-repeat':
               repeatBtn.classList.replace('bi-repeat','bi-repeat-1')
               repeatBtn.setAttribute('title','song looped')
               break;
          case 'bi-repeat-1':
               repeatBtn.classList.replace('bi-repeat-1','bi-shuffle')
               repeatBtn.setAttribute('title','playlist shuffle')
               break;
          case 'bi-shuffle':
               repeatBtn.classList.replace('bi-shuffle','bi-repeat')
               repeatBtn.setAttribute('title','playlist looped')
               break;          
     };
});

/// after song ended 
mainAudio.addEventListener('ended', () => {
     let getClassText = repeatBtn.classList[1]

     switch (getClassText) {
          case 'bi-repeat':
               nextMusic(); /// will playing next song automatically
               break;
          case 'bi-repeat-1':
               mainAudio.currentTime = 0; // playing song again 
               loadMusic(musicIndex);
               playMusic();
               break;
          case 'bi-shuffle':
               let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
               do {
                    Math.floor((Math.random() * allMusic.length) + 1);
               } while (musicIndex == randIndex);

               musicIndex = randIndex; 
               loadMusic(musicIndex);
               playMusic();
               break;          
     };
});


showMoreBtn.addEventListener('click', () => {
     musicList.classList.toggle('show');
});

hideMusicListBtn.addEventListener('click', () => {
     showMoreBtn.click();
});

const ulTag = wrapper.querySelector('.music_list ul');

for (let i = 0; i < allMusic.length; i++) {
     // creating li tag 
     let liTag = 
     `
          <li li-index="${i + 1}">
               <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p class="artist">${allMusic[i].artist}</p>
               </div>
               <audio class="${allMusic[i].src}" src="${allMusic[i].src}></audio>
               <span id="${allMusic[i].src} class="audio_duration">3:40</span>
          </li>
     `;
     ulTag.insertAdjacentHTML('beforeend',liTag);
};

const allLiTags = ulTag.querySelectorAll('li');
for (let j = 0; j < allLiTags.length; j++) {
     allLiTags[j].setAttribute('onclick','clicked(this)');
};

function clicked(element) {
     let getLiIndex = element.getAttribute('li-index');
     musicIndex = getLiIndex;
     loadMusic(musicIndex);
     playMusic();
};

//// menu 
menuBtn.addEventListener('click', () => {
     menu.classList.toggle('show');
});

lightDarkBtn.addEventListener('click', () => {
     let getText = lightDarkBtn.querySelector('span').innerText.toLowerCase();
     let icon = lightDarkBtn.querySelector('i');

     menu.classList.remove('show');

     switch (getText.toLowerCase()) {
          case 'light mode':
               icon.classList.replace('bi-brightness-high-fill','bi-moon');
               lightDarkBtnSpan.innerText = 'dark mode';
               wrapper.classList.add('lightmode');
               break;
          case 'dark mode':
               icon.classList.replace('bi-moon','bi-brightness-high-fill');
               lightDarkBtnSpan.innerText = 'light mode';
               wrapper.classList.remove('lightmode');
               break;     
     };
});

