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

		<div v-else id="connected">
			<form v-on:submit.prevent>
				<label for="research">
					Trouvez vos gags :
				</label>
				<div>
					<input
						type="search"
						id="research"
						v-model="search"
						placeholder="description"
					/>
					<button type="submit" @click="getGags">
						<span class="fas fa-search"></span>
						<span id="rech">Rechercher</span>
					</button>
				</div>
				<p>Filtrer par:</p>
				<div class="filters">
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
						<i class="fas fa-comments"></i> Les + commentés
					</button>
				</div>
				<p>{{ response }}</p>
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

			<button
				type="button"
				v-if="page > 1"
				@click="previousPage"
				class="btn btn--modify"
			>
				<i class="fas fa-chevron-circle-left"></i> Page précédente
			</button>
			<button
				type="button"
				v-if="gags.length == 10"
				@click="nextPage"
				class="btn btn--modify"
			>
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
	box-sizing: border-box;
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
		}
	}
}
@media all and (max-width: 991px) {
	#notconnected {
		width: 80%;
	}
}
@media all and (max-width: 600px) {
	#notconnected {
		width: 100%;
		margin: 2rem auto 2rem auto;
	}
}
#connected {
	form {
		width: 60%;
		label {
			margin-top: 0;
			font-weight: 600;
			font-size: 1.5rem;
		}
		& > div {
			margin: 1rem;
		}
		& > p {
			text-align: left;
			margin: 0;
		}
	}
	input[type="search"] {
		width: 100%;
		padding: 0 0.1rem 0 0.1rem;
		border: solid 2px #192b48;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		height: 30px;
		margin: 0;
		font-size: 1rem;
		box-sizing: border-box;
		color: #192b48;
		font-family: "Blinker", Arial, sans-serif;
		&:focus {
			outline: none;
			box-shadow: 0 0 5px darken(#b3deff, 30%);
		}
	}
	button[type="submit"] {
		box-sizing: border-box;
		font-size: 1rem;
		font-weight: 600;
		margin: 0px 0 0 -2px;
		padding: 0 0.2rem;
		color: #192b48;
		border-color: #192b48;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		background-color: #ffd7d7;
		font-family: "Blinker", Arial, sans-serif;
		transition: 150ms;
		height: 30px;
		white-space: nowrap;
	}

	.filters button {
		color: #c32240;
		background: #cde9ff;
		border: none;
		box-shadow: 1px 1px 4px darken(#b3deff, 15%);
		margin-top: 0;
	}
	& > button[type="button"] {
		font-size: 1rem;
		box-sizing: border-box;
		width: 150px;
	}
}
@media all and (max-width: 1300px) {
	#connected {
		form {
			width: 70%;
		}
	}
}
@media all and (max-width: 1050px) {
	#connected {
		form {
			width: 90%;
		}
	}
}
@media all and (max-width: 800px) {
	#connected {
		form {
			width: 100%;
			padding: 1rem;
			.filters {
				flex-wrap: wrap;
				justify-content: space-evenly;
				column-gap: 10px;
				button {
					margin: 0.5rem 0 0 0;
				}
			}
		}
	}
}

@media all and (max-width: 700px) {
	#connected {
		form {
			.filters {
				justify-content: space-between;
				row-gap: 0.5rem;
			}
		}
	}
}
@media all and (max-width: 400px) {
	#rech {
		display: none;
	}
}
</style>
