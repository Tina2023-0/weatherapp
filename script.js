const API_KEY = "db40e3ff37458e68a6f77baa881c106c";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherBox = document.getElementById("weatherBox");
const forecastBox = document.getElementById("forecast");
const errorTxt = document.getElementById("error");
const tipBox = document.getElementById("tipBox");

const themeToggle = document.getElementById("themeToggle");

/* DARK MODE */
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

/* SEARCH */
searchBtn.onclick = () => {
  if (cityInput.value) getWeatherByCity(cityInput.value);
};

/* LOCATION */
locationBtn.onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  });
};

async function getWeatherByCity(city) {
  fetchWeather(`weather?q=${city}`);
}

async function getWeatherByCoords(lat, lon) {
  fetchWeather(`weather?lat=${lat}&lon=${lon}`);
}

async function fetchWeather(query) {
  errorTxt.textContent = "";
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/${query}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  if (data.cod !== 200) {
    errorTxt.textContent = "City not found ❌";
    return;
  }

  showWeather(data);
  fetchForecast(data.coord.lat, data.coord.lon);
}

function showWeather(data) {
  weatherBox.classList.remove("hidden");

  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";
  document.getElementById("condition").textContent =
    getEmoji(data.weather[0].main) + " " + data.weather[0].main;
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("wind").textContent = data.wind.speed + " m/s";

  showTip(data.weather[0].main);
}

/* FORECAST (7 DAYS STYLE) */
async function fetchForecast(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  forecastBox.innerHTML = "";
  forecastBox.classList.remove("hidden");

  data.list.filter(i => i.dt_txt.includes("12:00")).slice(0,7).forEach(day => {
    forecastBox.innerHTML += `
      <div>
        <strong>${new Date(day.dt_txt).toDateString().slice(0,3)}</strong><br>
        ${getEmoji(day.weather[0].main)}<br>
        ${Math.round(day.main.temp)}°C
      </div>`;
  });
}

/* EMOJI */
function getEmoji(type) {
  if (type === "Rain") return "🌧";
  if (type === "Clouds") return "☁️";
  if (type === "Clear") return "☀️";
  if (type === "Snow") return "❄️";
  return "🌫";
}

/* FUN TIP */
function showTip(type) {
  tipBox.classList.remove("hidden");

  if (type === "Rain")
    tipBox.textContent = "☔ Looks rainy! Don’t forget your umbrella!";
  else if (type === "Clear")
    tipBox.textContent = "😎 Sunny day! Wear sunglasses!";
  else
    tipBox.textContent = "🌤 Weather looks calm today!";
}
