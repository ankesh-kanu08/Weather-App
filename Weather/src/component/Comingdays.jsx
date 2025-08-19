import React, { useState } from 'react';
import './Comingdays.css';
import { AlignCenter } from 'lucide-react';

const Comingdays = ({ forecast = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!forecast || forecast.length === 0) {
    return null;
  }

  const leftSide = forecast.slice(0, 5);
  const rightSide = forecast.slice(5, 10);

  const renderRows = (days, baseIndex = 0) =>
    days.map((day, i) => {
      const idx = baseIndex + i;
      const isSelected = selectedIndex === idx;

      return (
        <div
          key={idx}
          className={`comingdays-row ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
          style={{ cursor: 'pointer' }}
        >
          <div className="row-main">
            <span className="col-date">{day.date}</span>
            <span className="col-condition">
              <img
                src={day.day.condition.icon}
                alt={day.day.condition.text}
                style={{ verticalAlign: 'middle', marginRight: '6px' }}
              />
              {day.day.condition.text}
            </span>
          </div>
        </div>
      );
    });

  const selectedDay = selectedIndex !== null ? forecast[selectedIndex] : null;

  return (
    <div className="comingdays-container">
      <h3 className="comingdays-header" >Coming Days Forecast</h3>
      <div className={`comingdays-table three-columns ${selectedDay ? 'with-details' : ''}`}>
        <div className="column left-column">{renderRows(leftSide, 0)}</div>

        {selectedDay && (
          <div className="details-panel">
            <h4>Details for {selectedDay.date}</h4>
            <p><strong>Max Temp:</strong> {selectedDay.day.maxtemp_c}°C</p>
            <p><strong>Min Temp:</strong> {selectedDay.day.mintemp_c}°C</p>
            <p><strong>Humidity:</strong> {selectedDay.day.avghumidity}%</p>
            <p><strong>UV Index:</strong> {selectedDay.day.uv}</p>
            <p><strong>Sunrise:</strong> {selectedDay.astro.sunrise}</p>
            <p><strong>Sunset:</strong> {selectedDay.astro.sunset}</p>
            <p><strong>Chance of Rain:</strong> {selectedDay.day.daily_chance_of_rain}%</p>
          </div>
        )}

        <div className="column right-column">{renderRows(rightSide, 5)}</div>
      </div>
    </div>
  );
};

export default Comingdays;
