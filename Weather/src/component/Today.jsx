import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Today.css';

const Today = ({ forecast = [], localTime, selectedDate }) => {
  const DEG = String.fromCharCode(176);
  const baseLocalTime = useMemo(() => new Date(localTime).getTime(), [localTime]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const localDate = useMemo(() => new Date(baseLocalTime + elapsedMs), [baseLocalTime, elapsedMs]);
  const cityHour = localDate.getHours();
  const forecastRef = useRef(null);
  const isCurrentDay =
    Boolean(selectedDate) && localDate.toISOString().slice(0, 10) === selectedDate;

  useEffect(() => {
    setElapsedMs(0);
    const startedAt = Date.now();
    const intervalId = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [baseLocalTime]);

  const initialSelectedIndex = useMemo(() => {
    if (!forecast.length) return 0;
    if (!isCurrentDay) return 0;

    const matchIndex = forecast.findIndex(({ time }) => new Date(time).getHours() === cityHour);
    return matchIndex >= 0 ? matchIndex : 0;
  }, [forecast, cityHour, isCurrentDay]);

  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

  useEffect(() => {
    setSelectedIndex(initialSelectedIndex);
  }, [initialSelectedIndex]);

  useEffect(() => {
    const container = forecastRef.current;
    if (!container) return;

    const activeCard = container.children[initialSelectedIndex];
    if (!activeCard) return;

    const centeredOffset =
      activeCard.offsetLeft - container.clientWidth / 2 + activeCard.clientWidth / 2;

    container.scrollTo({
      left: Math.max(0, centeredOffset),
      behavior: 'smooth',
    });
  }, [initialSelectedIndex, forecast]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const meridiem = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${hours}:${minutes} ${meridiem}`;
  };

  const selectedHour = forecast[selectedIndex];

  if (!forecast.length) return null;

  return (
    <section id="hourly-section" className="hourly-panel">
      <div className="section-head">
        <div className="section-title-wrap">
          <p className="section-kicker">Hourly Window</p>
          <h3>24-Hour Forecast</h3>
        </div>
        <p>
          {selectedDate
            ? `${new Date(selectedDate).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })} hourly detail`
            : 'Tap any hour to inspect detailed conditions.'}
        </p>
      </div>

      <div ref={forecastRef} className="forecast">
        {forecast.map(({ time, temp_c, condition, chance_of_rain }, index) => {
          const forecastHour = new Date(time).getHours();
          const isNow = isCurrentDay && forecastHour === cityHour;
          const isSelected = selectedIndex === index;

          return (
            <button
              key={time}
              type="button"
              className={`forecast-item ${isNow ? 'now-highlight' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className="hour">{formatTime(time)}</span>
              <img src={`https:${condition.icon}`} alt={condition.text} width={28} height={28} />
              <span className="temp">{Math.round(temp_c)}{DEG}C</span>
              <span className="cond">{condition.text}</span>
              <span className="rain">{chance_of_rain}% rain</span>
            </button>
          );
        })}
      </div>

      {selectedHour && (
        <div className="hourly-details">
          <h4>
            {new Date(selectedHour.time).toLocaleDateString(undefined, { weekday: 'long' })}, {formatTime(selectedHour.time)}
          </h4>
          <div className="detail-grid">
            <div><span>Temperature</span><strong>{Math.round(selectedHour.temp_c)}{DEG}C</strong></div>
            <div><span>Feels Like</span><strong>{Math.round(selectedHour.feelslike_c)}{DEG}C</strong></div>
            <div><span>Wind</span><strong>{selectedHour.wind_kph} km/h {selectedHour.wind_dir}</strong></div>
            <div><span>Humidity</span><strong>{selectedHour.humidity}%</strong></div>
            <div><span>Precipitation</span><strong>{selectedHour.precip_mm} mm</strong></div>
            <div><span>Pressure</span><strong>{selectedHour.pressure_mb} mb</strong></div>
            <div><span>Cloud Cover</span><strong>{selectedHour.cloud}%</strong></div>
            <div><span>UV Index</span><strong>{selectedHour.uv}</strong></div>
            <div><span>Visibility</span><strong>{selectedHour.vis_km} km</strong></div>
            <div><span>Dew Point</span><strong>{Math.round(selectedHour.dewpoint_c)}{DEG}C</strong></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Today;

