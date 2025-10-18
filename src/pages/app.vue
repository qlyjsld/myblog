<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { ref } from 'vue'

import axios from 'axios';

const loggedIn = ref(false)
const username = ref('')
const usernameInput = ref('')
const passwd = ref('')

function usernameMatch(commentUsername: string) {
	return username.value == commentUsername || username.value == 'jay'
}

async function login() {
	const postData = { username: usernameInput.value, passwd: passwd.value};
	try {
		const token = await axios.post('/api/login', postData);
		loggedIn.value = true;
		username.value = usernameInput.value
	}
	catch (e) {
		console.log(e);
	}
}

async function initauth() {
	const payload: any = await axios.post('/api/auth', {withCredentials: true})
	username.value = payload.data.username
	if (username.value.length > 0) loggedIn.value = true
}

initauth()

function formatDate(date: Date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;

    return `${day} ${month} @ ${formattedHours}:${minutes}${ampm}`;
}

interface comment {
	id: number;
	username: string;
	comment: string;
	time: string;
}

const comments = ref<comment[]>([])
const newComment = ref('')
const pages = ref<number[]>([])
let currentPage = 0
let commentsCount = 0

async function submit() {
	const postData = { username: username.value, comment: newComment.value};
	const response = await axios.post('/api/comments', postData, {withCredentials: true})
	newComment.value = ''
	commentsCount++
	updatePages()
	fetchpage(0)
}

async function fetchpage(page: number) {
	currentPage = page
	const getQuery = await axios.get('/api/comments/query',
		{params: {page: page, size: 3}})
	comments.value = getQuery.data

	for (const c of comments.value)
		c.time = formatDate(new Date(c.time));
}

async function initpages() {
	const getQuery = await axios.get('/api/comments/query?page=0&size=3')
	comments.value = getQuery.data

	const getCount = await axios.get('/api/comments/count')
	commentsCount = getCount.data[0].count

	for (let i = 1; i <= Math.ceil(commentsCount / 3); i++)
		pages.value.push(i)
	for (const c of comments.value)
		c.time = formatDate(new Date(c.time));
}

initpages()

function updatePages() {
	pages.value = []
	for (let i = 1; i <= Math.ceil(commentsCount / 3); i++)
		pages.value.push(i)
}

async function deleteComment(id: number) {
	const deleteReq = await axios.delete('/api/comments/' + id, {withCredentials: true})
	commentsCount--
	updatePages()
	fetchpage(currentPage)
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

    <div v-if="loggedIn" class="submit">
		<form class="textarea" @submit.prevent="submit">
		<textarea v-model="newComment" required
			placeholder="add a comment"></textarea>
		<button class="submit-button">submit</button>
		</form>
    </div>

	<div v-else class="login-pages-wrapper">
		<div class="login">
			<form @submit.prevent="login()">
			<input type="text" class="username-input" v-model="usernameInput" required
				placeholder="username"></input>
			<input type="password" class="passwd-input" v-model="passwd" required
				placeholder="passwd"></input>
			<button class="login-button">login</button>
			</form>
		</div>
	</div>

	<div class="login-pages-wrapper">
		<div class="pages-button" v-for="page in pages">
			<button @click="fetchpage(page - 1)">{{page}}</button>
		</div>
	</div>

	<div class="comments">
		<li class="comment" v-for="comment in comments.slice()">
			<div class="comment-header">
				<h3 class="username">{{ comment.username }} {{ comment.time }} </h3>
				<button v-if="usernameMatch(comment.username)" @click="deleteComment(comment.id)">x</button>
			</div>
			<pre class="comment-content">{{ comment.comment }}</pre>
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

.textarea {
	display: flex;
}

.submit-button {
	height: 50%;
	align-self: center;
	margin: 5px;
}

.login-pages-wrapper {
	display: flex;
	width: 100%;
	max-width: 768px;
	justify-content: end;
}

.pages-button {
	margin: 5px;
}

.username-input {
	margin: 5px;
}

.passwd-input {
	margin: 5px;
}

.login-button {
	margin: 5px;
}

.comments {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 768px;
	width: 100%;
}

.comment {
	border: 1px solid #ff79c7;
	padding: 10px;
	margin: 5px;
	width: 100%;
	list-style-type: none; 
}

.comment-header {
	display: flex;
	justify-content: space-between;
}

.username {
	text-align: left;
	font-size: 16px;
	font-weight: 300;
	margin: 3px;
}

.time {
	text-align: left;
	font-size: 16px;
	font-weight: 300;
}

.comment-content {
	text-align: left;
	font-size: 16px;
	font-weight: 300;
	text-wrap: auto;
}
</style>
