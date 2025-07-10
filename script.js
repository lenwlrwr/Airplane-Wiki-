const READ_THRESHOLD = 10; // seconds
let hasCountedAsRead = false;
let currentImage = ""; // store which image was opened
let timerInterval;
let startTime;
let currentImageIndex = 0;
let currentImageSet = [];

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

//Open detail version  function//
function openPopup(imagePath) {
  const modal = document.getElementById("imageModal");

  // Extract base name like DV-A320 from DV-A320-1.png
  const fullName = imagePath.split("/").pop().split(".")[0]; // e.g. "DV-A320-1"
  const baseName = fullName.substring(0, fullName.lastIndexOf("-")); // removes last "-1"
  currentImageSet = [
    `images/${baseName}-1.png`,
    `images/${baseName}-2.png`,
    `images/${baseName}-3.png`
  ];
  currentImageIndex = 0;

  showPopupImage(); // set the initial image
  modal.style.display = "block";

  currentImage = currentImageSet[currentImageIndex].split("/").pop();
  hasCountedAsRead = false;

  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timerDisplay").textContent = `Elapsed time: ${elapsed} seconds`;

    if (!hasCountedAsRead && elapsed >= READ_THRESHOLD) {
      hasCountedAsRead = true;
      sendReadEvent(currentImage);
    }
  }, 1000);
}
function showPopupImage() {
  const popupImg = document.getElementById("popupImg");
  popupImg.src = currentImageSet[currentImageIndex];
}
function changeImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) currentImageIndex = currentImageSet.length - 1;
  if (currentImageIndex >= currentImageSet.length) currentImageIndex = 0;
  showPopupImage();
}


//close detail version function(Optional + Nessary)//
function closePopup() {
  document.getElementById("imageModal").style.display = "none";
  clearInterval(timerInterval); // Stop the timer
  document.getElementById("timerDisplay").textContent = "Elapsed time: 0 seconds"; // Optional reset
}
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePopup();
  }
});

//Aircraft button title MORE//
document.querySelectorAll(".airplane-title").forEach(titleDiv => {
  const fullTitle = titleDiv.dataset.title;

  // Helper: Remove emoji when counting words
  const nonEmojiWords = fullTitle
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .trim()
    .split(/\s+/);

  const fullWords = fullTitle.trim().split(/\s+/);

  // Only shorten if more than 3 real words
  if (nonEmojiWords.length > 3) {
    const shortText = fullWords.slice(0, 3).join(" ") + "… more";
    titleDiv.textContent = shortText;
    titleDiv.title = fullTitle;

    // Toggle full/short on click
    let isExpanded = false;
    titleDiv.style.cursor = "pointer";
    titleDiv.addEventListener("click", () => {
      if (isExpanded) {
        titleDiv.textContent = shortText;
      } else {
        titleDiv.textContent = fullTitle;
      }
      isExpanded = !isExpanded;
    });
  } else {
    titleDiv.textContent = fullTitle;
  }
});

// Lazy-load thumbnail images only
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll(".lazy-img");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        obs.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => observer.observe(img));
});

//measuring system-connected to google sheet//
function sendReadEvent(imageName) {
  const formData = new URLSearchParams();
  formData.append("image", imageName);

  fetch("https://script.google.com/macros/s/AKfycbx50We29OX7wqeMsx218nbmC8vl6RC6UMUaZqFu2EXGP-EDvNJGfr7xu0ykJGBYLmg3/exec", {
    method: "POST",
    body: formData
  })
  .then(response => response.text())
  .then(result => console.log("Logged to Google Sheet:", result))
  .catch(error => console.error("Error logging read:", error));
}
window.addEventListener("load", function () {
  const popup = document.getElementById("aircraftPopup");
  const dontShow = localStorage.getItem("hideAircraftPopup");

  if (!dontShow) {
    popup.style.display = "flex";
  }

  document.getElementById("popupAddBtn").addEventListener("click", function () {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdEH1qy_pc5pxsrf0KdijS4Rx9Q3bvTB_ue_qMo5y2jUKa-mQ/viewform", "_blank");
  });

  document.getElementById("popupCloseBtn").addEventListener("click", function () {
    localStorage.setItem("hideAircraftPopup", "true");
    popup.style.display = "none";
  });
});

// ✅ Log Visit (no CORS issue)
fetch("https://script.google.com/macros/s/AKfycbwsHUoHPo-FHGLYM5qzzfMwXzmNqWjWpAyieJCfrq6QP4J4DY7oH5wXiZ71nqNAL95DCw/exec?visit=" 
  + encodeURIComponent(navigator.userAgent), {
  method: "POST",
  mode: "no-cors"
});

// ✅ Log Load Time After All Images
window.addEventListener("load", () => {
  const start = performance.now();
  const images = Array.from(document.images).filter(img => img.src && !img.id.includes("popupImg"));
  let loaded = 0;
  const total = images.length;

  function check() {
    loaded++;
    if (loaded === total) {
      const loadTime = Math.round(performance.now() - start);
      console.log("✅ All images loaded in:", loadTime, "ms");

      fetch("https://script.google.com/macros/s/AKfycbwsHUoHPo-FHGLYM5qzzfMwXzmNqWjWpAyieJCfrq6QP4J4DY7oH5wXiZ71nqNAL95DCw/exec?loadTime=" + loadTime, {
        method: "POST",
        mode: "no-cors"
      }).then(() => {
        console.log("✅ Load time sent to Google Sheet");
      }).catch(err => {
        console.error("❌ Failed to log load time:", err);
      });
    }
  }

  if (total === 0) check();

  for (let img of images) {
    if (img.complete && img.naturalHeight !== 0) {
      check();
    } else {
      img.addEventListener("load", check);
      img.addEventListener("error", check);
    }
  }
});
