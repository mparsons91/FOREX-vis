import React from 'react';
import './CountryDesc.css';

const CountryDesc = (props) => {
    const { hoveredOver, coords } = props;

    return (
      hoveredOver && coords && (
        <div
          className="countryModal"
          style={{ left: coords.x, top: coords.y }}
        >
          <h1>{hoveredOver}</h1>
        </div>
      )
    );
}
export default CountryDesc;

