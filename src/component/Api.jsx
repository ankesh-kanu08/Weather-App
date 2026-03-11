import React, { useEffect, useState } from "react";

const WeatherViewer = () => {
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = "ed28347106824df8977180413250408"; // replace this
  const city = "London";
  const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
  const API_URL1 = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`;

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        console.log("WeatherAPI Response:", data); // 👈 view structure here
        setWeatherData(data);
      })
      .catch(err => console.error("API error:", err));
  }, [API_URL]);
  useEffect(() => {
    fetch(API_URL1)
      .then(res => res.json())
      .then(data => {
        console.log("WeatherAPI Response:", data); // 👈 view structure here
        setWeatherData(data);
      })
      .catch(err => console.error("API error:", err));
  }, [API_URL1]);

  return (
    <div>
      <h2>Weather Info</h2>
      {weatherData ? (
         <pre>{JSON.stringify(weatherData, null, 2)}</pre> // show all details
      ) : (
        <p>Loading...</p>
     )}
    </div>
  );
};

export default WeatherViewer;
