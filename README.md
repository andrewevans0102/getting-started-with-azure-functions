# Getting Started With Azure Functions

This project is a companion to my blog post [Getting Started with Azure Functions]().

This is also a modified version of my project at https://github.com/andrewevans0102/weather-app

## Project Layout

The project is an Angular frontend project that shows the weather for your location. It uses the NOAA APIs, so this only works in locations that have NOAA servers.

The `functions` folder has the Azure Function this app uses to gather the weather information. You can deploy it by following the [Microsoft Tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=csharp).

The function also uses an environment variable for the [Open Weather Map API](https://openweathermap.org/api). This can be set in the environment variables in the Azure console.

The Angular app also has environment variables for the Azure Function that is hosted. Once you've got the function deployed, ad its endpoint to the `src/environment` files:

```js
export const environment = {
  production: false,
  openWeatherMapAPIKey: "OPEN_WEATHER_MAP_API_KEY",
  weatherAzure: "HOSTED_AZURE_FUNCTION_ENDPOINT",
};
```

## Running Locally

The app is an Angular project, and you'll need to swap out the environment variables and deploy the Azure function to see it work.

Once you've got the Azure Function setup, you'll first need to do an `npm install` and then `npm run start` to see the app running locally.

## More Information

If you have questions or would like to know more, feel free to open a GitHub issue or contact me at [andrewevans.dev](https://www.andrewevans.dev).
