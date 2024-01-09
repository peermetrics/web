import EmosGraphData from "./graphs/emosGraphData";
import MediaThroughputGraphData from "./graphs/mediaThroughputGraphData";
import RttGraphData from "./graphs/rttGraphData";
import PacketLossGraphData from "./graphs/packetLossGraphData";
import JitterGraphData from "./graphs/jitterGraphData";
import FrameSizeGraphData from "./graphs/frameSizeGraphData";
import FramesGraphData from "./graphs/framesGraphData";
import AverageDecodingTimeGraphData from "./graphs/averageDecodingTimeGraphData";

import {
  POSITIONS,
  TOPICS,
  Stat,
  GraphDatum,
  groupByCallback,
  CONNECTION,
} from "./shared";

class StatsForLineChart {
  /**
   * Processing stats for line chart
   *
   * @param {object}                                    options
   * @param {Stat[]}                                    options.events
   * @param {string}                                    options.conferenceId
   * @param {string}                                    options.participantId
   * @param {string}                                    options.peerId
   * @param {string}                                    options.trackId
   * @param {'all' | 'audio' | 'video' | 'connection'}  options.topic
   * @param {'all' | 'inbound' | 'outbound'}            options.position
   * @param {Object.<string, string>[]}                 options.participantsDetails
   */
  constructor({
    events,
    conferenceId,
    participantId,
    peerId,
    trackId,
    topic,
    position,
    participantsDetails,
  }) {
    this._events = events;
    this._participantsDetails = participantsDetails;
    this._conferenceId = conferenceId;
    this._participantId = participantId;
    this._peerId = peerId;
    this._trackId = trackId;
    this._topic = topic;
    this._position = position;

    // Stats = only events whose type is 'stats' and are for this conference
    this._stats = this._filteredOnlyStatEventsForThisConference();

    // Graphs
    this._emosGraphData = new EmosGraphData();
    this._rttGraphData = new RttGraphData();
    this._packetLossGraphData = new PacketLossGraphData();
    this._jitterGraphData = new JitterGraphData();
    this._mediaThroughputGraphData = new MediaThroughputGraphData();
    this._frameSizeGraphData = new FrameSizeGraphData();
    this._framesGraphData = new FramesGraphData();
    this._averageDecodingTimeGraphData = new AverageDecodingTimeGraphData();
  }

  set participantId(participantId) {
    this._participantId = participantId;
  }

  set peerId(peerId) {
    this._peerId = peerId;
  }

  set trackId(trackId) {
    this._trackId = trackId;
  }

  set topic(topic) {
    this._topic = topic;
  }

  set position(position) {
    this._position = position;
  }

  /**
   * Filter only events that are for stats
   *
   * @returns {Event[]}
   */
  _filteredOnlyStatEventsForThisConference() {
    return this._events.filter(
      (event) =>
        event.conference === this._conferenceId && event.type === "stats"
    );
  }

  /**
   *
   * @param {string} groupField
   * @param {Stat[]} items
   * @param {groupByCallback} callback
   * @returns {Object.<string, Stat[]>}
   */
  _groupBy(groupField, items, callback) {
    return items.reduce((data, current) => {
      if (callback) {
        data = callback(data, current);
      } else {
        const { [groupField]: groupFieldValue } = current;
        data[groupFieldValue] = [...(data[groupFieldValue] || []), current];
      }
      return data;
    }, {});
  }

  /**
   *
   * @param {string} filterField
   * @param {string} filterValue
   * @param {Stat[]} items
   * @returns {Stat[]}
   */
  _filterBy(filterField, filterValue, items) {
    return items.filter(
      ({ [filterField]: filterFieldValue }) => filterFieldValue === filterValue
    );
  }

  /**
   *
   * @param {Object.<string, Stat[]>} data
   * @returns {Object.<string, Stat[]>}
   */
  _replaceIdWithName(data) {
    return Object.keys(data).reduce((result, currentKey) => {
      if (this._participantsDetails[currentKey]) {
        result[this._participantsDetails[currentKey]] = data[currentKey];
      } else {
        result[currentKey] = data[currentKey];
      }

      return result;
    }, {});
  }

  /**
   * Manipulate the data to be in a format accepted by Highcharts
   * @param {Object.<string, Stat[]>} data
   * @returns {GraphDatum[]}
   */
  _transformDataForHighchart(data, simple=false) {
    return Object.keys(data)
      .reduce((result, key) => {
        if (simple) {
          return [...result, {name: key, data: data[key]}]
        } else {
          let additional = data[key].map((data) => {
            return {
              name: key,
              data
            }
          })
          return [...result, ...additional]
        }
      }, [])
      .filter(({ data }) => data.length > 0);
  }

