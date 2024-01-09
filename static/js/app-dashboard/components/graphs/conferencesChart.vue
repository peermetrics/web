<template>
  <div class="chart">
    <NoDataMessage v-if="isEmpty" />
    <div v-else id="conferences-chart"></div>

    <conference-list-modal
      ref="conferencesModal"
      :conferences="modalConferences"
    ></conference-list-modal>
  </div>
</template>

<script>
import NoDataMessage from "../../../components/noDataMessage.vue";
import ConferenceListModal from "../../../components/conferenceListModal.vue";

import createColumnChart from "../mixins/createColumnChart";
import conferencesFunctions from "../../../mixins/conferences";

export default {
  name: "conferences-chart",
  props: {
    conferences: {
      type: Array,
      required: true,
    },
  },
  components: {
    NoDataMessage,
    ConferenceListModal
  },
  data() {
    return {
      chartId: "conferences-chart",
      titleYAxis: "No. of conferences",
      modalConferences: [],
    };
  },

  mixins: [createColumnChart, conferencesFunctions],

  computed: {
    chartOptions() {
      return {
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            stacking: "normal",
          },

          series: {
            cursor: "pointer",
            events: {
              click: (event) => {
                const seriesNameToKey = {
                  successful: "success",
                  warnings: "warning",
                  errors: "error",
                  ongoing: "ongoing",
                }[event?.point?.series?.name?.toLowerCase()];

                const conferences =
                  this.groupedConferences?.[seriesNameToKey]?.[
                    event.point.category
                  ] ?? [];

                this.modalConferences = conferences;
                this.$refs["conferencesModal"].show();
              },
            },
          },
        },
      }
    },

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

    categories() {
      return this.seriesData.dates;
    },

    series() {
      return [
        {
          name: "Ongoing",
          data: this.seriesData.ongSeriesData,
          color: peermetrics.colors.info,
        },
        {
          name: "Errors",
          data: this.seriesData.errSeriesData,
          color: peermetrics.colors.error,
        },
        {
          name: "Warnings",
          data: this.seriesData.warnSeriesData,
          color: peermetrics.colors.warning,
        },
        {
          name: "Successful",
          data: this.seriesData.succSeriesData,
          color: peermetrics.colors.default,
        },
      ];
    },

    isEmpty() {
      if (
        Object.keys(this.groupedConferences.success).length < 1 &&
        Object.keys(this.groupedConferences.warning).length < 1 &&
        Object.keys(this.groupedConferences.error).length < 1 &&
        Object.keys(this.groupedConferences.ongoing).length < 1
      )
        return true;
      else return false;
    },
  },

  watch: {
    conferences(val, prev) {
      this.dataWatcher(val, prev)
    }
  }
};
</script>

<style lang="scss" scoped>
.card-custom-column {
  line-height: 10;
}
</style>
