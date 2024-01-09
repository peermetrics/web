<template>
  <div class="chart">
    <NoDataMessage v-if="!dataSeries || dataSeries.series.length===0" />
    <div v-else id="call-error-chart"></div>
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";

export default {
  name: "call-errors-chart",
  props: {
    conferences: {
      type: Array,
      required: true
    },
    sessions: {
      type: Array,
      required: false
    }
  },
  components: {
    NoDataMessage
  },
  data() {
    return {
      chartId: "call-error-chart"
    };
  },
  computed: {
    dataSeries() {
      return {
        series: [],
        drilldown: null
      };
    }
  }
};
</script>