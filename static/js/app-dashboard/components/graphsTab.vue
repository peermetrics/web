<template>
  <div>
    <div class="row mt-3">
      <div class="col">
        <p class="lead">Conferences</p>
        <Loader v-if="conferences == null" />
        <conferences-chart v-else :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Most common issues</p>
        <Loader v-if="(issues == null || conferences == null)" />
        <most-common-issues-chart v-else :issues="issues" :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Errors getting access to media</p>
        <Loader v-if="issues == null" />
        <gum-chart v-else :issues="gumIssues" />
      </div>
      <div class="col">
        <p class="lead">Relayed connections</p>
        <Loader v-if="connections == null" />
        <connection-type-chart v-else :connections="connections" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Conference duration</p>
        <Loader v-if="conferences == null" />
        <conference-duration-chart
          v-else
          :conferences="conferences"
        />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Connection setup time</p>
        <Loader v-if="(connections == null || conferences == null)" />
        <call-setup-time-chart v-else :connections="connections" :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Number of participants</p>
        <Loader v-if="conferences == null" />
        <no-participants-chart v-else :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Browsers</p>
        <Loader v-if="sessions == null" />
        <browsers-chart v-else :sessions="sessions" />
      </div>
      <div class="col">
        <p class="lead">Operating systems</p>
        <Loader v-if="sessions == null" />
        <o-s-chart v-else :sessions="sessions" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Map</p>
        <Loader v-if="sessions == null" />
        <map-chart v-else :sessions="sessions" />
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
    Loader
  },
  props: {
    conferences: {
      required: true,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    sessions: {
      required: false,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    connections: {
      required: false,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    issues: {
      required: false,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
  },
  computed: {
    gumIssues() {
      if (this.issues) {
        return this.issues.filter((issue) => {
          return issue.code === 'getusermedia_error'
        })
      }

      return []
    }
  }
};
</script>

<style lang="scss" scoped>
.card-body {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
