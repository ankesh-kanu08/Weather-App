import React from 'react'
import Search from './Search';
import "./Navbar.css"

const Navbar = () => {
  const navItems = [
    { label: 'Today', targetId: 'today-section' },
    { label: 'Hourly', targetId: 'hourly-section' },
    { label: '3-Day', targetId: 'outlook-section' },
  ];

  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="site-header">
      <div className="site-brand">
        <p className="site-kicker">Regional Forecast Center</p>
        <h1>MeghBodh</h1>
      </div>

      <div className="site-search">
        <Search embedded />
      </div>

      <nav className="site-nav" aria-label="Primary">
        {navItems.map((item) => (
          <button
            key={item.targetId}
            type="button"
            onClick={() => scrollToSection(item.targetId)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
