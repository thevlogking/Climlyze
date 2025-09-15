/* ================= JS (script.js) ================= */
const hourlyForecast = document.getElementById("hourlyForecast");
const tenDayForecast = document.getElementById("tenDayForecast");
const aqiDisplay = document.getElementById("aqiDisplay");
const cityName = document.getElementById("cityName");
const mainCondition = document.querySelector(".main-condition");
const humidityDisplay = document.getElementById("humidity");
const feelsLikeDisplay = document.getElementById("feelsLike");
const visibilityDisplay = document.getElementById("visibility");
const pressureDisplay = document.getElementById("pressure");
const searchBar = document.getElementById("searchBar");

const API_KEY = "4f2ded401e9a4de4f2fda13cfdd35a2c";

let tempChart, aqiChart;

// Initialize charts
function initCharts() {
  const tempCtx = document.getElementById("tempChart").getContext("2d");
  tempChart = new Chart(tempCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Temperature (°C)",
          data: [],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });

  const aqiCtx = document.getElementById("aqiChart").getContext("2d");
  aqiChart = new Chart(aqiCtx, {
    type: "bar",
    data: {
      labels: ["Current AQI"],
      datasets: [
        {
          label: "Air Quality Index",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 500,
        },
      },
    },
  });
}

// Update temperature chart
function updateTempChart(data) {
  let labels, temps;
  if (Array.isArray(data)) {
    // If data is array of hourly temps
    labels = data.map((item) =>
      new Date(item.dt * 1000).toLocaleTimeString(undefined, {
        hour: "numeric",
        hour12: true,
      })
    );
    temps = data.map((item) => Math.round(item.temp.day));
  } else {
    // If data is daily forecast object with map method
    labels = data.map((day) =>
      new Date(day.dt * 1000).toLocaleDateString(undefined, {
        weekday: "short",
      })
    );
    temps = data.map((day) => Math.round(day.temp.day));
  }
  tempChart.data.labels = labels;
  tempChart.data.datasets[0].data = temps;
  tempChart.update();
}

// Update AQI chart
function updateAQIChart(aqi) {
  if (Array.isArray(aqi)) {
    // Map AQI array values for chart
    const mappedData = aqi.map((val) => mapAQI(val));
    aqiChart.data.datasets[0].data = mappedData;
  } else {
    aqiChart.data.datasets[0].data = [mapAQI(aqi)];
  }
  aqiChart.update();
}

// Update AQI display
function updateAQI(aqi) {
  const latestAQI = Array.isArray(aqi) ? aqi[aqi.length - 1] : aqi;
  let color = "green";
  if (latestAQI > 2) color = "orange";
  if (latestAQI > 4) color = "red";
  aqiDisplay.style.color = color;
  aqiDisplay.textContent = `AQI: ${latestAQI}`;
}

// Clear existing forecast UI
function clearForecasts() {
  hourlyForecast.innerHTML = "";
  tenDayForecast.innerHTML = "";
}

// Update hourly forecast UI
function loadHourly(hours, temps, icons) {
  hourlyForecast.innerHTML = "";
  hours.forEach((hour, i) => {
    const card = document.createElement("div");
    card.className = "hour-card";
    card.innerHTML = `<p>${hour}</p><i class="fas fa-${icons[i]}"></i><p>${temps[i]}°</p>`;
    hourlyForecast.appendChild(card);
  });
}

// Map AQI value for chart (1-5 to 50-250 scale)
function mapAQI(aqi) {
  return aqi * 50; // 1=50, 2=100, 3=150, 4=200, 5=250
}

// Update 5-day forecast UI with icons
function loadTenDayForecast(daily) {
  tenDayForecast.innerHTML = "";
  daily.forEach((day) => {
    const li = document.createElement("li");
    const date = new Date(day.dt * 1000);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const dateStr = date.toLocaleDateString(undefined, options);
    const icon = mapWeatherIcon(day.weather[0].icon);
    li.innerHTML = `<i class="fas fa-${icon}"></i> ${dateStr}: ${Math.round(
      day.temp.day
    )}° | ${day.weather[0].main}`;
    tenDayForecast.appendChild(li);
  });
}

// Update main weather info UI
function updateMainInfo(data) {
  cityName.textContent = data.name;
  mainCondition.textContent = `${Math.round(data.main.temp)}° | ${
    data.weather[0].main
  }`;
  humidityDisplay.textContent = `${data.main.humidity}%`;
  feelsLikeDisplay.textContent = `${Math.round(data.main.feels_like)}°`;
  visibilityDisplay.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  pressureDisplay.textContent = `${data.main.pressure} hPa`;
}

