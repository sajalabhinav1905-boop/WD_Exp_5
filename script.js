async function getWeather() {
  const input = document.getElementById("cityInput");
  const city = input.value.trim();
  if (!city) {
    alert("Please enter a city name to explore weather metrics.");
    return;
  }

  const loader = document.getElementById("loader");
  const resultCard = document.getElementById("weatherResult");
  const searchBtn = document.getElementById("searchBtn");

  loader.classList.remove("d-none");
  resultCard.classList.add("opacity-50");
  searchBtn.disabled = true;

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert(`Location "${city}" could not be resolved. Please try another city.`);
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    document.getElementById("cityName").innerText = `${name}, ${country || ""}`;
    document.getElementById("coordinates").innerText = `Lat: ${latitude.toFixed(2)}°, Lon: ${longitude.toFixed(2)}°`;
    document.getElementById("temperature").innerHTML = `${current.temperature}&deg;C`;
    document.getElementById("windspeed").innerText = `${current.windspeed} km/h`;
    document.getElementById("winddirection").innerText = `${current.winddirection}°`;
  } catch (error) {
    alert("Network or API error occurred while fetching weather data.");
  } finally {
    loader.classList.add("d-none");
    resultCard.classList.remove("opacity-50");
    searchBtn.disabled = false;
  }
}

function quickCity(cityName) {
  document.getElementById("cityInput").value = cityName;
  getWeather();
}

// Support enter key on input
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});

// Auto load default city (Noida) on initial launch
window.addEventListener("DOMContentLoaded", () => {
  getWeather();
});
