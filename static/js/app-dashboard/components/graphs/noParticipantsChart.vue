<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.series.length===0" />
    <div v-else id="number-of-participants-chart"></div>
  </div>
</template>

<script>
import createPieChart from "../mixins/createPieChart";
import NoDataMessage from "../../../components/noDataMessage.vue";

export default {
  name: "participants-chart",
  props: {
    conferences: {
      type: Array,
      required: true
    }
  },
  components: {
    NoDataMessage
  },
  data() {
    return {
      chartId: "number-of-participants-chart",
      seriesName: "Number of participants",
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: ' +
        "<b>{point.y:.2f}%</b><br/>Count:<b>{point.count}</b></br>"
    };
  },
  mixins: [createPieChart],
  mounted() {},
  computed: {
    dataSeries() {
      let arr = this.conferences.map(conf => {
        return conf.participants.length;
      });
      let participants = peermetrics.utils.reduce(arr);
      let conferencesCount = this.conferences.length;
      let series = [];

      for (let key of Object.keys(participants)) {
        series.push({
          name: key,
          y: (participants[key] / conferencesCount) * 100,
          count: participants[key]
        });
      }

      return {
        series,
        drilldown: null
      };
    }
  },

  watch: {
    conferences(val, prev) {
      this.dataWatcher(val, prev)
    }
  }
};
</script>