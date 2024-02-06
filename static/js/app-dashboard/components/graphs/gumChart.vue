<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.datasets.length===0" />
    <pie-chart
        v-else
        id="gum-chartjs"
        tooltipTitle="GetUserMedia Errors"
        :labels="dataSeries.labels"
        :datasets="dataSeries.datasets"
        :count="dataSeries.count"
        :padding="65"
    />
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import PieChart from "./pieChart.vue";

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

      let datasets = [];
      let labels = [];
      let count = [];

      for (let key of Object.keys(gum_warnings)) {
        labels.push(key)
        count.push(gum_warnings[key])
        datasets.push((gum_warnings[key] / numberOfErrors) * 100)
      }

      return {
        labels,
        datasets,
        count
      };
    },
  }
};
</script>

<style lang="scss" scoped>
#gum-chartjs {
  background-color: white;
}
</style>
