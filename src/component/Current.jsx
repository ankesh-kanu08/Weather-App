import React from 'react';
import './Current.css';
import useLiveLocalTime from './useLiveLocalTime';

const Current = ({ current, location, forecast }) => {
  const DEG = String.fromCharCode(176);
  const now = useLiveLocalTime(location.localtime);
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const metrics = [
    { label: 'Feels Like', value: `${Math.round(current.feelslike_c)}${DEG}C` },
    { label: 'Humidity', value: `${current.humidity}%` },
    { label: 'Wind', value: `${current.wind_kph} km/h ${current.wind_dir}` },
    { label: 'Wind Gust', value: `${current.gust_kph} km/h` },
    { label: 'Visibility', value: `${current.vis_km} km` },
    { label: 'Pressure', value: `${current.pressure_mb} mb` },
    { label: 'Cloud Cover', value: `${current.cloud}%` },
    { label: 'UV Index', value: `${current.uv}` },
    { label: 'Dew Point', value: `${Math.round(current.dewpoint_c)}${DEG}C` },
    { label: 'Precipitation', value: `${current.precip_mm} mm` },
  ];

  if (forecast?.forecastday?.length > 0) {
    metrics.push({
      label: 'Today High / Low',
      value: `${Math.round(forecast.forecastday[0].day.maxtemp_c)}${DEG}C / ${Math.round(
        forecast.forecastday[0].day.mintemp_c
      )}${DEG}C`,
    });
  }

  const todayForecast = forecast?.forecastday?.[0];
  const summaryItems = [
    todayForecast && {
      label: 'Today Range',
      value: `${Math.round(todayForecast.day.mintemp_c)}${DEG}C to ${Math.round(
        todayForecast.day.maxtemp_c
      )}${DEG}C`,
    },
    todayForecast && {
      label: 'Sunrise',
      value: todayForecast.astro.sunrise,
    },
    todayForecast && {
      label: 'Sunset',
      value: todayForecast.astro.sunset,
    },
    {
      label: 'Wind',
      value: `${current.wind_dir} ${Math.round(current.wind_kph)} km/h`,
    },
  ].filter(Boolean);

  return (
    <section id="today-section" className="current-panel">
      <div className="current-head">
        <div className="current-copy">
          <p className="place">{location.name}, {location.country}</p>
          <h2>{location.region || location.name}</h2>
          <p className="local-time">{formattedDate} | {formattedTime}</p>

          <div className="summary-strip">
            {summaryItems.map((item) => (
              <div key={item.label} className="summary-pill">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="temperature-block">
          <p className="temperature-label">Live Conditions</p>
          <img src={`https:${current.condition.icon}`} alt={current.condition.text} width={56} height={56} />
          <p className="main-temp">{Math.round(current.temp_c)}{DEG}C</p>
          <p className="condition">{current.condition.text}</p>
          <p className="temperature-meta">Updated {formattedTime}</p>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((item) => (
          <article key={item.label} className="metric-card">
            <p className="metric-label">{item.label}</p>
            <p className="metric-value">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Current;

