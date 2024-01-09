<template>
  <div class="chart">
    <NoDataMessage v-if="seriesData.length < 1" />
    <div v-else id="conference-duration-chart"></div>

    <conference-list-modal
      ref="conferencesModal"
      :conferences="modalConferences"
    ></conference-list-modal>
  </div>
</template>

<script>
import createColumnChart from "../mixins/createColumnChart";
import NoDataMessage from "../../../components/noDataMessage.vue";
import ConferenceListModal from "../../../components/conferenceListModal.vue";

export default {
  name: "conference-duration-chart",
  props: {
    conferences: {
      type: Array,
      required: true
    },
  },
  components: {
    NoDataMessage,
    ConferenceListModal,
  },

  mixins: [createColumnChart],

  data() {
    return {
      chartId: "conference-duration-chart",
      titleYAxis: "No. of conferences",
      modalConferences: [],
    };
  },
  mounted() {},

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
                const conferences = this.conferences.filter((conf) => {
                  // if the conf id is inside data
                  return event.point.data.has(conf.id)
                })

                this.modalConferences = conferences;
                this.$refs["conferencesModal"].show();
              },
            },
          },
        },
      }
    },

    durations() {
      // create an array with all the conf durations
      let confDurations = this.conferences.map((conference) => {
        return {
          value: conference.duration / 60,
          data: conference.id
        }
      });

      return peermetrics.utils.groupDurations(
        confDurations,
        peermetrics.globals.durationInterval
      );
    },
    categories() {
      return this.durations.map(n => n.title);
    },
    seriesData() {
      const durations = this.durations.reduce((accumulator, currentValue) => accumulator + currentValue.number, 0)

      if (durations) {
        return this.durations.map((n) => {
          return {
            y: n.number,
            // create a unique list of conf ids
            data: new Set(n.data)
          }
        });
      } else {
        return [];
      }
    },
    series() {
      return [
        {
          name: "Conferences",
          data: this.seriesData,
          color: peermetrics.colors.info
        }
      ];
    }
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