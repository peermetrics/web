import DataForGraphs from "./dataForGraphs";
import { INBOUND, OUTBOUND, POSITIONS, VIDEO } from "../shared";

class FramesGraphData extends DataForGraphs {
  /**
   * Processing stats for Frames graph
   */
  constructor(...args) {
    super(...args);
  }

  /**
   *
   * @returns {Object.<string, [number, number][]}
   */
  get() {
    const attributes = {
      "Received frames": "framesReceived",
      "Decoded frames": "framesDecoded",
      "Frames sent": "framesSent",
      "Encoded frames": "framesEncoded",
    };

    const customKeys = {
      [INBOUND]: ["Received frames", "Decoded frames"],
      [OUTBOUND]: ["Frames sent", "Encoded frames"],
    };

    let temp = {}
    const unsortedValues = Object.keys(this._data)
    // each key is actaully a track ID
    .reduce((result, key) => {      
      // go through the stats
      this._data[key].forEach((stat) => {
        if (this._topic !== VIDEO) return {};

        const xPoint = this._statTimeEpoch(stat);

        // if we are looking at a certain position (inbound, outbound, both)
        POSITIONS[this._position].forEach((position) => {
          // look at all video tracks in that position (not just the key)
          stat.data[VIDEO][position]
            .filter(
              (track) => this._trackId === "all" || track.id === this._trackId
            )
            .forEach((track) => {
              customKeys[position].forEach((customKey) => {
                if (!temp[track.id]) {
                  temp[track.id] = {
                    "Received frames": 0,
                    "Decoded frames": 0,
                    "Frames sent": 0,
                    "Encoded frames": 0,
                  }
                }

                if (!result[track.id]) {
                  result[track.id] = {}
                }

                const value = Number(track[attributes[customKey]])
                const yPoint = value - temp[track.id][customKey]

                if (yPoint < 0) return

                temp[track.id][customKey] += yPoint;
                const point = [xPoint, yPoint];

                result[track.id][customKey] = [...(result[track.id][customKey] || []), point];
              });
            });
        });
      });

      return result;
    }, {});

    return Object.keys(unsortedValues).reduce((result, key) => {
      Object.keys(unsortedValues[key]).forEach((title) => {
        result[`${key} ${title}`] = unsortedValues[key][title]
          .concat()
          .sort((val1, val2) => Math.sign(val1[0] - val2[0]));
      })

      return result;
    }, {});
  }
}

export default FramesGraphData;
