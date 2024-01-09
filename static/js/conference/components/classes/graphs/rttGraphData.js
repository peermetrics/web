import DataForGraphs from "./dataForGraphs";
import { CONNECTION, Stat } from "../shared";

class RttGraphData extends DataForGraphs {
  /**
   * Processing stats for RTT graph
   */
  constructor(...args) {
    super(...args);
  }

  /**
   *
   * @param {Stat[]} stats
   * @returns {[number, number][]}
   */
  _calculate(stats) {
    const dataObject = stats.reduce((data, stat) => {
      const connection = stat.data[CONNECTION];

      if (!(stat.connection in data)) {
        data[stat.connection] = []
      }

      if (connection && typeof connection.responsesReceived !== "undefined") {

        const xPoint = this._statTimeEpoch(stat);
        const yPoint =
          (connection.totalRoundTripTime / connection.responsesReceived) * 1000;
        const point = [xPoint, Number(yPoint.toFixed(1))];

        data[stat.connection].push(point);
      }

      return data;
    }, {});

    return Object.values(dataObject)
  }
}

export default RttGraphData;
