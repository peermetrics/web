<template>
  <div class="chart">
    <NoDataMessage v-if="isEmpty" />
    <bar-chart
        v-else
        id="conferences-chartjs"
        :labels="seriesData.dates"
        :datasets="series"
        yTitle="No. of conferences"
        @chart-click="onChartClick"
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

import conferencesFunctions from "../../../mixins/conferences";
import BarChart from "./barChart.vue";

export default {
  name: "conferences-chart",
  props: {
    conferences: {
      type: Array,
      required: true,
    },
  },
  components: {
    BarChart,
    NoDataMessage,
    ConferenceListModal
  },
  data() {
    return {
      modalConferences: [],
    };
  },

  mixins: [conferencesFunctions],

  computed: {
    /**
     * Used to group the conferences by day
     * It also looks to see if they have warnings or erros on them
     * receives the list of conferences for a timeframe
     * @return {Object}
     */
    groupedConferences() {
      return this.conferences.reduce(
        (result, conference) => {
          let date = moment(conference.created_at).format("MM/DD");

          let hasWarning = this.hasWarning(conference)
          let hasError = this.hasError(conference)

          if (conference.ongoing === true) {
            (result.ongoing[date] = result.ongoing[date] || []).push(
              conference
            );
          } else if (hasError) {
            (result.error[date] = result.error[date] || []).push(conference);
          } else if (hasWarning) {
            (result.warning[date] = result.warning[date] || []).push(
              conference
            );
          } else {
            (result.success[date] = result.success[date] || []).push(
              conference
            );
          }

          return result;
        },
        {
          success: {},
          warning: {},
          error: {},
          ongoing: {},
        }
      );
    },

    seriesData() {
      let succ = this.groupedConferences.success;
      let warn = this.groupedConferences.warning;
      let err = this.groupedConferences.error;
      let ong = this.groupedConferences.ongoing;

      let dates = [];
      let succSeriesData = [];
      let warnSeriesData = [];
      let errSeriesData = [];
      let ongSeriesData = [];
      let now = moment();

      for (let i = 0; i <= peermetrics.daysHistory; i++) {
        dates.push(now.format("MM/DD"));
        now.subtract(1, "days");
      }
      dates.reverse();

      dates.forEach((date) => {
        let num = succ[date] ? succ[date].length : 0;
        succSeriesData.push(num);
      });

      dates.forEach((date) => {
        let num = warn[date] ? warn[date].length : 0;
        warnSeriesData.push(num);
      });

      dates.forEach((date) => {
        let num = err[date] ? err[date].length : 0;
        errSeriesData.push(num);
      });

      dates.forEach((date) => {
        let num = ong[date] ? ong[date].length : 0;
        ongSeriesData.push(num);
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
          label: "Ongoing",
          data: this.seriesData.ongSeriesData,
          backgroundColor: peermetrics.colors.info,
        },
        {
          label: "Errors",
          data: this.seriesData.errSeriesData,
          backgroundColor: peermetrics.colors.error,
        },
        {
          label: "Warnings",
          data: this.seriesData.warnSeriesData,
          backgroundColor: peermetrics.colors.warning,
        },
        {
          label: "Successful",
          data: this.seriesData.succSeriesData,
          backgroundColor: peermetrics.colors.default,
        },
      ];
    },

    isEmpty() {
      return Object.keys(this.groupedConferences.success).length < 1 &&
          Object.keys(this.groupedConferences.warning).length < 1 &&
          Object.keys(this.groupedConferences.error).length < 1 &&
          Object.keys(this.groupedConferences.ongoing).length < 1;
    },
  },

  methods: {
    onChartClick(e) {
      const seriesNameToKey = {
        Successful: "success",
        Warnings: "warning",
        Errors: "error",
        Ongoing: "ongoing",
      }[e.label];

      this.modalConferences = this.groupedConferences?.[seriesNameToKey]?.[e.xValue] ?? [];
      this.$refs["conferencesModal"].show();
    }
  },

  watch: {
    conferences(val, prev) {
      // Question: how to trigger this watcher
    }
  }
};
</script>

<style lang="scss" scoped>
#conferences-chartjs {
  max-height: 280px;
  background-color: white;
}
</style>
