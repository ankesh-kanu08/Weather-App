import React from 'react';
import './Comingdays.css';

const Comingdays = ({ forecast = [], selectedIndex = 0, onSelectDay }) => {
  const DEG = String.fromCharCode(176);

  if (!forecast.length) return null;

  const outlookDays = forecast.length;
  const selectedDay = forecast[selectedIndex];

  const formatDay = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  return (
    <section id="outlook-section" className="comingdays-container">
      <div className="section-head">
        <div className="section-title-wrap">
          <p className="section-kicker">Extended Trend</p>
          <h3>{outlookDays}-Day Outlook</h3>
        </div>
        <p>Extended forecast trend and day-by-day detail.</p>
      </div>

      <div className="comingdays-layout">
        <div className="days-list">
          {forecast.map((day, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={day.date}
                type="button"
                className={`comingdays-row ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectDay?.(idx)}
              >
                <div className="row-main">
                  <span className="col-date">{formatDay(day.date)}</span>
                  <span className="col-condition">
                    <img src={day.day.condition.icon} alt={day.day.condition.text} />
                    {day.day.condition.text}
                  </span>
                </div>
                <span className="col-temp">
                  {Math.round(day.day.maxtemp_c)}{DEG} / {Math.round(day.day.mintemp_c)}{DEG}
                </span>
              </button>
            );
          })}
        </div>

        {selectedDay && (
          <aside className="details-panel">
            <h4>{new Date(selectedDay.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
            <div className="details-grid">
              <div><span>Condition</span><strong>{selectedDay.day.condition.text}</strong></div>
              <div><span>Max Temp</span><strong>{Math.round(selectedDay.day.maxtemp_c)}{DEG}C</strong></div>
              <div><span>Min Temp</span><strong>{Math.round(selectedDay.day.mintemp_c)}{DEG}C</strong></div>
              <div><span>Humidity</span><strong>{selectedDay.day.avghumidity}%</strong></div>
              <div><span>UV Index</span><strong>{selectedDay.day.uv}</strong></div>
              <div><span>Chance of Rain</span><strong>{selectedDay.day.daily_chance_of_rain}%</strong></div>
              <div><span>Sunrise</span><strong>{selectedDay.astro.sunrise}</strong></div>
              <div><span>Sunset</span><strong>{selectedDay.astro.sunset}</strong></div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};

export default Comingdays;

