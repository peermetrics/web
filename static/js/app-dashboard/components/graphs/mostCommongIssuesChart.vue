<template>
  <div class="chart">
    <NoDataMessage v-if="seriesData.length===0 " />
    <div v-else class="row">
      <div id="most-common-issues" class="col-10"></div>
    </div>

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
    NoDataMessage,
    ConferenceListModal
  },
  mixins: [createColumnChart],
  data() {
    return {
      chartId: "most-common-issues",
      titleYAxis: "No. of issues",
      type: 'bar',
      modalConferences: []
    };
  },
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
                  // if we have at least one issue with this code
                  return conf.issues.some((issue) => issue.code === event.point.issueCode)
                })

                this.modalConferences = conferences;
                this.$refs["conferencesModal"].show();
              },
            },
          },
        },
      }
    },

    errorCodes() {
      return this.issues.map((issue) => {
        return issue.code
      })
    },
    sortedCodes() {
      return peermetrics.utils.reduce(this.errorCodes)
    },
    categories() {
      const issues = {}
      this.issues.forEach((issue) => {
        issues[issue.code] = issue
      })
      return Object.keys(this.sortedCodes).map((key) => {
        return issues[key].title
      })
    },
    seriesData() {
      return Object.keys(this.sortedCodes).map((key) => {
        return {
          y: this.sortedCodes[key],
          issueCode: key
        }
      })
      // sort them in ascending order
      .sort((first, second) => second.y - first.y)
    },
    series() {
      return [
        {
          name: "Issues",
          data: this.seriesData,
          maxPointWidth: 50,
          color: peermetrics.colors.info
        }
      ];
    },
  },

  watch: {
    issues(val, prev) {
      this.dataWatcher(val, prev)
    }
  }
};
</script>