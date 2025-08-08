---
pagination:
  data: talks
  size: 1
  alias: talk
eleventyComputed:
  title: "{{ talk.title }}"
layout: "layouts/talk.njk"
permalink: "/2025/talks/{{ talk.title | slugify }}/index.html"
---
