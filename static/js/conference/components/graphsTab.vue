<template>
  <Loader v-if="isLoading" />

  <div class="container" v-else>
    <GraphTimelineBar
      :participants="participants"
      :events="processedEvents"
      :participantId="selectedParticipantId"
    />

    <GraphFilters
      :participants="participants"
      :connections="connections"
      :events="eventsWithStats"
      @onChangeParticipant="setSelectedParticipantId"
      @onChangePeer="setSelectedPeerId"
      @onChangeTopic="setSelectedTopic"
      @onChangePosition="setSelectedPosition"
      @onChangeTrack="setSelectedTrackId"
    />

    <Graphs
      :events="eventsWithStats"
      :participantsDetails="participantsDetails"
      :participantId="selectedParticipantId"
      :peerId="selectedPeerId"
      :topic="selectedTopic"
      :trackId="selectedTrackId"
      :position="selectedPosition"
      @onChangePosition="setSelectedPosition"
    />
  </div>
</template>

<script>
import Loader from "../../components/loader.vue";
import GraphFilters from "./graphFilters.vue";
import GraphTimelineBar from "./graphTimeline.vue";
import Graphs from './graphs.vue';

export default {
  name: "GraphsTab",
  components: {
    Loader,
    GraphFilters,
    GraphTimelineBar,
    Graphs,
  },
  props: {
    participants: {
      required: true,
      validator: (value) => {
        return Array.isArray(value) || peermetrics.utils.isNull(value);
      },
    },
    connections: {
      required: true,
      validator: (value) => {
        return Array.isArray(value) || peermetrics.utils.isNull(value);
      },
    },
    eventsWithoutStats: {
      required: true,
      validator: (value) => {
        return Array.isArray(value) || peermetrics.utils.isNull(value);
      },
    },
    eventsWithStats: {
      required: true,
      validator: (value) => {
        return Array.isArray(value) || peermetrics.utils.isNull(value);
      },
    },
    processedEvents: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    },
  },
  created() {
    if (!peermetrics.utils.isNull(this.eventsWithoutStats)) {
      this.events.push(...this.eventsWithoutStats);
    }

    this.appendEventsWithStats();

    if (peermetrics.utils.isNull(this.eventsWithStats)) {
      this.$emit("loadEventsWithStats");
    }
  },
  data() {
    return {
      isLoading: true,
      events: [],

      selectedParticipantId: "all",
      selectedPeerId: "all",
      selectedTopic: "all",
      selectedPosition: "all",
      selectedTrackId: "all",
    };
  },
  computed: {
    participantsDetails() {
      return this.participants.reduce((result, current) => {
        const { id, name } = current;
        result[id] = name;

        return result;
      }, {});
    }
  },
  methods: {
    appendEventsWithStats() {
      if (!peermetrics.utils.isNull(this.eventsWithStats)) {
        this.events.push(...this.eventsWithStats);
        this.isLoading = false;
      }
    },

    setSelectedParticipantId(id) {
      this.selectedParticipantId = id;
    },

    setSelectedPeerId(id) {
      this.selectedPeerId = id;
    },

    setSelectedTopic(id) {
      this.selectedTopic = id;
    },

    setSelectedTrackId(id) {
      this.selectedTrackId = id;
    },

    setSelectedPosition(position) {
      this.selectedPosition = position;
    },
  },
  watch: {
    eventsWithStats() {
      this.appendEventsWithStats();
    },
  },
};
</script>

<style lang="sass">
</style>