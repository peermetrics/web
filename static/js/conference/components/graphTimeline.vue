<template>
  <div class="row">
    <div class="col">
      <div
        v-for="participant in selectedParticipants"
        :key="participant.id"
        class="mt-2"
      >
        <span>{{ participant.name }}</span>
        <TimelineBar
          :events="participantTimelineBarEvents(participant.id)"
          :startTime="startTime"
          :endTime="endTime"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TimelineBar from "../../components/timelineBar.vue";
import timelineBarEvents, {
  filteringEventsForParticipantGraphs,
  unionSameTypeOfEvents,
} from "../utils/timelineBarFilterEvents";

export default {
  name: "GraphTimeline",
  components: {
    TimelineBar,
  },
  props: {
    participantId: {
      required: true,
      type: String,
    },
    participants: {
      required: true,
      validator: (value) => {
        return Array.isArray(value) || peermetrics.utils.isNull(value);
      },
    },
    events: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    }
  },
  computed: {
    selectedParticipants() {
      if (!this.participants) return [];

      return this.participants.filter(({ id }) => {
        return (
          this.participantId === "all" ||
          id === this.participantId
        );
      });
    },
    startTime() {
      return this.events ? this.events.conferenceTimeEdges.startTime : 0
    },
    endTime() {
      return this.events ? this.events.conferenceTimeEdges.endTime : 0
    },
  },
  methods: {
    participantTimelineBarEvents(participantId) {
      return timelineBarEvents({
        processedEvents: this.events ? this.events.events : [],
        participantId,
        processingBeforeFiltering: filteringEventsForParticipantGraphs,
        processingAfterFiltering: unionSameTypeOfEvents,
      });
    },
  },
};
</script>

<style>
</style>