import DataForGraphs from "./dataForGraphs";
import { POSITIONS, INBOUND, VIDEO } from "../shared";

class AverageDecodingTimeGraphData extends DataForGraphs {
  /**
   * Processing stats for Average Decoding Time graph
   */
  constructor(...args) {
    super(...args);
  }

  /**
   *
   * @returns {Object.<string, [number, number][]}
   */
  get() {
    const unsortedValues = Object.keys(this._data).reduce((result, key) => {
      this._data[key].forEach((stat) => {
        if (this._topic !== VIDEO) return {};

        const xPoint = this._statTimeEpoch(stat);

        POSITIONS[this._position].forEach((position) => {
          stat.data[VIDEO][position]
            .filter(
              (track) => track.id === key
            )
            .forEach((track) => {
              const {
                totalDecodeTime = 0,
                totalEncodeTime = 0,
                framesDecoded = 1,
                framesEncoded = 1,
              } = track;

              // in seconds
              const totalTime = position === INBOUND ? totalDecodeTime : totalEncodeTime;
              const totalFrames = position === INBOUND ? framesDecoded: framesEncoded

              const yPoint = Number(totalTime) * 1000 / Number(totalFrames);

              const point = [xPoint, Number(yPoint.toFixed(1))];

              result[track.id] = [...(result[track.id] || []), point];
            });
        });
      });

      return result;
    }, {});

    return Object.keys(unsortedValues).reduce((result, key) => {
      result[key] = unsortedValues[key]
        .concat()
        .sort((val1, val2) => Math.sign(val1[0] - val2[0]));

      return result;
    }, {});
  }
}

export default AverageDecodingTimeGraphData;
