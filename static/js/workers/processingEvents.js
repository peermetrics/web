/**
 * @typedef {Object} Conference
 * @property {string} id
 * @property {string} created_at
 * @property {string | null} start_time
 * @property {string} close_time
 */

 /**
  * @typedef {Object} ConferenceTime
  * @property {string} start_time
  * @property {string} close_time
  */

 /**
  * @typedef {Object} Session
  * @property {string} id
  * @property {string} conference Conference ID
  * @property {string} created_at
  */

 /**
  * @typedef {Object} AppEvent
  * @property {string} id
  * @property {string} type
  * @property {string} conference Conference ID
  * @property {string} session Session ID
  * @property {string} participant Participant ID
  * @property {string} peer Peer ID (participant)
  * @property {string} created_at
  * @property {Object} data
  */

/**
 * @typedef {Object} SingleEvent
 * @property {string} id
 * @property {string} event_type
 * @property {string} timestamp
 * @property {string} participant
 * @property {?string} peer
 * @property {?string} message
 * @property {?string} color
 */

/**
 * @typedef {Object} PeriodEvent
 * @property {string} id
 * @property {string} event_type
 * @property {string} start_time
 * @property {string} end_time
 * @property {string} participant
 * @property {?string} peer
 * @property {?string} message
 * @property {?string} color
 */

  /**
  * @typedef {Object} DraftEvent
  * @property {string} id
  * @property {string} type
  * @property {string} start_time
  * @property {string} participant
  * @property {?string} peer
  * @property {?string} addPeerID
  */



class EventsExtractor {
  /**
   * Processing events for timelinebar
   *
   * @param {Session[]} sessions
   * @param {AppEvent[]} events
   */
  constructor(sessions, events) {
    this.sessions = sessions
    this.events = events

    // Cache data
    this.sortedEvents = this._sortByCreatedAt(this.events)
    this.sortedSessions = this._sortByCreatedAt(this.sessions)
    this.firstSession = this.sortedSessions[0]
  }

  /**
   * @return {Array<SingleEvent | PeriodEvent>}
   */
  result() {
    const resultEvents = this.sortedEvents.reduce((result, event) => {
      if (this._isValidSingleEvent(event)) {
        result.push(this._fieldsForSingleEvent(event))
      }

      const { type } = event;
      /**
       * @type {undefined | null | PeriodEvent | [null | PeriodEvent, null | PeriodEvent]}
       */
      let processedEvent;

      switch (type) {
        case 'addPeer':
          processedEvent = this._processingAddPeer(event)
          break
        case 'unload':
          processedEvent = this._processingUnload(event) 
          break
        case 'onnegotiationneeded':
          processedEvent = this._processingOnNegotiationNeeded(event)
          break
        case 'onconnectionstatechange':
          processedEvent = this._processingOnConnectionStateChange(event)
          break
        case 'onsignalingstatechange':
          processedEvent = this._processingOnSignalingStateChange(event)
          break
        case 'oniceconnectionstatechange':
          processedEvent = this._processingOnIceConnectionStateChange(event)
          break
        default: break
      }

      // normalize data and add only it's valid
      if (this._isValidProcessedEvent(processedEvent).length > 0) {
        result.push(...this._isValidProcessedEvent(processedEvent))
      } 

      return result
    }, []);

    if (this._draftedEvents.length > 0 && this._isValidProcessedEvent(this._isPagePresence(this.sortedEvents.slice(-1)[0])).length > 0) {
      resultEvents.push(...this._isValidProcessedEvent(this._isPagePresence(this.sortedEvents.slice(-1)[0])))
    }

    const [startTime, endTime] = [this.firstSession.created_at, this.sortedEvents.slice(-1)[0].created_at]

    return {conferenceTimeEdges: {startTime, endTime} , events: resultEvents}
  }


  // private fields
  // Flags
  _currentAddPeerID = ''
  _currentAddPeer = {}
  _onNegotiationNeededCount = 0
  _draftedEvents = []


  // private functions
  /**
   * 1. Single Events
   */

  /**
   *
   * @param {AppEvent} event
   * @return {SingleEvent}
   * @private
   */
  _fieldsForSingleEvent(event) {
    const singleEventsWithMessage = ['custom']

    const id = this._uuid()
    const {type: event_type, created_at: timestamp, participant, peer } = event
    const fields = {id, event_type, timestamp, participant, peer }

    if (singleEventsWithMessage.includes(event_type)) {
      fields.message = event.data
    } else {
      fields.message = event_type
    }

    return fields;
  }

