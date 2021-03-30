"use strict";

const weather = document.querySelector(".weather__title");

const API_KEY = "fbc88ad51c453c9f9e2917a7aca1a4e8";
const COORDS = "coords";

function paintWeather(lat, lon) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const temperture = json.main.temp;
      const place = json.name;
      weather.innerText = `${temperture}℃ @ ${place}`;
    });
}

function saveCoords(obj) {
  localStorage.setItem(COORDS, JSON.stringify(obj));
}

function handleGeoSucess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude,
  };
  saveCoords(coordsObj);
  paintWeather(latitude, longitude);
}

function handleGeoError() {
  console.log("Don't find Position");
}

function askForCoods() {
  navigator.geolocation.getCurrentPosition(handleGeoSucess, handleGeoError);
}

function loadCoords() {
  const loadedCoords = localStorage.getItem(COORDS);
  if (loadedCoords === null) {
    askForCoods();
  } else {
    const parsedCoords = JSON.parse(loadedCoords);
    paintWeather(parsedCoords.latitude, parsedCoords.longitude);
  }
}

function init() {
  loadCoords();
}

init();
