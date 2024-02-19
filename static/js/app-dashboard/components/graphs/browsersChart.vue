<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.series.length===0" />
    <pie-chart
        v-else
        id="browsers-chartjs"
        tooltipTitle="Browsers"
        :datasets="dataSeries.series"
        :drilldown="dataSeries.drilldown"
        :padding-top="60"
    />
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import PieChart from "./pieChart.vue";

export default {
  name: "browsers-chart",
  props: {
    sessions: {
      type: Array,
      required: true
    }
  },
  components: {
    PieChart,
    NoDataMessage
  },
  mounted() {},
  computed: {
    dataSeries() {
      let systems = [];
      let drilldown = {};
      let len = this.sessions.length;

      this.sessions.forEach(function(event) {
        if (event.platform) {
          let platform = event.platform;
          let name = platform.browser.name;
          let version = platform.browser.version;

          systems.push(name);

          if (version) {
            if (drilldown[name]) {
              drilldown[name].push(version);
            } else {
              drilldown[name] = [version];
            }
          }
        }
      });

      systems = peermetrics.utils.reduce(systems, len);

      let series = [];
      let drilldownSeries = [];
      for (let browser in systems) {
        series.push({
          name: browser,
          y: systems[browser],
          drilldown: drilldown[browser] ? browser : null
        });

        if (drilldown[browser]) {
          let versions = peermetrics.utils.reduce(
            drilldown[browser],
            drilldown[browser].length
          );
          drilldownSeries.push({
            name: browser,
            id: browser,
            data: Object.entries(versions)
          });
        }
      }

      return {
        series,
        drilldown: drilldownSeries
      };
    }
  },

  watch: {
    sessions(val, prev) {
      this.dataWatcher(val, prev)
    }
  }
};
</script>

<style scoped>
#browsers-chartjs {
  background-color: white;
}
</style>