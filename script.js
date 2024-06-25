/******w**************
    
    Assignment 4 Javascript
    Name: Hung-Sheng Lee
    Date: June 25th, 2024
    Description: 

*********************/

const routeResultsDiv = document.getElementById("route-results");
const stopContainer = document.getElementById("stop-container");
const stopResultsDiv = document.getElementById("stop-results");
const routeNumberInput = document.getElementById("route-number");

// Fetch Routes API
const fetchRoutes = async (routeNumber) => {
  const apiKey = "uR6UnmHHjbTEBfaMLUnk";
  const url = `https://api.winnipegtransit.com/v3/routes/${routeNumber}.json?api-key=${apiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Invalid Route Number");
  }

  const data = await res.json();
  displayRoute(data.route);
};

// Fetch Stops API
const fetchStops = async (routeNumber) => {
  const apiKey = "uR6UnmHHjbTEBfaMLUnk";
  const url = `https://api.winnipegtransit.com/v3/stops.json?api-key=${apiKey}&route=${routeNumber}`;

  const res = await fetch(url);

  const data = await res.json();
  displayStops(data.stops);
};

// Display Route data
const displayRoute = (route) => {
  routeResultsDiv.innerHTML = "";

  const routeDiv = document.createElement("div");
  routeDiv.className = "route";

  const routeNumberDiv = document.createElement("div");
  const routeNumberSpan = document.createElement("span");
  routeNumberDiv.className = "route-number";
  routeNumberSpan.className = "route-number-span";
  routeNumberSpan.textContent = route.number;

  const routeNameDiv = document.createElement("div");
  routeNameDiv.className = "route-name";
  if (route.number === "BLUE") {
    routeNameDiv.textContent = "BLUE LINE";
  } else {
    routeNameDiv.textContent = route.name;
  }

  const stopForm = document.createElement("form");
  const detailBtn = document.createElement("button");
  stopForm.id = "stop-form";
  detailBtn.className = "detail-btn";
  detailBtn.type = "submit";
  detailBtn.textContent = "Details";

  routeDiv.appendChild(routeNumberDiv);
  routeDiv.appendChild(routeNameDiv);
  routeDiv.appendChild(stopForm);
  stopForm.appendChild(detailBtn);
  routeNumberDiv.appendChild(routeNumberSpan);

  routeResultsDiv.appendChild(routeDiv);

  // After create "Stops Form", then addEventListener
  stopForm.addEventListener("submit", async (event) => {
    console.log("submit");
    event.preventDefault();
    const routeNumber = routeNumberInput.value;
    try {
      await fetchStops(routeNumber);
      const detailBtn = document.getElementsByClassName("detail-btn")[0];
      detailBtn.style.display = "none";
    } catch (error) {
      console.log(error);
      stopResultsDiv.innerHTML = "";
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.textContent = error.message;

      stopResultsDiv.appendChild(errorDiv);
    }
  });
};

// Display Stops data
const displayStops = (stops) => {
  stopResultsDiv.innerHTML = "";
  stopContainer.style.display = "block";
  stops.forEach((stop) => {
    const stopDiv = document.createElement("li");
    stopDiv.className = "stop-name";

    const stopImg = document.createElement("img");
    stopImg.className = "stop-image";
    stopImg.src = "./pin.png";

    const stopSpan = document.createElement("span");
    stopSpan.textContent = stop.name;

    stopDiv.appendChild(stopImg);
    stopDiv.appendChild(stopSpan);
    stopResultsDiv.appendChild(stopDiv);
  });
};

const searchButton = document.querySelector("button");
const updateButtonState = () => {
  const isEmpty = routeNumberInput.value.trim() === "";
  searchButton.disabled = isEmpty;
  searchButton.style.cursor = isEmpty ? "not-allowed" : "pointer";
  if (isEmpty) {
    searchButton.classList.remove("glow-on-hover");
    searchButton.className = "btn";
  } else {
    searchButton.classList.remove("btn");
    searchButton.className = "glow-on-hover";
  }
};

routeNumberInput.addEventListener("input", updateButtonState);
routeNumberInput.addEventListener("input", () => {
  routeNumberInput.value = routeNumberInput.value.toUpperCase();
});

// Initial submit button state
updateButtonState();

// Handle Search button submission
const form = document.getElementById("search-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const routeNumber = routeNumberInput.value;
  try {
    await fetchRoutes(routeNumber);
    stopContainer.style.display = "none";
  } catch (error) {
    console.log(error);
    routeResultsDiv.innerHTML = "";
    stopResultsDiv.innerHTML = "";
    stopContainer.style.display = "none";
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = error.message;

    routeResultsDiv.appendChild(errorDiv);
  }
});
