import React, { useContext, useEffect, useMemo, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { CloudFog, CloudLightning, CloudRain, CloudSun, Flame, SunMedium } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import UserContext from './UserContext';
import './WeatherMap.css';

const DEFAULT_ZOOM = 10;

const getAqiMeta = (airQuality = {}) => {
  const pm25 = airQuality.pm2_5;

  if (pm25 == null) {
    return {
      label: 'Unavailable',
      tone: 'unknown',
      advice: 'Air quality data is not available for this location right now.',
    };
  }
  if (pm25 <= 12) {
    return { label: 'Good', tone: 'good', advice: 'Air quality is healthy for outdoor activity.' };
  }
  if (pm25 <= 35.4) {
    return { label: 'Moderate', tone: 'moderate', advice: 'Air is acceptable, but sensitive people should limit long exposure.' };
  }
  if (pm25 <= 55.4) {
    return { label: 'Sensitive', tone: 'sensitive', advice: 'Sensitive groups should reduce extended outdoor exertion.' };
  }
  if (pm25 <= 150.4) {
    return { label: 'Unhealthy', tone: 'unhealthy', advice: 'Outdoor exposure should be reduced for most people.' };
  }
  if (pm25 <= 250.4) {
    return { label: 'Very Unhealthy', tone: 'very-unhealthy', advice: 'Health alert level. Limit outdoor time if possible.' };
  }
  return { label: 'Hazardous', tone: 'hazardous', advice: 'Avoid prolonged outdoor exposure and take precautions.' };
};

const getConditionAccent = (current = {}) => {
  const text = `${current.condition?.text ?? ''}`.toLowerCase();
  const temp = current.temp_c ?? 0;

  if (text.includes('thunder')) return { label: 'Thunder activity', icon: CloudLightning };
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) return { label: 'Rain bands', icon: CloudRain };
  if (text.includes('mist') || text.includes('fog') || text.includes('haze')) return { label: 'Low visibility', icon: CloudFog };
  if (temp >= 40) return { label: 'Extreme heat', icon: Flame };
  if (text.includes('sun') || text.includes('clear')) return { label: 'Bright skies', icon: SunMedium };
  return { label: 'Mixed sky', icon: CloudSun };
};

const MapViewportManager = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
    setTimeout(() => map.invalidateSize(), 0);
  }, [center, zoom, map]);

  return null;
};

const BoundaryViewportManager = ({ boundaryGeoJson, center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (boundaryGeoJson) {
      const layer = L.geoJSON(boundaryGeoJson);
      const bounds = layer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          animate: true,
          padding: [24, 24],
        });
        return;
      }
    }

    map.setView(center, zoom, { animate: true });
  }, [boundaryGeoJson, center, zoom, map]);

  return null;
};

const MapClickSelector = ({ onSelectLocation }) => {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      onSelectLocation(`${lat.toFixed(4)},${lng.toFixed(4)}`);
    },
  });

  return null;
};

const WeatherMap = ({ location, current }) => {
  const { setCity } = useContext(UserContext);
  const center = useMemo(() => [location.lat, location.lon], [location.lat, location.lon]);
  const aqiMeta = getAqiMeta(current.air_quality);
  const conditionAccent = getConditionAccent(current);
  const [boundaryGeoJson, setBoundaryGeoJson] = useState(null);
  const boundaryQuery = useMemo(
    () => `${location.name}${location.region ? `, ${location.region}` : ''}, ${location.country}`,
    [location.name, location.region, location.country]
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadBoundary = async () => {
      setBoundaryGeoJson(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            boundaryQuery
          )}&polygon_geojson=1&polygon_threshold=0.01&limit=1&accept-language=en`,
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Boundary lookup failed');
        }

        const results = await response.json();
        const geometry = results?.[0]?.geojson;

        if (!geometry || geometry.type === 'Point') {
          return;
        }

        setBoundaryGeoJson(geometry);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setBoundaryGeoJson(null);
        }
      }
    };

    loadBoundary();

    return () => controller.abort();
  }, [boundaryQuery]);

  const pollutantCards = [
    { label: 'PM2.5', value: current.air_quality?.pm2_5?.toFixed?.(1) ?? 'N/A' },
    { label: 'PM10', value: current.air_quality?.pm10?.toFixed?.(1) ?? 'N/A' },
    { label: 'CO', value: current.air_quality?.co?.toFixed?.(1) ?? 'N/A' },
    { label: 'NO2', value: current.air_quality?.no2?.toFixed?.(1) ?? 'N/A' },
    { label: 'O3', value: current.air_quality?.o3?.toFixed?.(1) ?? 'N/A' },
    { label: 'SO2', value: current.air_quality?.so2?.toFixed?.(1) ?? 'N/A' },
  ];
  const AccentIcon = conditionAccent.icon;

  return (
    <section className="map-panel">
      <div className="section-head map-head">
        <div className="section-title-wrap">
          <p className="section-kicker">Weather Atlas</p>
          <h3>{location.name} and Nearby Places</h3>
        </div>
        <div className={`aqi-hero aqi-${aqiMeta.tone}`}>
          <div className="aqi-topline">
            <span>Current AQI</span>
            <strong>{aqiMeta.label}</strong>
          </div>
          <p>{aqiMeta.advice}</p>
        </div>
      </div>

      <div className="map-layout">
        <div className="map-shell">
          <MapContainer center={center} zoom={DEFAULT_ZOOM} scrollWheelZoom className="weather-map">
            <MapViewportManager center={center} zoom={DEFAULT_ZOOM} />
            <BoundaryViewportManager boundaryGeoJson={boundaryGeoJson} center={center} zoom={DEFAULT_ZOOM} />
            <MapClickSelector onSelectLocation={setCity} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {boundaryGeoJson && (
              <GeoJSON
                data={boundaryGeoJson}
                pathOptions={{
                  color: '#111111',
                  weight: 3,
                  fillColor: '#1f7a8c',
                  fillOpacity: 0.08,
                }}
              />
            )}
          </MapContainer>
        </div>

        <aside className="map-sidebar">
          <article className={`aqi-feature-card aqi-feature-${aqiMeta.tone}`}>
            <div className="aqi-feature-head">
              <div>
                <span className="aqi-feature-label">Selected place</span>
                <h4>{location.name}</h4>
              </div>
              <div className="aqi-score-chip">
                <span>PM2.5</span>
                <strong>{current.air_quality?.pm2_5?.toFixed?.(1) ?? 'N/A'}</strong>
              </div>
            </div>

            <div className="aqi-feature-body">
              <div className="condition-badge">
                <AccentIcon size={20} strokeWidth={2.2} />
                <span>{conditionAccent.label}</span>
              </div>
              <p className="aqi-summary-copy">{aqiMeta.advice}</p>
              <div className="aqi-mini-row">
                <div>
                  <span>Condition</span>
                  <strong>{current.condition.text}</strong>
                </div>
                <div>
                  <span>Temperature</span>
                  <strong>{Math.round(current.temp_c)}&deg;C</strong>
                </div>
                <div>
                  <span>Humidity</span>
                  <strong>{current.humidity}%</strong>
                </div>
                <div>
                  <span>Wind</span>
                  <strong>{Math.round(current.wind_kph)} km/h</strong>
                </div>
              </div>
            </div>
          </article>

          <div className="map-summary-grid">
            {pollutantCards.map((item) => (
              <article key={item.label} className="map-summary-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default WeatherMap;
