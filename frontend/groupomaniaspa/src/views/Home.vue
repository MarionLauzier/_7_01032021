<template>
	<div class="home">
		<Navbar />
		<div v-if="!userId" id="notconnected">
			<img alt="logo" src="../assets/icon-above-font.png" />
			<h1>Social Network</h1>
			<p>
				Veuillez <router-link to="/signup">vous inscrire</router-link> ou
				<router-link to="/login">vous connecter</router-link> pour consulter le
				site.
			</p>
		</div>

		<div v-else>
			<form v-on:submit.prevent>
				<label for="research">
					Trouvez vos gags :
				</label>
				<div>
					<input type="search" id="research" v-model="search" />
					<button type="submit" @click="getGags">
						<span class="fas fa-search"></span> Rechercher
					</button>
					<div>
						<button type="button" @click="sortQuery('recent')">
							<i class="fas fa-calendar-alt"></i> Les + récents
						</button>
						<button type="button" @click="sortQuery('popular')">
							<i class="fas fa-thumbs-up"></i> Les + populaires
						</button>
						<button type="button" @click="sortQuery('unpopular')">
							<i class="fas fa-thumbs-down"></i> Les - populaires
						</button>
						<button type="button" @click="sortQuery('comment')">
							<i class="fas fa-comments"></i>Les + commentés
						</button>
					</div>
					<p>{{ response }}</p>
				</div>
			</form>
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

			<button type="button" v-if="page > 1" @click="previousPage">
				<i class="fas fa-chevron-circle-left"></i> Page précédente
			</button>
			<button type="button" v-if="gags.length == 10" @click="nextPage">
				Page suivante <i class="fas fa-chevron-circle-right"></i>
			</button>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import Gag from "@/components/Gag.vue";
import Navbar from "@/components/Navbar.vue";
import { mapState } from "vuex";
export default {
	name: "Home",
	components: {
		Gag,
		Navbar,
	},
	data() {
		return {
			sort: "",
			search: "",
			page: 1,
			response: "",
			gags: "",
			showComments: false,
		};
	},
	computed: {
		...mapState(["userId", "isAdmin", "token"]),
	},
	methods: {
		getGags() {
			let auth = "bearer " + this.token;
			let query = "?";
			if (this.sort) {
				query = query + "&sort=" + this.sort;
			}
			if (this.search) {
				query = query + "&search=" + this.search;
			}
			if (this.page) {
				query = query + "&page=" + this.page;
			}
			let url = "http://localhost:3000/api/gag/" + query;
			fetch(url, { method: "GET", headers: { Authorization: auth } })
				.then((res) => {
					return res.json();
				})
				.then((message) => {
					if (message.error) {
						this.response = message.error;
					} else {
						this.gags = message;
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
		isLiked(likes) {
			if (likes[0]) {
				return likes[0].isLiked;
			} else {
				return "";
			}
		},
		nextPage() {
			this.page += 1;
			this.getGags();
		},
		previousPage() {
			this.page -= 1;
			this.getGags();
		},
		sortQuery(criteria) {
			this.sort = criteria;
			this.getGags();
		},
	},
	created() {
		if (this.userId) {
			this.getGags();
		}
	},
};
</script>

<style lang="scss">
#home {
	min-height: 100%;
}

#notconnected {
	background: white;
	width: 60%;
	margin: 5rem auto 5rem auto;
	padding: 1rem;
	h1 {
		color: red;
		margin-top: -10px;
		font-family: Arial;
	}
	img {
		width: 70%;
	}
	p {
		color: #192b48;
		a {
			color: #192b48;
			font-weight: bold;
			//text-decoration: none;
		}
	}
}
</style>
