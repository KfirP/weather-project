async function fetchWeather() {

  //get all the elements
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "your openweather api key here"; //plz don't use mine lol

  if(searchInput == "") { //in case you searched nothing
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <b>city name</b>/</p>
    </div>
    `;
  }

  async function getLonAndLat() {
    /*
    This function uses OpenWeather API to get the lon and lat values of the searched city.
    It changes the weather-data section with an error message if somethings goes wrong.
    Returns json of the geolocation of the searched city
    */
    const countryCode = 972; //Israel code
    const geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`

    const response = await fetch(geocodeURL);

    if (!response.ok) { //if we didn't connect well to the api
      console.log("Bad response!", response.status);
      return;
    }

    const data = await response.json(); //get the data from the response

    if (data.length == 0) { //there's no data?
      console.log("Something is wrong with the data.");
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input "${searchInput}"<h2>
        <p>Please try again with a valid <b>city name</b>/</p>
      </div>
      `;
      return;
    } else {
      return data[0]; //everything worked fine!
    }
  }

  async function getWeatherData(lon, lat) {
    /*
    Gets the lon and lat values (which are found by the getLonAndLat function) as parameters.
    Uses those parameters in the Open Weather weather data API to get the current weather data of the desired location.
    Updates the weather-data innter HTML accordingly.
    */
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);

    if (!response.ok) { //bad response check
      console.log("Bad response!", response.status);
      return;
    }

    const data = await response.json();

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
    <div>
      <h2>${data.name}</h2>
      <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
      <p><strong>Description:</strong> ${data.weather[0].description}</p>
    </div>
    `
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);
}