<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.series.length===0" />
    <div v-else id="gum-chart"></div>
  </div>
</template>

<script>
import createPieChart from "../mixins/createPieChart";
import NoDataMessage from "../../../components/noDataMessage.vue";

export default {
  name: "gum-chart",
  props: {
    issues: {
      type: Array,
      required: true
    }
  },
  components: {
    NoDataMessage
  },
  data() {
    return {
      chartId: "gum-chart",
      seriesName: "GetUserMedia Errors",
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: ' +
        "<b>{point.y:.2f}%</b><br/>Occurrences:<b>{point.count}</b></br>"
    };
  },
  mixins: [createPieChart],
  mounted() {},
  computed: {
    dataSeries() {
      const numberOfErrors = this.issues.length

      let titles = {}
      const result = this.issues.map(function(issue) {
        titles[issue.data.name] = issue.data.message
        return issue.data.name
      })

      let gum_warnings = peermetrics.utils.reduce(result);

      let series = [];
      for (let key of Object.keys(gum_warnings)) {
        series.push({
          name: titles[key],
          y: (gum_warnings[key] / numberOfErrors) * 100,
          count: gum_warnings[key]
        });
      }

      return {
        series,
        drilldown: null
      };
    },
  },

  watch: {
    issues(val, prev) {
      this.dataWatcher(val, prev)
    }
  }
};
</script>
