<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.series.length===0" />
    <div v-else id="type-of-connection-chart"></div>
  </div>
</template>

<script>
import createPieChart from "../mixins/createPieChart";
import NoDataMessage from "../../../components/noDataMessage.vue";

export default {
  name: "connection-type-chart",

  props: {
    connections: {
      type: Array,
      required: true
    }
  },

  components: {
    NoDataMessage
  },

  data() {
    return {
      colors: ["rgb(124,181,236)", "rgb(228,211,84)"],
      chartId: "type-of-connection-chart",
      seriesName: "Connection Types",
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: ' +
        "<b>{point.y:.2f}%</b><br/>Count:<b>{point.count}</b></br>"
    };
  },

  mixins: [createPieChart],

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
        series.push({
          name: 'Direct',
          y: (grouping['direct'] / connectionsCount) * 100,
          count: grouping['direct']
        }, {
          name: 'Relayed',
          y: (grouping['relayed'] / connectionsCount) * 100,
          count: grouping['relayed']
        })
      }

      return {
        series,
        drilldown: null
      };
    }
  },

  watch: {
    connections(val, prev) {
      this.dataWatcher(val, prev)
    }
  }
};
</script>