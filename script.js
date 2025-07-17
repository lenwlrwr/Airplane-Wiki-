//Search function//
function searchItems() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const imageButtons = document.querySelectorAll(".airplane-container .airplane-btn");

  imageButtons.forEach(button => {
    const img = button.querySelector("img");
    const altText = img.alt.toLowerCase();
    button.style.display = altText.includes(input) ? "" : "none";
  });
}

//Add An Aircraft button function//  
document.getElementById("createbutton").addEventListener("click", function() 
{ window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSdEH1qy_pc5pxsrf0KdijS4Rx9Q3bvTB_ue_qMo5y2jUKa-mQ/formResponse"//Change this link to the form link// Change the access of this form someday
});

let ytPlayer;
let watchStart = 0;
let watchTimer;
let watchedSeconds = 0;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytplayer', {
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  const state = event.data;

  if (state === YT.PlayerState.PLAYING) {
    watchStart = Date.now();
    clearInterval(watchTimer);
    watchTimer = setInterval(() => {
      watchedSeconds = Math.floor((Date.now() - watchStart) / 1000);
    }, 1000);
  }

  if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
    clearInterval(watchTimer);

    const dropoffTime = Math.round(ytPlayer.getCurrentTime());

    if (watchedSeconds > 0) {
      fetch("https://script.google.com/macros/s/AKfycbzEL0lESweMSgUY2wqBEHyzWEfI6XyB1dQYKe5hFCcxHOS2m86O-cGo7hiUle5I79ePxg/exec"
        + "?video=" + encodeURIComponent("F2A Buffalo")
        + "&seconds=" + encodeURIComponent(watchedSeconds)
        + "&dropoff=" + encodeURIComponent(dropoffTime), {
          method: "POST",
          mode: "no-cors"
      });

      watchedSeconds = 0;
    }
  }
}
