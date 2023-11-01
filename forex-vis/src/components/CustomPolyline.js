import React, { useEffect, useState } from 'react';
import { Polyline, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';

const CustomPolyline = ({ selectedCountries, countryCenters }) => {
  const [lineCoordinates, setLineCoordinates] = useState([]);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (selectedCountries.length === 2) {
      const country1Center = countryCenters[selectedCountries[0]];
      const country2Center = countryCenters[selectedCountries[1]];

      if (country1Center && country2Center) {
        setLineCoordinates([country1Center, country2Center]);
        setAnimationProgress(0);

        const animationInterval = setInterval(() => {
          setAnimationProgress((prevProgress) => {
            const newProgress = prevProgress + 0.01; // step size 0.01

            if (newProgress >= 1) {
              clearInterval(animationInterval);
              return 1;
            }

            return newProgress;
          });
        }, 14); // anim speed, lower = faster
    
      } else {
        setLineCoordinates([]);
      }
    } else {
      setLineCoordinates([]);
    }
  }, [selectedCountries, countryCenters]);

  return (
    <>
      {lineCoordinates.length === 2 && (
        <>
          <Marker
            position={lineCoordinates[0]}
            icon={new Icon({
              iconUrl: require('./icons/pushpin.png'),
              iconSize: [24, 52],
              iconAnchor: [12, 48],
            })}
          />
          <Marker
            position={lineCoordinates[1]}
            icon={new Icon({
              iconUrl: require('./icons/pushpin.png'),
              iconSize: [24, 52],
              iconAnchor: [12, 48],
            })}
          />
          <Polyline
            positions={[
              lineCoordinates[0],
              interpolatePosition(lineCoordinates[0], lineCoordinates[1], animationProgress),
            ]}
            color="red"
            className="custom-polyline"
          />
        </>
      )}
    </>
  );
};

// interp positions for smooth line animation - ease in/out
function interpolatePosition(start, end, progress) {
    const easing = (t) => t * (2 - t);
    return [
      start[0] + (end[0] - start[0]) * easing(progress),
      start[1] + (end[1] - start[1]) * easing(progress),
    ];
  }

export default CustomPolyline;
