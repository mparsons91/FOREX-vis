// import React from 'react';
// import * as d3 from 'd3';
// import countriesGeoJSON from '../data/countries.json'
// import '../components/chartModal.css'


// export default function Gallery() {

//     const x = d3.scaleLinear().domain([0, data.length - 1]).range([marginLeft, width - marginRight]);
//     const y = d3.scaleLinear().domain(d3.extent(data)).range([height - marginBottom, marginTop]);
//     const line = d3.line().x((d, i) => x(i)).y(y);

//     const data = [1, 2, 3, 4, 5];
//     const width = 640;
//     const height = 400;
//     const marginTop = 20;
//     const marginRight = 20;
//     const marginBottom = 20;
//     const marginLeft = 20;
//     return (
//         <div className="overlay-div">
    
//           <h1>Foreign Exchange Visualization</h1>
//           <p>this is where we can generate graphs</p>

//           <svg width={width} height={height}>
//             <path fill="none" stroke="currentColor" strokeWidth={1.5} d={line(data)} />
//             <g fill="white" stroke="currentColor" strokeWidth={1.5}>
//               {data.map((d, i) => (
//                 <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
//               ))}
//             </g>
//           </svg>
//         </div>
//     )
// }


