<template>
	<div>
		<Navbar />
		<h1>Profile de {{ pseudo }}</h1>
		<p v-if="userId == $route.params.userId">email : {{ email }}</p>
		<p>{{ pseudo }} - inscrit depuis le {{ since }}</p>
		<p>département : {{ departement }}</p>
		<button
			type="button"
			v-if="userId == $route.params.userId"
			@click="unsuscribe"
		>
			Se désinscrire
		</button>
		<p v-if="gags[0]">Les gags les plus récents de {{ pseudo }}:</p>
		<div v-for="gag in gags" :key="gag._id" :id="gag._id">
			<Gag
				:gagId="gag._id"
				:gagUserId="gag.userId"
				:pseudo="gag.User.pseudo"
				:createdAt="gag.createdAt"
				:description="gag.description"
				:imageUrl="gag.imageUrl"
				:likes="gag.likes"
				:dislikes="gag.dislikes"
				:isLiked="isLiked(gag.Likes)"
				:nbComments="gag.nbComments"
				:showComments="showComments"
			/>
		</div>
	</div>
</template>

<script>
import Gag from "@/components/Gag.vue";
import Navbar from "@/components/Navbar.vue";
import { mapState } from "vuex";
export default {
	name: "Profile",
	components: {
		Navbar,
		Gag,
	},
	data() {
		return {
			email: "",
			pseudo: "",
			departement: "",
			since: "",
			gags: "",
			response: "",
			showComments: false,
		};
	},
	computed: {
		...mapState(["userId", "isAdmin", "token"]),
	},
	methods: {
		isLiked(likes) {
			if (likes[0]) {
				return likes[0].isLiked;
			} else {
				return "";
			}
		},
		unsuscribe() {
			let auth = "bearer " + this.token;
			let url =
				"http://localhost:3000/api/auth/unsuscribe/" +
				this.$route.params.userId;
			fetch(url, {
				method: "DELETE",
				headers: {
					Authorization: auth,
				},
			})
				.then((res) => {
					return res.json();
				})
				.then((message) => {
					if (message.error) {
						this.response = message.error;
					} else {
						this.response = message;
						this.$router.push({ name: "Home" });
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
	},
	created() {
		let auth = "bearer " + this.token;
		let url =
			"http://localhost:3000/api/auth/profile/" + this.$route.params.userId;
		fetch(url, {
			method: "GET",
			headers: { Authorization: auth },
		})
			.then((res) => {
				return res.json();
			})
			.then((message) => {
				if (message.error) {
					this.response = message.error;
				} else {
					this.email = message.email;
					this.pseudo = message.pseudo;
					let date = new Date(message.createdAt);
					this.since = date.toLocaleDateString("fr-FR", {
						year: "numeric",
						month: "long",
						day: "numeric",
					});
					this.departement = message.departement;
					this.gags = message.Gags;
				}
			})
			.catch((error) => {
				this.response = error;
			});
	},
};
</script>
