import React, { useState } from 'react';
import './Today.css';

const Today = ({ forecast, localTime }) => {
  const cityHour = new Date(localTime).getHours(); // Local hour of searched city

  const [selectedIndex, setSelectedIndex] = useState(null);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}${suffix}`;
  };

  return (
    <div className="weather-card">
      <h3>Today's 24-Hour Forecast</h3>
      <div className="forecast">
        {forecast.map(({ time, temp_c, condition, wind_kph, wind_dir, humidity, feelslike_c, precip_mm, pressure_mb, cloud, uv, vis_km, dewpoint_c }, index) => {
          const forecastHour = new Date(time).getHours();
          const isNow = forecastHour === cityHour;

          const isSelected = selectedIndex === index;

          return (
            <div key={index}>
              <div
                className={`forecast-item ${isNow ? 'now-highlight' : ''}`}
                onClick={() => setSelectedIndex(isSelected ? null : index)}
                style={{ cursor: 'pointer' }}
              >
                <span>{formatTime(time)}</span>
                <span>{Math.round(temp_c)}°C</span>
                <div className="desc-icon">
                  <img
                    src={`https:${condition.icon}`}
                    alt={condition.text}
                    width={24}
                    height={24}
                    style={{ marginRight: '6px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 'normal' }}>
                    {condition.text}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="hourly-details">
                  <table>
                    <tbody>
                      <tr>
                        <th>Temperature</th>
                        <td>{Math.round(temp_c)}°C</td>
                      </tr>
                      <tr>
                        <th>Feels Like</th>
                        <td>{Math.round(feelslike_c)}°C</td>
                      </tr>
                      <tr>
                        <th>Wind</th>
                        <td>{wind_kph} km/h {wind_dir}</td>
                      </tr>
                      <tr>
                        <th>Humidity</th>
                        <td>{humidity}%</td>
                      </tr>
                      <tr>
                        <th>Precipitation</th>
                        <td>{precip_mm} mm</td>
                      </tr>
                      <tr>
                        <th>Pressure</th>
                        <td>{pressure_mb} mb</td>
                      </tr>
                      <tr>
                        <th>Cloud Cover</th>
                        <td>{cloud}%</td>
                      </tr>
                      <tr>
                        <th>UV Index</th>
                        <td>{uv}</td>
                      </tr>
                      <tr>
                        <th>Visibility</th>
                        <td>{vis_km} km</td>
                      </tr>
                      <tr>
                        <th>Dew Point</th>
                        <td>{dewpoint_c}°C</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Today;