  /**
   * @param {AppEvent} event
   * @return {boolean}
   * @private
   */
  _isValidSingleEvent(event) {
    // getUserMedia: when user successfully requested access to mic/camera.
    //  - type: getUserMedia, if it has error attribute, it's a failed request. if it has data, look inside and show the event that doesn't have constraints.
    // mute/unmute: when a user mutes/unmutes the mic
    //  - type: mute or unmute
    // custom
    //  - type: custom. add a tooltip and that contains what's inside data
    const kindsOfSingleEvents = ['getUserMedia', 'mute', 'unmute', 'custom']
    const singleEventsWithConstraints = ['getUserMedia']

    const isOneOfKinds = kindsOfSingleEvents.includes(event.type)
    const hasContraints = singleEventsWithConstraints.includes(event.type) && typeof event.data.constraints !== 'undefined'

    return isOneOfKinds && !hasContraints
  }


  /**
   * 2. Period Events
   */

  /**
   *
   * @param {string} type
   * @param {string} start_time
   * @param {string} end_time
   * @param {?string} message
   * @param {?string} color
   * @return {PeriodEvent}
   */
  _fieldsForPeriodEvent({ type, start_time, end_time, participant, peer, message = type, color }) {
    const id = this._uuid()
    const result = { id, event_type: type, start_time, end_time, participant, peer }

    if (message) result.message = message
    if (color) result.color = color

    return result
  }

  /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _isPagePresence(event) {
    // type: page_presence
    // start_tme: created_at on the session
    // end_time: created_at from first unload after above timestamps

    const type = 'page_presence'
    let result = null

    const foundSession = this.sortedSessions.find(({ id }) => {
      return id === event.session
    })

    if (foundSession) {
      result = this._fieldsForPeriodEvent({ type, start_time: foundSession.created_at, end_time: event.created_at, participant: event.participant, peer: event.peer })
      // Remove processed session from sessions
      this.sortedSessions = this.sortedSessions.filter(({id}) => id !== foundSession.id)
    }

    return result
  }

  /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _isConnectionSuccessfully(event) {
    // type: connecting_successfully
    // start_time: first onnegotiationneeded after addPeer (fallback: addPeer)
    // end_time: first "onconnectionstatechange", data: "connected"
    const type = 'connecting_successfully'
    let result

    switch (this._onNegotiationNeededCount) {
      case 0:
        const customDraftConnection = {id: this._uuid(), type: 'draft_connection', start_time: this._currentAddPeer.created_at, addPeerID: this._currentAddPeerID, participant: this._currentAddPeer.participant, peer: this._currentAddPeer.peer}
        result = this._processingDraftEvent(type, customDraftConnection, event)
        break
      case 1:
        const draftEvent = this._draftedEvents.find(({ type, addPeerID, participant }) => (type === 'draft_connection' && addPeerID === this._currentAddPeerID  && participant === event.participant))
        result = this._processingDraftEvent(type, draftEvent, event)
        break
      default:
        result = null
    }

    return result
  }

   /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _isConnectionFailed(event) {
    // type: connecting_failed
    // start_time: first onnegotiationneeded after addPeer (fallback: addPeer)
    // end_time: first "onconnectionstatechange", data: "failed"
    const type = 'connecting_failed'
    let result

    switch (this._onNegotiationNeededCount) {
      case 0:
        const customDraftConnection = {id: this._uuid(), type: 'draft_connection', start_time: this._currentAddPeer.created_at, addPeerID: this._currentAddPeerID, participant: this._currentAddPeer.participant, peer: this._currentAddPeer.peer}
        result = this._processingDraftEvent(type, customDraftConnection, event)
        break
      case 1:
        const draftEvent = this._draftedEvents.find(({ type, addPeerID, participant, peer }) => (type === 'draft_connection' && addPeerID === this._currentAddPeerID && participant === event.participant && peer === event.peer))
        result = this._processingDraftEvent(type, draftEvent, event)
        break
      default:
        result = null
    }

    return result
  }

   /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _isConnected(event) {
    // type: connected (alias for connection is up)
    // start_tim: "onconnectionstatechange", data: "connected",
    // end_time: one of these
    //   "onsignalingstatechange", date: "closed"
    //   "onconnectionstatechange", date: "closed"
    //   "unload"

    const type = 'connected'
    const draftEvent = this._draftedEvents.find(({ type, participant }) => (type === 'draft_connected' && participant === event.participant ))
    const result = this._processingDraftEvent(type, draftEvent, event)

    return result
  }

