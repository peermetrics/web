<template>
  <div class="chart">
    <NoDataMessage v-if="!citySeries || citySeries.length === 0" />
    <div v-else id="map-chart"></div>
  </div>
</template>

<script>
import NoDataMessage from "./noDataMessage.vue";

export default {
  name: "map-chart",
  props: {
    cities: {
      type: Array,
      required: true,
    },
  },
  components: {
    NoDataMessage,
  },
  data() {
    return {
      map: null,
      countries: null,
    };
  },
  computed: {
    citySeries() {
      return this.cities.map((c) => ({
        name: c.city,
        lat: c.latitude,
        lon: c.longitude,
        z: c.count,
      }));
    },
    bounds() {
      if (this.citySeries.length === 0) return { min: 0, max: 0 };
      let min = Infinity;
      let max = -Infinity;
      this.citySeries.forEach((c) => {
        if (c.z < min) min = c.z;
        if (c.z > max) max = c.z;
      });
      return { min, max };
    },
  },
  mounted() {
    this.createMapChart();
  },
  methods: {
    async createMapChart() {
      if (this.citySeries.length === 0) return;

      if (!this.countries) {
        const prefix = (window.peermetrics && window.peermetrics.settings && window.peermetrics.settings.urlPrefix) || '';
        const normalizedPrefix = prefix === '/' ? '' : (prefix.endsWith('/') ? prefix.slice(0, -1) : prefix);
        const countriesUrl = `${normalizedPrefix}/static/data/countries.json`;
        this.countries = await wretch(countriesUrl).get().json();
      }

      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      const { min, max } = this.bounds;

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
          color: "#495057",
          weight: 1,
          opacity: 1,
        },
      }).addTo(this.map);

      this.citySeries.forEach((city) => {
        let radius;
        if (min === max) {
          radius = this.citySeries.length === 0 ? 30 : 20;
        } else {
          radius = ((city.z - min) / (max - min)) * 30;
          radius = Math.min(Math.max(radius, 10), 30);
        }

        L.circleMarker([city.lat, city.lon], {
          color: peermetrics.colors.default,
          fillColor: peermetrics.colors.default,
          fillOpacity: 0.5,
          radius: radius,
        })
          .bindTooltip(`${city.name}<br>Count: ${city.z}`, {
            direction: 'top',
          })
          .addTo(this.map);
      });
    },
  },
  watch: {
    cities() {
      this.$nextTick(this.createMapChart);
    },
  },
};
</script>

<style>
#map-chart {
  min-height: 200px;
}
</style>