  _inputData() {
    let filteredAndGroupedStats;
    /**
     * _participantId = 'all' | id
     * _peerId = 'all' | id
     * _topic = 'all' | AUDIO | VIDEO | CONNECTION
     * _position = 'all' | INBOUND | OUTBOUND
     * _trackId = 'all' | id
     *
     * Cases:
     */
    if (this._participantId === "all") {
      // * 1. _participantId === 'all':
      // * * * multiple lines (one line for each participants)
      filteredAndGroupedStats = this._groupBy("participant", this._stats);
    } else if (this._participantId !== "all" && this._peerId === "all") {
      // * 2. _participantId !== 'all' && _peerId === 'all':
      // * * * multiple lines (one line for each peer)
      const participantStats = this._filterBy(
        "participant",
        this._participantId,
        this._stats
      );
      filteredAndGroupedStats = this._groupBy("peer", participantStats);
    } else if (
      this._participantId !== "all" &&
      this._peerId !== "all" &&
      (this._topic === "all" || this._position === 'all')
    ) {
      // * 3. _participantId !== 'all' && _peerId !== 'all' && _topic === 'all' || _position ===  'all':
      // * * * multiple lines (one line for each incoming and another  for outcoming)
      const participantStats = this._filterBy(
        "participant",
        this._participantId,
        this._stats
      );
      const peerStats = this._filterBy("peer", this._peerId, participantStats);

      filteredAndGroupedStats = this._groupBy(
        undefined,
        peerStats,
        (result, stat) => {
          const localResult = result;

          POSITIONS[this._position].forEach((position) => {
            let topic = TOPICS[this._topic][0]
            localResult[position] = [...(localResult[position] || []), stat];
          });

          return localResult;
        }
      );
    } else if (
      this._participantId !== "all" &&
      this._peerId !== "all" &&
      this._topic !== "all" &&
      this._trackId === "all"
    ) {
      // * 4. _participantId !== 'all' && _peerId !== 'all' && _topic !== 'all' && _trackId === 'all':
      // * * * multiple lines (one line for each track)
      const participantStats = this._filterBy(
        "participant",
        this._participantId,
        this._stats
      );
      const peerStats = this._filterBy("peer", this._peerId, participantStats);

      filteredAndGroupedStats = this._groupBy(
        undefined,
        peerStats,
        (result, stat) => {
          const localResult = result;

          if (this._topic === CONNECTION) {
            ["local", "remote"].forEach((position) => {
              localResult[position] = [...(localResult[position] || []), stat]
            });
          } else {
            POSITIONS[this._position].forEach((position) => {
              let topic = TOPICS[this._topic][0]
              stat.data[topic][position].forEach(({ id }) => {
                localResult[id] = [...(localResult[id] || []), stat];
              });
            });
          }

          return localResult;
        }
      );
    } else if (
      this._participantId !== "all" &&
      this._peerId !== "all" &&
      this._topic !== "all" &&
      this._trackId !== "all"
    ) {
      // * 5. _participantId !== 'all' && _peerId !== 'all' && _topic !== 'all' && _trackId !== 'all':
      // * * * one line
      const participantStats = this._filterBy(
        "participant",
        this._participantId,
        this._stats
      );
      const peerStats = this._filterBy("peer", this._peerId, participantStats);
      const trackStats = peerStats.filter((stat) => {
        return POSITIONS[this._position].some((position) => {
          const topic = TOPICS[this._topic][0]
          return stat.data[topic][position].some((track) => {
            return track.id === this._trackId;
          });
        });
      });

      filteredAndGroupedStats = { [this._trackId]: trackStats };
    }

    const namedStats = this._replaceIdWithName(filteredAndGroupedStats);

    return namedStats;
  }

  /**
   * Sync graphs with selected options
   *
   * @param {string} graphName
   */
  _syncData(graphName) {
    this[`_${graphName}GraphData`].data = this._inputData();
    this[`_${graphName}GraphData`].participantId = this._participantId;
    this[`_${graphName}GraphData`].peerId = this._peerId;
    this[`_${graphName}GraphData`].trackId = this._trackId;
    this[`_${graphName}GraphData`].topic = this._topic;
    this[`_${graphName}GraphData`].position = this._position;
  }

  /**
   * @returns {GraphDatum[]} GraphData
   */
  emosGraph() {
    this._syncData("emos");
    const data = this._emosGraphData.get();
    const result = this._transformDataForHighchart(data);

    return result;
  }


  /**
   * @returns {GraphDatum[]} GraphData
   */
  rttGraph() {
    this._syncData("rtt");
    const data = this._rttGraphData.get();
    const result = this._transformDataForHighchart(data);

    return result;
  }

  /**
   * @returns {GraphDatum[]} GraphData
   */
  packetLossGraph() {
    this._syncData("packetLoss");
    const data = this._packetLossGraphData.get();
    const result = this._transformDataForHighchart(data);

    return result;
  }

  /**
   * @returns {GraphDatum[]} GraphData
   */
  jitterGraph() {
    this._syncData("jitter");
    const data = this._jitterGraphData.get();
    const result = this._transformDataForHighchart(data);

    return result;
  }

  /**
   * @returns {GraphDatum[]} GraphData
   */
  mediaThroughputGraph() {
    this._syncData("mediaThroughput");
    const data = this._mediaThroughputGraphData.get();
    const result = this._transformDataForHighchart(data);

    return result;
  }

  /**
   * @returns {GraphDatum[]} GraphData
   */
  frameSizeGraph() {
    this._syncData("frameSize");
    const data = this._frameSizeGraphData.get();
    const result = this._transformDataForHighchart(data, true);

    return result;
  }

  /**
   * @returns {GraphDatum[]} GraphData
   */
  framesGraph() {
    this._syncData("frames");
    const data = this._framesGraphData.get();
    const result = this._transformDataForHighchart(data, true);

    return result;
  }

  /**
   * @returns {GraphDatum[]} GraphData
   */
  averageDecodingTimeGraph() {
    this._syncData("averageDecodingTime");
    const data = this._averageDecodingTimeGraphData.get();
    const result = this._transformDataForHighchart(data, true);

    return result;
  }
}

export default StatsForLineChart;
