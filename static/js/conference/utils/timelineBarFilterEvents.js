
function transformProcessedEventsForPeerOverview(events, {}) {
  return events
    .reduce((acc, event) => {
      // const hasEventAlready = events.filter(evt => {
      //   event.participant === evt.peer
      //   && event.peer === evt.participant
      //   && event.event_type === evt.event_type
      //   && event.id !== evt.id
      // });

      if (event.peer) {
        const mirrorEvent = JSON.parse(JSON.stringify(event));
        mirrorEvent.participant = event.peer;
        mirrorEvent.peer = event.participant;

        acc.push(mirrorEvent);
      }
      acc.push(event);

      return acc;
    }, []);
}

function customFilteringForDrilldown(events, { conferenceId, participantId, start_time, end_time }) {
  return events
    .filter(event => {
      return event.conference === conferenceId
        && event.participant === participantId
        && start_time < new Date(event.created_at).getTime() 
        && end_time > new Date(event.created_at).getTime();
    })
    .map(event => {
      event.event_type = event.type;
      event.timestamp = event.created_at;
      event.color = peermetrics.utils.getColorForEventType(event.event_type);

      let message = `${event.event_type}`
      if (typeof event.data === 'string') {
        message += `<br>${event.data}`
      }
      event.message = {
        customTitle: message
      };
      return event;
    });
}

function filteringEventsForParticipantOverview(events) {
  return events
    .filter(event => {
      return !event.peer && event.event_type !== 'connected';
    });
}

function addConnectedEventToPeers(events, { allEvents, peerId }) {
  const connectedEvents = allEvents
    .filter(event => {
      return event && event.participant === peerId && !event.peer && event.event_type === 'connected'
    });

  if (connectedEvents.length > 0) {
    return [...events, ...connectedEvents];
  }

  return events;
}

function filteringEventsForParticipantGraphs(events) {
  return events
    .filter(({ event_type }) => ['page_presence', 'connected'].includes(event_type));
}

function unionSameTypeOfEvents(events, {}) {
  const groupByType  = events => {
    const result = events.reduce((acc, event) => {
      if(!acc[event.event_type]) acc[event.event_type] = [];
      acc[event.event_type].push(event);

      return acc;
    }, {});

    return result;
  }

  const sortEventsByStartTime = events => {
    const transformedEvents = events.sort((event1, event2) => {
      const time1 = new Date(event1.start_time ? event1.start_time : event1.timestamp).getTime();
      const time2 = new Date(event2.start_time ? event2.start_time : event2.timestamp).getTime();

      const diff = Math.sign(time1 - time2);

      return diff;
    });

    return transformedEvents;
  };

  const unionEvents = events => {
    return events
      .reduce((acc, event) => {
        const areSeparatedEvents = (ev1, ev2) => new Date(ev2.start_time).getTime() > new Date(ev1.end_time).getTime();

        const lastIndex = acc.length - 1;
        if (acc.length === 0 || areSeparatedEvents(acc[lastIndex], event)) {
          return [...acc, event];
        } else {
          acc[lastIndex].start_time = Math.min(new Date(acc[lastIndex].start_time).getTime(), new Date(event.start_time).getTime());
          acc[lastIndex].end_time = Math.max(new Date(acc[lastIndex].end_time).getTime(), new Date(event.end_time).getTime());

          return acc;
        }
      }, []);
  };

  return Object.values(groupByType(events))
    .reduce((acc, filteredEvents) => {
      const sortedEvents = sortEventsByStartTime(filteredEvents);
      const unionedEvents = unionEvents(sortedEvents);

      return [...acc, ...unionedEvents];
    }, []);
}

/**
 * Filtering and processing events for timelinebar
 * 
 * @param {any} param0 
 * @returns {any[]}
 */
function timelineBarEvents({
  processedEvents = [],
  participantId = '',
  peerId = '',
  processingBeforeFiltering = (events, {}) => events,
  processingAfterFiltering = (events, {}) => events,
  optionsForProcessingBeforeFiltering = {},
  optionsForProcessingAfterFiltering = {},
}) {
  const events = processingBeforeFiltering(processedEvents, optionsForProcessingBeforeFiltering);

  const filteredEventsByParticipantId = !participantId
    ? events
    : events
      .filter(event => {
        return event.participant === participantId
      });
  
  const filteredEventsByParticipantIdAndPeerId = !peerId 
    ? filteredEventsByParticipantId
    : filteredEventsByParticipantId
        .filter(event => {
          return event.peer === peerId
        });

  const result = processingAfterFiltering(filteredEventsByParticipantIdAndPeerId, optionsForProcessingAfterFiltering);

  return result;
}

export {
  transformProcessedEventsForPeerOverview,
  customFilteringForDrilldown,
  filteringEventsForParticipantOverview,
  addConnectedEventToPeers,
  filteringEventsForParticipantGraphs,
  unionSameTypeOfEvents,
};
export default timelineBarEvents;