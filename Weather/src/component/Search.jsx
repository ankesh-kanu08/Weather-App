// component/Search.jsx
import React, { useState, useContext } from 'react';
import UserContext from './UserContext';
import './Search.css';

const Search = () => {
  const { setCity } = useContext(UserContext);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setCity(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <input
        type="text"
        className="search"
        placeholder="Search city..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="searchicon">🔍</button>
    </form>
  );
};

export default Search;
