const READ_THRESHOLD = 10; // seconds
let hasCountedAsRead = false;
let currentImage = ""; // store which image was opened
let timerInterval;
let startTime;

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
  const popupImg = document.getElementById("popupImg");
  popupImg.src = imagePath;
  modal.style.display = "block";

  // Store current image name
  currentImage = imagePath.split("/").pop();
  hasCountedAsRead = false;

  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timerDisplay").textContent = `Elapsed time: ${elapsed} seconds`;

    // Send only once when read threshold reached
    if (!hasCountedAsRead && elapsed >= READ_THRESHOLD) {
      hasCountedAsRead = true;
      sendReadEvent(currentImage);
    }
  }, 1000);
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

//measuring system-connected to google sheet//
function sendReadEvent(imageName) {
  fetch("https://script.google.com/macros/s/AKfycbxdn69hgIJS7dKXRFRgShqgfTSNwZDMzM-BzIWElApYlq6l7PjcljDa1dSioKCxxUk/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: imageName
    })
  })
  .then(response => response.text())
  .then(result => console.log("Logged to Google Sheet:", result))
  .catch(error => console.error("Error logging read:", error));
}
