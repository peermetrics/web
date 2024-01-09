<template>
  <div class="accordion" id="accordion">
    <loader
      v-if="
        participants === null ||
        events === null ||
        connections === null ||
        processedEvents === null
      "
    />
    <div
      v-else
      v-for="participant in nonSFUParticipants"
      :key="participant.id"
      class="card mb-0"
    >
      <div class="card-header p-0">
        <h5 class="mb-0">
          <div class="container h-75px">
            <div class="row align-items-center h-75px">
              <button
                class="btn btn-link btn-block text-left col-2 no-outline"
                type="button"
                aria-expanded="false"
                aria-controls="collapseOne"
                @click="toggleTab(participant.id)"
              >
                <i
                  :class="
                    isOpenedTab(participant.id)
                      ? 'icon-chevron-down'
                      : 'icon-chevron-right'
                  "
                ></i>
                {{ participantName(participant.id) }}
              </button>
              <div class="col-10">
                <TimelineBar
                  isMain
                  skip_validate_clicked_events
                  :events="participantTimelineBarEvents(participant.id)"
                  :startTime="
                    processedEvents
                      ? processedEvents.conferenceTimeEdges.startTime
                      : 0
                  "
                  :endTime="
                    processedEvents
                      ? processedEvents.conferenceTimeEdges.endTime
                      : 0
                  "
                  @onDrilldownEvent="showEventDatails(participant.id, $event)"
                />
              </div>
            </div>
          </div>
        </h5>

        <div
          v-if="participantMediaAccessContent[participant.id]"
          class="row mt-0"
        >
          <div class="col-12">
            <pre
              v-for="mediaAccessContent in participantMediaAccessContent[
                participant.id
              ]"
              :key="mediaAccessContent.id"
              class="timeline-event-preview"
            ><span v-html="stringified(mediaAccessContent.message)" /></pre>
          </div>
        </div>
      </div>

      <div
        :id="'collapse' + participant.id"
        :class="['collapse', { show: isOpenedTab(participant.id) }]"
      >
        <div v-if="getConnections(participant.id).length">
          <div
            v-for="[connectionId, peerId] in getConnections(participant.id)"
            :key="`${connectionId}${peerId}`"
            class="card-body"
          >
            <div class="row m-0">
              <div class="col-2">
                <span class="pl-4 participant-name">{{ participantName(peerId) }}</span>
              </div>
              <div class="col-10">
                <TimelineBar
                  :events="
                    peerTimelineBarEvents(participant.id, connectionId, peerId)
                  "
                  :startTime="
                    processedEvents
                      ? processedEvents.conferenceTimeEdges.startTime
                      : 0
                  "
                  :endTime="
                    processedEvents
                      ? processedEvents.conferenceTimeEdges.endTime
                      : 0
                  "
                  @onDrilldownEvent="
                    toggleDrilldown(
                      participant.id,
                      connectionId,
                      peerId,
                      $event
                    )
                  "
                />
              </div>
            </div>
            <div
              v-for="eventId in drilldownOpened[
                `${participant.id}-${connectionId}-${peerId}`
              ]"
              :key="`${participant.id}-${connectionId}-${peerId}-${eventId}`"
            >
              <div class="row m-0 mt-2">
                <div class="col-10 offset-md-2">
                  <span>{{
                    insideEventsTitle[
                      `${participant.id}-${connectionId}-${peerId}-${eventId}`
                    ]
                  }}</span>
                </div>
              </div>
              <div class="row m-0">
                <div class="col-10 offset-md-2">
                  <TimelineBar
                    skip_validate_clicked_events
                    :events="
                      insideEvents[
                        `${participant.id}-${connectionId}-${peerId}-${eventId}`
                      ]
                    "
                    :startTime="
                      drilldownEventsStartTime(
                        insideEvents[
                          `${participant.id}-${connectionId}-${peerId}-${eventId}`
                        ]
                      )
                    "
                    :endTime="
                      drildownEventsEndTime(
                        insideEvents[
                          `${participant.id}-${connectionId}-${peerId}-${eventId}`
                        ]
                      )
                    "
                    @onDrilldownEvent="
                      toggleSubDrilldown(
                        participant.id,
                        connectionId,
                        peerId,
                        eventId,
                        $event
                      )
                    "
                  />
                </div>
                <div
                  v-if="
                    subDrilldownOpened[
                      `${participant.id}-${connectionId}-${peerId}-${eventId}`
                    ]
                  "
                  class="col-10 mt-4 p-1 offset-md-2"
                >
                  <pre
                    class="timeline-event-preview"
                  ><span v-html="stringified(subDrilldownOpened[
                        `${participant.id}-${connectionId}-${peerId}-${eventId}`
                      ].message)"></span></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <span class="spacing">This participant had no connections</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../../components/loader.vue";