   /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _isRenegotationSuccessfully(event) {
    // type: renegotation_successfully
    // start_time: any onnegotiationneeded after the first onnegotiationneeded
    // end_time: first
    //   "onconnectionstatechange", date: "connected"
    //   "oniceconnectionstatechange", date: "connected"
    // color light blue

    if (this._onNegotiationNeededCount > 1) {
      const type = 'renegotation_successfully'
      const draftEvent = this._draftedEvents.find(({ type, addPeerID, participant, peer }) => (type === 'draft_renegotation' && addPeerID === this._currentAddPeerID && participant === event.participant && peer === event.peer))
      const result = this._processingDraftEvent(type, draftEvent, event)

      return result
    }

    return null
  }

   /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _isRenegotationFailed(event) {
    // type: renegotiation_failed
    // start_time: any onnegotiationneeded after the first onnegotiationneeded
    // end_time: first
    //   "onconnectionstatechange", date: "failed"
    //   "oniceconnectionstatechange", date: "failed"
    // color light blue

    if (this._onNegotiationNeededCount > 1) {
      const type = 'renegotation_failed'
      const draftEvent = this._draftedEvents.find(({ type, addPeerID, participant, peer }) => (type === 'draft_renegotation' && addPeerID === this._currentAddPeerID && participant === event.participant && peer === event.peer))
      const result = this._processingDraftEvent(type, draftEvent, event)

      return result
    }

    return null
  }

   /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _isReconnectedSuccessfully(event) {
    // type: reconnected_successfully
    // start_time: one of these
    //   "onconnectionstatechange", date: "disconnected"
    //   "oniceconnectionstatechange", date: "disconnected"
    // end_time: one of these
    //   "onconnectionstatechange", date: "connected"
    //   "oniceconnectionstatechange", date: "connected"
    // color yellow

    const type = 'reconnected_successfully'
    const draftEvent = this._draftedEvents.find(({ type, participant, peer }) => (type === 'draft_reconnected' && participant === event.participant && peer === event.peer))
    const result = this._processingDraftEvent(type, draftEvent, event)

    return result
  }

  _isReconnectedFailed(event) {
    // type: reconnected_failed
    // start_time: one of these
    //   "onconnectionstatechange", date: "disconnected"
    //   "oniceconnectionstatechange", date: "disconnected"
    // end_time: one of these
    //   "onconnectionstatechange", date: "failed"
    //   "oniceconnectionstatechange", date: "failed"
    // color red

    const type = 'reconnected_failed'
    const draftEvent = this._draftedEvents.find(({ type, participant, peer }) => (type === 'draft_reconnected' && participant === event.participant && peer === event.peer))
    const result = this._processingDraftEvent(type, draftEvent, event)

    return result
  }


  /**
   * 3. Processing events
   */

  /**
   *
   * @param {string} type
   * @param {DraftEvent} draftEvent
   * @param {AppEvent} event
   * @param {Object} custom
   * @return {?PeriodEvent}
   */
  _processingDraftEvent(type, draftEvent, event, custom = {}) {
    let result = null

    if (draftEvent) {
      result = this._fieldsForPeriodEvent({ type, start_time: draftEvent.start_time, end_time: event.created_at, participant: event.participant, peer: event.peer })

      if (custom.message) result.message = custom.message
      if (custom.color) result.color = custom.color

      // Remove draft from draftEvent because it is completed processed
      this._draftedEvents = this._draftedEvents.filter(({id}) => id !== draftEvent.id)
    }

    return result
  }

  /**
   *
   * @param {AppEvent} event
   */
  _processingAddPeer(event) {
    this._currentAddPeerID = event.peer
    this._currentAddPeer = JSON.parse(JSON.stringify(event))
    // Reset onNegotiationNedded
    this._onNegotiationNeededCount = 0
  }

  /**
   *
   * @param {AppEvent} event
   */
  _processingUnload(event) {
    const result = []
    result.push(this._isPagePresence(event))
    result.push(this._isConnected(event))

    return result
   }

  /**
   *
   * @param {AppEvent} event
   */
  _processingOnNegotiationNeeded(event) {
    // type: draft_connection (for connecting_successfully, connecting_failed)
    // start_time: first onnegotiationneeded after addPeer
    // -----
    // type: draft_renegotation (for renegotation_successfully, renegotation_failed)
    // start_time: any onnegotiationneeded after the first onnegotiationneeded

    this._onNegotiationNeededCount++
    const id = this._uuid()

    if (this._onNegotiationNeededCount === 1) {
      const type = 'draft_connection'
      this._draftedEvents.push({id, type, start_time: event.created_at, addPeerID: this._currentAddPeerID, participant: event.participant, peer: event.peer})
    } else if (this._onNegotiationNeededCount > 1) {
      const type = 'draft_renegotation'
      this._draftedEvents.push({id, type, start_time: event.created_at, addPeerID: this._currentAddPeerID, participant: event.participant, peer: event.peer})
    }
   }

