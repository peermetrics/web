$(function () {
  var appInput = $('#app-name')
  var orgId = peermetrics.organizationId

  $('.create-app').click(function () {
      if (!appInput.val()) {
          appInput.addClass('is-invalid')
      } else {
          appInput.removeClass('is-invalid')
          peermetrics.post(peermetrics.urls['apps'], {
              organization: orgId,
              name: appInput.val().slice(0, 64)
          }).then(function () {
              window.location.reload()
          }).catch(function (err) {
              console.error(err)
              appInput.addClass('is-invalid')
          })
      }
  })

  $('.delete-app').click(function () {
      var appId = $(this).data('appId')
      if (!appId) return

      peermetrics.delete(peermetrics.urls['apps'] + '/' + appId)
      .then(function () {
          window.location.reload()
      }).catch(function (err) {
          console.error(err)
      })
  })

  $('.pause-app-collection').click(function () {
      var appId = $(this).data('appId')
      var isRecording = $(this).data('recording')
      if (!appId) return

      peermetrics.put(peermetrics.urls['apps'] + '/' + appId, {
        recording: !isRecording
      }).then(function () {
          window.location.reload()
      }).catch(function (err) {
          console.error(err)
      })
  })
})