import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesGeoJSON from './data/countries.json';
import countryCenters from './data/CountryCenters';
import './MapComponent.css';
import CandlestickChart from './components/CandlestickChart';
import SearchBar from './components/SearchBar';
import CountryDesc from './components/CountryDesc';
import CustomPolyline from './components/CustomPolyline';


const MapComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(false);
  const [hoveredCountryCoords, setHoveredCountryCoords] = useState(null);
  const isHovered = false;
  
  const geoJSONStyle = (feature) => {
    const countryName = feature.properties.NAME;
    const isSelected = selectedCountries.includes(countryName);
    const isHovered = countryName === hoveredCountry;
    return {
      fillColor: isSelected ? '#127200' : isHovered ? '#6AB05C' : 'green',
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
        return [prevSelectedCountries[0], countryName];
      }
    });
  };

  const handleCountryHover = (countryName, event) => {
    setHoveredCountryCoords(event.containerPoint)
    setHoveredCountry(countryName);
  };

  const handleCountryMouseOut = () => {
    setHoveredCountry(null);
  };

  const toggleOverlay = () => {
    setIsOverlayCollapsed(!isOverlayCollapsed);
  };

  const overlayClass = isOverlayCollapsed ? 'overlay-div collapsed' : 'overlay-div';
  const grabberText = isOverlayCollapsed ? '◀' : '▶';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
    <div className={overlayClass}>
      <div className='grabber-bar' onClick={toggleOverlay}>{grabberText}</div>
      <h1>Foreign Exchange Visualization</h1>
      {selectedCountries.length !== 2 ? (
        <h2>Choose two countries to begin analyzing foreign exchange data<div className={"searchbar"}><SearchBar toggleCountrySelection={toggleCountrySelection}/></div></h2>) : (
        <>
          <h2>Showing foreign exchange data between <strong>{selectedCountries[0]}</strong> and <strong>{selectedCountries[1]}</strong></h2>
          <CandlestickChart/>
          <div className={"searchbar"}><SearchBar toggleCountrySelection={toggleCountrySelection}/></div>
        </>
      )}
    </div>
      <MapContainer center={[35, 25]} zoom={3} style={{ width: '100%', height: '100%', zIndex: 0 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          minZoom={2}
          maxZoom={8}
        />
        <GeoJSON
          data={countriesGeoJSON}
          style={geoJSONStyle}
          onEachFeature={(feature, layer) => {
            const countryName = feature.properties.NAME;
            layer.on({
              click: () => toggleCountrySelection(countryName),
              mouseover: (event) => {
                handleCountryHover(countryName, event);
              },
              mouseout: handleCountryMouseOut,
            });
          }}
        />
        <CustomPolyline
          selectedCountries={selectedCountries}
          countryCenters={countryCenters}
        />
        {isHovered && (
          <CountryDesc hoveredOver = {hoveredCountry} coords={hoveredCountryCoords}/>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
