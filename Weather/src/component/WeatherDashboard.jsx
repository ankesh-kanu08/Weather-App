import React, { useContext, useEffect, useState } from 'react';
import Today from './Today';
import Current from './Current';
import Comingdays from './Comingdays';
import UserContext from './UserContext';
import './WeatherDashboard.css';

const WeatherDashboard = () => {
  const { city } = useContext(UserContext);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const days = 10;

  const API_KEY = 'ed28347106824df8977180413250408';

  useEffect(() => {
    if (!city) return;
    setError(null);
    setWeatherData(null);
    setSelectedDayIndex(0);
    const controller = new AbortController();

    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&days=${days}&aqi=yes&alerts=yes`;

    fetch(API_URL, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch weather data');
        return res.json();
      })
      .then(data => {
        if (data?.error?.message) {
          throw new Error(data.error.message);
        }
        setWeatherData(data);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      });

    return () => controller.abort();
  }, [city]);

  if (error) {
    return (
      <section className="status-card">
        <h3>Could not load forecast</h3>
        <p>{error}</p>
      </section>
    );
  }

  if (!weatherData) {
    return (
      <section className="status-card">
        <h3>Loading weather data</h3>
        <p>Fetching the latest forecast for {city}.</p>
      </section>
    );
  }

  const forecastDays = weatherData.forecast?.forecastday ?? [];
  const activeDay = forecastDays[selectedDayIndex] ?? forecastDays[0];

  return (
    <section className="dashboard-grid">
      <Current current={weatherData.current} location={weatherData.location} forecast={weatherData.forecast} />

      <Today
        forecast={activeDay?.hour ?? []}
        localTime={weatherData.location.localtime}
        selectedDate={activeDay?.date}
      />

      {forecastDays.length > 0 && (
        <Comingdays
          forecast={forecastDays.slice(0, 10)}
          selectedIndex={selectedDayIndex}
          onSelectDay={setSelectedDayIndex}
        />
      )}
    </section>
  );
};

export default WeatherDashboard;
