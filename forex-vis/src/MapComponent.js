import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesGeoJSON from './data/countries.json';
import './MapComponent.css';

const MapComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(false);

  const geoJSONStyle = (feature) => {
    const countryName = feature.properties.NAME;
    const isSelected = selectedCountries.includes(countryName);
    const isHovered = countryName === hoveredCountry;

    return {
      fillColor: isSelected ? 'darkred' : isHovered ? 'lightcoral' : 'green',
      weight: 1,
      opacity: 1,
      color: isSelected || isHovered ? 'white' : 'white',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected || isHovered ? 0.6 : 0.2,
    };
  };

  const toggleCountrySelection = (countryName) => {
    setSelectedCountries((prevSelectedCountries) => {
      if (prevSelectedCountries.includes(countryName)) {
        return prevSelectedCountries.filter((name) => name !== countryName);
      } else if (prevSelectedCountries.length < 2) {
        return [...prevSelectedCountries, countryName];
      } else {
        return [prevSelectedCountries[1], countryName];
      }
    });
  };

  const handleCountryHover = (countryName) => {
    setHoveredCountry(countryName);
  };

  const handleCountryMouseOut = () => {
    setHoveredCountry(null);
  };

  const toggleOverlay = () => {
    setIsOverlayCollapsed(!isOverlayCollapsed);
  };

  const overlayClass = isOverlayCollapsed ? 'overlay-div collapsed' : 'overlay-div';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div className={overlayClass}>
        <div className='grabber-bar' onClick={toggleOverlay}></div>
        <h1>Foreign Exchange Visualization</h1>
        <h2>Showing forex data for:</h2>
        {selectedCountries.slice(0, 2).map((country, index) => (
          <li key={country}>{country}</li>
        ))}
        <p>This is where we can generate graphs:</p>
      </div>
      <MapContainer center={[35, 25]} zoom={3} style={{ width: '100%', height: '100%', zIndex: 0 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          minZoom={3}
          maxZoom={4}
        />
        <GeoJSON
          data={countriesGeoJSON}
          style={geoJSONStyle}
          onEachFeature={(feature, layer) => {
            const countryName = feature.properties.NAME;
            layer.on({
              click: () => toggleCountrySelection(countryName),
              mouseover: () => handleCountryHover(countryName),
              mouseout: handleCountryMouseOut,
            });
          }}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
