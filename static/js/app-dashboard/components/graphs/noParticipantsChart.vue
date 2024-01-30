<template>
  <div class="chart">
    <NoDataMessage v-if="dataSeries.datasets.length===0" />
    <pie-chart
        v-else
        id="number-of-participants-chartjs"
        tooltipTitle="Number of participants"
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
      let datasets = [];
      let labels = [];
      let count = [];

      for (let key of Object.keys(participants)) {
        labels.push(key)
        count.push(participants[key])
        datasets.push((participants[key] / conferencesCount) * 100)
      }

      return {
        labels,
        datasets,
        count
      };
    }
  },

  watch: {
    conferences(val, prev) {
      // TODO: trigger and test it
    }
  }
};
</script>

<style scoped>
#number-of-participants-chartjs {
  background-color: white;
}
</style>