const apiKey = "992a8d013c0856b51f2ffc5f17b54800";

let currentLang = "en";
let voiceOn = false;

function createRainDrops() {
  const rain = document.querySelector(".rain");

  if (!rain || rain.children.length > 0) {
    return;
  }

  const dropCount = 95;

  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement("span");
    const length = 12 + Math.random() * 24;
    const thickness = 1.1 + Math.random() * 1.8;
    const splashWidth = length * 0.45;

    drop.className = "raindrop";
    drop.style.setProperty("--x", `${Math.random() * 100}vw`);
    drop.style.setProperty("--length", `${length.toFixed(0)}px`);
    drop.style.setProperty("--thickness", `${thickness.toFixed(1)}px`);
    drop.style.setProperty("--splash-width", `${splashWidth.toFixed(0)}px`);
    drop.style.setProperty("--duration", `${(0.7 + Math.random() * 0.8).toFixed(2)}s`);
    drop.style.setProperty("--delay", `${(Math.random() * -2.6).toFixed(2)}s`);
    drop.style.setProperty("--opacity", `${(0.35 + Math.random() * 0.5).toFixed(2)}`);
    drop.style.setProperty("--drift", `${(-28 + Math.random() * 56).toFixed(0)}px`);
    drop.style.setProperty("--blur", Math.random() > 0.78 ? "1px" : "0px");

    rain.appendChild(drop);
  }
}

const translations = {
  en: {
    title: "WeatherWise",
    tagline: "Plan your day with real-time weather insights",
    placeholder: "Enter city name",
    search: "Search",
    location: "📍 Use My Location",
    today: "Today Details",
    feels: "Feels Like:",
    humidity: "Humidity:",
    wind: "Wind Speed:",
    aqi: "Air Quality:",
    sun: "Sunrise & Sunset",
    hourly: "Hourly Forecast",
    forecast: "5-Day Forecast",
    enterCity: "Please enter city name",
    cityNotFound: "City not found"
  },

  hi: {
    title: "WeatherWise",
    tagline: "रीयल-टाइम मौसम जानकारी के साथ अपना दिन प्लान करें",
    placeholder: "शहर का नाम दर्ज करें",
    search: "खोजें",
    location: "📍 मेरी लोकेशन उपयोग करें",
    today: "आज की जानकारी",
    feels: "महसूस होता है:",
    humidity: "नमी:",
    wind: "हवा की गति:",
    aqi: "वायु गुणवत्ता:",
    sun: "सूर्योदय और सूर्यास्त",
    hourly: "घंटेवार पूर्वानुमान",
    forecast: "5-दिन का पूर्वानुमान",
    enterCity: "कृपया शहर का नाम दर्ज करें",
    cityNotFound: "शहर नहीं मिला"
  },

  as: {
    title: "WeatherWise",
    tagline: "ৰিয়েল-টাইম বতৰৰ তথ্যৰে আপোনাৰ দিনটো পৰিকল্পনা কৰক",
    placeholder: "চহৰৰ নাম লিখক",
    search: "সন্ধান কৰক",
    location: "📍 মোৰ অৱস্থান ব্যৱহাৰ কৰক",
    today: "আজিৰ বিৱৰণ",
    feels: "অনুভৱ হয়:",
    humidity: "আৰ্দ্ৰতা:",
    wind: "বতাহৰ গতি:",
    aqi: "বায়ুৰ মান:",
    sun: "সূৰ্যোদয় আৰু সূৰ্যাস্ত",
    hourly: "ঘণ্টাভিত্তিক পূৰ্বানুমান",
    forecast: "৫-দিনৰ পূৰ্বানুমান",
    enterCity: "অনুগ্ৰহ কৰি চহৰৰ নাম লিখক",
    cityNotFound: "চহৰ পোৱা নগ'ল"
  }
};

async function getWeather() {
  let city = document.getElementById("cityInput").value.trim();

  if (city === "") {
    alert(translations[currentLang].enterCity);
    return;
  }

  const currentUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(currentUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      alert(translations[currentLang].cityNotFound);
      return;
    }

    updateCurrentWeather(data);
    getForecast(data.coord.lat, data.coord.lon);
    getAirQuality(data.coord.lat, data.coord.lon);

  } catch (error) {
    alert("Something went wrong");
  }
}

