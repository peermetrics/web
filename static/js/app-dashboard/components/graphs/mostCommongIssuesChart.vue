<template>
  <div class="chart">
    <Loader v-if="loading" />
    <NoDataMessage v-else-if="summary.length === 0" />

    <bar-chart
        v-else
        id="most-common-issues-chartjs"
        :labels="categories"
        :datasets="series"
        :datalabels="false"
        xTitle="No. of issues"
        @chart-click="onChartClick"
        horizontal
        y-grid
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
  name: "most-common-issues-chart",
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
      return this.summary.map((row) => row.title || row.code);
    },
    series() {
      return [
        {
          label: "Issues",
          data: this.summary.map((row) => row.count),
          backgroundColor: peermetrics.colors.info,
          barThickness: 20,
        },
      ];
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
        const res = await peermetrics.get(peermetrics.urls.issuesSummary, {
          appId: peermetrics.app.id,
          created_at_gte: since.toISOString(),
        });
        this.summary = Object.freeze(res.data || []);
      } catch (e) {
        console.warn(e);
        this.summary = [];
      }
      this.loading = false;
    },

    async onChartClick(e) {
      const row = this.summary[e.index];
      if (!row) return;

      try {
        this.modalConferences = await this.fetchConferencesForIssue(row.code);
      } catch (err) {
        console.warn(err);
        this.modalConferences = [];
      }
      this.$refs["conferencesModal"].show();
    },

    async fetchConferencesForIssue(issueCode) {
      const since = new Date();
      since.setDate(since.getDate() - peermetrics.daysHistory);

      const PAGE_SIZE = 200;
      const out = [];
      let offset = 0;
      let total = Infinity;

      while (offset < total) {
        const res = await peermetrics.get(peermetrics.urls.conferences(), {
          appId: peermetrics.app.id,
          created_at_gte: since.toISOString(),
          issue_code: issueCode,
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
#most-common-issues-chartjs {
  max-height: 280px;
  background-color: white;
}
</style>
