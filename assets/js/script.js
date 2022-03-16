let weatherContainer = document.querySelector('.weather-container')
let locationEl = document.querySelector('.location-time');
let logoTempEl = document.querySelector('.logo-temp');
let weatherInfoEl = document.querySelector('.weather-info');
let humidity = document.querySelector('.humidity');
let windSpeed = document.querySelector('.wind-speed');
let uvIndex = document.querySelector('.index-number');
let userInput = document.querySelector('.user-input');
let searchButton = document.querySelector('.search-btn');
let daysContainer = document.querySelectorAll('.container');
let rightContainer = document.querySelector('.right');
let savedButtons = document.querySelector('.saved-button');

// converts kelvin to fahrenheit
function convertToFah(kelvin) {
    let convertedTemp = 1.8 * (kelvin - 273) + 32;
    return convertedTemp;
}

let savedGeoData = [];
let savedCityData = [];

// function to grab the lat and lon from the geocoding API
function getWeather() {
    // grabs the value of the user inputs
    userInputValue = document.querySelector('.user-input').value
    userInputValue = userInputValue.toLowerCase();
    // if there is no input just use los angeles
    userInput = document.querySelector('.user-input');
    if (userInputValue === "") {
        userInputValue = "los%20angeles"
    }

    locationEl.textContent = "Los Angeles , California"
    // if user input length is greater than 1, it will add %20 in between
    if (userInputValue.length > 1) {
        userInputValue.split(" ").join("%20")
    } else {
        return userInputValue
    } 

    requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInputValue + "&appid=0ca6859b636893d65ad340a16c3102a5";
    
    // fetch the lat and lon data based on base url and the city provided
    fetch(requestUrl)
    .then(function(response) { 
    return response.json()
    })
    .then(function(data) {   
    let lat = data[0].lat;
    let lon = data[0].lon;
    let latLon = "lat=" + lat + "&lon=" + lon;
    let cityState = data[0].name + " , " + data[0].state
    locationEl.textContent = cityState;
    savedGeoData.push(latLon)
    savedCityData.push(data[0].name)
    console.log(latLon)
    let anotherUrl = "https://api.openweathermap.org/data/2.5/onecall?" + latLon + "&appid=0ca6859b636893d65ad340a16c3102a5"
    return fetch(anotherUrl)
    })
    .then(function(response) { 
    return response.json(); 
    })
    .then(function(data) {
        console.log(data)
        let apiData = data.current
        // depending on description give an icon
        if (apiData.weather[0].main === 'Clouds') {
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute("src", "assets/images/weather-icons/cloudy.svg")
            weatherIcon.classList.add("main-icon")
            logoTempEl.append(weatherIcon)    
        } else if (apiData.weather[0].main === 'Clear') {
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute("src", "assets/images/weather-icons/clear.svg")
            weatherIcon.classList.add("main-icon")
            logoTempEl.append(weatherIcon)   
        } else if (apiData.weather[0].main === 'Atmosphere') {
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute("src", "assets/images/weather-icons/atmosphere.svg")
            weatherIcon.classList.add("main-icon")
            logoTempEl.append(weatherIcon)  
        } else if (apiData.weather[0].main === 'Snow') {
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute("src", "assets/images/weather-icons/snow.svg")
            weatherIcon.classList.add("main-icon")
            logoTempEl.append(weatherIcon)  
        } else if (apiData.weather[0].main === 'Thunderstorm') {
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute("src", "assets/images/weather-icons/thunderstorms.svg")
            weatherIcon.classList.add("main-icon")
            logoTempEl.append(weatherIcon)  
        } else if (apiData.weather[0].main === 'Drizzle') {
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute("src", "assets/images/weather-icons/drizzle.svg")
            weatherIcon.classList.add("main-icon")
            logoTempEl.append(weatherIcon) 
        } else if (apiData.weather[0].main === 'Rain') {
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute("src", "assets/images/weather-icons/rain.svg")
            weatherIcon.classList.add("main-icon")
            logoTempEl.append(weatherIcon)  
        } else {
            return 
        }
        const currentTime = apiData.dt - data.timezone_offset
        let currentDate = new Date(currentTime * 1000);
        let dateOnly = currentDate.toDateString();
        // console.log(dateOnly)
        let date = document.createElement('p');
        date.textContent = dateOnly;
        locationEl.append(date);
        let temp = convertToFah(apiData.temp)
        let temperature = document.createElement('h1');
        temperature.textContent = Math.floor(temp) + "℉";
        logoTempEl.append(temperature)
        humidity.textContent = apiData.humidity + " %"
        windSpeed.textContent = apiData.wind_speed + " mph"
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

        // create the list title
        


        // create and append elements for the 5 day forecast
        for (let i=0; i<5; i++) {
            let bottomContainer= document.querySelector('.bottom')
            let boxContainer = document.createElement('div')
            bottomContainer.append(boxContainer);
            let logoTemp = bottomContainer.children[i]
            let fiveDays = document.createElement('h5')
            boxContainer.classList.add("container");
            fiveDays.textContent = "TEST";
            fiveDays.classList.add("five-day");
            logoTemp.append(fiveDays);
            // depending on description give an icon
            // console.log(data.daily[i].weather[0].main)
            if (data.daily[i].weather[0].main === 'Clouds') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/cloudy.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)    
            } else if (data.daily[i].weather[0].main === 'Clear') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/clear.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)   
            } else if (data.daily[i].weather[0].main === 'Atmosphere') {
                let  smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/atmosphere.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else if (data.daily[i].weather[0].main === 'Snow') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/snow.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else if (data.daily[i].weather[0].main === 'Thunderstorm') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/thunderstorms.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else if (data.daily[i].weather[0].main === 'Drizzle') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/drizzle.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon) 
            } else if (data.daily[i].weather[0].main === 'Rain') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/rain.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else {
                return 
            }
            let fiveDayTemp = document.createElement('h5');
            let dayTemp = data.daily[i].temp.day
            fiveDayTemp.textContent = Math.floor(convertToFah(dayTemp)) + "℉";
            fiveDayTemp.classList.add("five-temp");
            let fiveDayHumidity = document.createElement('p');
            fiveDayHumidity.textContent = "Humidity:" + data.daily[i].humidity + "%";
            fiveDayHumidity.classList.add("five-humidity")
            let fiveDayWind = document.createElement('p');
            fiveDayWind.textContent = "Wind Speed:" + data.daily[i].wind_speed + "mph"
            fiveDayWind.classList.add("five-wind")
            logoTemp.append(fiveDayTemp, fiveDayHumidity, fiveDayWind)
        }
    })
}

getWeather();

function saveData() {
    localStorage.setItem("latLon", JSON.stringify(savedGeoData))
    localStorage.setItem("cityNames", JSON.stringify(savedCityData))
}

function saveButtons() {
    let retrievedGeoData = JSON.parse(localStorage.getItem("latLon"))
    let retrievedCityData = JSON.parse(localStorage.getItem("cityNames"))
    console.log(retrievedGeoData)
    console.log(retrievedCityData)
    for (let i=0; i<retrievedGeoData.length; i++) {
        let cityButton = document.createElement('button')
        cityButton.textContent = retrievedCityData[i]
        cityButton.classList.add("search-button")
        savedButtons.append(cityButton)
        userInputValue = retrievedCityData[i]
        cityButton.addEventListener("click", function() {
            getWeather();
        })
    }
}

searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    let removeContent = document.querySelector(".bottom")
    removeContent.textContent = "";
    logoTempEl.textContent = "";
    getWeather();
    saveData();
    saveButtons();
})