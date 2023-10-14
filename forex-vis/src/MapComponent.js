import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from 'd3';
import './MapComponent.css';
import countriesGeoJSON from './data/countries.json';

function MapComponent() {
  const center = [35, 25]; // initial center coordinates
  const [showModal, setShowModal] = React.useState(false); //sets modal off as default
  const [selectedCountries, setSelectedCountries] = React.useState([]); // Selected countries

  React.useEffect(() => {
    if (selectedCountries.length > 2){
      toggleModal();
      setSelectedCountries(selectedCountries.slice(2));
    }
    if (selectedCountries.length === 2) {
      toggleModal();
    }
  }, [selectedCountries]);

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

  const geoJSONStyle = (feature) => {
    return {
      fillColor: 'green',
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.2,
    };
  };

  const maxBounds = [
    [-180, -180],
    [180, 347],
  ];

  //Toggles the modal on and off
  const toggleModal = () => {
    setShowModal((current) => !current);
  };

  const mouseDownFeature = (e) => {
    const layer = e.target;
    const countryName = e.sourceTarget.feature.properties.NAME;
    
    setSelectedCountries((prevSelectedCountries) => {
      // Check if the countryName is not already in the selectedCountries array
      if (!prevSelectedCountries.includes(countryName)) {
        return [...prevSelectedCountries, countryName];
      }else {
        return prevSelectedCountries;
      }
    });

    layer.setStyle({
      weight: 1.5,
      color: '047127',
      dashArray: '',
      fillOpacity: 0.8,
    });

    layer.bringToFront();
  };

  const mouseUpFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 1.5,
      color: '047127',
      dashArray: '',
      fillOpacity: 0.6,
    });

    layer.bringToFront();
  };

  const highlightFeature = (e) => {
    const layer = e.target;

    layer.setStyle({
      weight: 1.5,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.4,
    });

    layer.bringToFront();
  };

  const resetHighlight = (e) => {
    const layer = e.target;

    layer.setStyle({
      weight: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.2,
    });
  };
  

  return (
    <MapContainer
      center={center}
      zoom={3}
      style={{ width: '100vw', height: '100vh' }}
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
    >
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
          layer.on({
            mousedown: mouseDownFeature,
            mouseup: mouseUpFeature,
            mouseover: highlightFeature,
            mouseout: resetHighlight,
          });
        }}
      />

      {/* This section should be populared with our dataset. Should probably move to separate file... */}
      {showModal && 
        <div className="overlay-div">
          
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
      }
      
    </MapContainer>
  );
}

export default MapComponent;
