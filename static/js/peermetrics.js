(function () {
  if (!window.peermetrics) return

  var peermetrics = window.peermetrics

  function normalizePrefix(prefix) {
    if (!prefix) return ''
    if (prefix === '/') return ''
    return prefix.endsWith('/') ? prefix.slice(0, -1) : prefix
  }

  function derivePrefixFromApiRoot() {
    if (!peermetrics.settings || !peermetrics.settings.apiRoot) return ''
    try {
      var url = new URL(peermetrics.settings.apiRoot)
      var path = url.pathname || ''
      if (path.endsWith('/')) {
        path = path.slice(0, -1)
      }
      if (path.endsWith('/v1')) {
        path = path.slice(0, -3)
      }
      return normalizePrefix(path)
    } catch (err) {
      return ''
    }
  }

  function withPrefix(path) {
    var prefix = normalizePrefix(peermetrics.settings && peermetrics.settings.urlPrefix)
    if (!prefix) {
      prefix = derivePrefixFromApiRoot()
    }
    if (!prefix) return path
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return prefix + path
  }

  peermetrics.urls = {
    'sessions': '/sessions',
    conferences: function (conferenceId) {
      if (conferenceId) {
        return '/conferences/' + conferenceId
      } else {
        return '/conferences'
      }
    },
    conferenceEvents: function (conferenceId) {
      if (!conferenceId) {
        throw new Error('Missing conferenceId')
      }

      return this.conferences(conferenceId) + '/events'
    },
    conferenceGraph: function (conferenceId) {
      if (!conferenceId) {
        throw new Error('Missing conferenceId')
      }

      return this.conferences(conferenceId) + '/graphs'
    },
    connections: function (connectionId) {
      if (connectionId) {
        return '/connections/' + connectionId
      } else {
        return '/connections'
      }
    },
    issues: function (issueId) {
      if (issueId) {
        return '/issues/' + issueId
      } else {
        return '/issues'
      }
    },
    'organizations': '/organizations',
    organizationTeam: function (orgId) {
      return `/organizations/${orgId}/members`
    },

    'participants': '/participants',
    'apps': '/apps',
    'search': '/search',
    'payment-token': '/billing/payment-token',
    'paymentMethod': '/billing/payment-method',
    'stats': '/stats',
    'customer-portal': '/users/customer-portal',
  };

  /**
   * used to create certain paths for pages. similar to jinja's url
   * @param  {String} pathName 
   * @param  {String | Number} arg
   * @return {String}
   */
  peermetrics.createPath = function (pathName, arg) {
    if (pathName === 'conference') {
      return withPrefix(`/conference/${arg}`)
    }

    if (pathName === 'participant') {
      return withPrefix(`/participant/${arg}`)
    }

    if (pathName === 'docs') {
      return withPrefix('/docs')
    }

    throw new Error('Could not find path with that name')
  }

  peermetrics.colors = {
    default: '#4582EC',
    warning: '#f0ad4e',
    error: '#d9534f',
    info: '#17a2b8',
    list: ["#2caffe", "#544fc5", "#00e272", "#fe6a35", "#6b8abc", "#d568fb", "#2ee0ca", "#fa4b42", "#feb56a", "#91e8e1"]
  }

  peermetrics.globals = {
    durationInterval: [
      {
        title: '< 1 m',
        min: 0,
        max: 1,
        number: 0,
        data: []
      },
      {
        title: '1 - 3 m',
        min: 1,
        max: 3,
        number: 0,
        data: []
      },
      {
        title: '3 - 5 m',
        min: 3,
        max: 5,
        number: 0,
        data: []
      },
      {
        title: '5 - 10 m',
        min: 5,
        max: 10,
        number: 0,
        data: []
      },
      {
        title: '10 - 15 m',
        min: 10,
        max: 15,
        number: 0,
        data: []
      },
      {
        title: '15 - 20 m',
        min: 15,
        max: 20,
        number: 0,
        data: []
      },
      {
        title: '20 - 25 m',
        min: 20,
        max: 25,
        number: 0,
        data: []
      },
      {
        title: '25 - 30 m',
        min: 25,
        max: 30,
        number: 0,
        data: []
      },
      {
        title: '30 - 40 m',
        min: 30,
        max: 40,
        number: 0,
        data: []
      },
      {
        title: '40 - 50 m',
        min: 40,
        max: 50,
        number: 0,
        data: []
      },
      {
        title: '50 - 60 m',
        min: 50,
        max: 60,
        number: 0,
        data: []
      },
      {
        title: '> 60 m',
        min: 60,
        max: Infinity,
        number: 0,
        data: []
      }
    ],

    // Object that associates a country's code with its full name
    countryCodes: {"AF":"Afghanistan","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BQ":"Bonaire, Sint Eustatius and Saba","BA":"Bosnia and Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","IO":"British Indian Ocean Territory","BN":"Brunei Darussalam","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","CV":"Cabo Verde","KH":"Cambodia","CM":"Cameroon","CA":"Canada","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CD":"Congo (the Democratic Republic of the)","CG":"Congo","CK":"Cook Islands","CR":"Costa Rica","HR":"Croatia","CU":"Cuba","CW":"Curaçao","CY":"Cyprus","CZ":"Czechia","CI":"Côte d'Ivoire","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","SZ":"Eswatini","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard Island and McDonald Islands","VA":"Holy See","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KP":"North Korea","KR":"South Korea","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Lao","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macao","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Republic of Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestine","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","MK":"Republic of North Macedonia","RO":"Romania","RU":"Russian Federation","RW":"Rwanda","RE":"Réunion","BL":"Saint Barthélemy","SH":"Saint Helena, Ascension and Tristan da Cunha","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin (French part)","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","ST":"Sao Tome and Principe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten (Dutch part)","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia and the South Sandwich Islands","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SJ":"Svalbard and Jan Mayen","SE":"Sweden","CH":"Switzerland","SY":"Syrian Arab Republic","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"UAE","GB":"UK","UM":"United States Minor Outlying Islands","US":"USA","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VE":"Venezuela","VN":"Viet Nam","VG":"Virgin Islands (British)","VI":"Virgin Islands (U.S.)","WF":"Wallis and Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe","AX":"Åland Islands"}
  }

  peermetrics.utils = {
    /**
     * Custom reduce method
     * Used to take an array of repeating terms and creating an object
     * that counts how many occurances each value has
     * @param  {Array} arr The array of values
     * @param  {Int} total Optional. If we also want to compute a percentage of each value, out of total
     *
     * @return {Object}
     */
    reduce: function (arr, total) {
      var result = arr.reduce(function (acc, curr) {
        acc[curr] ? acc[curr]++ : acc[curr] = 1;
        return acc;
      }, {});

      if (total) {
        Object.keys(result).map(function(key) {
          result[key] = result[key] / total * 100
        })
      }

      return result
    },

    /**
     * Used to group number into interval
     * @param  {Array} result    An array of numbers (int most likely)
     * @param  {Array} intervals An array of objects. structure: {min, max, number}
     * @return {Array}           Same as intervals but with an incremened number
     */
    groupDurations: function (result, intervals) {
      // create copies
      var values = result.slice()
      var intervalsArray = intervals.slice()

      // filter out NaN
      // and sort the numbers
      values = values.filter((val) => typeof val === 'object' && !Number.isNaN(val.value))
                     .sort((first, second) => first.value - second.value)

      var i = 0
      return intervalsArray.map((interval) => {
        var newInterval = Object.assign({}, interval)
        var res = values[i]?.value

        while (res >= newInterval.min && res < newInterval.max && i < values.length) {
          newInterval.number++
          newInterval.data.push(values[i].data)
          i++
          res = values[i]?.value
        }
        return newInterval
      })
    },

    /**
     * Used to create an array for formated days used as X axis on graphs
     * @param  {Number} days The number of days. Usually 15/30
     * @return {Array}      The array of dates. Structure: ['04/15', '04/16', ...]
     */
    createDatesArray: function (days) {
      if (!window.moment) return []

      var dates = []
      var now = moment()

      for (var i = 0; i <= days; i++) {
        dates.push(now.format('MM/DD'))
        now.subtract(1, 'days')
      }

      dates.reverse()

      return dates
    },

    /**
     * Used to transform sec into a string formated as "0h 0m 0s"
     * @param  {Number} sec The number of seconds
     * @return {String}     The formated string
     */
    secondsToHMS: function (sec) {
      if (typeof sec !== 'number') {
        throw new Error('secToHMS accepts a number as an arg')
      }

      if (sec < 0) {
        throw new Error('number of seconds must be positive')
      }

      sec *= 1000

      // if more than 1h
      if (sec >= 3600000) {
        return moment(sec).utc().format('h[h] m[m] s[s]')
      }

      // if more than 1 minute
      if (sec >= 60000) {
        return moment(sec).utc().format('m[m] s[s]')
      }

      // if less than 1 second
      if (sec < 1000) {
        return moment(sec).utc().milliseconds() + 'ms'
      }

      return moment(sec).utc().format('s[s]')
    },

    msToHMS: function (ms) {
      return this.secondsToHMS(ms / 1000)
    },

    /**
     * Used to compute minutes out of seconds. It rounds down because we don't need that much accuracy
     * @param  {Number} sec Number of seconds
     * @return {Number}     Number of minutes
     */
    secondsToMinutes: function (sec) {
      return Math.floor(Number(sec) / 60)
    },

    /**
     * Check if a variable is null
     * @param {String | Number | Object} value The variable that is being tested
     * @return {Boolean}
    */
    isNull: function(value) {
      return typeof value === 'object' && !value
    },

    /**
     * Transform bytes in MB, KB and so on
     * @param {Number} bytes Number of bytes
     * @param {Number} decimals How many decimals 
     */
    formatBytes: function(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    /**
     * Used to get a color code for an event
     * @param  {String} eventType The name of the event
     * @return {String}           The HEX color code
     */
    getColorForEventType: function (eventType) {
      const defaultColor = "#b3e5fc"
      const eventsColor = {
        // main timeline events
        page_presence: "#BDBDBD",
        getUserMedia: "#542344",
        mediaResponseError: "#e57373",
        mediaResponseSuccess: "#66bb6a",
        mute: "#BFD1E5",
        unmute: "#BFD1E5",
        // participant timeline events
        connecting_successfully: "#66bb6a",
        connecting_failed: "#e57373",
        connected: "#64b5f6",
        renegotiation_failed: "#e57373",
        reconnected_successfully: "#66bb6a",
        reconnected_failed: "#e57373",
        // drilldown events
        addPeer: '#673ab7',
        peerDetails: '#9575cd',
        onsignalingstatechange: '#26c6da',
        onconnectionstatechange: '#4caf50',
        onicegatheringstatechange: '#ffc107',
        oniceconnectionstatechange: '#ffc107',
        onicecandidate: '#ffd54f',
        ondatachannel: '#26a69a',
        onicecandidateerror: '#ef5350',
      }

      return eventsColor[eventType] || defaultColor;
    },

    /**
     * Used to populate issues inside models that have references to issues
     * @param  {Array} models Array of DB models (conferences, sessions, etc)
     * @param  {Array} issues Array of issues
     * @return {Array}        The models enhanced
     */
    populateIssues: function (models, issues) {
      let issueMap = {}
      issues.forEach((issue) => {
        issueMap[issue.id] = issue
      })

      return models.map((model) => {
        if (Array.isArray(model.issues)) {
          model.issues = model.issues.map((issueId) => {
            if (issueId in issueMap) {
              return issueMap[issueId]
            }

            // this should not happen
            return {id: issueId}
          })
        }

        return model
      })
    }
  }

  var apiRoot = wretch(peermetrics.settings.apiRoot)
        .options({credentials: "include", mode: "cors"})
        // .content("application/json")
        .accept("application/json")

  // used to post data to the api server
  peermetrics.post = function (url, data) {
    if (!url || !data) return Promise.reject('missing argument url or argument data')

    return apiRoot.url(url).post(data).json()
  }

  peermetrics.put = function (url, data) {
    if (!url || !data) return Promise.reject('missing argument url or argument data')

    return apiRoot.url(url).put(data).json()
  }

  /**
   * Used to do a get to the API server
   * @param  {String} url   The url where to make the get
   * @param  {Object|String} query This can be either an object or a string
   * @return {Promise}       Wretch promise
   */
  peermetrics.get = function (url, query) {
    if (!url) return Promise.reject('missing argument url')
    var request = apiRoot.url(url)

    // if we get a query arg, make sure it's an object or a string
    if (query) {
      if (typeof query == 'object') {
        request = request.query(query)
      } else if (typeof query == 'string') {
        request = apiRoot.url(url + '/' + query)
      } else {
        return Promise.reject('query must be an object or a string')
      }
    }

    return request.get().json(function (response) {
      if (response.data) {
        return response.data
      }
      return response
    })
  }

  peermetrics.delete = function (url, query) {
    if (!url) return Promise.reject('missing argument url')

    var request = apiRoot.url(url)
    if (typeof query == 'object') {
      request = request.query(query)
    }

    return request.delete().json()
  }
}())
