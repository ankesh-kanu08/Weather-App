import React from 'react';
import './Current.css';

const Current = ({ current, location, forecast }) => {
  return (
    <div className="container">
      {/* Location */}
      <div className="location">{location.name}, {location.country}</div>
      <div className="city">{location.region}</div>

      {/* Temperature */}
      <div className="temperature">{Math.round(current.temp_c)}°C</div>
      <div className="type">
        <img
          src={`https:${current.condition.icon}`}
          alt={current.condition.text}
          width={32}
          height={32}
          style={{ verticalAlign: 'middle', marginRight: '8px' }}
        />
        {current.condition.text}
      </div>

      {/* Local date and time */}
      <div className="date">
        {(() => {
          const dateObj = new Date(location.localtime);
          const formattedDate = dateObj.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const formattedTime = dateObj.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <>
              <div style={{ fontSize: "2em" }}>{formattedDate}</div>
              <div style={{ fontSize: "2em", color: "#666666ff" }}>{formattedTime}</div>
            </>
          );
        })()}
      </div>

      {/* Extra weather details in two columns */}
      <div className="details">
        <div className="details-column">
          <table>
            <tbody>
              <tr>
                <th>💨 Wind</th>
                <td>{current.wind_kph} km/h {current.wind_dir}</td>
              </tr>
              <tr>
                <th>🌬️ Wind Gust</th>
                <td>{current.gust_kph} km/h</td>
              </tr>
              <tr>
                <th>💧 Humidity</th>
                <td>{current.humidity}%</td>
              </tr>
              <tr>
                <th>🌡️ Feels Like</th>
                <td>{Math.round(current.feelslike_c)}°C</td>
              </tr>
              <tr>
                <th>🌧️ Precipitation</th>
                <td>{current.precip_mm} mm</td>
              </tr>
               <tr>
                <th>📈 Pressure</th>
                <td>{current.pressure_mb} mb</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="details-column">
          <table>
            <tbody>
              <tr>
                <th>☁️ Cloud Cover</th>
                <td>{current.cloud}%</td>
              </tr>
              <tr>
                <th>🌞 UV Index</th>
                <td>{current.uv}</td>
              </tr>
              <tr>
                <th>👁 Visibility</th>
                <td>{current.vis_km} km</td>
              </tr>
              <tr>
                <th>💧 Dew Point</th>
                <td>{current.dewpoint_c}°C</td>
              </tr>

              {forecast?.forecastday?.length > 0 && (
                <>
                  <tr>
                    <th>🔼 Max</th>
                    <td>{Math.round(forecast.forecastday[0].day.maxtemp_c)}°C</td>
                  </tr>
                  <tr>
                    <th>🔽 Min</th>
                    <td>{Math.round(forecast.forecastday[0].day.mintemp_c)}°C</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Current;