function updateBackground(weatherMain) {
  const body = document.body;
  body.style.transition = "background 0.5s ease";

  switch (weatherMain.toLowerCase()) {
    case "clear":
      body.style.background = "linear-gradient(to right, #56ccf2, #2f80ed)"; // sunny blue sky
      break;
    case "clouds":
      body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)"; // cloudy gray
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(to right, #4e54c8, #8f94fb)"; // rainy purple
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(to right, #141e30, #243b55)"; // dark stormy
      break;
    case "snow":
      body.style.background = "linear-gradient(to right, #e6dada, #274046)"; // snowy cold
      break;
    case "mist":
    case "fog":
    case "haze":
      body.style.background = "linear-gradient(to right, #3e5151, #decba4)"; // misty
      break;
    default:
      body.style.background = "var(--bg)"; // default background
  }
}

// Fetch weather data from OpenWeather API
async function fetchWeatherData(lat, lon, city = null) {
  try {
    console.log("Fetching current weather data for:", lat, lon, city);
    // Fetch current weather data
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    if (!currentWeatherResponse.ok) {
      console.error(
        "Current Weather API request failed with status:",
        currentWeatherResponse.status
      );
      alert(
        "Failed to fetch weather data. Please check your API key and try again."
      );
      return;
    }
    const currentWeatherData = await currentWeatherResponse.json();

    // Fetch 5-day forecast data
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      console.error(
        "Forecast API request failed with status:",
        forecastResponse.status
      );
      alert(
        "Failed to fetch forecast data. Please check your API key and try again."
      );
      return;
    }
    const forecastData = await forecastResponse.json();

    // Fetch air pollution data for past 12 hours hourly
    const nowUnix = Math.floor(Date.now() / 1000);
    const startUnix = nowUnix - 12 * 3600; // 12 hours ago
    const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${startUnix}&end=${nowUnix}&appid=${API_KEY}`;
    const airPollutionResponse = await fetch(airPollutionUrl);
    if (!airPollutionResponse.ok) {
      console.error(
        "Air Pollution API request failed with status:",
        airPollutionResponse.status
      );
      alert(
        "Failed to fetch air pollution data. Please check your API key and try again."
      );
      return;
    }
    const airPollutionData = await airPollutionResponse.json();

    // Update main info using current weather data
    updateMainInfo({
      name: city || currentWeatherData.name,
      main: {
        temp: currentWeatherData.main.temp,
        humidity: currentWeatherData.main.humidity,
        feels_like: currentWeatherData.main.feels_like,
        pressure: currentWeatherData.main.pressure,
      },
      weather: currentWeatherData.weather,
      visibility: currentWeatherData.visibility || 10000,
    });

    // Update background based on current weather
    updateBackground(currentWeatherData.weather[0].main);

    // Process forecast data to get daily summaries (5 days)
    const dailyData = [];
    const dailyMap = new Map();
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split("T")[0];
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          dt: item.dt,
          temp: { day: item.main.temp },
          weather: item.weather,
        });
      }
    });
    dailyMap.forEach((value) => dailyData.push(value));
    const fiveDayData = dailyData.slice(0, 5);

    // Prepare hourly forecast data (past 3 hours + next 9 intervals)
    const hours = [];
    const temps = [];
    const icons = [];
    // Find the index of the forecast closest to current time
    const now = Date.now();
    let startIndex = 0;
    for (let i = 0; i < forecastData.list.length; i++) {
      const forecastTime = forecastData.list[i].dt * 1000;
      if (forecastTime > now) {
        startIndex = i;
        break;
      }
    }
    // Include past 3 hours if available
    const firstIndex = Math.max(0, startIndex - 1);
    const lastIndex = Math.min(forecastData.list.length, firstIndex + 12);
    for (let i = firstIndex; i < lastIndex; i++) {
      const item = forecastData.list[i];
      const date = new Date(item.dt * 1000);
      const hourStr = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        hour12: true,
      });
      hours.push(hourStr);
      temps.push(Math.round(item.main.temp));
      icons.push(mapWeatherIcon(item.weather[0].icon));
    }

    // Update hourly forecast UI
    loadHourly(hours, temps, icons);

    // Update 5-day forecast UI
    loadTenDayForecast(fiveDayData);

    // Update AQI display with latest hourly AQI
    const latestAQIEntry =
      airPollutionData.list[airPollutionData.list.length - 1];
    const aqi = latestAQIEntry ? latestAQIEntry.main.aqi : 0;
    updateAQI(aqi);

    // Prepare hourly AQI data for chart
    const aqiHours = airPollutionData.list.map((entry) => {
      const date = new Date(entry.dt * 1000);
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        hour12: true,
      });
    });
    const aqiValues = airPollutionData.list.map((entry) => entry.main.aqi);

    // Update charts with hourly data
    const hourlyTempData = temps.map((temp, i) => ({
      dt: Math.floor(Date.now() / 1000) + i * 3600,
      temp: { day: temp },
    }));
    updateTempChart(hourlyTempData);
    updateAQIChart(aqiValues);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Failed to fetch weather data. Please try again later.");
  }
}

// Map OpenWeather icon code to FontAwesome icon names (simplified)
function mapWeatherIcon(iconCode) {
  if (iconCode.startsWith("01")) return "sun"; // clear sky
  if (iconCode.startsWith("02")) return "cloud-sun"; // few clouds
  if (iconCode.startsWith("03") || iconCode.startsWith("04")) return "cloud"; // clouds
  if (iconCode.startsWith("09") || iconCode.startsWith("10"))
    return "cloud-showers-heavy"; // rain
  if (iconCode.startsWith("11")) return "bolt"; // thunderstorm
  if (iconCode.startsWith("13")) return "snowflake"; // snow
  if (iconCode.startsWith("50")) return "smog"; // mist
  return "cloud";
}

searchBar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const query = searchBar.value.trim();
    if (!query) return;
    try {
      // Use OpenWeather Geocoding API to get lat/lon for city name
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=1&appid=${API_KEY}`;
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        console.error(
          "Geocoding API request failed with status:",
          geoResponse.status
        );
        alert(
          "Failed to fetch location data. Please check your API key and try again."
        );
        return;
      }
      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        alert("Location not found.");
        return;
      }
      const { lat, lon, name } = geoData[0];
      fetchWeatherData(lat, lon, name);
      initWeatherMap(lat, lon);
    } catch (error) {
      console.error("Error fetching location data:", error);
      alert("Failed to fetch location data. Please try again later.");
    }
  }
});

// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeToggle.innerHTML = isLight
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

initCharts();

// Logo click to refresh page
document.querySelector(".logo").addEventListener("click", () => {
  location.reload();
});

// Fetch weather data based on user's device location on page load
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`User location: Latitude ${lat}, Longitude ${lon}`);
        fetchWeatherData(lat, lon);
        initWeatherMap(lat, lon);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to retrieve your location. Showing default weather data."
        );
        // Default to Kolkata coordinates
        fetchWeatherData(22.5726, 88.3639);
        initWeatherMap(22.5726, 88.3639);
      }
    );
  } else {
    alert(
      "Geolocation is not supported by your browser. Showing default weather data."
    );
    // Default to Kolkata coordinates
    fetchWeatherData(22.5726, 88.3639);
    initWeatherMap(22.5726, 88.3639);
  }
});

// Initialize Google Map and add OpenWeather layers
let map;
let temperatureLayer, precipitationLayer, cloudsLayer;

function initWeatherMap(lat, lon) {
  // Initialize Leaflet map
  map = L.map("weatherMap").setView([lat, lon], 8);

  // Add base tile layer (OpenStreetMap)
  const baseLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap contributors",
    }
  ).addTo(map);

  // OpenWeather tile layers URLs
  const apiKey = API_KEY; // Use actual API key from constant
  const baseUrl = "https://tile.openweathermap.org/map";

  temperatureLayer = L.tileLayer(
    `${baseUrl}/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    { opacity: 0.6, attribution: "OpenWeatherMap" }
  );

  precipitationLayer = L.tileLayer(
    `${baseUrl}/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    { opacity: 0.6, attribution: "OpenWeatherMap" }
  );

  cloudsLayer = L.tileLayer(
    `${baseUrl}/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    { opacity: 0.6, attribution: "OpenWeatherMap" }
  );

  // Add temperature layer by default
  temperatureLayer.addTo(map);

  // Add location marker with a visible color
  const locationIcon = L.divIcon({
    className: "location-marker",
    html: '<div style="background-color: #007bff; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  L.marker([lat, lon], { icon: locationIcon }).addTo(map);

  // Add layer toggle controls
  const layersControl = L.control
    .layers(
      {
        Temperature: temperatureLayer,
        Precipitation: precipitationLayer,
        Clouds: cloudsLayer,
      },
      null,
      { collapsed: false }
    )
    .addTo(map);
}

function toggleLayer(layer) {
  // Not needed with Leaflet layers control
}
