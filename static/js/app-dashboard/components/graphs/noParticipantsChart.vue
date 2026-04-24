<template>
  <div class="chart">
    <Loader v-if="loading" />
    <NoDataMessage v-else-if="dataSeries.length === 0" />
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
import Loader from "../../../components/loader.vue";

export default {
  name: "participants-chart",
  components: {
    PieChart,
    NoDataMessage,
    Loader,
  },

  data() {
    return {
      loading: true,
      summary: [],
    };
  },

  computed: {
    dataSeries() {
      const total = this.summary.reduce((sum, row) => sum + (row.conferences || 0), 0);
      if (!total) return [];
      return this.summary.map((row) => ({
        name: String(row.participants),
        y: (row.conferences / total) * 100,
        count: row.conferences,
      }));
    },
  },

  async mounted() {
    await this.fetchSummary();
  },

  methods: {
    async fetchSummary() {
      this.loading = true;
      try {
        const since = new Date();
        since.setDate(since.getDate() - peermetrics.daysHistory);
        const res = await peermetrics.get(
          peermetrics.urls.conferencesParticipantCountSummary,
          {
            appId: peermetrics.app.id,
            created_at_gte: since.toISOString(),
          }
        );
        this.summary = Array.isArray(res) ? res : (res.data || []);
      } catch (e) {
        console.warn(e);
        this.summary = [];
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
#number-of-participants-chartjs {
  background-color: white;
}
</style>
