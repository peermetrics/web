<template>
  <div class="chart">
    <NoDataMessage v-if="seriesData.length===0 " />

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

export default {
  name: "most-common-issues-chart",
  props: {
    issues: {
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
    ConferenceListModal
  },
  data() {
    return {
      modalConferences: []
    };
  },
  computed: {
    errorCodes() {
      return this.issues.map((issue) => {
        return issue.code
      })
    },
    sortedCodes() {
      return peermetrics.utils.reduce(this.errorCodes)
    },
    categories() {
      return this.seriesData.map(s => s.title)
    },
    seriesData() {
      const issues = {}
      this.issues.forEach((issue) => {
        issues[issue.code] = issue
      })

      return Object.keys(this.sortedCodes).map((key) => {
        return {
          y: this.sortedCodes[key],
          issueCode: key,
          title: issues[key]?.title,
        }
      })
      .sort((first, second) => second.y - first.y)
    },
    series() {
      return [
        {
          label: "Issues",
          data: this.seriesData.map(s => s.y),
          backgroundColor: peermetrics.colors.info,
          barThickness: 20,
        }
      ];
    },
  },

  methods: {
    onChartClick(e) {
      this.modalConferences = this.conferences.filter((conf) => {
        return conf.issues.some((issue) => issue.code === this.seriesData.find(s => s.y === e.yValue).issueCode)
      });
      this.$refs["conferencesModal"].show();
    }
  }
};
</script>

<style lang="scss" scoped>
#most-common-issues-chartjs {
  max-height: 280px;
  background-color: white;
}
</style>