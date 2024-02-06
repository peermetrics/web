<template>
  <div class="chart">
    <NoDataMessage v-if="seriesData.length < 1" />
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
import BarChart from "./barChart.vue";

export default {
  name: "conference-duration-chart",
  props: {
    conferences: {
      type: Array,
      required: true
    },
  },
  components: {
    BarChart,
    NoDataMessage,
    ConferenceListModal,
  },

  data() {
    return {
      modalConferences: [],
    };
  },

  computed: {
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
        return {
          data: this.durations.map((n) => n.number),
          values: this.durations.map((n) => new Set(n.data))
        };
      } else {
        return [];
      }
    },
    series() {
      return [
        {
          label: "Conferences",
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
  }
};
</script>

<style lang="scss" scoped>
#conference-duration-chartjs {
  max-height: 280px;
  background-color: white;
}
</style>