# Web service - peer metrics

> [!Note]
> This repo is only one part of the bigger peer metrics WebRTC monitoring service. Check out the full project [here](https://github.com/peermetrics/peermetrics).

Web, is the user facing part of peer metrics. It contains all the functionality to view and analyze the collected events



## How to run locally

To run this locally check the main [project page](https://github.com/peermetrics/peermetrics).

## Tech stack

- Language: Python 3.8
- Framework: Django
- DB: Postgres

### Frontend

##### TLDR:

- templates:  
  - static pages: Jinja2
  - dynamic: VueJs

- CSS: bootstrap + theme
- build tools: rollup
- charts: ChartJS

#### Static pages

Most of the pages pure HTML + CSS and some interactivity with jQuery. We use `Jinja2` for template rendering.

All new static page should textend `base.html`. If the page is for a logged in user it should extend `account_base.html`.

The main block in a page are:

- `{% block assets %}{% endblock %}`: used to add external JS, CSS resources. location: inside head
- `{% block content %}{% endblock %}`: main block of the page where all the main HTML will be added
- `{% block scripts %}{% endblock %}`: used to load JS scripts

##### Template vars

- `DEV`: if we are in a dev enviroment
- `template_vars`: object with settings. read from `settings.py`
- `url`: method used to create url paths. wrapper over Django's `reverse`
- `title`
- page specific: each page also has some custom template vars

#### Dynamic pages

Some heavy interaction pages (like participant or conference) are built with `VueJs`.

To start development on these, run:

1. `npm install`
2. `npm run watch`

We are using `rollup` to build the pages. Also, we don't use a project wide build with a single bundle, but we do it on a page by page basis. The watch command will build them individually. If dev starts on a new page that uses Vue, it will also need to be added in `rollup.config.js`.

To load that code in the page we use  (the old way):

<script src="/static/js/participant/index.js"></script>

##### Structure

Each page that's built with Vue, has it's own folder in `/static/js`.

The structure of that folder should be:

- `index.js` - the compiled Vue code that's directly loaded in the page
- `index.vue` - the main entry point in the page's app
- `/components` - folder where we put all the components used in the page

### Global peermertrics object

We have a global `peermetrics` object used capture some behavior that we want to standardize or reuse.

Structure:

- `get` - used to do GET requests to API
- `post`
- `put`
- `delete`
- `urls`: object containing mapping to API endoints:
  - 'sessions': '/sessions'
  - 'conferences': '/conferences'
  - etc.

- `colors`: object of color codes to be used across the app, mainly for charts

- `utils`: collection of useful functions
- `settings`: object set on page render. read from `template_vars`