<template>
	<div :key="componentKey">
		<router-link :to="{ name: 'Profile', params: { userId: gagUserId } }">
			{{ pseudo }}
		</router-link>
		<span> - {{ setTimeDiff(createdAt) }}</span>
		<router-link :to="{ name: 'OneGag', params: { gagId: gagId } }">
			<p>{{ description }}</p>
			<img :src="imageUrl" :alt="'image gag' + gagId" />
		</router-link>
		<Like
			:likes="likes"
			:dislikes="dislikes"
			:isLiked="isLiked"
			:gagId="gagId"
		/>
		<button type="button" v-if="gagUserId == userId" @click="modifyGag">
			Modifier
		</button>
		<button
			type="button"
			v-if="gagUserId == userId || isAdmin"
			@click="deleteGag(gagId)"
		>
			Supprimer
		</button>
		<Comment
			:gagId="gagId"
			:nbComments="nbComments"
			:showComments="showComments"
		/>
		<PostComment :gagId="gagId" @reload-comments="incrKey" />
		<p>{{ response }} la réponse</p>
	</div>
</template>

<script>
import { mapState } from "vuex";
import Like from "@/components/Like.vue";
import Comment from "@/components/Comment.vue";
import PostComment from "@/components/PostComment.vue";
export default {
	name: "Gag",
	components: { Like, Comment, PostComment },
	props: [
		"gagId",
		"gagUserId",
		"pseudo",
		"createdAt",
		"description",
		"imageUrl",
		"likes",
		"dislikes",
		"isLiked",
		"nbComments",
		"showComments",
	],
	data() {
		return {
			componentKey: 0,
			response: "",
		};
	},
	computed: { ...mapState(["userId", "isAdmin", "token"]) },
	methods: {
		setTimeDiff(date) {
			//let time = Date.parse(date);
			let time = new Date(date);
			let diff = Date.now() - time;
			if (diff > 1000 * 60 * 60 * 24 * 30) {
				return time.toLocaleDateString("fr-FR", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				});
			} else if (diff >= 1000 * 60 * 60 * 24) {
				let diffj = Math.round(diff / (1000 * 60 * 60 * 24));
				return diffj + " jour(s)";
			} else if (diff >= 1000 * 60 * 60) {
				let diffh = Math.round(diff / (1000 * 60 * 60));
				return diffh + " heure(s)";
			} else if (diff >= 1000 * 60) {
				let diffm = Math.round(diff / (1000 * 60));
				return diffm + " minute(s)";
			}
		},
		deleteGag(id) {
			let auth = "bearer " + this.token;
			let url = "http://localhost:3000/api/gag/" + id;
			fetch(url, {
				method: "DELETE",
				headers: { Authorization: auth },
			})
				.then((res) => {
					return res.json();
				})
				.then((message) => {
					if (message.error) {
						this.response = message.error;
					} else {
						let path = this.$route.path;
						if (path == "/") {
							let gag = document.getElementById(id);
							gag.remove();
						} else {
							this.$router.push({ name: "Home" });
						}
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
		incrKey() {
			console.log("hello");
			this.componentKey += 1;
		},
		modifyGag() {
			const gag = {
				gagId: this.gagId,
				description: this.description,
				imageUrl: this.imageUrl,
			};
			this.$store.dispatch("saveGag", gag);
			this.$router.push({ name: "PostGag", query: { mod: true } });
		},
	},
};
</script>

<style></style>
