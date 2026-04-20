<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.length === 0" />
    <pie-chart
        v-else
        id="os-chart-chartjs"
        tooltipTitle="OS"
        :datasets="dataSeries"
        :padding-top="60"
    />
  </div>
</template>

<script>
import NoDataMessage from "./noDataMessage.vue";
import PieChart from "./pieChart.vue";

export default {
  name: "os-chart",
  props: {
    os: {
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
      const total = this.os.reduce((sum, row) => sum + (row.count || 0), 0);
      if (!total) return [];
      return this.os.map((row) => ({
        name: row.name,
        y: (row.count / total) * 100,
        count: row.count,
      }));
    },
  },
};
</script>

<style scoped>
#os-chart-chartjs {
  background-color: white;
}
</style>
