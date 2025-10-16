<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { ref } from 'vue'

import axios from 'axios';

interface comment {
	id: number;
	username: string;
	comment: string;
	craeted_at: string;
}

const comments = ref<comment[]>([])

axios.get('/api/comments')
	.then(function(response) {
		comments.value = response.data
	})
	.catch(function(error) {})
	.finally(function() {});

async function submit() {

}
</script>

<template>
  <body class="body">
    <header class="site-header"> <SiteHeader /> </header>

    <div class="blog">
    <a href="/blog2.html"> <h1 class="title"> testing the steam api </h1> </a>
    <h2 class="date"> 10/16/25 </h2>
    <p class="content">
      in this blog i will try to make use of the data from steam api,
      lets see what can we do!
    </p>
    </div>

    <div class="blog">
    <a href="/blog1.html"> <h1 class="title"> Ohiyo! Konichiwa! Kombawa! </h1> </a>
    <h2 class="date"> 10/15/25 </h2>
    <p class="content">
      hi guys 😍 welcome to my blog, this is my first post!
      here you can see i sharing some of my exciting life (18+) 😏 ,
      click the link above!
    </p>
    </div>

    <div class="submit">
      <input placeholder="add a comment"></input>
      <button @click="submit">submit</button>
	  <button>signin</button>
    </div>

	<div class="comments">
		<li class="comment" v-for="comment in comments">
			<p class="username">{{ comment.username }}</p>
			<p class="comment-content">{{ comment.comment }}</p>
		</li>
	</div>

    <footer class="site-footer"> <SiteFooter /> </footer>
  </body>
</template>

<style scoped>
.blog {
	border: 1px solid #b3ff00;
	padding: 20px;
	margin: 20px;
	max-width: 768px;
	width: 100%;
}

.title {
	text-align: left;
	font-size: 32px;
	font-style: italic;
	max-width: 768px;
	margin-bottom: 0px;
}

.date {
	text-align: left;
	font-size: 24px;
	font-style: italic;
	max-width: 768px;
	margin-top: 0px;
}

.content {
	text-align: left;
	font-size: 24px;
	font-weight: 300;
	max-width: 768px;
}

.submit {
	margin: 30px;
	white-space: nowrap;
}

.comments {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 60%;
}

.comment {
	display: flex;
	flex-direction: row;
	border: 1px solid #b9ff9d;
	padding: 10px;
	margin: 5px;
	max-width: 768px;
	width: 100%;
	justify-content: space-around;
}

.username {
	text-align: left;
	font-size: 16px;
	font-style: italic;
}

.comment-content {
	text-align: left;
	font-size: 16px;
}

</style>
