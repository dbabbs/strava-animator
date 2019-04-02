const map = L.map('map', {
   center: [18.465342564357663, -66.11760187894107],
   zoom: 16,
   layers: [L.tileLayer("https://2.aerial.maps.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?app_id=E2ZQ9D1JPucDy6AYr2LV&app_code=JSkKINQgwC1NazM236X9GQ")],
   zoomControl: false,
   attributionControl: false
});

const group = L.layerGroup().addTo(map);

const line = data.features[0].geometry.coordinates.map(x => [x[1], x[0]]);

const times = data.features[0].properties.coordTimes.map(
   x => new Date(x)
      .toLocaleString('en-US', { timeZone: 'America/Puerto_Rico' })
      .split(', ')[1]
).map(x => {
   const indicator = x.split(' ')[1];
   const time = x.split(' ')[0];
   return time.split(':')[0] + ':' + time.split(':')[2] + ' ' + indicator;
});

const drawMap = (curr) => {
   group.clearLayers();
   const filtered = line.slice(0, curr)
   new L.Polyline(filtered, {color: '#FF0000', weight: 5}).addTo(group);
}
const max = data.features[0].geometry.coordinates.length;

let distance = 0;
let z  = 0;

const interval = setInterval(() => {
   if (z === max) {
      clearInterval(interval)
   } else {
      drawMap(z);
   }
   if (z !== 0) {
      distance += turf.distance(
         [line[z - 1][1], line[z - 1][0]],
         [line[z][1], line[z][0]],
         {units: 'miles'}
      )
      document.getElementById('distance').innerText = Math.round(distance * 10 ) / 10 +  ' miles';
   }
   if (z % 20 === 0) {
      document.getElementById('time').innerText = times[z];
   }
   z++;
}, 3)
