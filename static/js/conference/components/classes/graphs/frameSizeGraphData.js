import DataForGraphs from "./dataForGraphs";
import { POSITIONS, VIDEO } from "../shared";

class FrameSizeGraphData extends DataForGraphs {
  /**
   * Processing stats for Frame Size graph
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
              (track) => this._trackId === "all" || track.id === this._trackId
            )
            .forEach((track) => {
              const { frameWidth = 0, frameHeight = 0 } = track;
              const yPoint = Number(frameWidth) * Number(frameHeight);
              const point = [xPoint, Number(yPoint.toFixed(1))];

              const customKey = `${
                POSITIONS[this._position].length > 1 ? position + ": " : ""
              }${frameWidth} x ${frameHeight} px`;
              result[customKey] = [...(result[customKey] || []), point];
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

export default FrameSizeGraphData;
