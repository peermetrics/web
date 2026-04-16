<template>
  <div class="chart">
    <Loader v-if="loading" />
    <NoDataMessage v-else-if="isEmpty" />
    <bar-chart
        v-else
        id="conferences-chartjs"
        :labels="seriesData.dates"
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
import Loader from "../../../components/loader.vue";
import BarChart from "../../../components/barChart.vue";

const SERIES_TO_STATUS_KEY = {
  Successful: "success",
  Warnings: "warning",
  Errors: "error",
  Ongoing: "ongoing",
};

const STATUS_KEY_TO_API = {
  warning: "warning",
  error: "error",
  ongoing: "ongoing",
  // success is derived — no direct API filter
};

export default {
  name: "conferences-chart",
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
    summaryByDate() {
      const out = {};
      this.summary.forEach((row) => {
        const label = moment(row.date).format("MM/DD");
        out[label] = row;
      });
      return out;
    },

    seriesData() {
      let dates = [];
      let now = moment();
      for (let i = 0; i <= peermetrics.daysHistory; i++) {
        dates.push(now.format("MM/DD"));
        now.subtract(1, "days");
      }
      dates.reverse();

      const succSeriesData = [];
      const warnSeriesData = [];
      const errSeriesData = [];
      const ongSeriesData = [];

      dates.forEach((date) => {
        const row = this.summaryByDate[date];
        succSeriesData.push(row ? row.success : 0);
        warnSeriesData.push(row ? row.warning : 0);
        errSeriesData.push(row ? row.error : 0);
        ongSeriesData.push(row ? row.ongoing : 0);
      });

      return {
        dates,
        succSeriesData,
        warnSeriesData,
        errSeriesData,
        ongSeriesData,
      };
    },

    series() {
      return [
        {
          label: "Successful",
          data: this.seriesData.succSeriesData,
          backgroundColor: peermetrics.colors.default,
        },
        {
          label: "Warnings",
          data: this.seriesData.warnSeriesData,
          backgroundColor: peermetrics.colors.warning,
        },
        {
          label: "Errors",
          data: this.seriesData.errSeriesData,
          backgroundColor: peermetrics.colors.error,
        },
        {
          label: "Ongoing",
          data: this.seriesData.ongSeriesData,
          backgroundColor: peermetrics.colors.info,
        },
      ];
    },

    isEmpty() {
      return this.summary.length === 0;
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
        const res = await peermetrics.get(peermetrics.urls.conferencesSummary, {
          appId: peermetrics.app.id,
          created_at_gte: since.toISOString(),
        });
        // peermetrics.get() auto-unwraps response.data, so res is already the array
        this.summary = Object.freeze(Array.isArray(res) ? res : (res.data || []));
      } catch (e) {
        console.warn(e);
        this.summary = [];
      }
      this.loading = false;
    },

    async onChartClick(e) {
      const statusKey = SERIES_TO_STATUS_KEY[e.label];
      if (!statusKey) return;

      // Fetch only the clicked day's conferences via the paginated list
      const day = moment(e.xValue, "MM/DD").year(moment().year());
      const dayStart = day.clone().startOf("day").toISOString();
      const dayEnd = day.clone().endOf("day").toISOString();

      try {
        const res = await peermetrics.get(peermetrics.urls.conferences(), {
          appId: peermetrics.app.id,
          created_at_gte: dayStart,
          created_at_lte: dayEnd,
          limit: 50,
        });
        const confs = res.results || res || [];
        this.modalConferences = this.filterByStatus(confs, statusKey);
      } catch (err) {
        console.warn(err);
        this.modalConferences = [];
      }

      this.$refs["conferencesModal"].show();
    },

    filterByStatus(conferences, statusKey) {
      return conferences.filter((c) => {
        if (statusKey === "ongoing") return !!c.ongoing;
        if (c.ongoing) return false;
        if (statusKey === "error") return !!c.has_errors;
        if (statusKey === "warning") return !c.has_errors && !!c.has_warnings;
        if (statusKey === "success") return !c.has_errors && !c.has_warnings;
        return false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#conferences-chartjs {
  max-height: 280px;
  background-color: white;
}
</style>
