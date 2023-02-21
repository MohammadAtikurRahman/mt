const { ipcRenderer } = require('electron');
const videoPlayer = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const seekBar = document.getElementById('seekBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const volumeBar = document.getElementById('volumeBar');

let isSeeking = false;

// When the page loads, ask the main process for the video file path
ipcRenderer.send('get-video-file');

// When the main process responds with the file path, load the video
ipcRenderer.on('video-file', (event, filePath) => {
    videoPlayer.src = `file://${filePath}`;
    videoPlayer.load();
});

// Play the video when the Play button is clicked
playBtn.addEventListener('click', () => {
    videoPlayer.play();
});

// Pause the video when the Pause button is clicked
pauseBtn.addEventListener('click', () => {
    videoPlayer.pause();
});

// Update the seek bar and time display as the video plays
videoPlayer.addEventListener('timeupdate', () => {
    if (!isSeeking) {
        seekBar.value = videoPlayer.currentTime / videoPlayer.duration;
        currentTime.textContent = formatTime(videoPlayer.currentTime);
        duration.textContent = formatTime(videoPlayer.duration);
    }
});

// Seek the video when the seek bar is changed
seekBar.addEventListener('input', () => {
    const seekTime = videoPlayer.duration * seekBar.value;
    videoPlayer.currentTime = seekTime;
});

// Update the volume as the volume bar is changed
volumeBar.addEventListener('input', () => {
    videoPlayer.volume = volumeBar.value;
});

// Toggle fullscreen mode when the Fullscreen button is clicked
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Format a time in seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    const paddedSeconds = secondsRemainder.toString().padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
}

// Set the initial volume to the maximum value
videoPlayer.volume = volumeBar.value;
