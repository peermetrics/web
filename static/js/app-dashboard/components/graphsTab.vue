<template>
  <div>
    <div class="row mt-3">
      <div class="col">
        <p class="lead">Conferences</p>
        <conferences-chart />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Most common issues</p>
        <most-common-issues-chart />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Errors getting access to media</p>
        <gum-chart />
      </div>
      <div class="col">
        <p class="lead">Relayed connections</p>
        <connection-type-chart />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Conference duration</p>
        <conference-duration-chart />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Connection setup time</p>
        <call-setup-time-chart />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Number of participants</p>
        <no-participants-chart />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Browsers</p>
        <Loader v-if="loadingSessions" />
        <browsers-chart v-else :browsers="sessionsSummary.browsers || []" />
      </div>
      <div class="col">
        <p class="lead">Operating systems</p>
        <Loader v-if="loadingSessions" />
        <o-s-chart v-else :os="sessionsSummary.os || []" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Map</p>
        <Loader v-if="loadingSessions" />
        <map-chart v-else :cities="sessionsSummary.cities || []" />
      </div>
    </div>
  </div>
</template>

<script>
import ConferencesChart from "./graphs/conferencesChart.vue";
import GumChart from "./graphs/gumChart.vue";
import ConnectionTypeChart from "./graphs/connectionTypeChart.vue";
import MostCommonIssuesChart from "./graphs/mostCommongIssuesChart.vue";
import CallErrorsChart from "./graphs/callErrorsChart.vue";
import ConferenceDurationChart from "./graphs/conferenceDurationChart.vue";
import CallSetupTimeChart from "./graphs/callSetupTimeChart.vue";
import NoParticipantsChart from "./graphs/noParticipantsChart.vue";

import BrowsersChart from "../../components/browsersChart.vue";
import OSChart from "../../components/osChart.vue";
import MapChart from "../../components/mapChart.vue";
import Loader from "../../components/loader.vue";

export default {
  name: "graphs-tab",
  components: {
    ConferencesChart,
    GumChart,
    MostCommonIssuesChart,
    CallErrorsChart,
    ConnectionTypeChart,
    ConferenceDurationChart,
    CallSetupTimeChart,
    NoParticipantsChart,
    BrowsersChart,
    OSChart,
    MapChart,
    Loader,
  },
  data() {
    return {
      loadingSessions: true,
      sessionsSummary: {},
    };
  },
  async mounted() {
    await this.fetchSessionsSummary();
  },
  methods: {
    async fetchSessionsSummary() {
      this.loadingSessions = true;
      try {
        const since = new Date();
        since.setDate(since.getDate() - peermetrics.daysHistory);
        const res = await peermetrics.get(peermetrics.urls.sessionsSummary, {
          appId: peermetrics.app.id,
          created_at_gte: since.toISOString(),
        });
        this.sessionsSummary = res || {};
      } catch (e) {
        console.warn(e);
        this.sessionsSummary = {};
      }
      this.loadingSessions = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
