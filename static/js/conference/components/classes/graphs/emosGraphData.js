import DataForGraphs from "./dataForGraphs";
import { TOPICS, POSITIONS, INBOUND, OUTBOUND, CONNECTION } from "../shared";

class EmosGraphData extends DataForGraphs {
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
    if (this._topic === 'video' || this._topic === 'connection' || this._position === OUTBOUND || key === OUTBOUND) {
      return []
    }

    const dataObject = stats.reduce((data, stat) => {
      if (this._topic === CONNECTION) return [];

      if (!data[stat.connection]) {
        data[stat.connection] = []
      }

      let yPoint = stat.data.audio[INBOUND].reduce((score, audioStat) => {
        if (audioStat.emos) {
          if (score) {
            return (score + audioStat.emos ) / 2
          } else {
            return audioStat.emos
          }
        }

        return score
      }, 0)


      if (yPoint) {
        const xPoint = this._statTimeEpoch(stat);
        const point = [xPoint, yPoint];

        data[stat.connection].push(point);
      }

      return data;
    }, {})

    return Object.values(dataObject)
  }
}

export default EmosGraphData;
