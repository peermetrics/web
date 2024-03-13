(function () {

  let data = {
    conferences: [],
    sessions: [],
    connections: [],
    issues: []
  }

  const urlMap = {
    '/conferences': 'conferences',
    '/connections': 'connections',
    '/sessions': 'sessions',
    '/issues': 'issues',
  }

  let uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  let getRandomInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let randomIdList = (length) => {
    return new Array(length).fill().map(uuidv4)
  }

  const conferenceNames = [
    'Conference call',
    'Client 1',
    'Sales meeting',
    'Recording with John',
    'Recording with Mary',
    'Customer support',
    'Meeting',
    'First meeting',
    'Scheduled call',
    'Introduction call',
  ]

  let createConference = ({start, end, ongoing=false}) => {
    let hasIssue = getRandomInt(1, 10) < 2
    return {
      "participants": randomIdList(getRandomInt(2, 5)),
      "issues": hasIssue ? randomIdList(getRandomInt(1, 3)) : [],
      "id": uuidv4(),
      "conference_id": uuidv4(),
      "conference_name": conferenceNames[getRandomInt(0, conferenceNames.length - 1)],
      "conference_info": {},
      "app": peermetrics.app.id,
      "start_time": start.toISOString(),
      "call_start": null,
      "end_time": end.toISOString(),
      "ongoing": ongoing,
      "duration": (end - start) / 1000,
      "created_at": start.toISOString()
    }
  }

  const errors = [{
    'code': 'no_media_access',
    'title': 'Could not access any media device',
    'explanation': 'The app could not access any input device from the browser'
  }]
  const warnings = [{
    'code': 'getusermedia_error',
    'title': 'Problem accessing media',
    'explanation': 'The user had a problem accessing the mic/camera of the device'
  }, {
    'code': 'multiple_rejoins',
    'title': 'Multiple rejoins',
    'explanation': 'An user refreshed during a call'
  }, {
    'code': 'connection_disconnected',
    'title': 'Connection disconnected',
    'explanation': 'An user temporarily disconnected'
  }]
  const gumErrors = [
    "NotAllowedError",
    "NotAllowedError",
    "NotAllowedError",
    "NotReadableError",
    "OverconstrainedError",
    "OverconstrainedError",
  ]

  let createIssue = ({id, confId}) => {
    let isWarning = getRandomInt(1, 10) > 2
    let details = isWarning ? warnings[getRandomInt(0, warnings.length - 1)] : errors[0]

    let data = {}
    if (details.code == 'getusermedia_error') {
      let error = gumErrors[getRandomInt(0, gumErrors.length - 1)]
      data = {
        "name": error,
        "message": error
      }
    }

    return {
      "id": id,
      "session": "6e47a66d-5963-40a1-8076-e85f9c6a199c",
      "conference": confId,
      "participant": null,
      "connection": null,
      "track": null,
      "type": isWarning ? "warning" : "error",
      "code": details.code,
      "data": data,
      "created_at": "",
      "title": details.title,
      "explanation": details.explanation
    }
  }

  const geoIp = [
    {
        'country_code': 'US',
        'city': 'San Jose',
        'latitude': '37.34217071533203',
        'longitude': '-121.90677642822266',
    },
    {
        'country_code': 'US',
        'city': 'Quincy',
        'latitude': '47.23400115966797',
        'longitude': '-119.85199737548828',
    },
    {
        'country_code': 'US',
        'city': 'Chicago',
        'latitude': '41.84885025024414',
        'longitude': '-87.67124938964844',
    },
    {
        'country_code': 'US',
        'city': 'Manhattan',
        'latitude': '40.7589111328125',
        'longitude': '-73.97901916503906',
    },
    {
        'country_code': 'GB',
        'city': 'City of Westminster',
        'latitude': '51.50416946411133',
        'longitude': '-0.17000000178813934',
    },
    {
        'country_code': 'GB',
        'city': 'Earlsfield',
        'latitude': '51.45000076293945',
        'longitude': '-0.1833299994468689',
    },
    {
        'country_code': 'RO',
        'city': 'Bucharest',
        'latitude': '44.43655014038086',
        'longitude': '26.099349975585938',
    },
    {
        'country_code': 'IT',
        'city': 'Arese',
        'latitude': '45.541419982910156',
        'longitude': '9.067130088806152',
    },
  ]

  const versions = [
    "1.0.0",
    "1.0.1",
    "1.1.3"
  ]

  const platforms = [
    {
        "os": {
            "name": "Linux",
            "version": "x86_64"
        },
        "engine": {
            "name": "Blink",
            "version": "99.0.4844.51"
        },
        "browser": {
            "name": "Chrome",
            "major": "99",
            "version": "99.0.4844.51"
        }
    },
    {"os": {"name": "Mac OS", "version": "10.15.7"}, "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36", "cpu": {}, "device": {}, "engine": {"name": "Blink", "version": "98.0.4758.109"}, "browser": {"name": "Chrome", "major": "98", "version": "98.0.4758.109"}},
    {"os": {"name": "Mac OS", "version": "10.15.7"}, "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36", "cpu": {}, "device": {}, "engine": {"name": "Blink", "version": "98.0.4758.109"}, "browser": {"name": "Chrome", "major": "98", "version": "98.0.4758.109"}},
    {"os": {"name": "Windows", "version": "10"}, "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36", "cpu": {"architecture": "amd64"}, "device": {}, "engine": {"name": "Blink", "version": "96.0.4664.45"}, "browser": {"name": "Chrome", "major": "99", "version": "99.0.4664.45"}},
    {"os": {"name": "Windows", "version": "10"}, "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4664.45 Safari/537.36", "cpu": {"architecture": "amd64"}, "device": {}, "engine": {"name": "Blink", "version": "99.0.4664.45"}, "browser": {"name": "Chrome", "major": "99", "version": "99.0.4664.45"}},
    {"os": {"name": "Windows", "version": "10"}, "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4664.45 Safari/537.36", "cpu": {"architecture": "amd64"}, "device": {}, "engine": {"name": "Blink", "version": "99.0.4664.45"}, "browser": {"name": "Chrome", "major": "99", "version": "99.0.4664.45"}},
    {"os": {"name": "Windows", "version": "10"}, "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4664.45 Safari/537.36", "cpu": {"architecture": "amd64"}, "device": {}, "engine": {"name": "Blink", "version": "99.0.4664.45"}, "browser": {"name": "Chrome", "major": "99", "version": "99.0.4664.45"}},
  ]

  let createSession = ({confId, participant, issue}) => {
    return {
      "id": uuidv4(),
      "app_version": versions[getRandomInt(0, versions.length - 1)],
      "conference": confId,
      "created_at": "",
      "devices": [],
      "duration": 0,
      "end_time": "",
      "geo_ip": geoIp[getRandomInt(0, geoIp.length - 1)],
      "issues": [issue],
      "metadata": null,
      "participant": participant,
      "platform": platforms[getRandomInt(0, platforms.length - 1)],
      "session_info": {},
      "webrtc_sdk": "",
    }
  }

  let createConnection = ({confId, participant, session, start}) => {
    return {
      "id": uuidv4(),
      "conference": confId,
      "connection_info": {
        "negotiations": [{
          "duration": 0,
          "start_time": start.toISOString(),
          "end_time": moment(start).add(getRandomInt(200, 3000), 'milliseconds').toISOString(),
          "status": "connected",
          "type": "initial",
        }],
      },
      "created_at": "",
      "duration": 0,
      "participant": participant,
      "peer": participant,
      "session": session,
      "start_time": "",
      "end_time": "",
      "state": "closed",
      "type": getRandomInt(0, 10) < 1 ? "relay" : "host",
    }
  }

  let createDummyData = () => {
    // for each day in history
    for (let i = 0; i < peermetrics.daysHistory + 1; i++) {
      let startDay = moment().startOf('day').subtract(i, 'days')
      // create a random number of conferences
      for (let j = 0; j < getRandomInt(12, 25); j++) {
        let confStart = moment(startDay).add(getRandomInt(8, 16), 'hours')
        let duration = getRandomInt(60, 6000)
        let confEnd = moment(confStart).add(duration, 'seconds')

        // add a couple of ongoing conferences
        if (i === 0 && j % 4 === 0) {
          data.conferences.push(createConference({
            start: confStart,
            end: confEnd,
            ongoing: true
          }))
        }

        let conf = createConference({
          start: confStart,
          end: confEnd
        })

        conf.issues.forEach((id) => {
          data.issues.push(createIssue({id, confId: conf.id}))
        })

        conf.participants.forEach((id, i) => {
          let session = createSession({
            confId: conf.id,
            participant: id,
            issue: conf.issues[i] || ''
          })
          data.sessions.push(session)

          let connection = createConnection({
            confId: conf.id,
            participant: id,
            session: session.id,
            start: confStart
          })

          data.connections.push(connection)
        })

        data.conferences.push(conf)
      }
    }
  }

  createDummyData()

  peermetrics.createPath = function (pathName, arg) {
    if (pathName === 'conference') {
      return '/how-it-works/conference/demo-conference'
    }

    throw new Error('Could not find path with that name')
  }

  peermetrics.get = function (url) {
    return new Promise((resolve) => {
        setTimeout(() => {
          const key = urlMap[url]
          resolve(data[key])
        }, 1000)
    })
  }

  peermetrics.post = function (url, data) {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    })
  }

  peermetrics.put = function (url, data) {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    })
  }
}())
