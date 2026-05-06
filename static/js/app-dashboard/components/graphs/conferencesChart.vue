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
        out[row.date] = row;
      });
      return out;
    },

    seriesData() {
      // Rolling window in the browser's local calendar (used for the default axis).
      const windowIso = [];
      const day = moment();
      for (let i = 0; i <= peermetrics.daysHistory; i++) {
        windowIso.push(day.format("YYYY-MM-DD"));
        day.subtract(1, "days");
      }
      windowIso.reverse();

      // The API groups with TruncDate in the server/DB timezone; that calendar day
      // can fall one day earlier/later than the browser-built list. Merge every
      // date returned by the summary so bar totals match other charts (e.g. duration).
      const fromApi = this.summary.map((row) => row.date).filter(Boolean);
      const isoDates = [...new Set([...windowIso, ...fromApi])].sort();

      const displayDates = isoDates.map((iso) => moment(iso).format("MM/DD"));

      const succSeriesData = [];
      const warnSeriesData = [];
      const errSeriesData = [];
      const ongSeriesData = [];

      isoDates.forEach((iso) => {
        const row = this.summaryByDate[iso];
        succSeriesData.push(row ? row.success : 0);
        warnSeriesData.push(row ? row.warning : 0);
        errSeriesData.push(row ? row.error : 0);
        ongSeriesData.push(row ? row.ongoing : 0);
      });

      return {
        dates: displayDates,
        isoDates,
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

      // Resolve the clicked bar to its full ISO date via the parallel array
      // built in seriesData. Using the label index avoids the year-boundary
      // bug where "12/31" in early January would otherwise resolve to the
      // current year instead of the previous year.
      const idx =
        typeof e.index === "number"
          ? e.index
          : this.seriesData.dates.indexOf(e.xValue);
      if (idx === -1) return;
      const isoDate = this.seriesData.isoDates[idx];
      const day = moment(isoDate);
      const dayStart = day.clone().startOf("day").toISOString();
      const dayEnd = day.clone().endOf("day").toISOString();

      try {
        this.modalConferences = await this.fetchAllConferencesForDay(dayStart, dayEnd, statusKey);
      } catch (err) {
        console.warn(err);
        this.modalConferences = [];
      }

      this.$refs["conferencesModal"].show();
    },

    async fetchAllConferencesForDay(dayStart, dayEnd, statusKey) {
      // Paginate through every conference for the day so the modal count
      // matches the chart bar on high-volume days (API list max limit is 200).
      const PAGE_SIZE = 200;
      const out = [];
      let offset = 0;
      let total = Infinity;

      while (offset < total) {
        const res = await peermetrics.get(peermetrics.urls.conferences(), {
          appId: peermetrics.app.id,
          created_at_gte: dayStart,
          created_at_lte: dayEnd,
          limit: PAGE_SIZE,
          offset,
        });
        const page = res.results || [];
        total = typeof res.count === "number" ? res.count : page.length;
        out.push(...this.filterByStatus(page, statusKey));
        if (page.length === 0) break;
        offset += page.length;
      }
      return out;
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
