<script setup lang="ts">
import SiteHeader from '../../components/SiteHeader.vue'
import SiteFooter from '../../components/SiteFooter.vue'
</script>

<template>
  <body class="body">
    <header class="site-header"> <SiteHeader /> </header>

    <div class="blog">
    <h1 class="title"> testing the steam api </h1>
    <h2 class="date"> 10/16/25 </h2>
    <p class="content">
        blah blah blah
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
  text-align: center;
  font-size: 32px;
  font-style: italic;
  max-width: 768px;
  margin-bottom: 0px;
}

.date {
  text-align: center;
  font-size: 16px;
  font-style: italic;
  max-width: 768px;
  margin-top: 0px;
}

.content{
  text-align: left;
  font-size: 24px;
  font-weight: 300;
  max-width: 768px;
}
</style>
