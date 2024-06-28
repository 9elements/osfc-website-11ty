---
pagination:
  data: speakers
  size: 1
layout: "layouts/speaker.njk"
eleventyComputed:
  title: "{{ pagination.items[0].name }}"
permalink: "2024/speakers/{{ pagination.items[0].name | slugify }}/index.html"
---
