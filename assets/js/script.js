// query selector for the elements
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

// function that converts kelvin to fahrenheit
function convertToFah(kelvin) {
    let convertedTemp = 1.8 * (kelvin - 273) + 32;
    return convertedTemp;
}

// empty array to push the city names into
const cityNames = [];

// function to grab the lat and lon, then use lat and lon and generate
// the weather information needed to create and append elements
function getWeather() {
    // grabs the value of the user inputs
    userInputValue = document.querySelector('.user-input').value
    // turn user input as all lowercase to reduce errors 
    userInputValue = userInputValue.toLowerCase();
    
    // if there is no input just use los angeles
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
    
    // fetch the lat and lon data based on the city provided
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
    console.log(latLon)
    // fetch within fetch to use the lat and lon to grab the information we need
    let anotherUrl = "https://api.openweathermap.org/data/2.5/onecall?" + latLon + "&appid=0ca6859b636893d65ad340a16c3102a5"
    return fetch(anotherUrl)
    })
    .then(function(response) { 
    return response.json(); 
    })
    .then(function(data) {
        console.log(data)
        let apiData = data.current
        // depending on description give a weather icon
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
        } else if (apiData.weather[0].main === 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Dust' || 'Ash' || 'Squall' || 'Tornado') {
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
        // dt times 1000 then subtract the timezone offset to get
        // the local time for that city
        const currentTime = (apiData.dt * 1000) - data.timezone_offset
        // console.log(currentTime)
        let currentDate = new Date(currentTime);
        // console.log(currentDate)
        let dateOnly = moment.tz(currentDate, data.timezone).format('MMMM Do YYYY, h:mm a z')
        // console.log(dateOnly)
        // generate the elements for the daily weather
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

        // create the grey boxes for the 5 day forecast
        for (let i=0; i<5; i++) {
            let bottomContainer= document.querySelector('.bottom')
            let boxContainer = document.createElement('div')
            bottomContainer.append(boxContainer);
            boxContainer.classList.add("container");
            let logoTemp = bottomContainer.children[i]
            logoTemp.classList.add("box-container"+ (i+1));
        }
        // for loop that allows us to grab the information starting from 
        // the next day, skipping current day
        for (let j=1; j<6; j++) {
            // grab container to append to, generate the date for the boxes
            let logoTemp = document.querySelector('.box-container' + j)
            let fiveDays = document.createElement('h5')
            let fiveDayDate = (data.daily[j].dt * 1000) - data.timezone_offset
            let fiveTime = new Date(fiveDayDate)
            let fiveDateOnly = moment.tz(fiveTime, data.timezone).format('M' + '/' + 'D')
            fiveDays.textContent = fiveDateOnly
            fiveDays.classList.add("five-day");
            logoTemp.append(fiveDays);
            // depending on description give an icon
            // console.log(data.daily[i].weather[0].main)
            if (data.daily[j].weather[0].main === 'Clouds') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/cloudy.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)    
            } else if (data.daily[j].weather[0].main === 'Clear') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/clear.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)   
            } else if (data.daily[j].weather[0].main === 'Atmosphere') {
                let  smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/atmosphere.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else if (data.daily[j].weather[0].main === 'Snow') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/snow.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else if (data.daily[j].weather[0].main === 'Thunderstorm') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/thunderstorms.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else if (data.daily[j].weather[0].main === 'Drizzle') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/drizzle.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon) 
            } else if (data.daily[j].weather[0].main === 'Rain') {
                let smallIcon = document.createElement('img')
                smallIcon.setAttribute("src", "assets/images/weather-icons/rain.svg")
                smallIcon.classList.add("side-icon")
                logoTemp.append(smallIcon)  
            } else {
                return 
            }
            // generates the information for the 5-day forecast
            let fiveDayTemp = document.createElement('h5');
            let dayTemp = data.daily[j].temp.day
            fiveDayTemp.textContent = Math.floor(convertToFah(dayTemp)) + "℉";
            fiveDayTemp.classList.add("five-temp");
            let fiveDayHumidity = document.createElement('p');
            fiveDayHumidity.textContent = "Humidity:" + data.daily[j].humidity + "%";
            fiveDayHumidity.classList.add("five-humidity")
            let fiveDayWind = document.createElement('p');
            fiveDayWind.textContent = "Wind Speed:" + data.daily[j].wind_speed + "mph"
            fiveDayWind.classList.add("five-wind")
            logoTemp.append(fiveDayTemp, fiveDayHumidity, fiveDayWind)
            saveData();
        }
    })
}

getWeather();

// saves the city names as data into the local storage
function saveData() {
    if (cityNames !== "") {
        for (let i=0; i<cityNames.length; i++) {
            localStorage.setItem("cityNames" + i, JSON.stringify(cityNames[i]))
        }
    }
}

// function that creates the button when user inputs a city 
function createButtons() {
    let cityButton = document.createElement('button')
    // if user inputs something, save that to the empty array for city names
    if (userInput) {
        userInputValue = userInput.value;
        cityNames.push(userInputValue)
    }
    // if the array is not empty then generate the buttons onto the page
    if (cityNames !== "") {
        for (let i=0; i<cityNames.length; i++) {
            // change text to the city names for the button
            cityButton.textContent = cityNames[i]
            cityButton.setAttribute("data-city", cityNames[i])
            // applies the css to these buttons by using class
            cityButton.classList.add("saved-btn")
            rightContainer.append(cityButton)
        }
    }
}

// function to retrieve info from local storage and generate buttons even 
// when browser refreshes
// function retrieveButtons() {
//     for (let i=0; i<cityNames.length; i++) {
//         let cityName = localStorage.getItem("cityNames" + i)
//         console.log(cityName)
//         cityButton.textContent = cityName[i]
//         cityButton.classList.add("saved-btn")
//         rightContainer.append(cityButton)
//     }
// }

// this function is not working right now....
// retrieveButtons();

// still trying to figure out adding event listener to the buttons to 
// get weather data for the city on that button
// savedButtons.addEventListener("click", function(event) {
//     event.preventDefault();
//     let element = event.target;
//     var index = element.getAttribute("data-city");
//     if (element.matches("button") === true) {
//         userInputValue = index
//         console.log(index)
//         let removeContent = document.querySelector(".bottom")
//         removeContent.textContent = "";
//         logoTempEl.textContent = "";
//         element.parentElement.textContent = ""
//         getWeather();
//         createButtons();
//     }
// })

// click the search button and the following functions will run
searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    //clears out the already appended elements 
    let removeContent = document.querySelector(".bottom")
    removeContent.textContent = "";
    logoTempEl.textContent = "";
    getWeather();
    createButtons();
    console.log(cityNames)
})