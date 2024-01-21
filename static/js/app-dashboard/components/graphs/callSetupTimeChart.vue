<template>
  <div class="chart">
    <NoDataMessage v-if="seriesData.length === 0" />
    <bar-chart
        v-else
        id="call-setup-time-chartjs"
        :labels="categories"
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
import BarChart from "./barChart.vue";

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
    BarChart,
    NoDataMessage,
    ConferenceListModal,
  },
  data() {
    return {
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

  computed: {
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
        return {
          data: this.durations.map((n) => n.number),
          values: this.durations.map((n) => new Set(n.data))
        }
      }

      return []
    },
    series() {
      return [
        {
          label: "Connections",
          data: this.seriesData.data,
          backgroundColor: peermetrics.colors.info,
          values: this.seriesData.values
        }
      ];
    }
  },

  methods: {
    onChartClick(e) {
      this.modalConferences = this.conferences.filter((conf) => {
        return this.seriesData.values[e.index].has(conf.id)
      });

      this.$refs["conferencesModal"].show();
    }
  },

  watch: {
    connections(val, prev) {
      // Question: how to trigger this watcher
    }
  }
};
</script>
<style lang="scss" scoped>
#call-setup-time-chartjs {
  max-height: 280px;
  background-color: white;
}
</style>