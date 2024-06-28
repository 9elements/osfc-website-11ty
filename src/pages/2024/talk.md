---
pagination:
  data: talks
  size: 1
  alias: talk
eleventyComputed:
  title: "{{ talk.title }}"
layout: "layouts/talk.njk"
permalink: "/2024/talks/{{ talk.title | slugify }}/index.html"
---
