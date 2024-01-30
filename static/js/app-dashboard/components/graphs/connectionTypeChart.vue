<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.datasets.length===0" />
    <pie-chart
        v-else
        id="type-of-connection-chartjs"
        tooltipTitle="Connection Types"
        :labels="dataSeries.labels"
        :datasets="dataSeries.datasets"
        :count="dataSeries.count"
    />
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import PieChart from "./pieChart.vue";

export default {
  name: "connection-type-chart",

  props: {
    connections: {
      type: Array,
      required: true
    }
  },

  components: {
    NoDataMessage,
    PieChart
  },

  computed: {
    dataSeries() {
      let result = this.connections
          .map(connection => {
            // get connection type from each one
            return connection.type;
          })
          // concat the arrays to create one big one
          .reduce((arr, cur) => {
            return arr.concat(cur);
          }, [])
          // filter out invalid values
          .filter(arr => !!arr);

      let types = peermetrics.utils.reduce(result);

      let connectionsCount = Object.values(types).reduce((a, b) => a + b, 0);

      let grouping = {
        'relayed': 0,
        'direct': 0
      }
      // group the connection types into 2 categories
      for (let key of Object.keys(types)) {
        const group_key = key === 'relay' ? 'relayed' : 'direct'
        grouping[group_key] += types[key]
      }

      let series = []
      if (connectionsCount) {
        series.push((grouping['direct'] / connectionsCount) * 100, (grouping['relayed'] / connectionsCount) * 100)
      }

      return {
        labels: ['Direct', 'Relayed'],
        datasets: series,
        count: [grouping['direct'], grouping['relayed']]
      }
    }
  },

  watch: {
    connections(val, prev) {
      // TODO: trigger and test it
    }
  }
};
</script>

<style scoped>
#type-of-connection-chartjs {
  background-color: white;
}
</style>