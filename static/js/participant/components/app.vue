<template>
  <div>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          id="conferences-tab"
          data-toggle="tab"
          href="#conferences"
          role="tab"
          aria-controls="conferences"
          aria-selected="true"
        >Conferences</a>
      </li>
      <li v-if="!participant.isSfu" class="nav-item">
        <a
          class="nav-link"
          id="devices-tab"
          data-toggle="tab"
          href="#devices"
          role="tab"
          aria-controls="devices"
          aria-selected="false"
          @click="showDevices = true"
        >Devices</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          id="connections-tab"
          aria-controls="connections"
          aria-selected="false"
          title="Launching soon"
          data-toggle="tooltip" 
          data-placement="right"
          disabled
        >Connection stats</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="conferences"
        role="tabpanel"
        aria-labelledby="conferences-tab"
      >
        <conferences-tab v-bind:conferences="conferences" v-bind:sessions="sessions" :isSfu="participant.isSfu" />
      </div>
      <div class="tab-pane fade" id="devices" role="tabpanel" aria-labelledby="devices-tab">
        <DevicesTab :sessions="sessions" :displayed="showDevices" />
      </div>
      <div class="tab-pane fade" id="connections" role="tabpanel" aria-labelledby="connections-tab">
        <ConnectionsTab />
      </div>
    </div>
  </div>
</template>

<script>
import ConferencesTab from "./conferencesTab.vue";
import ConnectionsTab from "./connectionTab.vue";
import DevicesTab from "./devicesTab.vue";

export default {
  data() {
    return {
      conferences: [],
      sessions: [],
      // TODO: this might not be the best way. we use this flag to detect 
      // when the devices tab is disaplyed so we rerender the leaflet map
      showDevices: false,
      participant: window.peermetrics.participant
    };
  },

  async created() {
    const conferences = await peermetrics.get(peermetrics.urls.conferences(), {
      participantId: peermetrics.participant.id
    }).catch(e => console.log(e));
    if(conferences) {
      conferences.forEach(conference => this.conferences.push(conference));
    }

    const sessions = await peermetrics.get(peermetrics.urls.sessions, {
      participantId: peermetrics.participant.id
    }).catch(e => console.log(e));
    if(sessions) {
      sessions.forEach(session => this.sessions.push(session));
    }

    // TODO: remove this after we've implemented the connections tab
    $('[data-toggle="tooltip"]').tooltip()
  },

  methods: {},

  components: {
    ConferencesTab,
    ConnectionsTab,
    DevicesTab
  }
};
</script>

<style>
.tab-pane {
  padding-top: 30px;
}
</style>