  /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _processingOnConnectionStateChange(event) {
    const { data: resultOfConnection } = event
    let result

    switch (resultOfConnection) {
      case 'connected':
        result = this._isConnectionSuccessfully(event) || this._isRenegotationSuccessfully(event) || this._isReconnectedSuccessfully(event)
        this._addDraftConnectedEvent(event)
        break
      case 'failed':
        result = this._isConnectionFailed(event) || this._isRenegotationFailed(event) || this._isReconnectedFailed(event)
        break
      case 'closed':
        result = this._isConnected(event)
        break
      case 'disconnected':
        this._addDraftReconnectedEvent(event)
        break
      default: break;
    }

    return result
  }

  /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _processingOnSignalingStateChange(event) {
    const { data: resultOfConnection } = event
    let result

    switch (resultOfConnection) {
      case 'closed':
        result = this._isConnected(event)
        break
      default: break;
    }

    return result
   }

  /**
   *
   * @param {AppEvent} event
   * @return {?PeriodEvent}
   */
  _processingOnIceConnectionStateChange(event) {
    const { data: resultOfConnection } = event
    let result

    switch (resultOfConnection) {
      case 'connected':
        result = this._isRenegotationSuccessfully(event) || this._isReconnectedSuccessfully(event)
        break
      case 'failed':
        result = this._isRenegotationFailed(event) || this._isReconnectedFailed(event)
        break
      case 'disconnected':
        this._addDraftDisconnectedEvent(event)
        break
      default: break;
    }

    return result
  }

   /**
   *
   * @param {AppEvent} event
   */
  _addDraftConnectedEvent(event) {
    // type: draft_connected ( for connected)
    // start_time: "onconnectionstatechange", data: "connected"
    const type = 'draft_connected'
    const id = this._uuid()

    this._draftedEvents.push({ id, type, start_time: event.created_at, participant: event.participant, peer: event.peer })
  }

     /**
   *
   * @param {AppEvent} event
   */
  _addDraftDisconnectedEvent(event) {
    // type: draft_connected ( for connected)
    // start_time: "onconnectionstatechange", data: "connected"
    const type = 'draft_connected'
    const id = this._uuid()

    this._draftedEvents.push({ id, type, start_time: event.created_at, participant: event.participant, peer: event.peer })
  }

  /**
   *
   * @param {AppEvent} event
   */
  _addDraftReconnectedEvent(event) {
    // type: draft_connected ( for reconnected_successfully or reconnected_failed)
    // start_time: one of these
    //    "onconnectionstatechange", date: "disconnected"
    //    "oniceconnectionstatechange", date: "disconnected"

    const type = 'draft_reconnected'
    const id = this._uuid()

    this._draftedEvents.push({ id, type, start_time: event.created_at, participant: event.participant, peer: event.peer })
  }


  /**
   * 4. Utils
   */

  /**
   *
   *  @return {PeriodEvent[]}
   */
  _processingUnprocessedDraftEvents() {}

  /**
   * 
   * @param {undefined | null | PeriodEvent | [null | PeriodEvent, null | PeriodEvent]} event
   * @returns {PeriodEvent[] | []} 
   */
  _isValidProcessedEvent(event) {
    if (Array.isArray(event)) {
      return event.filter(item => item);
    }

    if (event) {
      return [event];
    }

    return [];
  }

  /**
   * @param {string} dataString
   * @return {number}
   * @private
   */
  _epochTimeFromDataString(dataString) {
    return new Date(dataString).getTime()
  }

  /**
   * Sort an array of object by created_at field
   *
   * @param {Array<AppEvent|Session>} data
   * @return {Array<AppEvent|Session>}
   */
  _sortByCreatedAt(data) {
    const sortedData = data.sort((datum1, datum2) => {
      const time1 = this._epochTimeFromDataString(datum1.created_at)
      const time2 = this._epochTimeFromDataString(datum2.created_at)

      return Math.sign( time1 - time2)
    })

    return sortedData
  }

  /**
   * Generate uuid for events that are composed from two events
   * @return {string}
   */
  _uuid() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }
}

self.addEventListener('message', ({ data }) => {
  const { events, sessions } = data
  const { conferenceTimeEdges, events: resultEvents} = new EventsExtractor(sessions, events).result()
  postMessage({ conferenceTimeEdges, events: resultEvents })
})
