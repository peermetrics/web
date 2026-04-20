<template>
  <div class="chart">
    <Loader v-if="loading" />
    <NoDataMessage v-else-if="dataSeries.length === 0" />
    <pie-chart
        v-else
        id="type-of-connection-chartjs"
        tooltipTitle="Connection Types"
        :datasets="dataSeries"
    />
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import PieChart from "../../../components/pieChart.vue";
import Loader from "../../../components/loader.vue";

export default {
  name: "connection-type-chart",

  components: {
    NoDataMessage,
    PieChart,
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
      const total = this.summary.reduce((sum, row) => sum + (row.count || 0), 0);
      if (!total) return [];
      return this.summary.map((row) => ({
        name: row.name,
        y: (row.count / total) * 100,
        count: row.count,
      }));
    }
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
        const res = await peermetrics.get(peermetrics.urls.connectionsSummary, {
          appId: peermetrics.app.id,
          created_at_gte: since.toISOString(),
        });
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
#type-of-connection-chartjs {
  background-color: white;
}
</style>
