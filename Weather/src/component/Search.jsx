import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import UserContext from './UserContext';
import './Search.css';

const Search = ({ embedded = false }) => {
  const { setCity } = useContext(UserContext);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const skipNextFetchRef = useRef(false);
  const API_KEY = 'ed28347106824df8977180413250408';

  const shouldShowSuggestions = useMemo(
    () => input.trim().length >= 2 && suggestions.length > 0,
    [input, suggestions]
  );

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    const query = input.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      setLoading(true);
      fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`,
        {
          signal: controller.signal,
          cache: 'no-store',
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error('Suggestion fetch failed');
          return res.json();
        })
        .then((data) => {
          if (!Array.isArray(data)) {
            setSuggestions([]);
            return;
          }
          setSuggestions(data.slice(0, 6));
          setActiveIndex(data.length > 0 ? 0 : -1);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setSuggestions([]);
            setActiveIndex(-1);
          }
        })
        .finally(() => setLoading(false));
    }, 320);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [input]);

  const chooseSuggestion = (entry) => {
    const selected = `${entry.name}${entry.region ? `, ${entry.region}` : ''}, ${entry.country}`;
    skipNextFetchRef.current = true;
    setCity(selected);
    setInput(selected);
    setSuggestions([]);
    setActiveIndex(-1);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      chooseSuggestion(suggestions[activeIndex]);
      return;
    }

    const nextCity = input.trim();
    if (!nextCity) return;
    setCity(nextCity);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!shouldShowSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }

    if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <section className={`search-card ${embedded ? 'search-card-embedded' : ''}`}>
      <form onSubmit={handleSubmit} className="search-container">
        <div className="search-input-wrap">
          <input
            type="text"
            className="search"
            placeholder="Search city or region"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTimeout(() => {
                setSuggestions([]);
                setActiveIndex(-1);
              }, 120);
            }}
            aria-label="Search city"
            autoComplete="off"
          />

          {loading && <p className="search-hint">Loading suggestions...</p>}

          {shouldShowSuggestions && (
            <ul className="suggestions-list" role="listbox" aria-label="City suggestions">
              {suggestions.map((entry, index) => {
                const label = `${entry.name}${entry.region ? `, ${entry.region}` : ''}, ${entry.country}`;
                return (
                  <li key={`${entry.id ?? label}-${index}`}>
                    <button
                      type="button"
                      className={`suggestion-item ${activeIndex === index ? 'active' : ''}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => chooseSuggestion(entry)}
                    >
                      <span>{entry.name}</span>
                      <small>{entry.region ? `${entry.region}, ` : ''}{entry.country}</small>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button type="submit" className="searchicon">
          Search
        </button>
      </form>
    </section>
  );
};

export default Search;
