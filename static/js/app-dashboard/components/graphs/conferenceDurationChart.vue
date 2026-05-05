<template>
  <div class="chart">
    <Loader v-if="loading" />
    <NoDataMessage v-else-if="isEmpty" />
    <bar-chart
        v-else
        id="conference-duration-chartjs"
        :labels="categories"
        :datasets="series"
        yTitle="No. of conferences"
        @chart-click="onChartClick"
        x-grid
    />

    <conference-list-modal
      ref="conferencesModal"
      :conferences="modalConferences"
    ></conference-list-modal>
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import ConferenceListModal from "../../../components/conferenceListModal.vue";
import BarChart from "../../../components/barChart.vue";
import Loader from "../../../components/loader.vue";

export default {
  name: "conference-duration-chart",
  components: {
    BarChart,
    NoDataMessage,
    ConferenceListModal,
    Loader,
  },

  data() {
    return {
      loading: true,
      summary: [],
      modalConferences: [],
    };
  },

  computed: {
    categories() {
      return this.summary.map((b) => b.range);
    },
    series() {
      return [
        {
          label: "Conferences",
          data: this.summary.map((b) => b.count),
          backgroundColor: peermetrics.colors.info,
        },
      ];
    },
    isEmpty() {
      return this.summary.every((b) => b.count === 0);
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
        const res = await peermetrics.get(peermetrics.urls.conferencesDurationSummary, {
          appId: peermetrics.app.id,
          created_at_gte: since.toISOString(),
        });
        this.summary = Object.freeze(Array.isArray(res) ? res : (res.data || []));
      } catch (e) {
        console.warn(e);
        this.summary = [];
      }
      this.loading = false;
    },

    async onChartClick(e) {
      const bucket = this.summary[e.index];
      if (!bucket) return;

      try {
        this.modalConferences = await this.fetchAllInBucket(bucket);
      } catch (err) {
        console.warn(err);
        this.modalConferences = [];
      }
      this.$refs["conferencesModal"].show();
    },

    async fetchAllInBucket(bucket) {
      const since = new Date();
      since.setDate(since.getDate() - peermetrics.daysHistory);

      const PAGE_SIZE = 200;
      const out = [];
      let offset = 0;
      let total = Infinity;

      const baseParams = {
        appId: peermetrics.app.id,
        created_at_gte: since.toISOString(),
        duration_gte: bucket.min_sec,
      };
      if (bucket.max_sec !== null && bucket.max_sec !== undefined) {
        baseParams.duration_lt = bucket.max_sec;
      }

      while (offset < total) {
        const res = await peermetrics.get(peermetrics.urls.conferences(), {
          ...baseParams,
          limit: PAGE_SIZE,
          offset,
        });
        const page = res.results || [];
        total = typeof res.count === "number" ? res.count : page.length;
        out.push(...page);
        if (page.length === 0) break;
        offset += page.length;
      }
      return out;
    },
  },
};
</script>

<style lang="scss" scoped>
#conference-duration-chartjs {
  max-height: 280px;
  background-color: white;
}
</style>
