<template>
  <div>
    <div class="row">
      <div class="col mb-4">
        <h1 :class="['h2', {'text-muted': !conference.name}]">
          {{ conference.name || "No conference name" }}
        </h1>
        <h2 class="h5 less-space">
          <span class="text-muted"> Conference ID: </span>{{ conference.id }}
        </h2>
        <h2 class="h5">
          <span class="text-muted">Conference date:</span> {{ conferenceDate }}
        </h2>
        <h2 class="h5">
          <span class="text-muted">Conference time (UTC):</span>
          {{ conferenceTime }}
        </h2>
        <h2 class="h5">
          <span class="text-muted">Conference duration:</span>
          {{ duration }}
        </h2>
      </div>
    </div>

    <div class="row">
      <div class="col col-md-8">
        <div class="alert alert-danger" v-show="requestError">
          It appears there was an error loading the data. Please refresh the page to try again.
        </div>

        <div class="alert alert-info" v-show="conferenceOngoing">
          The graphs will become available after the conference has finished.
        </div>

        <div class="alert alert-info" v-show="summaryBulding">
          The graphs will become available in a bit. Please return in 1-2 minutes.
        </div>
      </div>
    </div>

    <b-tabs content-class="mt-3">
      <b-tab title="Overview" active>
        <overview-tab
          :connections="connections"
          :participants="participants"
          :processedEvents="processedEvents"
          :events="events"
          :sessions="sessions"
        />
      </b-tab>
      <b-tab title="Graphs" lazy>
        <graphs-tab
          :participants="participants"
          :connections="connections"
          :processedEvents="processedEvents"
          :eventsWithoutStats="events"
          :eventsWithStats="eventsWithStats"
          @loadEventsWithStats="loadEventsWithStats"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import OverviewTab from "./overviewTab.vue";
import GraphsTab from "./graphsTab.vue";
import Loader from "../../components/loader.vue";

