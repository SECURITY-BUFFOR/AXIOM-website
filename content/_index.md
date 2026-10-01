---
title: 'AXIOM — Pentest Reporting Platform'
description: 'AXIOM is a pentest reporting platform by Security Buffor: structured findings, CVSS scoring, live collaboration, scanner imports, and client-ready PDF reports.'

hero:
  kicker: 'Pentest reporting platform'
  lead: 'Findings in. Reports out.'
  text: 'Create findings, generate PDF reports, and collaborate in real time — one workspace for the whole engagement.'
  screen: 'images/axiom/slides/04-project-overview.png'
  screen_alt: 'AXIOM project workspace with findings, members, notes, and report actions'
  screen_title: 'AXIOM — PROJECT WORKSPACE'
  primary: { text: 'Take the tour', url: '#tour' }
  secondary: { text: 'Request a demo', url: 'mailto:h4mr3r@securitybuffor.com?subject=AXIOM%20demo' }
  specs:
    - { key: 'Scoring', value: 'CVSS 3.1 + 4.0' }
    - { key: 'Output', value: 'PDF via WeasyPrint' }
    - { key: 'Editing', value: 'Live, conflict-free' }
    - { key: 'Import', value: 'Burp · Nessus · Nmap · ZAP' }

trust:
  items:
    - { name: 'Self-hosted', text: 'Runs entirely on your own infrastructure. No engagement data leaves it.' }
    - { name: 'Encrypted at rest', text: 'Uploads and secrets sealed with AES-256-GCM.' }
    - { name: 'Hardened access', text: 'TOTP, FIDO2, and backup codes on every operator account.' }

pipeline:
  title: 'Engagement pipeline'
  steps:
    - { name: 'Import', text: 'Pull scanner output into findings.' }
    - { name: 'Author', text: 'Write from structured templates.' }
    - { name: 'Score', text: 'Rate severity with built-in CVSS.' }
    - { name: 'Review', text: 'Comment and co-edit live.' }
    - { name: 'Deliver', text: 'Export a client-ready PDF.' }

tour:
  title: 'Product tour'
  text: 'Follow an assessment from secure access and reusable project types through findings, collaboration, and client-ready reports.'

features:
  title: 'Features'
  text: 'Professional pentest reporting with a terminal-noir aesthetic.'
  items:
    - name: 'PDF report generation'
      description: 'WeasyPrint-powered output with cover pages, automatic table of contents, severity-coloured finding cards, and full MonoBlood styling.'
    - name: 'Real-time collaboration'
      description: 'Several pentesters edit the same project at once — Yjs-powered conflict-free editing with live cursor presence.'
    - name: 'Finding management'
      description: 'CVSS 3.1 and 4.0 scoring, severity classification, and structured fields for observation, impact, and recommendation.'
    - name: 'Custom project types'
      description: 'Define report sections, finding fields, HTML templates, and CSS per engagement type, then reuse them across teams.'
    - name: 'Scanner import'
      description: 'Bring findings in from Burp Suite, Nessus, Nmap, and ZAP. The importer registry is extensible through plugins.'
    - name: 'Plugin system'
      description: 'Extend AXIOM with Django app plugins: API endpoints, template tags, signal handlers, importers, and frontend pages.'

showcase:
  title: 'Report template'
  text: 'Start from a complete A4 report design instead of a blank page. Drop it into a project type and adapt it to your house style.'
  chips_label: "What's inside"
  scale_label: 'Severity scale'
  chips:
    - 'Cover page'
    - 'Table of contents'
    - 'Finding cards'
    - 'Severity system'
    - 'Data tables'
    - 'Code blocks'
    - 'Lists & markers'
    - 'Typography'
  scale: ['Critical', 'High', 'Medium', 'Low', 'Info']

modules:
  title: 'Plugins'
  text: 'AXIOM plugins are regular Django apps. Each one can add its own endpoints, importers, report helpers, and pages to the workspace.'
  points_label: 'Extension points'
  extensions:
    - { name: 'API endpoint', text: 'Add routes under /api/plugins/' }
    - { name: 'Template tags', text: 'Custom tags and filters for reports' }
    - { name: 'Importer', text: 'Turn any file format into findings' }
    - { name: 'Signals', text: 'React to project and finding events' }
    - { name: 'Frontend', text: 'Embed a page in the AXIOM sidebar' }

cta:
  kicker: 'Get in touch'
  title: 'See AXIOM on a real engagement.'
  text: 'AXIOM is not public. Reach out for a walkthrough or to hear when it becomes available.'
  primary: { text: 'Request a demo', url: 'mailto:h4mr3r@securitybuffor.com?subject=AXIOM%20demo' }
  secondary: { text: 'More from Security Buffor', url: 'https://securitybuffor.com' }
---
