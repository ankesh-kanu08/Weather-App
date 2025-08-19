import React, { useContext, useEffect, useState } from 'react';
import Today from './Today';
import Current from './Current';
import Comingdays from './Comingdays';
import UserContext from './UserContext';

const WeatherDashboard = () => {
  const { city } = useContext(UserContext);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const days = 11;

  const API_KEY = 'ed28347106824df8977180413250408';

  useEffect(() => {
    if (!city) return;

    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${days}`;

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch weather data');
        return res.json();
      })
      .then(data => {
        console.log("Weather API Data:", data);
        setWeatherData(data);
      })
      .catch(err => setError(err.message));
  }, [city]);

  if (error) return <p>Error: {error}</p>;
  if (!weatherData) return <p>Loading...</p>;

  return (
    <>
      <Current current={weatherData.current} location={weatherData.location} forecast={weatherData.forecast} />

      <Today
        forecast={weatherData.forecast.forecastday[0].hour}
        localTime={weatherData.location.localtime}
      />

      {/* Only render Comingdays if forecastday data exists and has length */}
      {weatherData.forecast &&
       weatherData.forecast.forecastday &&
       weatherData.forecast.forecastday.length > 1 && (
        <Comingdays forecast={weatherData.forecast.forecastday.slice(1)} />
      )}
    </>
  );
};

export default WeatherDashboard;
