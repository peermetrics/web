import { Stat } from '../shared';

class DataForGraphs {
  /**
   * 
   * @param {Object.<string, Stat[]>} data 
   * @param {string} participantId 
   * @param {string} peerId 
   * @param {string} trackId 
   * @param {'all' | 'audio' | 'video' | 'connection'} topic 
   * @param {'all' | 'inbound' | 'outbound'} position 
   */
  constructor(data, participantId, peerId, trackId, topic, position) {
    if (this.constructor == DataForGraphs) {
      throw new Error("This class can't be instantiated.");
    }

    this._data = data;
    this._participantId = participantId;
    this._peerId = peerId;
    this._trackId = trackId;
    this._topic = topic;
    this._position = position;
  }

  set data(data) {
    this._data = data;
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

  get workingPosition() {
    if (this._peerId === 'all') return 'outbound';
    return this._position;
  }

  /**
   * 
   * @returns {Object.<string, [number, number][]}
   */
  get() {
    return Object.keys(this._data).reduce((result, key) => {
      result[key] = this._calculate(this._data[key], key);

      return result;
    }, {});
  }

  /**
   * 
   * @param {Stat[]} stats 
   * @returns {[number, number][]}
   */
  _calculate(stats) {
    throw new Error('Implement this method');
  }

  /**
   * 
   * @param {Stat} stat 
   * @returns {number}
   */
  _statTimeEpoch(stat) {
    return new Date(stat.created_at).getTime();
  }

  /**
   * 
   * @param {number} previousAverage 
   * @param {number} currentNumber 
   * @param {number} index 
   * @returns {number}
   */
  _calculateRunningAverage(previousAverage, currentNumber, index) {
    // make sure we received a value for previousAverage
    const average = previousAverage ?? currentNumber
    return ( average  * (index - 1) + currentNumber ) / index;
  }

}

export default DataForGraphs;
