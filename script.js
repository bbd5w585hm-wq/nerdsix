const FORMSPREE_URL = "https://formspree.io/f/xvkgldlb";

const pages = [...document.querySelectorAll(".page")];
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const noteInput = document.getElementById("note");

let selectedLocation = "";
let selectedActivity = "";
let selectedExcitement = "";

function showPage(number) {
  pages.forEach((page, index) => {
    page.classList.toggle("active", index === number - 1);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function moveNoButton() {
  const container = noBtn.parentElement;
  const padding = 5;

  const maxX = Math.max(
    padding,
    container.clientWidth - noBtn.offsetWidth - padding
  );

  const maxY = Math.max(
    padding,
    container.clientHeight - noBtn.offsetHeight - padding
  );

  const randomX = padding + Math.random() * Math.max(0, maxX - padding);
  const randomY = padding + Math.random() * Math.max(0, maxY - padding);

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

let lastEscapeTime = 0;

document.addEventListener("mousemove", event => {
  if (!document.getElementById("page1").classList.contains("active")) return;

  const now = performance.now();
  if (now - lastEscapeTime < 90) return;

  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distance = Math.sqrt(
    Math.pow(event.clientX - centerX, 2) +
    Math.pow(event.clientY - centerY, 2)
  );

  if (distance < 180) {
    lastEscapeTime = now;
    moveNoButton();
  }
});

noBtn.addEventListener("touchstart", event => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("click", event => {
  event.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  showPage(2);
});

document.getElementById("dateNext").addEventListener("click", () => {
  if (!dateInput.value || !timeInput.value) {
    alert("Please pick a date and time first. 💕");
    return;
  }
  showPage(3);
});

function setupChoices(containerId, setter) {
  const buttons = document.querySelectorAll(`#${containerId} button`);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      setter(button.dataset.value);
    });
  });
}

setupChoices("locationChoices", value => {
  selectedLocation = value;
});

setupChoices("activityChoices", value => {
  selectedActivity = value;
});

setupChoices("excitementChoices", value => {
  selectedExcitement = value;
});

document.getElementById("locationNext").addEventListener("click", () => {
  if (!selectedLocation) {
    alert("Pick a place first. 💕");
    return;
  }
  showPage(4);
});

document.getElementById("activityNext").addEventListener("click", () => {
  if (!selectedActivity) {
    alert("Pick the vibe first. 💕");
    return;
  }
  showPage(5);
});

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function formatTime(value) {
  const [hourString, minute] = value.split(":");
  let hour = Number(hourString);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function setSummary() {
  document.getElementById("summaryDate").textContent = formatDate(dateInput.value);
  document.getElementById("summaryTime").textContent = formatTime(timeInput.value);
  document.getElementById("summaryLocation").textContent = selectedLocation;
  document.getElementById("summaryActivity").textContent = selectedActivity;
  document.getElementById("summaryExcitement").textContent = selectedExcitement;
  document.getElementById("summaryNote").textContent =
    noteInput.value.trim() || "No additional note.";
}

document.getElementById("submitBtn").addEventListener("click", async () => {
  const formStatus = document.getElementById("formStatus");
  const note = noteInput.value.trim();

  if (!selectedExcitement) {
    alert("Tell Six what you're most excited about. 💕");
    return;
  }

  formStatus.textContent = "Sending... 💌";

  const formData = new FormData();

  formData.append("_subject", "Six Date Invitation 💌");
  formData.append("name", "Dr. Tommy");
  formData.append("date", formatDate(dateInput.value));
  formData.append("time", formatTime(timeInput.value));
  formData.append("location", selectedLocation);
  formData.append("activity", selectedActivity);
  formData.append("excitement", selectedExcitement);
  formData.append("note", note || "No additional note.");

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    setSummary();
    showPage(6);
  } catch (error) {
    console.error(error);
    formStatus.textContent =
      "Something went wrong. Please try again. 💕";
  }
});
