from django.shortcuts import render
from django.views.generic import View


class HowItWorksView(View):
    template_name = 'how_it_works.html'
    journey_steps = [
        {
            'title': 'Overview',
            'caption': 'Open with a health snapshot that shows whether releases improved call quality.',
        },
        {
            'title': 'Key metric',
            'caption': 'Highlight the main regression immediately so support and engineering see the same story.',
        },
        {
            'title': 'Drilldown',
            'caption': 'Trace the issue to browser, region, and network conditions without needing production access.',
        },
        {
            'title': 'Action',
            'caption': 'Turn the finding into a concrete fix list for the next rollout.',
        },
    ]
    demo_scenarios = [
        {
            'id': 'improving',
            'label': 'Improving release',
            'teaser': 'Show a healthy team proving the last release worked.',
            'account_name': 'Acme Video',
            'environment': 'Production environment',
            'summary': 'Mocked operational data for a seven-day quality review after a successful release.',
            'score': '91',
            'score_label': 'Improving',
            'score_tone': 'healthy',
            'score_delta': '+18 points after the rollback fix shipped',
            'spotlight_eyebrow': 'Release takeaway',
            'spotlight_title': 'Join time dropped below two seconds across the highest-value traffic segment.',
            'spotlight_copy': 'This is the polished happy path for the walkthrough: leaders see the outcome first, then the evidence behind it.',
            'impacted_label': '24 sessions impacted',
            'trend_title': 'Call quality score after the last release',
            'trend_delta': '+18 score',
            'kpis': [
                {'label': 'Call success rate', 'value': '98.7%', 'delta': '+1.9 pts vs last week', 'tone': 'success'},
                {'label': 'Median join time', 'value': '1.8s', 'delta': '-320ms after the last deploy', 'tone': 'success'},
                {'label': 'Impacted sessions', 'value': '24', 'delta': 'Down from 61 in the previous 7 days', 'tone': 'success'},
                {'label': 'Recovered revenue at risk', 'value': '$18.4k', 'delta': 'Flagged from enterprise support workflows', 'tone': 'primary'},
            ],
            'trend_points': [73, 76, 74, 81, 84, 88, 91],
            'issue_breakdown': [
                {'label': 'Packet loss spikes', 'share': 34},
                {'label': 'Slow ICE negotiation', 'share': 27},
                {'label': 'Browser audio routing', 'share': 21},
                {'label': 'CPU saturation', 'share': 18},
            ],
            'regions': [
                {'name': 'US East', 'status': 'Healthy', 'value': '99.3%', 'tone': 'healthy'},
                {'name': 'Europe', 'status': 'Watch', 'value': '97.8%', 'tone': 'watch'},
                {'name': 'APAC', 'status': 'Recovering', 'value': '96.9%', 'tone': 'recovering'},
            ],
            'recommendations': [
                'Raise TURN capacity in Frankfurt during the 08:00 to 11:00 UTC traffic window.',
                'Ship the new codec fallback for Safari clients below version 18.1.',
                'Alert customer success when session join time exceeds 3 seconds for paid accounts.',
            ],
        },
        {
            'id': 'atrisk',
            'label': 'At-risk account',
            'teaser': 'Tell the escalation story when one customer is melting down.',
            'account_name': 'Northstar Health',
            'environment': 'Enterprise workspace',
            'summary': 'A high-value account is seeing degraded session setup in a concentrated region and browser cohort.',
            'score': '62',
            'score_label': 'At risk',
            'score_tone': 'critical',
            'score_delta': 'Revenue risk rising after a Safari-heavy customer launch',
            'spotlight_eyebrow': 'Escalation view',
            'spotlight_title': 'Support can isolate the failing segment before engineering opens production dashboards.',
            'spotlight_copy': 'This version of the demo proves Peer Metrics can accelerate triage even when access to the live stack is restricted.',
            'impacted_label': '118 sessions impacted',
            'trend_title': 'Session reliability after the customer onboarding event',
            'trend_delta': '-21 score',
            'kpis': [
                {'label': 'Call success rate', 'value': '92.1%', 'delta': '-4.8 pts vs baseline', 'tone': 'danger'},
                {'label': 'Median join time', 'value': '4.6s', 'delta': '+1.7s in Safari cohorts', 'tone': 'danger'},
                {'label': 'Impacted sessions', 'value': '118', 'delta': 'Mostly concentrated in EMEA enterprise users', 'tone': 'warning'},
                {'label': 'Revenue at risk', 'value': '$47k', 'delta': 'Escalated by customer success this morning', 'tone': 'danger'},
            ],
            'trend_points': [88, 84, 78, 71, 68, 64, 62],
            'issue_breakdown': [
                {'label': 'Safari codec negotiation', 'share': 41},
                {'label': 'TURN allocation failures', 'share': 24},
                {'label': 'ICE timeout spikes', 'share': 20},
                {'label': 'Audio route mismatch', 'share': 15},
            ],
            'regions': [
                {'name': 'US East', 'status': 'Watch', 'value': '95.1%', 'tone': 'watch'},
                {'name': 'Europe', 'status': 'Critical', 'value': '88.6%', 'tone': 'critical'},
                {'name': 'APAC', 'status': 'Watch', 'value': '94.3%', 'tone': 'watch'},
            ],
            'recommendations': [
                'Pin Safari traffic to the fallback codec profile while the negotiation patch is verified.',
                'Increase TURN headroom in Frankfurt and London before the next enterprise training block.',
                'Have customer success notify Northstar Health with an ETA and a scoped mitigation plan.',
            ],
        },
        {
            'id': 'recovery',
            'label': 'Recovery week',
            'teaser': 'Demonstrate progress after an incident with a tighter action plan.',
            'account_name': 'Beacon Events',
            'environment': 'Global live events cluster',
            'summary': 'Incident response has stabilized the platform, and the team is validating whether the fix is holding.',
            'score': '78',
            'score_label': 'Recovering',
            'score_tone': 'recovering',
            'score_delta': '+11 points since the incident bridge closed',
            'spotlight_eyebrow': 'Recovery watch',
            'spotlight_title': 'The story shifts from detection to confidence-building as each region returns to baseline.',
            'spotlight_copy': 'This scenario makes the walkthrough feel more complete because it shows how the product supports follow-through after the page goes green.',
            'impacted_label': '43 sessions impacted',
            'trend_title': 'Reliability score during post-incident validation',
            'trend_delta': '+11 score',
            'kpis': [
                {'label': 'Call success rate', 'value': '96.4%', 'delta': '+2.7 pts since Tuesday', 'tone': 'success'},
                {'label': 'Median join time', 'value': '2.4s', 'delta': '-910ms after failover tuning', 'tone': 'success'},
                {'label': 'Impacted sessions', 'value': '43', 'delta': 'Down from 139 during the incident', 'tone': 'success'},
                {'label': 'Open action items', 'value': '5', 'delta': 'Two require follow-up in APAC', 'tone': 'primary'},
            ],
            'trend_points': [67, 69, 72, 74, 75, 77, 78],
            'issue_breakdown': [
                {'label': 'Residual packet loss', 'share': 31},
                {'label': 'CPU saturation', 'share': 26},
                {'label': 'Regional failover lag', 'share': 24},
                {'label': 'Client retry churn', 'share': 19},
            ],
            'regions': [
                {'name': 'US East', 'status': 'Healthy', 'value': '98.4%', 'tone': 'healthy'},
                {'name': 'Europe', 'status': 'Recovering', 'value': '96.8%', 'tone': 'recovering'},
                {'name': 'APAC', 'status': 'Watch', 'value': '95.9%', 'tone': 'watch'},
            ],
            'recommendations': [
                'Keep failover routing in place for another 48 hours while Europe continues to normalize.',
                'Audit CPU-heavy publishers from the live events template and pre-warm alternative pools.',
                'Use the recovery summary in Monday customer reviews to show confidence trending back up.',
            ],
        },
    ]

    def get(self, request, *args, **kwargs):
        context = {
            'title': 'How Peer Metrics Works',
            'journey_steps': self.journey_steps,
            'demo_scenarios': self.demo_scenarios,
            'initial_scenario_id': self.demo_scenarios[0]['id'],
        }

        return render(request, self.template_name, context)
