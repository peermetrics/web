<template>
  <div :key="graphKey">
    <div class="mt-4" v-if="shouldDisplayVideoSection">
      <LineChart
        :title="frameSizeGraphicTitle"
        :data="graphData('frameSize')"
        :hideTooltip="true"
      />
      <LineChart
        :title="framesGraphicTitle"
        :data="graphData('frames')"
        class="mt-4"
      />
      <LineChart
        :title="averageDecodingTimeGraphicTitle"
        yAxis="ms"
        :data="graphData('averageDecodingTime')"
        :customTooltip="toolTipAverage"
        class="mt-4"
      />
    </div>
    <LineChart
      title="Audio eMOS rating"
      :data="graphData('emos')"
      class="mt-4"
    />
    <LineChart
      title="Media throughput"
      :data="graphData('mediaThroughput')"
      :customTooltip="toolTipMediaThroughput"
      class="mt-4"
    />
    <LineChart
      title="Round trip time"
      :data="graphData('rtt')"
      yAxis="ms"
      class="mt-4"
    />
    <LineChart
      title="Packet loss"
      :data="graphData('packetLoss')"
      class="mt-4"
    />
    <LineChart 
      title="Jitter"
      :data="graphData('jitter')"
      class="mt-4" 
    />
  </div>
</template>

<script>
import StatsForLineChart from "./classes/processingStats";
import LineChart from "./lineChart.vue";

let processorStatsForGraph = null;

const FRAME_SIZE_GRAPHIC_TITLE = {
  inbound: 'Incoming video resolution',
  outbound: 'Outgoing video resolution',
};
const FRAMES_GRAPHIC_TITLE = {
  inbound: 'Incoming frames',
  outbound:  'Outgoing frames',
};
const AVERAGE_DECODING_TIME_GRAPHIC_TITLE = {
  inbound: 'Average decoding time',
  outbound: 'Average encoding time',
};

export default {
  name: "Graphs",
  components: {
    LineChart,
  },
  props: {
    events: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    },
    participantsDetails: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    },
    participantId: {
      required: true,
      type: String,
    },
    peerId: {
      required: true,
      type: String,
    },
    trackId: {
      required: true,
      type: String,
    },
    topic: {
      required: true,
      type: String,
    },
    position: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      graphKey: 0,
    };
  },
  computed: {
    frameSizeGraphicTitle() {
      return FRAME_SIZE_GRAPHIC_TITLE[this.position];
    },
    framesGraphicTitle() {
      return  FRAMES_GRAPHIC_TITLE[this.position];
    },
    averageDecodingTimeGraphicTitle() {
      return AVERAGE_DECODING_TIME_GRAPHIC_TITLE[this.position];
    },
    shouldDisplayVideoSection() {
      return this.topic === 'video' && this.position !== 'all';
    }
  },
  methods: {
    graphData(nameOfGraph) {
      if (this.canInitObject()) {
        processorStatsForGraph = new StatsForLineChart({
          events: this.events,
          participantsDetails: this.participantsDetails,
          conferenceId: peermetrics.conference.id,
          participantId: this.participantId,
          peerId: this.peerId,
          trackId: this.trackId,
          topic: this.topic,
          position: this.position,
        });
      }

      if (processorStatsForGraph) {
        return processorStatsForGraph[`${nameOfGraph}Graph`]();
      }

      return [];
    },

    canInitObject() {
      return (
        peermetrics.utils.isNull(processorStatsForGraph) &&
        !peermetrics.utils.isNull(this.events) &&
        !peermetrics.utils.isNull(this.participantsDetails) &&
        this.participantId !== "" &&
        this.peerId !== "" &&
        this.trackId !== "" &&
        this.topic !== "" &&
        this.position !== ""
      );
    },

    setNewValueToAttribute(attribute, value) {
      if (peermetrics.utils.isNull(processorStatsForGraph)) return;

      processorStatsForGraph[attribute] = value;
      this.graphKey++;
    },

    toolTipMediaThroughput(options = {}) {
      const { time, color, seriesName, value } = options;
      return `<small>${time}</small><br/><p><span style="color:${color};">● </span> ${seriesName}: ${peermetrics.utils.formatBytes(
        value
      )}</p>`;
    },

    toolTipAverage(options = {}) {
      const { time, color, seriesName, value } = options;
      return `<small>${time}</small><br/><p><span style="color:${color};">● </span> ${seriesName}: ${value}ms</p>`;
    },
  },
  watch: {
    participantId(value) {
      this.setNewValueToAttribute("participantId", value);
    },
    peerId(value) {
      this.setNewValueToAttribute("peerId", value);
    },
    trackId(value) {
      this.setNewValueToAttribute("trackId", value);
    },
    topic(value) {
      this.setNewValueToAttribute("topic", value);
    },
    position(value) {
      this.setNewValueToAttribute("position", value);
    },
  },
};
</script>

<style>
</style>