import TimelineBar from "../../components/timelineBar.vue";

export default {
  name: "participants-accordion",
  props: {
    connections: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    },
    participants: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    },
    events: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    },
    processedEvents: {
      required: true,
      validator: (value) => {
        return typeof value === "object";
      },
    },
  },
  components: {
    Loader,
    TimelineBar,
  },
  data() {
    return {
      peerNames: [],
      openedTab: [],
      drilldownOpened: {},
      insideEvents: {},
      insideEventsEdges: {},
      insideEventsTitle: {},
      subDrilldownOpened: {},
      participantMediaAccessContent: {},
    };
  },

  computed: {
    nonSFUParticipants() {
      if (this.participants) {
        return this.participants.filter(({ is_sfu }) => !is_sfu);
      }

      return [];
    },
  },
  methods: {
    isOpenedTab(participantId) {
      return this.openedTab.includes(participantId);
    },
    participantName(participantId) {
      const found = this.participants.find(({ id }) => id === participantId);
      const hasName = found ? Boolean(found.name) : false;

      if (hasName) {
        return found.name;
      }

      return participantId;
    },

    /**
     * Used to get all connections for a participant
     * @param  {Object} participant
     * @return {Array}
     */
    getConnections(participantId) {
      const result = [];
      this.processedEvents?.events
        ?.filter(({ participant }) => participant === participantId)
        ?.forEach(({ connection, peer }) => {
          const newItem = `${connection}:${peer}`;
          const newItemIndex = result.findIndex(
            (item) => item.join(":") === newItem
          );

          if (newItemIndex === -1 && connection && peer) {
            result.push([connection, peer]);
          }
        });

      result.sort((item1, item2) => {
        if (item1[1] < item2[1]) {
          return -1;
        }

        if (item1[1] > item2[1]) {
          return 1;
        }

        return 0;
      });

      return result;
    },
    toggleTab(participantId) {
      if (this.openedTab.includes(participantId)) {
        this.openedTab = this.openedTab.filter((id) => id !== participantId);
      } else {
        this.openedTab.push(participantId);
      }
    },
    participantTimelineBarEvents(participantId) {
      return this.processedEvents?.events?.filter(
        (event) =>
          event.participant === participantId &&
          ["page_presence", "getUserMedia", "custom"].includes(event.event_type)
      );
    },
    peerTimelineBarEvents(participantId, connectionId, peerId) {
      return this.processedEvents?.events?.filter(
        (event) =>
          event.participant === participantId &&
          event.peer === peerId &&
          event.connection === connectionId
      );
    },
    showEventDatails(participantId, customEventId) {
      const events = this.participantTimelineBarEvents(participantId);
      const event = events.find(({ id }) => id === customEventId);

      if (event && event.event_type === "getUserMedia") {
        const key = participantId;
        let data;

        if (Array.isArray(this.participantMediaAccessContent[key])) {
          const isInArray = this.participantMediaAccessContent[key].some(
            ({ id }) => id === customEventId
          );

          if (isInArray) {
            data = this.participantMediaAccessContent[key].filter(
              ({ id }) => id !== customEventId
            );
          } else {
            data = [
              ...this.participantMediaAccessContent[key],
              { id: event.id, message: event.message },
            ];
          }
        } else {
          data = [{ id: event.id, message: event.message }];
        }

        this.$set(this.participantMediaAccessContent, key, data);
      }
    },
    toggleDrilldown(participantId, connectionId, peerId, customEventId) {
      const key = `${participantId}-${connectionId}-${peerId}`;

      if (this.drilldownOpened[key]?.includes(customEventId)) {
        const eventIdIndex = this.drilldownOpened[key].findIndex(
          (id) => id === customEventId
        );
        this.drilldownOpened[key].splice(eventIdIndex, 1);
      } else {
        const insideEventId = `${participantId}-${connectionId}-${peerId}-${customEventId}`;
        const customEvent = this.processedEvents?.events?.find(
          ({ id }) => id === customEventId
        );

        const start_time = new Date(customEvent?.start_time ?? 0).getTime();
        const end_time = new Date(customEvent?.end_time ?? 0).getTime();

        this.insideEventsEdges[insideEventId] = [start_time, end_time];

        const eventTitle = (customEvent?.event_type ?? "")
          .split("_")
          .map((word) => word?.charAt?.(0)?.toUpperCase() + word?.slice(1))
          .join(" ");
        this.insideEventsTitle[
          insideEventId
        ] = `${eventTitle} - ${peermetrics.utils.msToHMS(
          Math.abs(end_time - start_time)
        )}`;

        this.insideEvents[insideEventId] = this.events
          ?.filter((event) => {
            return (
              event.type !== "getUserMedia" &&
              event.connection === connectionId &&
              event.participant === participantId &&
              start_time <= new Date(event?.created_at ?? 0).getTime() &&
              end_time >= new Date(event?.created_at ?? 0).getTime()
            );
          })
          .map((event) => {
            event.event_type = event.type;
            event.timestamp = event.created_at;
            event.color = peermetrics.utils.getColorForEventType(
              event.event_type
            );

            let message = `${event.event_type}`;
            if (typeof event.data === "string") {
              message += `<br>${event.data}`;
            }
            event.message = {
              customTitle: message,
            };
            return event;
          });

        const value = [...(this.drilldownOpened[key] ?? []), customEventId];
        this.$set(this.drilldownOpened, key, value);
      }
    },
    drilldownEventsStartTime(events) {
      if (events.length === 0) return 0;
      return new Date(events[0].timestamp).getTime();
    },
    drildownEventsEndTime(events) {
      if (events.length === 0) return 0;
      return new Date(events.concat().reverse()[0].timestamp).getTime();
    },
    toggleSubDrilldown(
      participantId,
      connectionId,
      peerId,
      eventId,
      customEventId
    ) {
      const key = `${participantId}-${connectionId}-${peerId}-${eventId}`;
      let data;

      if (
        this.subDrilldownOpened[key] &&
        this.subDrilldownOpened[key].id === customEventId
      ) {
        data = null;
      } else {
        data = { id: customEventId };
        const customEvent = this.events.find(({ id }) => id === customEventId);
        const isNonEmptyObject =
          Object.keys(customEvent?.data ?? {}).length > 0;

        if (isNonEmptyObject) {
          data["message"] = customEvent.data;
        } else {
          data = null;
        }
      }

      this.$set(this.subDrilldownOpened, key, data);
    },
    stringified(message) {
      const stringifiedMessgae = JSON.stringify(message, undefined, 4);

      const json = stringifiedMessgae
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
          let cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.h-75px {
  height: 75px;
}

.card-header .btn[aria-expanded="true"] .icon-chevron-right:before {
  transition: all 0.4s ease;
  transform: rotateZ(90deg);
}
.card-header .btn[aria-expanded="false"] .icon-chevron-right:before {
  transition: all 0.4s ease;
}
.no-outline:focus {
  outline: none !important;
  box-shadow: none !important;
}
.spacing {
  display: block;
  padding: 1rem 1.5rem;
}

.card-body {
  padding-left: 0;
  padding-right: 0;
}
</style>

<style lang="css">
.timeline-event-preview {
  max-height: 400px;
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}

.participant-name {
  font-size: 14px;
}

.string {
  color: green;
}
.number {
  color: darkorange;
}
.boolean {
  color: blue;
}
.null {
  color: magenta;
}
.key {
  color: red;
}
</style>
