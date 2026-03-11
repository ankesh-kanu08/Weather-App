import React, { useEffect, useState } from "react";

const WeatherViewer = () => {
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const city = "London";
  const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
  const API_URL1 = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`;

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        console.log("WeatherAPI Response:", data);
        setWeatherData(data);
      })
      .catch(err => console.error("API error:", err));
  }, [API_URL]);

  useEffect(() => {
    fetch(API_URL1)
      .then(res => res.json())
      .then(data => {
        console.log("WeatherAPI Response:", data);
        setWeatherData(data);
      })
      .catch(err => console.error("API error:", err));
  }, [API_URL1]);

  return (
    <div>
      <h2>Weather Info</h2>
      {weatherData ? (
        <pre>{JSON.stringify(weatherData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherViewer;
