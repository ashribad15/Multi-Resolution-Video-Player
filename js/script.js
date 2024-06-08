document.addEventListener("DOMContentLoaded", function() {
  const video = document.getElementById("video");
  const resolutionButton = document.getElementById("resolution-button");
  const videoUpload = document.getElementById("video-upload");
  const videoPlayerContainer = document.querySelector('.video-player');

  const resolutions = [
    { label: "144p", width: 256, height: 144 },
    { label: "240p", width: 426, height: 240 },
    { label: "320p", width: 568, height: 320 },
    { label: "480p", width: 854, height: 480 },
    { label: "720p", width: 1280, height: 720 },
    { label: "1080p", width: 1920, height: 1080 }
  ];

  let currentResolutionIndex = 4; // Default to 720p
  let videoFileURL = '';

  videoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      videoFileURL = URL.createObjectURL(file);
      video.src = videoFileURL;
      video.load();
      video.play();
    }
  });

  resolutionButton.addEventListener("click", () => {
    if (videoFileURL) {
      changeResolution();
    } else {
      alert("Please upload a video first.");
    }
  });

  const changeResolution = () => {
    currentResolutionIndex = (currentResolutionIndex + 1) % resolutions.length;
    const currentTime = video.currentTime;

    videoPlayerContainer.style.width = resolutions[currentResolutionIndex].width + 'px';
    videoPlayerContainer.style.height = resolutions[currentResolutionIndex].height + 'px';
    video.currentTime = currentTime;
    video.play();
    alert(`Changed to ${resolutions[currentResolutionIndex].label}`);
  };

  let touchStartX = 0;
  let touchEndX = 0;

  video.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  video.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  });

  const handleGesture = () => {
    if (touchEndX < touchStartX) {
      video.currentTime = Math.max(0, video.currentTime - 10); 
    }
    if (touchEndX > touchStartX) {
      video.currentTime = Math.min(video.duration, video.currentTime + 10); 
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      window.location.href = '/'; 
    }
  });
});

