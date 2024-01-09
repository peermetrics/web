<template>
  <div class="chart">
    <NoDataMessage v-if="!dataSeries || dataSeries.citySeries.length === 0 " />
    <div v-else id="map-chart"></div>
  </div>
</template>

<script>
import NoDataMessage from "./noDataMessage.vue";

export default {
  name: "map-chart",
  props: {
    sessions: {
      type: Array,
      required: true
    }
  },
  components: {
    NoDataMessage
  },
  mounted() {
    this.createMapChart();
  },
  data() {
    return {
      map: null,
      countries: null
    }
  },
  computed: {
    dataSeries() {
      let cities = {};

      // keep track of the min and max of occurences
      let min
      let max

      this.sessions.map(session => {
        let city = session.geo_ip.city;
        let lat = parseFloat(session.geo_ip.latitude);
        let lon = parseFloat(session.geo_ip.longitude);

        if (city && lat && lon) {
          if (city in cities) {
            cities[city].z += 1;
          } else {
            cities[city] = {
              lat: lat,
              lon: lon,
              z: 1
            };
          }

          min = min ? Math.min(min, cities[city].z) : cities[city].z
          max = max ? Math.max(max, cities[city].z) : cities[city].z
        }
      });

      let citySeries = [];
      for (let city of Object.keys(cities)) {
        citySeries.push({
          name: city,
          lat: cities[city].lat,
          lon: cities[city].lon,
          z: cities[city].z
        });
      }

      return {
        citySeries,
        min,
        max
      };
    }
  },
  methods: {
    async createMapChart() {
      // if we have not sessions to use
      if (this.dataSeries.citySeries.length === 0) return

      if (!this.countries) {
        this.countries = await wretch('/static/data/countries.json').get().json()
      }

      if (this.map) {
        this.map.remove()
        this.map = null
      }

      const {min, max} = this.dataSeries

      this.map = L.map('map-chart', {
        attributionControl: false,
        maxZoom: 10,
      }).setView([30, 0], 2);

      L.geoJson(this.countries, {
          clickable: false,
          style: {
            fillColor: "#fff",
            fillOpacity: 1,
            fill: true,
            // TODO: find a better color
            color: "#495057",
            weight: 1,
            opacity: 1
        }
      }).addTo(this.map)

      this.dataSeries.citySeries.forEach((city) => {
        let radius
        // if this happens, most likely we only have on value
        if (min === max) {
          // still, if we have multiple points with the same value, make them a bit smaller
          radius = this.dataSeries.citySeries.length === 0 ? 30 : 20
        } else {
          // we should always have a value between 10 and 30
          radius = ( city.z - min / max - min ) * 30
          radius = Math.min(Math.max(radius, 10), 30)
        }

        L.circleMarker([city.lat, city.lon], {
          color: peermetrics.colors.default,
          fillColor: peermetrics.colors.default,
          fillOpacity: 0.5,
          radius: radius
        })
        .bindTooltip(`${city.name}<br>Count: ${city.z}`, {
          direction: 'top'
        })
        .addTo(this.map)
      })
    }
  },
  watch: {
    sessions() {
      this.$nextTick(this.createMapChart)
    },
  },
};
</script>

<style>
  #map-chart {
    min-height: 200px;
  }
</style>