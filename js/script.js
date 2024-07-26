document.addEventListener("DOMContentLoaded", function() {
  const video = document.getElementById("video");
  const resolutionButton = document.getElementById("resolution-button");
  const videoUpload = document.getElementById("video-upload");

  const resolutions = [
    { label: "144p", scale: 0.25 },
    { label: "240p", scale: 0.35 },
    { label: "320p", scale: 0.45 },
    { label: "480p", scale: 0.6 },
    { label: "720p", scale: 0.8 },
    { label: "1080p", scale: 1.0 }
  ];

  let currentResolutionIndex = 4; // Default to 720p
  let uploadedVideoFile = null;
  let originalVideoURL = null;

  videoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadedVideoFile = file;
      originalVideoURL = URL.createObjectURL(file);
      video.src = originalVideoURL;
      video.load();
      video.play();
    }
  });

  resolutionButton.addEventListener("click", () => {
    if (uploadedVideoFile) {
      changeResolution();
    } else {
      alert("Please upload a video first.");
    }
  });

  const changeResolution = () => {
    currentResolutionIndex = (currentResolutionIndex + 1) % resolutions.length;
    const currentTime = video.currentTime;
    const isPlaying = !video.paused;

    // Mock resolution change by altering playback speed for demonstration purposes
    const selectedResolution = resolutions[currentResolutionIndex];
    video.src = originalVideoURL;
    video.playbackRate = selectedResolution.scale;
    video.currentTime = currentTime;
    video.load();
    
    if (isPlaying) {
      video.play();
    }
    alert(`Changed to ${selectedResolution.label}`);
  };

  // Gesture and keyboard controls 
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartTime = 0;
  let touchTimeout;
  let lastTap = 0;

  video.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartTime = new Date().getTime();

    touchTimeout = setTimeout(() => {
      if (touchStartX < window.innerWidth / 3) {
        video.playbackRate = 3.0;
        video.play();
      } else if (touchStartX > (window.innerWidth / 3) * 2) {
        video.playbackRate = 2.0;
        video.play();
      }
    }, 500); // Long press detection threshold
  });

  video.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchEndTime = new Date().getTime();

    if (touchEndTime - touchStartTime < 500) {
      clearTimeout(touchTimeout);
      handleGesture();
    } else {
      video.playbackRate = 1.0; // Reset playback rate after a long press
    }
  });

  video.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    clearTimeout(touchTimeout);
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      if (touchEndX < window.innerWidth / 3) {
        video.currentTime = Math.max(0, video.currentTime - 5); // Double tap left: Rewind 5 seconds
      } else if (touchEndX > (window.innerWidth / 3) * 2) {
        video.currentTime = Math.min(video.duration, video.currentTime + 10); // Double tap right: Forward 10 seconds
      } else {
        video.paused ? video.play() : video.pause(); // Double tap center: Play/Pause
      }
    }
    lastTap = currentTime;
  });

  const handleGesture = () => {
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 0) {
      // Swiped right
      video.currentTime = Math.min(video.duration, video.currentTime + 10); // Forward 10 seconds
    } else {
      // Swiped left
      video.currentTime = Math.max(0, video.currentTime - 10); // Rewind 10 seconds
    }
  };

  // Listen for keydown events to detect the Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      window.location.href = '/';
    }
  });
});
