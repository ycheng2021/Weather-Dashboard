let weatherContainer = document.querySelector('.weather-container')
let locationEl = document.querySelector('.location-time');
let timeEl = document.querySelector('.time');
let logoTempEl = document.querySelector('.logo-temp');
let weatherInfoEl = document.querySelector('.weather-info');
let humidity = document.querySelector('.humidity');
let windSpeed = document.querySelector('.wind-speed');
let uvIndex = document.querySelector('.index-number');
let userInput = document.querySelector('.user-input');
let searchButton = document.querySelector('.search-btn');

// function to grab the lat and lon from the geocoding API
function getLatLon() {
    // grabs the value of the user inputs
    userInputValue = document.querySelector('.user-input').value
    userInputValue = userInputValue.toLowerCase();
    // if there is no input just use los angeles
    if (!userInput) {
        userInputValue = "los%20angeles"
    }
    locationEl.textContent = "Los Angeles , California"
    console.log(userInputValue)
    // if user input length is greater than 1, it will add %20 in between
    if (userInputValue.length > 1) {
        userInputValue.split(" ").join("%20")
    } else {
        return userInputValue
    } 

    console.log(userInputValue)
    requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInputValue + "&appid=0ca6859b636893d65ad340a16c3102a5";

    // fetch the lat and lon data based on base url and the city provided
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        let lat = data[0].lat;
        let lon = data[0].lon;
        let latLon = "lat=" + lat + "&lon=" + lon;
        let cityState = data[0].name + " , " + data[0].state
        locationEl.textContent = cityState;
        localStorage.setItem("latLon", latLon);
    });
}

// converts kelvin to fahrenheit
function convertToFah(kelvin) {
    let convertedTemp = 1.8 * (kelvin - 273) + 32;
    return convertedTemp;
}

// gets the daily weather information once lat and lon is fetched
function getDailyWeather() {
    let latLon = localStorage.getItem("latLon")
    geoRequestUrl = "https://api.openweathermap.org/data/2.5/onecall?" + latLon + "&appid=0ca6859b636893d65ad340a16c3102a5";
    
    fetch(geoRequestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let apiData = data.current
        console.log(apiData)
        let temp = convertToFah(apiData.temp)
        let temperature = document.createElement('h1');
        temperature.textContent = Math.floor(temp) + "℉";
        logoTempEl.append(temperature)
        humidity.textContent = apiData.humidity
        windSpeed.textContent = apiData.wind_speed
        uvIndex.textContent = apiData.uvi
        // depending on uv index number to decide what color it is
        if (apiData.uvi < 3) {
            uvIndex.classList.add('green')
        } else if (apiData.uvi < 6) {
            uvIndex.classList.add('yellow')
        } else if (apiData.uvi < 8) {
            uvIndex.classList.add('orange')
        } else {
            uvIndex.classList.add('red')
        }
    });
}

getLatLon();
getDailyWeather();

searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    logoTempEl.textContent = "";
    getLatLon();
    getDailyWeather();
})