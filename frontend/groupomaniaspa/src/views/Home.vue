<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />
		<HelloWorld msg="Welcome to Your Vue.js App" />
		<Signup />
		<Login />
		<PostGag />
		<Like :isLiked="this.test" likes="3" dislikes="5" gagId="17" />
		<PostComment gagId="17" />
		<Comment gagId="17" nbComments="3" :showComments="this.test" />
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Signup from "@/components/Signup.vue";
import Login from "@/components/Login.vue";
import PostGag from "@/views/PostGag.vue";
import Like from "@/components/Like.vue";
import PostComment from "@/components/PostComment.vue";
import Comment from "@/components/Comment.vue";
export default {
	name: "Home",
	components: {
		HelloWorld,
		Signup,
		Login,
		PostGag,
		Like,
		PostComment,
		Comment,
	},
	data() {
		return { test: true };
	},
};
</script>
