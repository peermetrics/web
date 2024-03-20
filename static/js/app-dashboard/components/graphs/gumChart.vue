<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.length===0" />
    <pie-chart
        v-else
        id="gum-chartjs"
        tooltipTitle="GetUserMedia Errors"
        :datasets="dataSeries"
        :padding="65"
    />
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import PieChart from "../../../components/pieChart.vue";

export default {
  name: "gum-chart",
  props: {
    issues: {
      type: Array,
      required: true
    }
  },
  components: {
    PieChart,
    NoDataMessage
  },
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

      return series;
    },
  }
};
</script>

<style lang="scss" scoped>
#gum-chartjs {
  background-color: white;
}
</style>
