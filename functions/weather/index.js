const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Blob = require("blob");

const formatSunrise = (sunrise) => {
  // TODO make this a common method for both sunrise and sunset
  // helpeful stackoverflow article here https://stackoverflow.com/questions/8362952/output-javascript-date-in-yyyy-mm-dd-hhmsec-format
  const dSunrise = new Date(0);
  dSunrise.setUTCSeconds(sunrise);
  let sunriseMinutes = String(dSunrise.getUTCMinutes());
  if (sunriseMinutes.length < 2) {
    sunriseMinutes = "0" + sunriseMinutes;
  }
  let sunriseHours = String(dSunrise.getUTCHours() - 5);
  if (sunriseHours.length < 2) {
    sunriseHours = "0" + sunriseHours;
  }
  const sunriseFormatted = sunriseHours + ":" + sunriseMinutes;
  return sunriseFormatted;
};

const formatSunset = (sunset) => {
  const dSunset = new Date(0);
  dSunset.setUTCSeconds(sunset);
  let sunsetMinutes = String(dSunset.getUTCMinutes());
  if (sunsetMinutes.length < 2) {
    sunsetMinutes = "0" + sunsetMinutes;
  }
  let sunsetHours = String(dSunset.getUTCHours() - 5);
  if (sunsetHours.length < 2) {
    sunsetHours = "0" + sunsetHours;
  }
  const sunriseFormatted = sunsetHours + ":" + sunsetMinutes;
  return sunriseFormatted;
};

module.exports = async (context, req) => {
  try {
    const lat = req.query.lat;
    const long = req.query.long;
    const metadataURL = `https://api.weather.gov/points/${lat},${long}`;

    const metadata = await axios.get(metadataURL);
    console.log("metadata was called successfully");

    const weatherDisplay = {
      latitude: "",
      longitude: "",
      currentTemperature: "",
      currentLocation: "",
      icon: "",
      forecastURL: "",
      forecast: {},
      currentCondition: "",
      sunrise: "",
      sunset: "",
      errorMessage: "",
    };

    weatherDisplay.latitude = lat;
    weatherDisplay.longitude = long;
    const city = metadata.data.properties.relativeLocation.properties.city;
    const state = metadata.data.properties.relativeLocation.properties.state;
    weatherDisplay.currentLocation = city + ", " + state;
    weatherDisplay.forecastURL = metadata.data.properties.forecast;
    const units = "imperial";
    const openWeatherMapAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${units}&appid=${process.env["openWeatherMapAPIKey"]}`;

    const currentWeather = await axios.get(openWeatherMapAPIURL);
    console.log("openWeatherMapAPI was called successfully");

    console.log(JSON.stringify(currentWeather.data));

    weatherDisplay.currentTemperature = String(
      Math.ceil(currentWeather.data.main.temp)
    );
    weatherDisplay.currentCondition =
      currentWeather.data.weather[0].description;
    weatherDisplay.sunrise = formatSunrise(currentWeather.data.sys.sunrise);
    weatherDisplay.sunset = formatSunset(currentWeather.data.sys.sunset);

    const detailedForecast = await axios.get(weatherDisplay.forecastURL);
    console.log("detailed forecast was called successfully");

    weatherDisplay.forecast = detailedForecast.data.properties.periods;

    if (req.query.output === "file") {
      // followed basic outline at
      // https://medium.com/@hosarsiph.valle/download-files-with-azure-functions-node-js-35d4f8d08cb8
      let fileBuffer = Buffer.from(JSON.stringify(weatherDisplay, null, 4));
      const fileName = "output.json";
      context.res = {
        status: 202,
        body: fileBuffer,
        headers: {
          "Content-Disposition": `attachment; filename=${fileName}`,
        },
      };
      context.done();
    } else if (req.query.output === "show") {
      context.res = {
        status: 200,
        body: weatherDisplay,
      };
    }
  } catch (error) {
    console.log(error);
    context.res = {
      status: 500,
      body: error,
    };
  }
};
