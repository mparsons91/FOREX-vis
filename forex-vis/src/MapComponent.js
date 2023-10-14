import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesGeoJSON from './data/countries.json';
import './MapComponent.css';
import * as d3 from 'd3';

const MapComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  
  const geoJSONStyle = (feature) => {
    const countryName = feature.properties.NAME;
    const isSelected = selectedCountries.includes(countryName);
    
    return {
      fillColor: isSelected ? 'darkred' : 'green',
      weight: 1,
      opacity: 1,
      color: isSelected ? 'white' : 'white',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected ? 0.6 : 0.2,
    };
  };
  
  const toggleCountrySelection = (countryName) => {
    setSelectedCountries((prevSelectedCountries) => {
      if (prevSelectedCountries.includes(countryName)) {
        // if the country is already selected, unselect it
        return prevSelectedCountries.filter((name) => name !== countryName);
      } else if (prevSelectedCountries.length < 2) {
        // if the country is not selected and you have less than 2 selections, add it
        return [...prevSelectedCountries, countryName];
      } else {
        // if you have reached the limit of 2 selections, replace the least recently selected one
        return [prevSelectedCountries[1], countryName];
      }
    });
  };

  // temporary stuff for data
  const data = [1, 2, 3, 4, 5];
  const width = 640;
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;

  const x = d3.scaleLinear().domain([0, data.length - 1]).range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear().domain(d3.extent(data)).range([height - marginBottom, marginTop]);
  const line = d3.line().x((d, i) => x(i)).y(y);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
          <div className='overlay-div'>
            <h1>Foreign Exchange Visualization</h1>

            <h2>Showing forex data for:</h2>
            {selectedCountries.slice(0,2).map((country, index) => (
              <li key={index}>{country}</li>
            ))}

          <p>this is where we can generate graphs</p>
          <div className="forexChart">
            <svg>
              <path fill="none" stroke="currentColor" strokeWidth={1.5} d={line(data)} />
              <g fill="white" stroke="currentColor" strokeWidth={1.5}>
                {data.map((d, i) => (
                  <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
                ))}
              </g>
            </svg>
          </div>

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
                });
              }}
            />
          </MapContainer>
      </div>
  );
};

export default MapComponent;
