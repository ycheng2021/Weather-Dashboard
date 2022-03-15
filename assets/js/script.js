let dailyWeatherEl = document.querySelector('.daily-weather')
let locationTimeEl = document.querySelector('.location-time');
let logoTempEl = document.querySelector('.logo-temp');
let weatherInfoEl = document.querySelector('.weather-info');
let userInput = document.querySelector('.user-input')
let searchButton = document.querySelector('.search-btn');

// function to grab the lat and lon from the geocoding API
function getLatLon() {

    // grabs the value of the user inputs
    userInputValue = document.querySelector('.user-input').value
    // if user input length is greater than 1, it will add %20 in between
    if (userInputValue.length > 1) {
        userInputValue.split(" ").join("%20")
    } else {
        return userInputValue
    }

    requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInputValue + "&appid=0ca6859b636893d65ad340a16c3102a5";

    // fetch the lat and lon data based on base url and the city provided
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        let cityLat = data[0].lat;
        let cityLon = data[0].lon;
        let latLon = "lat=" + cityLat + "&lon=" + cityLon;
        return latLon;
    });
}

// gets the daily weather information once lat and lon is fetched
function getDailyWeather() {
    geoRequestUrl = "https://api.openweathermap.org/data/2.5/onecall?" + getLatLon + "&appid=0ca6859b636893d65ad340a16c3102a5";
    
    fetch(geoRequestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
    });
}

searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    getLatLon();
    // getDailyWeather();
})