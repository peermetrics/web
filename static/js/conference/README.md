## About

This folder contains the files for the Conference page.

This is one of the main pages of the app displaying all the details about what happened during a conference

## Sections

### Header

In the top part we display general info about the conference

- Conference name: the user might omit this. in that case we should show `No conference name`
- Conference id: the id given by the user
- Conference date: the date in format YYYY-MM-DD
- Conference time: time in UTC in format `start - end`. The conference object has `start_time` on it, if that is missing, use the `created_at`. `start_time` is a timestamp when the first PeerConnection has been created, that's why it's more accurate than `created_at`

### Main section

In the main section of the page we have 2 tabs: Overview and Graphs

#### Overview

This tab displays general info about the conference. Sections

##### Participants

A list of cards of all the participants that took part in this conference. Each card should have the following structure:

- header: participant name and participant id. If the name is missing, just use the id
- body:
  - time in conference: how much this participant spent with an active PeerConnection
  - info about OS, browser, input/output devices
  - location
- footer - TODO



##### Connections

In this section for each participant we show the connections he had during this conference.

Each participant has a timeline where we'll show events that are relevant to him. All timelines use the same start and finish. All events are relative to them.

- start: `created_at` from the first session
- end:  `created_at` from the last event

Events on the participant timeline:

- page presence
- `getUserMedia` requests
- mute/unmute
- custom event

Clicking on a timeline will display the connections this participant had (we'll call them peers). Each peer has it's own timeline that shows events between the participant and this peer.

Events:

- connecting_successfully:
- connecting_failed:
- connected:
- renegotation_failed:
- reconnected_successfully:
- reconnected_failed:

#### Map

A map with locations of all the participants