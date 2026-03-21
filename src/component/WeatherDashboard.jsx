import React, { useContext, useEffect, useState } from 'react';
import Today from './Today';
import Current from './Current';
import Comingdays from './Comingdays';
import WeatherMap from './WeatherMap';
import UserContext from './UserContext';
import './WeatherDashboard.css';

const WeatherDashboard = () => {
  const { city } = useContext(UserContext);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const days = 10;

  useEffect(() => {
    if (!city) return;
    setError(null);
    setWeatherData(null);
    setSelectedDayIndex(0);
    const controller = new AbortController();

    const API_URL = `/api/weather?city=${encodeURIComponent(city)}&days=${days}`;

    fetch(API_URL, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch weather data');
        return res.json();
      })
      .then(data => {
        if (data?.error) {
          const message =
            typeof data.error === 'string'
              ? data.error
              : data.error.message ?? 'Unknown weather API error';
          throw new Error(message);
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

      <WeatherMap current={weatherData.current} location={weatherData.location} />

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
