const videoPlayer = document.getElementById('video-player')
const playPauseButton = document.getElementById('play-pause-button')
const seekBar = document.getElementById('seek-bar')
const currentTimeDisplay = document.getElementById('current-time-display')
const durationDisplay = document.getElementById('duration-display')
const volumeBar = document.getElementById('volume-bar')
const fullScreenButton = document.getElementById('full-screen-button')

let isFullScreen = false

// Play/Pause button functionality
playPauseButton.addEventListener('click', () => {
  if (videoPlayer.paused) {
    videoPlayer.play()
    playPauseButton.innerText = 'Pause'
  } else {
    videoPlayer.pause()
    playPauseButton.innerText = 'Play'
  }
})

volumeBar.addEventListener('input', () => {
    videoPlayer.volume = volumeBar.value;
  });


// Seek bar functionality
seekBar.addEventListener('input', () => {
  const seekTime = (videoPlayer.duration * (seekBar.value / 100))
  videoPlayer.currentTime = seekTime
})

// Update current time and duration display
videoPlayer.addEventListener('timeupdate', () => {
  const currentTime = videoPlayer.currentTime
  const duration = videoPlayer.duration

  currentTimeDisplay.innerText = formatTime(currentTime)
  durationDisplay.innerText = formatTime(duration)

  seekBar.value = (currentTime / duration) * 100
})

// Volume bar functionality
volumeBar.addEventListener('input', () => {
  videoPlayer.volume = volumeBar.value
})

// Full screen functionality
fullScreenButton.addEventListener('click', () => {
  if (isFullScreen) {
    document.exitFullscreen()
    fullScreenButton.innerText = 'Full Screen'
    isFullScreen = false
  } else {
    videoPlayer.requestFullscreen()
    fullScreenButton.innerText = 'Exit Full Screen'
    isFullScreen = true
  }
})
// Volume bar functionality
volumeBar.addEventListener('input', () => {
    videoPlayer.volume = volumeBar.value;
  });
  
// Format time function
function formatTime (time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time - (minutes * 60))
  const secondsWithLeadingZero = String(seconds).padStart(2, '0')
  return `${minutes}:${secondsWithLeadingZero}`
}
