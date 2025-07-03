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
  const words = fullTitle.trim().split(/\s+/);
  if (words.length > 3) {
    titleDiv.textContent = words.slice(0, 3).join(" ") + "… more";
    titleDiv.title = fullTitle; // tooltip on hover
  } else {
    titleDiv.textContent = fullTitle;
  }
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
