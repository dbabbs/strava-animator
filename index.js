const tangram = Tangram.leafletLayer({
   scene: 'scene.yaml'
})

const map = L.map('map', {
   center: [47.639147, -122.334996],
   zoom: 14,
   layers: [tangram],
   zoomControl: false,
   attributionControl: false
});

(async () => {
   const data = await fetch('data.json').then(res => res.json());

   const group = L.layerGroup().addTo(map);
   const line = data.features[0].geometry.coordinates.map(x => [x[1], x[0]]);

   const times = data.features[0].properties.coordTimes.map(x => {
      const date = new Date(new Date(x).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      const hours = date.getHours() - 12;
      let minutes = date.getMinutes();
      if (minutes < 10) {
         minutes = '0' + minutes;
      }
      return hours + ':' + minutes + ' PM';
   })


   const drawMap = curr => {
      group.clearLayers();
      const filtered = line.slice(0, curr)
      new L.Polyline(filtered, {color: 'rgba(101,99,226, 100)', weight: 6}).addTo(group);
   }
   const max = data.features[0].geometry.coordinates.length;

   let distance = 0;
   let z  = 0;

   document.body.onkeydown = ({code}) => {
      if (code === 'Space') {
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
         }, 5)
      }
   }

})();