function uuid() {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function groupBy(array, field) {
  return array.reduce((result, current) => {
    const fieldValue = current[field];

    if (Array.isArray(result[fieldValue])) {
      result[fieldValue].push(current);
    } else {
      result[fieldValue] = [current];
    }

    return result;
  }, {});
}

export default {
  name: "conference-app",
  components: {
    OverviewTab,
    GraphsTab,
    Loader,
  },

  data() {
    return {
      conference: {
        name: "",
        id: "",
        start_time: "",
        end_time: "",
        duration: "",
      },
      events: null,
      eventsWithStats: null,
      sessions: null,
      participants: null,
      connections: null,
      issues: null,
      peers: null,
      processedEvents: null,
      requestError: false,
      conferenceOngoing: false,
      summaryBulding: false,
    };
  },

  computed: {
    conferenceDate() {
      const conf = this.conference;

      // for some reason, start and close might not be present
      if (!conf.start_time || !conf.end_time) {
        return "-";
      }

      const start = moment(conf.start_time).format("YYYY-MM-DD");
      const finish = moment(conf.end_time).format("YYYY-MM-DD");

      // if it happened in the same day
      if (start === finish) {
        return start;
      } else {
        return `${start} - ${finish}`;
      }
    },

    conferenceTime() {
      const conf = this.conference;

      // check that we have a start time
      if (!conf.start_time) {
        return "-";
      }

      const start = moment(conf.start_time).format("HH:mm:ss");

      if (conf.end_time) {
        const finish = moment(conf.end_time).format("HH:mm:ss");
        return `${start} - ${finish}`;
      } else {
        return `${start} - Ongoing`;
      }
    },

    duration() {
      return this.conference.duration
        ? peermetrics.utils.secondsToHMS(this.conference.duration)
        : "-";
    },
  },

  async created() {
    // https://vuedose.tips/improve-performance-on-large-lists-in-vue-js/
    // use Object.freeze() for performance

    // get conference's info
    peermetrics
      .get(peermetrics.urls.conferences(peermetrics.conference.id))
      .then((conference) => {
        if (conference) {
          const {
            conference_name,
            conference_id,
            conference_info,
            created_at,
            end_time,
            duration,
          } = conference;

          this.$set(this.conference, "id", conference_id);
          this.$set(this.conference, "name", conference_name);
          this.$set(this.conference, "end_time", end_time);
          this.$set(this.conference, "duration", duration);
          this.$set(this.conference, "start_time", created_at);
        }
      })
      .catch((e) => console.warn(e));

    const issuesProm = peermetrics
      .get(peermetrics.urls.issues(), {
        conferenceId: peermetrics.conference.id,
      })
      .catch((e) => {
        console.warn(e);
      });

    // get all events without stats for this conference
    const eventsProm = peermetrics
      .get(peermetrics.urls.conferenceEvents(peermetrics.conference.id), {
        type: "-stats",
      })
      .then((events) => {
        if (events) {
          this.events = Object.freeze(events);
        }
      })
      .catch((e) => console.warn(e));

    const connectionsProm = peermetrics
      .get(peermetrics.urls.connections(), {
        conferenceId: peermetrics.conference.id,
      })
      .then((connections) => {
        if (connections) {
          this.connections = Object.freeze(connections);
        }
      })
      .catch((e) => console.warn(e));

    // get all sessions for this conference
    const sessionsProm = peermetrics
      .get(peermetrics.urls.sessions, {
        conferenceId: peermetrics.conference.id,
      })
      .then((sessions) => {
        if (sessions) {
          return issuesProm.then((issues) => {
            sessions = peermetrics.utils.populateIssues(sessions, issues);

            this.sessions = Object.freeze(sessions);
            const groupedSessions = this.groupSessionsByParticipantID(
              sessions || []
            );

            return groupedSessions;
          });
        }
      })
      .catch((e) => console.warn(e));

    // get all participant for this conference
    const participantsProm = peermetrics
      .get(peermetrics.urls.participants, {
        conferenceId: peermetrics.conference.id,
      })
      .then((participants) => {
        if (participants) {
          sessionsProm.then((groupedSessions) => {
            this.participants = Object.freeze(
              participants.map((participant) => {
                return {
                  ...participant,
                  // rename these attributes
                  participantId: participant.participant_id,
                  name: participant.participant_name,
                  sessions: groupedSessions[participant.id] || [],
                };
              })
            );
          });
        }
      })
      .catch((e) => console.warn(e));

    Promise.allSettled([
      eventsProm,
      sessionsProm,
      connectionsProm,
      participantsProm,
    ]).then(() => {
      this.processingEvents();
    }).catch(() => {
      this.requestError = true
    });
  },

  methods: {
    async loadEventsWithStats () {
      try {
        // get all stats events
        const response = await peermetrics
          .get(peermetrics.urls.conferenceGraph(peermetrics.conference.id))

        if (response.building) {
          this.summaryBulding = true
        } else if (response.ongoing) {
          this.conferenceOngoing = true
        } else if (response.summary) {
          this.eventsWithStats = response.summary.data;
        }
      } catch (e) {
        this.requestError = true
      }
    },

    /**
     * Group data from an array by participant id
     * @param  {Array} sessions
     * @return {Object}
     */
    groupByParticipantID(data) {
      if (!Array.isArray(data)) return {};

      const result = data.reduce((acc, datum) => {
        if (acc[datum.participant]) {
          acc[datum.participant].push(datum);
        } else {
          acc[datum.participant] = [datum];
        }

        return acc;
      }, {});

      return result;
    },

    /**
     * Group sessin by participant id
     * @param  {Array} sessions
     * @return {Object}
     */
    groupSessionsByParticipantID(sessions) {
      return this.groupByParticipantID(sessions);
    },

    processingEvents() {
      const startTime = new Date(this.conference.start_time).toISOString();
      let endTime = this.conference.end_time;
      if (!endTime) {
        endTime = new Date(Math.max(...this.events.map(({ created_at}) => new Date(created_at).getTime())) + 300000).toISOString();
      }
      const processedEvents = {
        conferenceTimeEdges: {
          startTime,
          endTime,
        },
        events: [],
      };

      
      this.participants.forEach((participant) => {
        const pagePresence = this.sessions
          .filter(
            ({ participant: sessionParticipant }) =>
              sessionParticipant === participant.id
          )
          .map(({ created_at: start_time, end_time }) => ({
            id: uuid(),
            event_type: "page_presence",
            message: "page_presence",
            participant: participant.id,
            peer: null,
            start_time,
            end_time,
          }));

        const participantConnections = this.connections.filter(
          (connection) => connection.participant === participant.id
        );
        const participantConnectionsGroupedByPeer = groupBy(
          participantConnections,
          "peer"
        );

        participantConnections.forEach((connection) => {
          const connected = {
            id: uuid(),
            event_type: "connected",
            message: "connected",
            connection: connection.id,
            participant: participant.id,
            peer: connection.peer,
            start_time: connection.start_time,
            end_time: connection.end_time
          };

          processedEvents.events.push(connected);
        });

        Object.values(participantConnectionsGroupedByPeer).forEach(
          (connections) => {
            const sortedParticipantNegotations = connections
              .map(
                ({
                  id,
                  peer,
                  connection_info: { negotiations } = { negotiations: [] },
                }) =>
                  negotiations.map((negotiation) => ({
                    ...negotiation,
                    connection: id,
                    peer,
                  }))
              )
              .flat()
              .sort((negotation1, negotation2) =>
                Math.sign(
                  new Date(negotation1.start_time).getTime() -
                    new Date(negotation2.start_time).getTime()
                )
              );

            const connectingSuccessfully = sortedParticipantNegotations
              .filter(
                ({ type, status }) => type === "initial" && status !== "failed"
              )
              .map(({ connection, peer, start_time, end_time }) => ({
                id: uuid(),
                event_type: "connecting_successfully",
                message: "connecting_successfully",
                participant: participant.id,
                connection,
                peer,
                start_time,
                end_time,
              }));

            const connectingFailed = sortedParticipantNegotations
              .filter(
                ({ type, status }) => type === "initial" && status === "failed"
              )
              .map(({ connection, peer, start_time, end_time }) => ({
                id: uuid(),
                event_type: "connecting_failed",
                message: "connecting_failed",
                participant: participant.id,
                connection,
                peer,
                start_time,
                end_time,
              }));

            const renegotiationSuccessfully = sortedParticipantNegotations
              .filter(
                ({ type, status }) =>
                  type === "renegotiation" && status !== "failed"
              )
              .map(({ connection, peer, start_time, end_time }) => ({
                id: uuid(),
                event_type: "renegotiation_successfully",
                message: "renegotiation_successfully",
                participant: participant.id,
                connection,
                peer,
                start_time,
                end_time,
              }));

            const renegotiationFailed = sortedParticipantNegotations
              .filter(
                ({ type, status }) =>
                  type === "renegotiation" && status === "failed"
              )
              .map(({ connection, peer, start_time, end_time }) => ({
                id: uuid(),
                event_type: "renegotiation_failed",
                message: "renegotiation_failed",
                participant: participant.id,
                connection,
                peer,
                start_time,
                end_time,
              }));

            connections.map((connection) => {
              const customOrGetUserMedia = this.events
                .filter(
                  ({
                    type,
                    participant: eventParticipant,
                  }) =>
                    eventParticipant === participant.id &&
                    ["custom", "getUserMedia"].includes(type)
                )
                .map(({ type: event_type, created_at: timestamp, data }) => ({
                  id: uuid(),
                  message: data,
                  participant: participant.id,
                  peer: null,
                  event_type,
                  timestamp,
                }));

              processedEvents.events.push(...customOrGetUserMedia);
            });

            processedEvents.events.push(
              ...connectingSuccessfully,
              ...connectingFailed,
              ...renegotiationSuccessfully,
              ...renegotiationFailed
            );
          }
        );

        processedEvents.events.push(...pagePresence);
      });

      this.processedEvents = processedEvents;
      
    },
  },
};
</script>

<style lang="css" scoped>
.less-space {
  margin-bottom: 1rem;
}
</style>
