<template>
  <div
    :class="['timelinebar-wrapper', { isMain }]"
    :data-start="startTimeTooltip"
    :data-end="endTimeTooltip"
  >
    <ul v-if="eventsNotEmpty">
      <li
        v-for="(event, index) in normalizedSortedEvents"
        :key="event.id"
        :style="eventStyle(event, index)"
        :id="`event${event.id}`"
        :class="{ pointer: isClickable(event) }"
        @click.self="onClick($event, event)"
        v-b-tooltip.hover.html="getMessage(event)"
      />
    </ul>
  </div>
</template>

<script>
//TODO
const MIN_WIDTH = 1;
const EXPANDABLE_EVENTS = [
  "connecting_successfully",
  "connecting_failed",
  "renegotiation_successfully",
  "renegotiation_failed",
  "reconnected_successfully",
  "reconnected_failed",
];
const isValidTextField = (field) =>
  typeof field !== "undefined" && field !== "";
const isValidDataTimeField = (field) =>
  typeof field !== "undefined" && moment(field).isValid();
const stringDateToEpochTime = (date) => new Date(date).getTime();
let timeEdgeStack;

import Stack from "./stack";

export default {
  name: "timelineBar",
  props: {
    /**
     * [{event_type, timestamp, start_time, end_time}]
     * TODO: add item to enumarator
     * event_type: string from [enumerator]
     * timestamp: DateTime (format: YYYY-MM-DDTHH:mm:ss.sssZ)
     * start_time: DateTime (format: YYYY-MM-DDTHH:mm:ss.sssZ)
     * end_time: DateTime (format: YYYY-MM-DDTHH:mm:ss.sssZ)
     */
    events: {
      type: Array,
      required: true,
    },
    startTime: {
      type: [String, Number, Date],
      required: true,
      validator: (value) => {
        return moment(value).isValid();
      },
    },

    endTime: {
      type: [String, Number, Date],
      required: true,
      validator: (value) => {
        return moment(value).isValid();
      },
    },

    skip_validate_clicked_events: {
      type: Boolean,
      required: false,
      default: false,
    },

    isMain: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  created() {
    timeEdgeStack = new Stack();
  },
  data() {
    return {
      zoomRatio: 1,
      itemTopPositionTemp: 0,
    };
  },
  computed: {
    eventsNotEmpty() {
      return this.events.length > 0;
    },
    normalizedSortedEvents() {
      const eventsTansformedEpochTime = this.transformDateToEpochTime(
        this.events
      );
      const eventsValid = this.limitEventsToConferenceTime(
        eventsTansformedEpochTime
      );
      const eventsSortedByStartTime = this.sortEventsByStartTime(eventsValid);
      const eventsNormalized = this.normalizeDate(eventsSortedByStartTime);

      return eventsNormalized;
    },

    /**
     * [Cache] Get event's duration in seconds
     *
     * @param {number} start_time - DateTime in epoch time
     * @param {number} end_time - DateTime in epoch time
     * @returns {number} Number of seconds
     */
    eventTimeLengthSeconds() {
      return (start_time, end_time) => {
        return (end_time - start_time) / 1000;
      };
    },

    /**
     * [Cache] Get event's width (percentage without sign)
     *
     * @param {number} timeLength - The event's length in seconds
     * @returns {number} The event's width
     */
    eventWidth() {
      return (timeLength) => {
        const endTime = this.eventsDuration / 100000;
        const widthPercentage = this.zoomRatio * (timeLength / endTime);

        return widthPercentage;
      };
    },

    /**
     * Return start time in epoch (seconds from 1st january 1970)
     */
    startTimeEpoch() {
      return stringDateToEpochTime(this.startTime);
    },

    /**
     * Return end time in epoch (seconds from 1st january 1970)
     */
    endTimeEpoch() {
      return stringDateToEpochTime(this.endTime);
    },

    /**
     * Return the 'global' conference's duration
     */
    eventsDuration() {
      const duration = this.endTimeEpoch - this.startTimeEpoch;

      return duration;
    },

    startTimeTooltip() {
      return moment(this.startTimeEpoch).format("hh:mm:ss");
    },

    endTimeTooltip() {
      return moment(this.endTimeEpoch).format("hh:mm:ss");
    },
  },
  methods: {
    getMessage(event) {
      const { message, timestamp, start_time, end_time, event_type } = event;
      const messages = {
        connecting_successfully: "Connection created",
        connecting_failed: "Failed to connect",
        page_presence: "Present on page",
        connected: "Active connection",
        mute: "Mute",
        unmute: "Unmute",
        renegotiation_successfully: "Renegotiation",
        renegotiation_failed: "Renegotiation failed",
      };

      if (event_type === "getUserMedia") {
        let customTitle = message.constraints
          ? "Media access request"
          : "Media access response";

        let timeMessage = "";
        // if we have timestamp for an event, show that, else show its duration
        if (timestamp) {
          timeMessage = `At: ${peermetrics.utils.msToHMS(timestamp)}`;
        } else {
          timeMessage = `Duration: ${peermetrics.utils.msToHMS(
            Math.abs(end_time - start_time)
          )}`;
        }
        const tooltipMessage = customTitle + `<br/> ${timeMessage}`;

        return tooltipMessage;
      }
      switch (typeof message) {
        case "string":
        case "number":
        case "boolean":
          let timeMessage = "";
          // if we have timestamp for an event, show that, else show its duration
          if (timestamp) {
            timeMessage = `At: ${peermetrics.utils.msToHMS(timestamp)}`;
          } else {
            timeMessage = `Duration: ${peermetrics.utils.msToHMS(
              Math.abs(end_time - start_time)
            )}`;
          }
          const tooltipMessage = messages[message] + `<br/> ${timeMessage}`;

          return tooltipMessage;
        case "object":
          if (!message) return "";
          else if (message.customTitle) return message.customTitle;
          else return JSON.stringify(message);
      }
    },
    onFocus(e, index) {},

    leaveFocus(e, index) {},

    isClickable({ event_type }) {
      return (
        this.skip_validate_clicked_events ||
        EXPANDABLE_EVENTS.includes(event_type)
      );
    },

    onClick(e, event) {
      if (
        this.skip_validate_clicked_events ||
        EXPANDABLE_EVENTS.includes(event.event_type)
      ) {
        this.$emit("onDrilldownEvent", event.id);
      }
    },

    /**
     * Get event top position based on start_time and end_time
     *
     * @param {Object} event
     * @return {number}
     */
    getEventItemTop(event) {
      if (["page_presence", "connected"].includes(event.event_type)) return 0;
      // check if a value is between previous event's start_time and end_time
      const isOverlapping = (edges, value) => {
        if (value && value > edges.start_time && value < edges.end_time) {
          return true;
        }
        return false;
      };

      // extract start_time and end_time from event and build an item for stack with them
      const itemForStack = ({ start_time, end_time }) => ({
        start_time,
        end_time,
      });

      const isSingleEvent =
        typeof event.timestamp !== "undefined" ? true : false;

      let stackLength = timeEdgeStack.length();
      let isOverlapped = false;
      while (!timeEdgeStack.isEmpty() && !isOverlapped) {
        const previousEvent = timeEdgeStack.peek();

        if (isSingleEvent) {
          isOverlapped = isOverlapping(previousEvent, event.timestamp);
        } else {
          isOverlapped =
            isOverlapping(previousEvent, event.start_time) ||
            isOverlapping(previousEvent, event.end_time);
        }

        if (isOverlapped) {
          stackLength++;
          if (!isSingleEvent) {
            timeEdgeStack.push(itemForStack(event));
          }
        } else {
          stackLength--;
          timeEdgeStack.pop();
        }
      }

      if (timeEdgeStack.isEmpty()) {
        if (!isSingleEvent) {
          timeEdgeStack.push(itemForStack(event));
        }
      }

      let position = (stackLength - 1) * 2;

      return position;
    },

    /**
     * [Cache] Style for an event
     *
     * @param {Object} event - The event's properties
     * @param {number} index - The position in list
     * @returns {Object} The style for the event
     */
    eventStyle(event, index) {
      // always start the index from 1. 0 is reserverd for special events like the ones bellow

      // these 2 events should alway be in the background
      if (
        event.event_type === "connected" ||
        event.event_type === "page_presence"
      ) {
        index = 0;
      }

      if (index == 1) timeEdgeStack.reset();

      let left;
      if (event.timestamp) {
        left = event.timestamp;
      } else {
        left = event.start_time;
      }
      left = (left / this.eventsDuration) * 100 + "%";

      let width;
      if (event.timestamp) {
        width = MIN_WIDTH;
      } else {
        width = Math.max(
          MIN_WIDTH,
          this.eventWidth(
            this.eventTimeLengthSeconds(event.start_time, event.end_time)
          )
        );
      }

      if (event.timestamp === 0) {
        left = "0%";
        width = MIN_WIDTH;
      }

      if ((event.timestamp / this.eventsDuration) * 100 + width > 100) {
        left = 100 - width + "%";
      }

      const topPosition = this.getEventItemTop(event);

      let event_type;

      if (
        event.event_type === "getUserMedia" &&
        !event.message.constraints &&
        event.message.error
      ) {
        event_type = "mediaResponseError";
      } else if (
        event.event_type === "getUserMedia" &&
        !event.message.constraints &&
        Object.keys(event.message).some((key) =>
          ["video", "audio"].includes(key)
        )
      ) {
        event_type = "mediaResponseSuccess";
      } else {
        event_type = event.event_type;
      }

      const styleObject = {
        left,
        top: topPosition > 0 ? topPosition + "px" : topPosition,
        width: event.width ? event.width : width + "%",
        backgroundColor: event.color
          ? event.color
          : peermetrics.utils.getColorForEventType(event_type),
        zIndex: index,
      };

      return styleObject;
    },

    /**
     * Transform on each event, start_time and end_time or timestamp from string to epoch time (number of seconds from 1970)
     *
     * @param {Object[]} events - A list of events
     * @returns {Object[]} A list of events
     */
    transformDateToEpochTime(events) {
      const transformedEvents = events.map((event) => {
        let transformedData;

        if (event.timestamp) {
          transformedData = {
            timestamp: stringDateToEpochTime(event.timestamp),
          };
        } else {
          transformedData = {
            start_time: stringDateToEpochTime(event.start_time),
            end_time: stringDateToEpochTime(event.end_time),
          };
        }

        return {
          ...event,
          ...transformedData,
        };
      });

      return transformedEvents;
    },

    /**
     * Normalized time to conference's start time
     *
     * @param {Object[]} events - A list of events
     * @returns {Object[]} A list of events
     */
    normalizeDate(events) {
      const transformedEvents = events.map((event) => {
        let transformedData;

        if (event.timestamp) {
          transformedData = {
            timestamp: event.timestamp - this.startTimeEpoch,
          };
        } else {
          transformedData = {
            start_time: event.start_time - this.startTimeEpoch,
            end_time: event.end_time - this.startTimeEpoch,
          };
        }

        return {
          ...event,
          ...transformedData,
        };
      });

      return transformedEvents;
    },

    /**
     * Sort events by start_time or timestamp
     *
     * @param {Object[]} events - A list of events
     * @returns {Object[]} A list of events
     */
    sortEventsByStartTime(events) {
      const transformedEvents = events.sort((event1, event2) => {
        const time1 = event1.start_time ? event1.start_time : event1.timestamp;
        const time2 = event2.start_time ? event2.start_time : event2.timestamp;

        const diff = Math.sign(time1 - time2);

        return diff;
      });

      return transformedEvents;
    },

    /**
     * Set event time in limit of conference
     *
     * @param {Object[]} events - A list of events
     * @returns {Object[]} A list of events
     */
    limitEventsToConferenceTime(events) {
      const transformedEvents = events.map((event) => {
        const transformedEvent = { ...event };

        const isNotValidTime = (time) =>
          time < this.startTimeEpoch || time > this.endTimeEpoch;

        if (
          transformedEvent.start_time &&
          isNotValidTime(transformedEvent.start_time)
        ) {
          transformedEvent.start_time = this.startTimeEpoch;
        }

        if (
          transformedEvent.end_time &&
          isNotValidTime(transformedEvent.end_time)
        ) {
          transformedEvent.end_time = this.endTimeEpoch;
        }

        if (
          transformedEvent.timestamp &&
          isNotValidTime(transformedEvent.timestamp)
        ) {
          transformedEvent.timestamp = this.startTimeEpoch;
        }

        return transformedEvent;
      });

      return transformedEvents;
    },
  },
};
</script>

<style lang="scss" scoped>
.timelinebar-wrapper {
  height: 20px;
  width: 100%;
  background-color: #dee2e6;
  border-radius: 0.25rem;

  &.isMain {
    position: relative;

    &:before,
    &:after {
      position: absolute;
      display: flex;
      align-items: center;
      height: 20px;
      top: -20px;
      font-size: 12px;
    }

    &:before {
      content: attr(data-start);
      border-left: 0.5px solid #c0c0c0;
      padding-left: 5px;
      left: 1px;
    }

    &:after {
      content: attr(data-end);
      border-right: 0.5px solid #c0c0c0;
      padding-right: 5px;
      right: 1px;
    }
  }

  ul {
    list-style-type: none;
    position: relative;

    li {
      position: absolute;
      height: 20px;
      border: 1px solid #495057; // $gray-700
    }
  }

  .pointer {
    cursor: pointer;
  }
}
</style>
