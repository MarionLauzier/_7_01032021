<template>
	<article :key="componentKey" class="gag">
		<div class="gag__header">
			<img class="logo" alt="Groupomania logo" src="../assets/icon-black.png" />
			<router-link :to="{ name: 'Profile', params: { userId: gagUserId } }">{{
				pseudo
			}}</router-link>
			<span> - publié il y a {{ setTimeDiff(createdAt) }}</span>
		</div>
		<router-link :to="{ name: 'OneGag', params: { gagId: gagId } }">
			<p class="gag__description">{{ description }}</p>
			<img :src="imageUrl" :alt="'image gag' + gagId" class="gag__image" />
		</router-link>
		<Like
			:likes="likes"
			:dislikes="dislikes"
			:isLiked="isLiked"
			:gagId="gagId"
		/>
		<button
			class="btn btn--modify"
			type="button"
			v-if="gagUserId == userId"
			@click="modifyGag"
		>
			<i class="fas fa-edit"></i> Modifier
		</button>
		<button
			class="btn btn--delete"
			type="button"
			v-if="gagUserId == userId || isAdmin"
			@click="deleteGag(gagId)"
		>
			<i class="fas fa-trash"></i> Supprimer
		</button>
		<Comment :gagId="gagId" :nbComments="nbComs" :showComments="showComments" />
		<PostComment :gagId="gagId" @reload-comments="incrKey" />
		<p class="gag__resp" v-show="response">{{ response }}</p>
	</article>
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
			nbComs: this.nbComments,
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
			} else {
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
			this.componentKey += 1;
			this.nbComs += 1;
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

<style lang="scss">
.gag {
	background-color: white;
	width: 40%;
	margin: 2rem auto;
	border-radius: 20px;
	padding: 2rem 0;
	box-sizing: border-box;
	box-shadow: 0px 0px 10px #192b48;
	text-align: center;
	&__header {
		text-align: left;
		border-bottom: 1px solid #192b48;
		box-sizing: border-box;
		padding: 0 3rem 0.5rem 3rem;

		a {
			color: #192b48;
			font-weight: bold;
			display: inline-block;
			transition: transform 150ms;
			&:hover,
			&:focus {
				transform: scale(1.05);
				outline: none;
			}
		}
	}
	& > a {
		text-decoration: none;
	}
	&__description {
		padding: 0 3rem;
		text-align: center;
		color: #192b48;
		text-decoration: none;
	}
	&__image {
		max-height: 50vh;
		min-height: 25vh;
		max-width: 100%;
	}
}
.btn {
	padding: 0.5rem;
	border-radius: 5px;
	font-weight: bold;
	transition: transform 150ms;
	margin: 0.5rem;
	border: none;
	font-family: inherit;
	&:hover {
		transform: scale(1.05);
	}
}

.btn--modify {
	color: white;
	background: lighten(#192b48, 10%);
	box-shadow: 1px 1px 4px darken(#192b48, 15%);
}
.btn--delete {
	color: white;
	background: #c32240;
	box-shadow: 1px 1px 4px darken(#c32240, 15%);
}
.logo {
	width: 25px;
	vertical-align: middle;
	margin: 0 0.25rem;
}
.gag__resp {
	margin: 0.2rem 0;
}
</style>