function changeLanguage() {
  currentLang = document.getElementById("languageSelect").value;
  let t = translations[currentLang];

  document.getElementById("appTitle").innerText = t.title;
  document.getElementById("tagline").innerText = t.tagline;
  document.getElementById("cityInput").placeholder = t.placeholder;
  document.getElementById("searchBtn").innerText = t.search;
  document.getElementById("locationBtn").innerText = t.location;
  document.getElementById("todayDetails").innerText = t.today;
  document.getElementById("sunText").innerText = t.sun;
  document.getElementById("hourlyText").innerText = t.hourly;
  document.getElementById("forecastText").innerText = t.forecast;

  document.getElementById("feelsText").innerText = t.feels;
  document.getElementById("humidityText").innerText = t.humidity;
  document.getElementById("windText").innerText = t.wind;
  document.getElementById("aqiText").innerText = t.aqi;
}

function startVoiceSearch() {
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice search is not supported in this browser.");
    return;
  }

  let recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = function(event) {
    let spokenCity = event.results[0][0].transcript;
    document.getElementById("cityInput").value = spokenCity;
    getWeather();
  };

  recognition.onerror = function() {
    alert("Could not recognize your voice. Please try again.");
  };
}

function toggleVoice() {
  voiceOn = !voiceOn;

  let voiceBtn = document.getElementById("voiceBtn");

  if (voiceOn) {
    voiceBtn.innerText = "🔊 Voice ON";
  } else {
    voiceBtn.innerText = "🔇 Voice OFF";
    window.speechSynthesis.cancel();
  }
}

function updateCurrentWeather(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText =
    Math.round(data.main.temp) + "°C";

  document.getElementById("condition").innerText = data.weather[0].main;

  document.getElementById("feels").innerText =
    Math.round(data.main.feels_like) + "°C";

  document.getElementById("humidity").innerText =
    data.main.humidity + "%";

  document.getElementById("wind").innerText =
    data.wind.speed + " m/s";

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("sunrise").innerText =
    formatTime(data.sys.sunrise);

  document.getElementById("sunset").innerText =
    formatTime(data.sys.sunset);

changeBackground(
   data.weather[0].main,
   data.weather[0].icon
);

  showAdvice(data.weather[0].main);
  checkDisasterAlert(data);

  if (voiceOn) {
    speakWeather(data);
  }
}

async function getForecast(lat, lon) {
  const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(forecastUrl);
  const data = await response.json();

  let hourlyBox = document.getElementById("hourlyForecast");
  hourlyBox.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    let item = data.list[i];
    let time = new Date(item.dt * 1000).getHours();

    hourlyBox.innerHTML += `
      <div>
        <p>${time}:00</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <p>${Math.round(item.main.temp)}°C</p>
      </div>
    `;
  }

  let weekBox = document.getElementById("weeklyForecast");
  weekBox.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    let item = data.list[i];
    let date = new Date(item.dt * 1000).toDateString();

    weekBox.innerHTML += `
      <p>
        ${date}
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        ${Math.round(item.main.temp)}°C - ${item.weather[0].main}
      </p>
    `;
  }
}

async function getAirQuality(lat, lon) {
  const aqiUrl =
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await fetch(aqiUrl);
  const data = await response.json();

  let aqiValue = data.list[0].main.aqi;
  let aqiText = "";

  if (aqiValue === 1) aqiText = "Good";
  else if (aqiValue === 2) aqiText = "Fair";
  else if (aqiValue === 3) aqiText = "Moderate";
  else if (aqiValue === 4) aqiText = "Poor";
  else aqiText = "Very Poor";

  document.getElementById("aqi").innerText = aqiText;
}

