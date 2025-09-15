const apiKey = "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={f8231a57ccc412b7e05a7f73c6e5d54a}";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const darkToggleBtn = document.getElementById("darkToggleBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const aqiDisplay = document.getElementById("aqi");
const weatherIcon = document.getElementById("weatherIcon");

let tempChart, aqiChart;

// ===== Light/Dark Mode Toggle =====
darkToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkToggleBtn.textContent = document.body.classList.contains("dark-mode")
    ? "🌙"
    : "🌞";
});

// ===== Fetch Weather & AQI =====
async function fetchWeather(city) {
  try {
    // Current weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();
    if (weatherData.cod !== 200) {
      alert("City not found!");
      return;
    }

    const { name, main, weather, coord } = weatherData;
    cityName.innerText = name;
    temperature.innerText = `${main.temp} °C`;
    condition.innerText = weather[0].description;

    // Update weather icon
    updateWeatherIcon(weather[0].id);

    humidity.innerText = `Humidity: ${main.humidity}%`;

    // Current AQI
    const aqiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`
    );
    const aqiData = await aqiRes.json();
    const currentAqi = aqiData.list[0].main.aqi;
    updateAqiDisplay(currentAqi);

    // Hourly forecast (next 5 hours)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    const labels = [];
    const tempData = [];
    const aqiForecastData = [];

    for (let i = 0; i < 5; i++) {
      const item = forecastData.list[i];
      const hour = new Date(item.dt * 1000).getHours();
      labels.push(`${hour}:00`);
      tempData.push(item.main.temp);

      // AQI (using previous AQI as fallback)
      const aqiHourRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&dt=${item.dt}&appid=${apiKey}`
      );
      const aqiHourData = await aqiHourRes.json();
      const hourAqi = aqiHourData.list[0]?.main.aqi || currentAqi;
      aqiForecastData.push(hourAqi);
    }

    drawCharts(labels, tempData, aqiForecastData);
  } catch (err) {
    console.error(err);
  }
}

// ===== Update Weather Icon Based on ID =====
function updateWeatherIcon(id) {
  if (id >= 200 && id < 300)
    weatherIcon.className = "fas fa-bolt"; // Thunderstorm
  else if (id >= 300 && id < 500)
    weatherIcon.className = "fas fa-cloud-rain"; // Drizzle
  else if (id >= 500 && id < 600)
    weatherIcon.className = "fas fa-cloud-showers-heavy"; // Rain
  else if (id >= 600 && id < 700)
    weatherIcon.className = "fas fa-snowflake"; // Snow
  else if (id >= 700 && id < 800)
    weatherIcon.className = "fas fa-smog"; // Atmosphere
  else if (id === 800) weatherIcon.className = "fas fa-sun"; // Clear
  else if (id > 800 && id < 900)
    weatherIcon.className = "fas fa-cloud"; // Clouds
  else weatherIcon.className = "fas fa-question"; // Unknown
}

// ===== Update AQI Display with Color =====
function updateAqiDisplay(aqi) {
  let color;
  switch (aqi) {
    case 1:
      color = "green";
      break; // Good
    case 2:
      color = "yellow";
      break; // Fair
    case 3:
      color = "orange";
      break; // Moderate
    case 4:
      color = "red";
      break; // Poor
    case 5:
      color = "purple";
      break; // Very Poor
    default:
      color = "#555";
  }
  aqiDisplay.innerHTML = `AQI: <span style="color:${color}; font-weight:600;">${aqi}</span>`;
}

// ===== Draw Charts =====
function drawCharts(labels, tempData, aqiData) {
  if (tempChart) tempChart.destroy();
  if (aqiChart) aqiChart.destroy();

  const tempCtx = document.getElementById("tempChart").getContext("2d");
  tempChart = new Chart(tempCtx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: tempData,
          borderColor: "#1e90ff",
          backgroundColor: "rgba(30,144,255,0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: false } },
    },
  });

  const aqiCtx = document.getElementById("aqiChart").getContext("2d");
  aqiChart = new Chart(aqiCtx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "AQI",
          data: aqiData,
          borderColor: "#ff4500",
          backgroundColor: "rgba(255,69,0,0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

// ===== Search & Location Buttons =====
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

locBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      fetchWeather(data.name);
    });
  } else alert("Geolocation not supported.");
});

// ===== Default Load =====
fetchWeather("New York");
