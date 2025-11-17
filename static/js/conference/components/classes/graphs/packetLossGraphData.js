import DataForGraphs from "./dataForGraphs";
import {
  TOPICS,
  CONNECTION,
  POSITIONS,
  Stat,
  INBOUND,
  OUTBOUND,
} from "../shared";

class PacketLossGraphData extends DataForGraphs {
  /**
   * Processing stats for Packet Loss graph
   */
  constructor(...args) {
    super(...args);
  }

  /**
   *
   * @param {Stat[]} stats
   * @param {string} key
   * @returns {[number, number][]}
   */
  _calculate(stats, key) {
    const dataObject = stats.reduce((data, stat) => {
      if (this._topic === CONNECTION) return [];

      if (!(stat.connection in data)) {
        data[stat.connection] = []
      }

      const yPoint = this._calculatePacketLost(stat, key);
      if (Number.isFinite(yPoint)) {

        const xPoint = this._statTimeEpoch(stat);
        const point = [xPoint, Number(yPoint.toFixed(4))];

        data[stat.connection].push(point);
      }

      return data;
    }, {});

    return Object.values(dataObject)
  }

  /**
   *
   * @param {Stat} stat
   * @param {string} key
   * @returns {number}
   */
  _calculatePacketLost(stat, key) {
    return TOPICS[this._topic].reduce(
      (aggregatedByTopic, currentTopic, topicIndex) => {
        const isPositionKey = [INBOUND, OUTBOUND].includes(key);
        const averageByPosition = POSITIONS[isPositionKey ? key : this.workingPosition].reduce(
          (aggregatedByPosition, currentPosition, positionIndex) => {
            let localAverage = 0;
            let inbound;
            let outbound;

            if (currentPosition === INBOUND) {
              inbound = stat.data[currentTopic][INBOUND].filter(
                (track) => this._trackId === "all" || track.id === this._trackId
              );
              outbound = inbound
                .map((inboundTrack) =>
                  stat.data.remote[currentTopic][OUTBOUND].find(
                    (outboundTrack) => outboundTrack.localId === inboundTrack.id
                  )
                )
                // if we are missing remote data, this will be an array of undefined
                .filter(track => !!track)
            }

            if (currentPosition === OUTBOUND) {
              outbound = stat.data[currentTopic][OUTBOUND].filter(
                (track) => this._trackId === "all" || track.id === this._trackId
              );
              inbound = outbound
                .map((outboundTrack) =>
                  stat.data.remote[currentTopic][INBOUND].find(
                    (inboundTrack) => outboundTrack.id === inboundTrack.localId
                  )
                )
                // if we are missing remote data, this will be an array of undefined
                .filter(track => !!track)
            }

            if (inbound && outbound && inbound.length && inbound.length === outbound.length) {
              const values = inbound
                .map((inboundTrack, idx) => {
                  const outboundTrack = outbound[idx];
                  if (outboundTrack.packetsSent) {
                    if (inboundTrack.packetsReceived) {
                      // Formula
                      const rate = (outboundTrack.packetsSent - inboundTrack.packetsReceived) 
                                    / outboundTrack.packetsSent
                      // make sure we have positive values
                      return Math.max(rate, 0);
                    } else if (Number.isFinite(inboundTrack.packetsLost)) {
                      return inboundTrack.packetsLost / outboundTrack.packetsSent
                    }
                  }

                  return null;
                })
                .filter(Number.isFinite);

              localAverage =
                values.reduce((sum, current) => sum + current, 0) /
                values.length;
            }

            return this._calculateRunningAverage(
              aggregatedByPosition,
              localAverage,
              positionIndex + 1
            );
          },
          0
        );

        return this._calculateRunningAverage(
          aggregatedByTopic,
          averageByPosition,
          topicIndex + 1
        );
      },
      0
    );
  }
}

export default PacketLossGraphData;