function checkDisasterAlert(data) {
  let alertBox = document.querySelector(".alert-card");
  let alertText = document.getElementById("disasterAlert");

  let weather = data.weather[0].main;
  let temp = data.main.temp;
  let wind = data.wind.speed;

  alertBox.classList.remove("alert-danger", "alert-warning", "alert-safe");

  if (weather === "Thunderstorm") {
    alertText.innerText = "Severe thunderstorm alert. Avoid outdoor activities.";
    alertBox.classList.add("alert-danger");
  } else if (weather === "Rain" && data.rain && data.rain["1h"] >= 20) {
    alertText.innerText = "Heavy rainfall alert. Possible flood risk in low areas.";
    alertBox.classList.add("alert-danger");
  } else if (temp >= 40) {
    alertText.innerText = "Heatwave alert. Stay indoors and drink water.";
    alertBox.classList.add("alert-warning");
  } else if (wind >= 15) {
    alertText.innerText = "Strong wind warning. Be careful while travelling.";
    alertBox.classList.add("alert-warning");
  } else {
    alertText.innerText = "No disaster alert currently.";
    alertBox.classList.add("alert-safe");
  }
}

function changeBackground(weather, iconCode) {

    // Save dark mode state
    let darkEnabled =
        document.body.classList.contains("dark-mode");

    // Remove ONLY weather classes
    document.body.classList.remove(
        "sunny",
        "rainy",
        "cloudy",
        "night"
    );

    // OpenWeather night icons end with "n"
    let isNight = iconCode && iconCode.endsWith("n");
    let isRainy =
        weather === "Rain" ||
        weather === "Drizzle" ||
        weather === "Thunderstorm";
    let isCloudy =
        weather === "Clouds" ||
        weather === "Mist" ||
        weather === "Fog" ||
        weather === "Haze";

    if (isNight) {

        document.body.classList.add("night");

    }

    if (isRainy) {

        document.body.classList.add("rainy");

    }

    else if (isCloudy) {

        document.body.classList.add("cloudy");

    }

    else if (!isNight) {

        document.body.classList.add("sunny");

    }

    // Restore dark mode if user enabled it
    if (darkEnabled) {
        document.body.classList.add("dark-mode");
    }
}

function showAdvice(weather) {
  let advice = document.getElementById("advice");

  if (weather === "Clear") {
    advice.innerText = "The sky is clear.";
  } else if (weather === "Rain" || weather === "Drizzle") {
    advice.innerText = "🌧 Carry an umbrella today.";
  } else if (weather === "Clouds") {
    advice.innerText = "☁ Pleasant weather outside.";
  } else if (weather === "Thunderstorm") {
    advice.innerText = "⚡ Avoid outdoor activities.";
  } else {
    advice.innerText = "Check weather before going outside.";
  }
}

function speakWeather(data) {
  let message =
    "Weather in " + data.name +
    " is " + data.weather[0].main +
    " with temperature " +
    Math.round(data.main.temp) +
    " degree Celsius";

  let speech = new SpeechSynthesisUtterance(message);
  speech.lang = "en-IN";

  window.speechSynthesis.speak(speech);
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  let btn = document.getElementById("themeBtn");

  if (document.body.classList.contains("dark-mode")) {
    btn.innerText = "☀️ Light Mode";
  } else {
    btn.innerText = "🌙 Dark Mode";
  }
}

function useLocation() {
  document.getElementById("cityInput").value = "";

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async function(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    updateCurrentWeather(data);
    getForecast(lat, lon);
    getAirQuality(lat, lon);
  });
}

function formatTime(timestamp) {
  let date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

document.getElementById("cityInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

function openMainApp() {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("mainApp").classList.remove("hidden");
}

function startSearch() {
  let city = document.getElementById("startCityInput").value.trim();

  if (city === "") {
    alert("Please enter city name");
    return;
  }

  document.getElementById("cityInput").value = city;

  document.getElementById("startPage").style.display = "none";
  document.getElementById("mainApp").classList.remove("hidden");

  setTimeout(function() {
    getWeather();
  }, 300);
}

function startLocation() {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("mainApp").classList.remove("hidden");

  setTimeout(function() {
    useLocation();
  }, 300);
}

document.getElementById("startCityInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    startSearch();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createRainDrops);
} else {
  createRainDrops();
}
