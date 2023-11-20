import Box from '@mui/material/Box';

// import 'src/lib/geojson/parser.css';

import { loadScript, loadStylesheet } from 'src/@core/coreHelper';
import { ReactNode, useEffect } from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';

const RouteMap = () => {
  // const geoJSONData = JSON.parse(
  //   '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Home","address":"undefined undefined","coords":"-34.6400027, -58.7573015","mapLink":"http://www.google.com/maps/place/-34.6400027,-58.7573015","marker-color":"#333","marker-symbol":"building"},"geometry":{"type":"Point","coordinates":[-58.7573015,-34.6400027]}},{"type":"Feature","properties":{"time":"36.85 mins","name":"V1D2sB45YI3QW39Zqrv6","address":"undefined undefined","coords":"-34.6209497, -58.46082139999999","mapLink":"http://www.google.com/maps/place/-34.6209497,-58.46082139999999","route":1,"stop":1,"marker-color":"#1b9e77","marker-symbol":1},"geometry":{"type":"Point","coordinates":[-58.46082139999999,-34.6209497]}},{"type":"Feature","properties":{"route":1,"distance":33032.488,"duration":2175.634,"stroke":"#1b9e77","stroke-width":4,"isDirection":true},"geometry":{"coordinates":[[-58.757137,-34.639894],[-58.757363,-34.639663],[-58.758595,-34.640476],[-58.763181,-34.635771],[-58.762907,-34.635588],[-58.750286,-34.633164],[-58.742434,-34.630254],[-58.729296,-34.628208],[-58.693573,-34.628888],[-58.664911,-34.632987],[-58.648718,-34.631407],[-58.626562,-34.632879],[-58.589597,-34.632199],[-58.553824,-34.629724],[-58.536743,-34.63489],[-58.527904,-34.635026],[-58.522649,-34.636894],[-58.512686,-34.635181],[-58.505872,-34.63635],[-58.497771,-34.63583],[-58.485643,-34.645747],[-58.47547,-34.64895],[-58.469259,-34.649523],[-58.464012,-34.648559],[-58.461258,-34.642675],[-58.456072,-34.638467],[-58.45192,-34.636517],[-58.460704,-34.620895]],"type":"LineString"}}]}'
  // );

  // @ts-ignore
  const geoJSONData = window.roadmapInfo;

  console.log('geoJSONData:', geoJSONData);
  useEffect(() => {
    loadScript(`http://localhost:3000/map/geojson/parser.js`, () => {
      // alert('error loading parser');
    });

    loadStylesheet(`http://localhost:3000/map/geojson/parser.css`);
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        <div className='main-content'>
          {/* <div>{routesString}</div> */}
          <div
            style={{ marginTop: 20 }}
            id='js-map'
            className='render-viewport'
            data-type='view'
            //data-file="https://raw.githubusercontent.com/mapbox/node-or-tools/32027ae43dd2fda2613e7cd239b201d4ef95aebf/example/solution.geojson"
            // data-file={JSON.stringify(roadmapInfo)}
            data-file={JSON.stringify(geoJSONData)}
            data-basemap='mapbox://styles/mapbox/light-v10'
            data-token='pk.eyJ1IjoiYWJkYWxhbWljaGVsIiwiYSI6ImNrZmxycWdlZDB2Z2cyeHFwYjBrYm0wcHkifQ.2Wy3b9vFulwjawYsUWNe2A'
          ></div>
        </div>
      </Box>
    </>
  );
};

RouteMap.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

RouteMap.guestGuard = true;

export default RouteMap;
