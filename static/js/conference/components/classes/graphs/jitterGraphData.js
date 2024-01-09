import DataForGraphs from "./dataForGraphs";
import { TOPICS, POSITIONS, INBOUND, OUTBOUND, CONNECTION } from "../shared";

class JitterGraphData extends DataForGraphs {
  /**
   * Processing stats for Jitter graph
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

      const yPoint = this._calculateJitter(stat, key);
      if (Number.isFinite(yPoint)) {
        const xPoint = this._statTimeEpoch(stat);
        const point = [xPoint, Number(yPoint.toFixed(2))];

        data[stat.connection].push(point);
      }

      return data;
    }, {});

    return Object.values(dataObject)
  }

  /**
   *
   * @param {Stat} stat
   * @param  {string} key
   * @returns {number}
   */
  _calculateJitter(stat, key) {
    return TOPICS[this._topic].reduce(
      (aggregatedByTopic, currentTopic, topicIndex) => {
        const isPositionKey = [INBOUND, OUTBOUND].includes(key);
        const averageByPosition = POSITIONS[isPositionKey ? key : this.workingPosition].reduce(
          (aggregatedByPosition, currentPosition, positionIndex) => {
            let localAverage = 0;
            let outbound;

            if (currentPosition === INBOUND) {
              outbound = stat.data[currentTopic][INBOUND];
            }

            if (currentPosition === OUTBOUND) {
              outbound = stat.data.remote[currentTopic][INBOUND];
            }

            if (outbound && outbound.length) {
              const values = outbound.map(({ jitter }) => jitter).filter(Number.isFinite);

              if (values.length) {
                localAverage =
                  values.reduce((sum, current) => sum + current, 0) /
                  values.length;
              }
            }

            return this._calculateRunningAverage(
              aggregatedByPosition,
              localAverage,
              positionIndex + 1
            );
          },
          null
        );

        return this._calculateRunningAverage(
          aggregatedByTopic,
          averageByPosition,
          topicIndex + 1
        );
      },
      null
    );
  }
}

export default JitterGraphData;
