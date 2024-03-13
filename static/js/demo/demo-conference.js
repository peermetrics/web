(function () {

  const urlMap = {
    '/conferences/demo-conference': '/static/js/demo/conference/conference.json',
    '/conferences/demo-conference/events': '/static/js/demo/conference/events.json',
    '/conferences/demo-conference/graphs': '/static/js/demo/conference/graphs.json',
    '/issues': '/static/js/demo/conference/issues.json',
    '/connections': '/static/js/demo/conference/connections.json',
    '/participants': '/static/js/demo/conference/participants.json',
    '/sessions': '/static/js/demo/conference/sessions.json',
  }

  peermetrics.createPath = function (pathName, arg) {
    return '/demo/conference/demo-conference'
  }

  peermetrics.get = function (url) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let newUrl = urlMap[url]
            fetch(newUrl).then((result) => result.json()).then(resolve)
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
