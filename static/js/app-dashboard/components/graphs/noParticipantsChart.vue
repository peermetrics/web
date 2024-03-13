<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.length===0" />
    <pie-chart
        v-else
        id="number-of-participants-chartjs"
        tooltipTitle="Number of participants"
        :datasets="dataSeries"
    />
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import PieChart from "../../../components/pieChart.vue";

export default {
  name: "participants-chart",
  props: {
    conferences: {
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

      return series;
    }
  }
};
</script>

<style scoped>
#number-of-participants-chartjs {
  background-color: white;
}
</style>