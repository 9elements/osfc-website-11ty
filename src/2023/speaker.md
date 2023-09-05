---
pagination:
  data: speakers
  size: 1
layout: "layouts/speaker.html"
eleventyComputed:
  title: "{{ pagination.items[0].name }}"
permalink: "2023/speakers/{{ pagination.items[0].name | slugify }}/index.html"
---
