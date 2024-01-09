<template>
  <div>
    <div class="row mt-4">
      <FilterDropdown
        filterLabel="Participant"
        :selectedItemLabel="selectedParticipantLabel"
        :items="participants"
        @onChange="setSelectedParticipantId"
      >
        <template #default="{ item }">
          <span>{{ item.name }}</span>
          <br />
          <span class="text-muted">{{ item.id }}</span>
        </template>
      </FilterDropdown>

      <FilterDropdown
        filterLabel="Peer"
        :selectedItemLabel="selectedPeerLabel"
        :items="peers"
        :disabled="isPeerDisabled"
        @onChange="setSelectedPeerId"
      >
        <template #default="{ item }">
          <span>{{ item.name }}</span>
          <br />
          <span class="text-muted">{{ item.id }}</span>
        </template>
      </FilterDropdown>

      <FilterDropdown
        filterLabel="Data"
        :selectedItemLabel="selectedTopicLabel"
        :items="topics"
        :disabled="isTopicDisabled"
        @onChange="setSelectedTopic"
      >
        <template #default="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </FilterDropdown>
    </div>
    <div class="row">
      <FilterDropdown
        filterLabel="Direction"
        :selectedItemLabel="selectedDirectionLabel"
        :items="direction"
        :disabled="isDirectionDisabled"
        @onChange="setSelectedDirection"
      >
        <template #default="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </FilterDropdown>

      <FilterDropdown
        filterLabel="Track"
        :selectedItemLabel="selectedTrackLabel"
        :items="tracks"
        :disabled="isTrackDisabled"
        @onChange="setSelectedTrackId"
      >
        <template #default="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </FilterDropdown>
    </div>
  </div>
</template>

<script>
import FilterDropdown from "../../components/filterDropdown.vue";

const TOPICS = [
  {
    id: "audio",
    name: "Audio",
  },
  {
    id: "video",
    name: "Video",
  },
  {
    id: "connection",
    name: "Connection",
  },
];

const DIRECTIONS = [
  {
    id: "inbound",
    name: "Inbound",
  },
  {
    id: "outbound",
    name: "Outbound",
  },
];

export default {
  name: "GraphsTab",
  components: {
    FilterDropdown,
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
    events: {
      required: true,
      validator: (value) => {
        return Array.isArray(value) || peermetrics.utils.isNull(value);
      },
    },
  },
  data() {
    return {
      selectedParticipantId: "all",
      selectedPeerId: "all",
      selectedTopic: "all",
      selectedDirection: "all",
      selectedTrackId: "all",
    };
  },
  computed: {
    // Participant
    selectedParticipantLabel() {
      if (this.selectedParticipantId === "all") return "All";

      const participant = this.participants.find(({ id }) => {
        return id === this.selectedParticipantId;
      });

      return participant.name;
    },

    // Peer
    peers() {
      if (this.isPeerDisabled) return [];

      const peers = {};
      const participant = this.participants
        ? this.participants.find(
            (participantLocal) =>
              participantLocal.id === this.selectedParticipantId
          )
        : undefined;

      if (typeof participant !== "undefined") {
        this.connections.forEach((connection) => {
          if (connection.participant === participant.id) {
            peers[connection.peer] = {};
          }
        });

        this.participants.map((participantLocal) => {
          if (participantLocal.id in peers) {
            peers[participantLocal.id] = {
              ...participantLocal,
              sessions: null,
            };
          }
        });
      }

      return Object.values(peers);
    },

    selectedPeerLabel() {
      if (this.selectedPeerId === "all") return "All";

      const peer = this.peers.find(({ id }) => {
        return id === this.selectedPeerId;
      });

      return peer.name;
    },

    isPeerDisabled() {
      return this.selectedParticipantId === "all";
    },

    // Topic
    topics() {
      return TOPICS.reduce((accumulator, currentTopic) => {
        if (currentTopic.id === "connection") {
          return [...accumulator, currentTopic];
        }

        const isCurrentTopicDisabled = this.events.filter(
          (event) => {
            const { type, participant, peer, data } = event;
            const participantOperand = participant === this.selectedParticipantId;

            const peerOperand = peer === this.selectedPeerId;

            const dataOperand =
              data?.[currentTopic.id]?.inboud?.length > 0 ||
              data?.[currentTopic.id]?.outbound?.length > 0;

            return (
              type === "stats" &&
              participantOperand &&
              peerOperand &&
              dataOperand
            );
          }
        )?.length === 0;

        return [
          ...accumulator,
          { ...currentTopic, disabled: isCurrentTopicDisabled },
        ];
      }, []);
    },
    selectedTopicLabel() {
      if (this.selectedTopic === "all") return "All";

      return this.topics.find(({ id }) => id === this.selectedTopic).name;
    },

    isTopicDisabled() {
      return (
        this.selectedParticipantId === "all" || this.selectedPeerId === "all"
      );
    },

    direction() {
      return DIRECTIONS;
    },

    selectedDirectionLabel() {
      if (this.selectedDirection === "all") return "All";

      return this.direction.find(({ id }) => id === this.selectedDirection)
        .name;
    },

    isDirectionDisabled() {
      return !["video", "audio"].includes(this.selectedTopic);
    },

    // Track
    tracks() {
      const groupedTracks = {};

      // detect all the events between a participant and a peer
      if (
        this.selectedParticipantId !== "all" &&
        this.selectedPeerId !== "all" &&
        ["audio", "video"].includes(this.selectedTopic) &&
        this.selectedDirection !== "all"
      ) {
        // loop through all of them and get all the tracks
        // TODO: this should take into account connection ID when we'll have that filter
        this.events.forEach(({ participant, peer, data }) => {
          if (
            participant === this.selectedParticipantId &&
            peer === this.selectedPeerId
          ) {
            data[this.selectedTopic][this.selectedDirection].forEach(
              ({ id }) => {
                groupedTracks[id] = { id, name: id };
              }
            );
          }
        });
      }

      return Object.values(groupedTracks);
    },

    selectedTrackLabel() {
      if (this.selectedTrackId === "all") {
        return "All";
      }

      return this.tracks.find(({ id }) => id === this.selectedTrackId).name;
    },

    isTrackDisabled() {
      return (
        this.selectedParticipantId === "all" ||
        this.selectedPeerId === "all" ||
        !["audio", "video"].includes(this.selectedTopic) ||
        this.selectedDirection === "alls"
      );
    },
  },
  methods: {
    /**
     * Set selected participant from filter dropdown
     */
    setSelectedParticipantId(id) {
      this.selectedParticipantId = id;

      // reset other filters
      this.setSelectedPeerId("all");

      this.$emit("onChangeParticipant", id);
    },

    /**
     * Set selected peer from filter dropdown
     */
    setSelectedPeerId(id) {
      this.selectedPeerId = id;

      // reset other filters
      this.setSelectedTopic("all");

      this.$emit("onChangePeer", id);
    },

    /**
     * Set selected topic from filter dropdown
     */
    setSelectedTopic(id) {
      this.selectedTopic = id;

      // reset other filters
      this.setSelectedDirection("all");

      this.$emit("onChangeTopic", id);
    },

    setSelectedDirection(id) {
      this.selectedDirection = id;

      this.setSelectedTrackId("all");

      this.$emit("onChangePosition", id);
    },

    /**
     * Set selected track from filter dropdown
     */
    setSelectedTrackId(id) {
      this.selectedTrackId = id;

      this.$emit("onChangeTrack", id);
    },
  },
};
</script>