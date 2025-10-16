<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <body class="body">
    <header class="site-header"> <SiteHeader /> </header>

    <div class="blog">
    <h1 class="title"> about me </h1>
      <p class="content">
        progamer 🎮 prohacker 💀
      </p>
      <p class="content">
        fromsoftware fan ❤️‍🔥
      </p>
      <p class="content">
        graphics programming 🥵
      </p>
      <p class="content">
        arch linux 😳
      </p>
    </div>

    <footer class="site-footer"> <SiteFooter /> </footer>
  </body>
</template>

<style scoped>
.blog {
  border: 1px solid #b3ff00;
  padding: 20px;
}

.title {
  text-align: left;
  font-size: 32px;
  font-style: italic;
  max-width: 768px;
  margin-bottom: 0px;
}

.content{
  text-align: left;
  font-size: 24px;
  font-weight: 300;
  max-width: 768px;
}
</style>
