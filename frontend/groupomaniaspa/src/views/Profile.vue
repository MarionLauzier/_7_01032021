<template>
	<div>
		<Navbar />
		<section id="idcard">
			<h1>Profil de {{ pseudo }}</h1>

			<p>
				<img
					class="logo"
					alt="Groupomania logo"
					src="../assets/icon-black.png"
				/>{{ pseudo }} - inscrit depuis le {{ since }}
			</p>
			<p v-if="userId == $route.params.userId">email : {{ email }}</p>
			<p>département : {{ departement }}</p>
			<button
				class="btn btn--modify"
				type="button"
				v-if="userId == $route.params.userId"
				@click="unsuscribe"
			>
				Se désinscrire
			</button>
			<p v-if="userId == $route.params.userId" class="alert">
				<em class="fas fa-exclamation-triangle"></em> Attention, la
				désincription entraîne la suppression de l'ensemble des avis et des
				commentaires postés par l'utilisateur ainsi que tous ses gags y compris
				les commentaires et les avis qui leurs sont associés.
				<em class="fas fa-exclamation-triangle"></em>
			</p>
		</section>

		<h2 v-if="gags[0]">Les gags les plus récents de {{ pseudo }}:</h2>
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
<style lang="scss">
#idcard {
	box-sizing: border-box;
	background: #cde9ff;
	width: 25%;
	min-width: 350px;
	margin: 1rem auto;
	padding: 1rem;
	border-radius: 20px;
	box-shadow: 0 0 10px darken(#cde9ff, 20%);
	h1 {
		margin-top: 0;
	}
	button {
		font-size: 1rem;
		margin: 0;
		&:hover + .alert {
			display: block;
		}
		&:focus + .alert {
			display: block;
		}
	}
	.alert {
		display: none;
		padding-top: 0.5rem;
	}
}
h2 {
	color: white;
	background-color: #192b48;
}
@media all and (max-width: 400px) {
	#idcard {
		width: 100%;
		min-width: 0px;
	}
}
</style>
