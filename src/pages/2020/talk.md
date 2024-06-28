---
pagination:
  data: talks
  size: 1
eleventyComputed:
  title: "{{ pagination.items[0].title }}"
layout: "layouts/talk.njk"
permalink: "2020/talks/{{ pagination.items[0].title | slugify }}/index.html"
---
