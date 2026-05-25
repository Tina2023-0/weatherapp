const apiKey = "992a8d013c0856b51f2ffc5f17b54800";

async function getWeather() {
  let city = document.getElementById("cityInput").value;

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  const currentUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(currentUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      alert("City not found");
      return;
    }

    updateCurrentWeather(data);
    getForecast(data.coord.lat, data.coord.lon);
    getAirQuality(data.coord.lat, data.coord.lon);

  } catch (error) {
    alert("Something went wrong");
  }
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

let voiceOn = false;

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

function startSearch() {
  let city = document.getElementById("startCityInput").value;

  if (city === "") {
    alert("Please enter city name");
    return;
  }

  document.getElementById("cityInput").value = city;
  document.getElementById("startPage").classList.add("hidden");

  getWeather();
}

function startSearch(){

let city=
document.getElementById(
"startCityInput"
).value;

if(city===""){

alert(
"Enter city name"
);

return;

}

document.getElementById(
"cityInput"
).value=city;

document.getElementById(
"startPage"
).style.display=
"none";

getWeather();

}

function startLocation(){

document.getElementById("startPage").classList.add("hidden");

document.getElementById(
"cityInput"
).value="";

useLocation();

}

function startLocation() {
  document.getElementById("startCityInput").value = "";
  document.getElementById("cityInput").value = "";
  document.getElementById("startPage").style.display = "none";

  useLocation();
}

function updateCurrentWeather(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText =
    Math.round(data.main.temp) + "°C";

  document.getElementById("condition").innerText =
    data.weather[0].main;

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

  changeBackground(data.weather[0].main);
  showAdvice(data.weather[0].main);

  if (voiceOn) {
  speakWeather(data);
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

function changeBackground(weather) {
  let isDark = document.body.classList.contains("dark-mode");

  document.body.className = "";

  if (weather === "Clear") {
    document.body.classList.add("sunny");
  } 
  else if (weather === "Rain" || weather === "Drizzle") {
    document.body.classList.add("rainy");
  } 
  else if (weather === "Clouds") {
    document.body.classList.add("cloudy");
  } 
  else {
    document.body.classList.add("night");
  }

  if (isDark) {
    document.body.classList.add("dark-mode");
  }
}

function showAdvice(weather) {
  let advice = document.getElementById("advice");

  if (weather === "Clear") {
    advice.innerText = "☀ Drink water and use sunscreen.";
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