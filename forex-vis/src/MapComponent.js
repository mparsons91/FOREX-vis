import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesGeoJSON from './data/countries.json';
import countryCenters from './data/CountryCenters';
import './MapComponent.css';
import CandlestickChart from './components/CandlestickChart';
import SearchBar from './components/SearchBar';
import CountryDesc from './components/CountryDesc';

import {Icon} from 'leaflet'

const MapComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(false);
  const [hoveredCountryCoords, setHoveredCountryCoords] = useState(null);

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
        return [prevSelectedCountries[1], countryName];
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
      <div className={"searchbar"}>
        <SearchBar toggleCountrySelection={toggleCountrySelection}/>
      </div>
      <div className={overlayClass}>
        <div className='grabber-bar' onClick={toggleOverlay}>
          {grabberText}
        </div>
        <h1>Foreign Exchange Visualization</h1>
        <h2>Showing foreign exchange data for:</h2>
        {selectedCountries.map((country, index) => (
          <li key={country}>{country}</li>
        ))}
        <CandlestickChart />
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
        isHovered && {
          <CountryDesc hoveredOver = {hoveredCountry} coords={hoveredCountryCoords}/>
        }
      </MapContainer>
    </div>
  );
};

const CustomPolyline = ({ selectedCountries, countryCenters }) => {
  const [lineCoordinates, setLineCoordinates] = React.useState([]);

  useEffect(() => {
    if (selectedCountries.length === 2) {

      // important to keep in mind: the country-centers csv has it listed in long-lat, we need lat-long
      // get center coords for selected countries
      const country1Center = countryCenters[selectedCountries[0]];
      const country2Center = countryCenters[selectedCountries[1]];

      if (country1Center && country2Center) {
        setLineCoordinates([country1Center, country2Center]);
      }

    } else {
      setLineCoordinates([]);
    }
  }, [selectedCountries, countryCenters]);

  return (
    <>
      {lineCoordinates.length === 2 && (
        <>
          <Marker position={lineCoordinates[0]} icon={new Icon({iconUrl: require('./icons/pushpin.png'), iconSize: [24, 52], iconAnchor: [12, 48]})}/>
          <Marker position={lineCoordinates[1]} icon={new Icon({iconUrl: require('./icons/pushpin.png'), iconSize: [24, 52], iconAnchor: [12, 48]})}/>
          <Polyline positions={lineCoordinates} color="red" className="polyline-shadow" />
        </>
      )}
    </>
  );
};

export default MapComponent;
