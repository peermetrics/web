<template>
  <div class="chart">
    <NoDataMessage v-if="seriesData.length === 0" />
    <div v-else id="call-setup-time-chart"></div>

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
  name: "call-setup-time-chart",
  props: {
    connections: {
      type: Array,
      required: true
    },
    conferences: {
      type: Array,
      required: true
    }
  },
  components: {
    NoDataMessage,
    ConferenceListModal,
  },
  mixins: [createColumnChart],
  data() {
    return {
      chartId: "call-setup-time-chart",
      titleYAxis: "No. of connections",
      durationInverval: [
        {
          title: "< 250 ms",
          min: 0,
          max: 250,
          number: 0,
          data: []
        },
        {
          title: "250 - 500 ms",
          min: 250,
          max: 500,
          number: 0,
          data: []
        },
        {
          title: "500 - 750 ms",
          min: 500,
          max: 750,
          number: 0,
          data: []
        },
        {
          title: "750 - 1000 ms",
          min: 750,
          max: 1000,
          number: 0,
          data: []
        },
        {
          title: "1000 - 1500 ms",
          min: 1000,
          max: 1500,
          number: 0,
          data: []
        },
        {
          title: "1500 - 2000 ms",
          min: 1500,
          max: 2000,
          number: 0,
          data: []
        },
        {
          title: "2000 - 2500 ms",
          min: 2000,
          max: 2500,
          number: 0,
          data: []
        },
        {
          title: "2500 - 3000 ms",
          min: 2500,
          max: 3000,
          number: 0,
          data: []
        },
        {
          title: "3000 - 4000 ms",
          min: 3000,
          max: 4000,
          number: 0,
          data: []
        },
        {
          title: "4000 - 5000 ms",
          min: 4000,
          max: 5000,
          number: 0,
          data: []
        },
        {
          title: "> 5000 ms",
          min: 5000,
          max: Infinity,
          number: 0,
          data: []
        }
      ],
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
      let confSetupDurations = this.connections.map(connection => {
        // take all the negociations
        let negotiations = connection.connection_info['negotiations']
        // if the first one is not a reneociation
        if (negotiations && negotiations[0]) {
          if (negotiations[0].status === 'connected') {
            // return negotiations[0].duration
            return {
              value: new Date(negotiations[0].end_time) - new Date(negotiations[0].start_time),
              data: connection.conference
            }
          }
        }  
      });

      return peermetrics.utils.groupDurations(
        confSetupDurations,
        this.durationInverval
      );
    },
    categories() {
      return this.durations.map(n => n.title);
    },
    seriesData() {
      const hasValues = this.durations.reduce((accumulator, currentValue) => accumulator + currentValue.number, 0)

      if (hasValues) {
        return this.durations.map((n) => {
          return {
            y: n.number,
            // create a unique list of conf ids
            data: new Set(n.data)
          }
        })
      }

      return []
    },
    series() {
      return [
        {
          name: "Connections",
          data: this.seriesData,
          color: peermetrics.colors.info
        }
      ];
    }
  },

  watch: {
    connections(val, prev) {
      this.dataWatcher(val, prev)
    }
  }
};
</script>