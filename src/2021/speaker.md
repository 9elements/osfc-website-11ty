---
pagination:
  data: speakers
  size: 1
eleventyComputed:
  title: "{{ pagination.items[0].name }}"
  permalink: "2021/speakers/{{ pagination.items[0].name | slugify }}/index.html"
layout: "layouts/speaker.html"
---
