// Weather widget
// Sequence of steps 
//    Get location coordinates from geolocation
//    Call openweatherAPI to get weather data
//    Build the Dom
//    added line in github app.j
let ATWWIDGET_CURRENT_WEATHER = document.createElement("div");
ATWWIDGET_CURRENT_WEATHER.className = 'atwwidget-current';


// 
// Get data from open weather API
// 
function getWeatherData(currentLocation) { 
  let headers = new Headers();
  const URL = 
  `http://api.openweathermap.org/data/2.5/forecast?${currentLocation}&cnt=7&units=metric&APPID=*****************`;
  return fetch(URL, {
    method: 'GET',
    headers: headers
}).then(data => data.json())
}

//
// Render data - current weather followed by daywise forecast
// 
renderData = (location, forecast) => {
  const currentWeather = forecast[0].weather[0];
  const currentTimestamp = Date(forecast[0].dt * 1000);
  const currentWeatherIcon = "'http://openweathermap.org/img/w/" + currentWeather.icon + ".png'";
  const widgetHeader = 
    `<div class="atwwidget-current__container__loc-timezone">
          <div>
              <h1 class="atwwidget-h1">${location.name}</h1>
          </div>
          <div>
              <small class="atwwidget-small">${currentTimestamp.substr(0,16)}<br>
                 ${currentTimestamp.substr(16,18)}</small>
          </div>
     </div>
     <div class="atwwidget-current__container__desc-temp">
          <div>
              <img src=${currentWeatherIcon} />
          </div>
          <div>
              <small class="atwwidget-small-bold">${currentWeather.description}</small>
          </div>
          <div>
              ${Math.round(forecast[0].main.temp)} &#8451
          </div>
     </div>`;
// 
// code &#8451 is used above to get symbol for degree centigrade
// 
// Render daywise forecast
// 
  let completeForecast = widgetHeader;
  let dayIcon = '';
  forecast.forEach(day => {
    let forecastDate = new Date(day.dt * 1000);
    let dayNamesArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    let dayName = dayNamesArr[forecastDate.getDay()];
    dayIcon = "'http://openweathermap.org/img/w/" + day.weather[0].icon + ".png'";
    completeForecast = completeForecast.concat(
      `<div class="atwwidget-daywise">
          <div class="atwwidget-daywise__item__heading">${dayName}<br>
                ${day.dt_txt.substring(11,16)}
          </div>
          <div class="atwwidget-daywise__item__info">
                <img src=${dayIcon} />
          </div>
          <div>
              ${Math.round(day.main.temp)} &#8451
          </div>
      </div>`);
  });

  completeForecast = '<div class="atwwidget-current__container">' + completeForecast + "</div>";
  writeToDocument=function(s){
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length-1];
    lastScript.insertAdjacentHTML("beforebegin", s);
  }
  writeToDocument(completeForecast);
}

// 
// Get current location and call weather API
// 
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((currentLocation) => {
  	const coordinates = `lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}`;
    getWeatherData(coordinates)
      .then(weatherData => {
          let city = weatherData.city;
          let dailyForecast = weatherData.list;
          renderData(city, dailyForecast);
        })
        .catch((error) => {
          let errorMsg = `<h3>${error}</h3>`;
          errorRoutine(errorMsg)         
        })
  });
} else {
    let errorMsg = `<h3>Location information not available. Cannot get weather data.</h3>`;
    errorRoutine(errorMsg)
}
// 
// Error handling
// 
function errorRoutine(error) { 
  let errorDiv = document.createElement("div")
  errorDiv.innerHTML = error;
  ATWWIDGET_CURRENT_WEATHER.appendChild(errorDiv);
}

//   End script
