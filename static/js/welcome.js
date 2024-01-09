$(document).ready(() => {
    var orgName = $('#organization-name')
    var appName = $('#application-name')

    var orgId = null
    var appId = null

    var createOrganization = function(name) {
        return peermetrics.post(peermetrics.urls['organizations'], {
            name: name
        })
    }

    var createApp = function(name) {
        return peermetrics.post(peermetrics.urls['apps'], {
            organization: orgId,
            name: name
        })
    }

    window.wizartStep = $('.wizard').smartWizard({
        transitionEffect: 'fade',
        showStepURLhash: false,
        toolbarSettings: { toolbarPosition: 'none' },
    })
    
    window.wizartStep.on('leaveStep', function (ev, evObject, step) {
        var self = this
        if (step === 0) {
            if (orgId) return true

            if (!orgName.val()) {
                orgName.addClass('is-invalid')
            } else {
                orgName.removeClass('is-invalid')
                createOrganization(orgName.val())
                .then(function (res) {
                    orgId = res.data.id
                    // go to the next step
                    // self.next()
                    // hacky way, because self.next() doesn't work
                    $('.create-org').click()
                })
            }
            return false
        } else if (step === 1) {
            if (appId) return true

            if (!appName.val()) {
                appName.addClass('is-invalid')
            } else {
                appName.removeClass('is-invalid')
                createApp(appName.val())
                .then(function (res) {
                    appId = res.data.id
                    // go to the next step
                    // self.next()
                    $('.create-app').click()
                })
            }
            return false
        }
    })
});