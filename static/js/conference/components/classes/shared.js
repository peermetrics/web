/**
 * @typedef {object} Stat
 * @property {string} id
 * @property {string} type
 * @property {string} conference Conference ID
 * @property {string} session Session ID
 * @property {string} participant Participant ID
 * @property {string} peer Peer ID
 * @property {string} created_at
 * @property {object} data
 * @property {object} data.audio
 * @property {Object.<string, string>[]} data.audio.inbound
 * @property {Object.<string, string>[]} data.audio.outbound
 * @property {object} data.video
 * @property {Object.<string, string>[]} data.video.inbound
 * @property {Object.<string, string>[]} data.video.outbound
 * @property {object} data.connection
 * @property {Object.<string, string>} data.connection.local
 * @property {Object.<string, string>} data.connection.remote
 * @property {object} data.remote
 * @property {object} data.remote.audio
 * @property {Object.<string, string>[]} data.remote.audio.inbound
 * @property {Object.<string, string>[]} data.remote.audio.outbound
 * @property {object} data.remote.video
 * @property {Object.<string, string>[]} data.remote.video.inbound
 * @property {Object.<string, string>[]} data.remote.video.outbound
 */

/**
 * @typedef {object} GraphDatum
 * @property {string} name
 * @property {[number, number][]} data
 */

/**
 * 
 * @callback groupByCallback
 * @param {Object.<string, Stat[]>} data 
 * @param {Stat} current 
 * @returns {Object.<string, Stat[]>}
 */

/**
 * 
 * @callback getCallback
 * @param {Stat[]} data 
 * @returns {[number, number][]}
 */


const AUDIO = 'audio';
const VIDEO = 'video';
const CONNECTION = 'connection';
const INBOUND = 'inbound';
const OUTBOUND = 'outbound';
const TOPICS = { 'all': [AUDIO, VIDEO], 'audio': [AUDIO], 'video': [VIDEO], 'connection': [CONNECTION] };
const POSITIONS = { 'all': [INBOUND, OUTBOUND], 'inbound': [INBOUND], 'outbound': [OUTBOUND] };

export {
    AUDIO,
    VIDEO,
    CONNECTION,
    INBOUND,
    OUTBOUND,
    TOPICS,
    POSITIONS,
};