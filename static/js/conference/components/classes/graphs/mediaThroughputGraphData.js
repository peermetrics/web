import DataForGraphs from "./dataForGraphs";
import { TOPICS, POSITIONS, INBOUND, OUTBOUND, CONNECTION } from "../shared";

class MediaThroughputGraphData extends DataForGraphs {
  /**
   * Processing stats for Media Throughput graph
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
    let temp = {};
    const dataObject = stats.reduce((data, stat) => {
      if (this._topic === CONNECTION) return [];

      if (!data[stat.connection]) {
        data[stat.connection] = []
      }

      if (!temp[stat.connection]) {
        temp[stat.connection] = 0
      }

      let yPoint = this._calculateMediaThroughput(stat, key);
      if (Number.isFinite(yPoint)) {
        // we need to check this to not get negative values
        // TODO: why is this happening?
        if (yPoint < temp[stat.connection]) return data

        yPoint -= temp[stat.connection];
        temp[stat.connection] += yPoint;
        const xPoint = this._statTimeEpoch(stat);
        const point = [xPoint, Number(yPoint.toFixed(1))];

        data[stat.connection].push(point);
      }

      return data;
    }, {})

    return Object.values(dataObject)
  }

  /**
   *
   * @param {Stat} stat
   * @param {string} key
   * @returns {number}
   */
  _calculateMediaThroughput(stat, key) {
    if (this._topic === 'all') {
      return stat.data.connection['bytesSent']
    } else {
      return TOPICS[this._topic].reduce((aggregatedByTopic, currentTopic) => {
        const isPositionKey = [INBOUND, OUTBOUND].includes(key);
        const sumByPosition = POSITIONS[isPositionKey ? key : this.workingPosition].reduce(
          (aggregatedByPosition, currentPosition) => {
            let localSum = 0;

            let data = stat.data[currentTopic][currentPosition]
                .filter((track) => {
                  if (this._trackId !== 'all') {
                    return track.id === this._trackId
                  }

                  return true
                })
                .map(({ bytesSent, headerBytesSent, bytesReceived, headerBytesReceived }) => {
                  if (currentPosition === OUTBOUND) {
                    return bytesSent + headerBytesSent
                  } else {
                    return bytesReceived + headerBytesReceived
                  }
                });

            if (data && data.length) {
              localSum = data.reduce((sum, current) => sum + current, 0);
            }

            return aggregatedByPosition + localSum;
          },
          0
        );

        return aggregatedByTopic + sumByPosition;
      }, 0);
    }
  }
}

export default MediaThroughputGraphData;
