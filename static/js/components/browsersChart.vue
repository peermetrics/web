<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.length === 0" />
    <pie-chart
        v-else
        id="browsers-chartjs"
        tooltipTitle="Browsers"
        :datasets="dataSeries"
        :padding-top="60"
    />
  </div>
</template>

<script>
import NoDataMessage from "./noDataMessage.vue";
import PieChart from "./pieChart.vue";

export default {
  name: "browsers-chart",
  props: {
    browsers: {
      type: Array,
      required: true,
    },
  },
  components: {
    PieChart,
    NoDataMessage,
  },
  computed: {
    dataSeries() {
      const total = this.browsers.reduce((sum, row) => sum + (row.count || 0), 0);
      if (!total) return [];
      return this.browsers.map((row) => ({
        name: row.name,
        y: (row.count / total) * 100,
        count: row.count,
      }));
    },
  },
};
</script>

<style scoped>
#browsers-chartjs {
  background-color: white;
}
</style>
