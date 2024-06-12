document.addEventListener("DOMContentLoaded", function() {
  const video = document.getElementById("video");
  const resolutionButton = document.getElementById("resolution-button");
  const videoUpload = document.getElementById("video-upload");

  const resolutions = [
    { label: "144p", path: "path/to/144p/video.mp4" },
    { label: "240p", path: "path/to/240p/video.mp4" },
    { label: "320p", path: "path/to/320p/video.mp4" },
    { label: "480p", path: "path/to/480p/video.mp4" },
    { label: "720p", path: "path/to/720p/video.mp4" },
    { label: "1080p", path: "path/to/1080p/video.mp4" }
  ];

  let currentResolutionIndex = 4; // Default to 720p
  let uploadedVideoFile = null;

  videoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadedVideoFile = file;
      const fileURL = URL.createObjectURL(file);
      video.src = fileURL;
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

    
    const selectedResolution = resolutions[currentResolutionIndex];
    const fileURL = URL.createObjectURL(uploadedVideoFile); 
    
    video.src = fileURL; 
    video.currentTime = currentTime;
    video.load();
    
    if (isPlaying) {
      video.play();
    }
    alert(`Changed to ${selectedResolution.label}`);
  };

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
    }, 500); 
  });

  video.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchEndTime = new Date().getTime();

    if (touchEndTime - touchStartTime < 500) {
      clearTimeout(touchTimeout);
      handleGesture();
    } else {
      video.playbackRate = 1.0; 
    }
  });

  video.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    clearTimeout(touchTimeout);
    if (tapLength < 300 && tapLength > 0) {
      if (touchEndX < window.innerWidth / 3) {
        video.currentTime = Math.max(0, video.currentTime - 5); 
      } else if (touchEndX > (window.innerWidth / 3) * 2) {
        video.currentTime = Math.min(video.duration, video.currentTime + 10); 
      } else {
        video.paused ? video.play() : video.pause();
      }
    }
    lastTap = currentTime;
  });

  const handleGesture = () => {
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 0) {
      video.currentTime = Math.min(video.duration, video.currentTime + 10); 
    } else {
      video.currentTime = Math.max(0, video.currentTime - 10); 
    }
  };
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      window.location.href = '/'; 
    }
  });
});

