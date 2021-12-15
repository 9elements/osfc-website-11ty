---
pagination:
  data: speakers
  size: 1
eleventyComputed:
  title: "{{ pagination.items[0].name }}"
layout: "layouts/speaker.html"
permalink: "2020/speakers/{{ pagination.items[0].name | slugify }}/index.html"
---
