document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("video");
    const resolutionButton = document.getElementById("resolution-button");
    const videoUpload = document.getElementById("video-upload");
  
    const resolutions = [
      { label: "144p", resolution: "low" },
      { label: "240p", resolution: "medium" },
      { label: "320p", resolution: "medium" },
      { label: "480p", resolution: "high" },
      { label: "720p", resolution: "high" },
      { label: "1080p", resolution: "high" }
    ];
  
    let currentResolutionIndex = 4; // Default to 720p
    let videoFileURL = '';
  
    resolutionButton.addEventListener("click", () => {
      if (videoFileURL) {
        changeResolution();
      } else {
        alert("Please upload a video first.");
      }
    });
  
    videoUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        videoFileURL = URL.createObjectURL(file);
        video.src = videoFileURL;
        video.load();
        video.play();
      }
    });
  
    const changeResolution = () => {
      currentResolutionIndex = (currentResolutionIndex + 1) % resolutions.length;
      const currentTime = video.currentTime;
      video.src = videoFileURL; // Here you can modify the URL to point to different resolutions if you have different files
      video.currentTime = currentTime;
      video.play();
      alert(`Changed to ${resolutions[currentResolutionIndex].label}`);
    };
  
    // Implement gesture controls
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
        // Swiped left
        video.currentTime = Math.max(0, video.currentTime - 10); // Rewind 10 seconds
      }
      if (touchEndX > touchStartX) {
        // Swiped right
        video.currentTime = Math.min(video.duration, video.currentTime + 10); // Forward 10 seconds
      }
    };
  });
  