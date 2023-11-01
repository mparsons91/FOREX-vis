import React, { useState, useEffect } from 'react';
import './CountryDesc.css';

const CountryDesc = (props) => {
  const { hoveredOver, coords } = props;
  const [displayedText, setDisplayedText] = useState(hoveredOver);

  const menuStyle = {
    left: coords?.x || 0,
    top: coords?.y || 0,
    opacity: hoveredOver ? 1 : 0,
    transition: 'left 0.3s ease-in-out, top 0.3s ease-in-out, opacity 0.3s ease-in-out',
  };

  useEffect(() => {
    if (hoveredOver) {
      setDisplayedText(hoveredOver);
    }
  }, [hoveredOver]);

  return (
    <div className="countryModal" style={menuStyle}>
      {displayedText && (
        <h1>{displayedText}</h1>
      )}
    </div>
  );
}

export default CountryDesc;