<template>
	<section :key="componentKey" class="comment">
		<div class="comment__header">
			<p>{{ nbCom }} Commentaire(s)</p>
			<button
				class="btn btn__show"
				type="button"
				v-show="detailComments === false && nbCom > 0"
				@click="detailComments = !detailComments"
			>
				Voir les commentaires
			</button>
			<button
				class="btn btn__show"
				type="button"
				v-show="detailComments === true"
				@click="detailComments = !detailComments"
			>
				Masquer les commentaires
			</button>
		</div>
		<div
			v-show="detailComments"
			v-for="comment in comments"
			:key="comment._id"
			:id="'comment_' + comment._id"
			class="comment__container"
		>
			<img class="logo" alt="Groupomania logo" src="../assets/icon-black.png" />
			<router-link
				:to="{ name: 'Profile', params: { userId: comment.userId } }"
			>
				{{ comment.User.pseudo }}</router-link
			>
			<span> - publié il y a {{ setTimeDiff(comment.createdAt) }}</span>
			<div class="comment__content">
				<div class="comment__content1">
					<p>{{ comment.content }}</p>
					<div>
						<button
							class="btn btn--modify"
							type="button"
							v-if="comment.userId == userId"
							@click="modifyComment(comment._id)"
						>
							<em class="fas fa-edit"></em> Modifier
						</button>
						<button
							type="button"
							class="btn btn--delete"
							v-if="comment.userId == userId || isAdmin"
							@click="deleteComment(comment._id)"
						>
							<em class="fas fa-trash"></em> Supprimer
						</button>
					</div>
				</div>
				<div
					:id="'mod_' + comment._id"
					style="display:none"
					class="comment__modif"
				>
					<label
						:for="'mod_input' + comment._id"
						aria-hidden="false"
						style="display: none;"
					>
						Modification du commentaire :</label
					>
					<input
						:id="'mod_input' + comment._id"
						type="text"
						maxlength="255"
						:value="comment.content"
					/>
					<button type="button" @click="updateComment(comment._id)">
						<em class="fas fa-comment-alt"></em> Poster
					</button>
				</div>
			</div>
		</div>
		<p v-show="response">{{ response }}</p>
	</section>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "Comment",
	props: ["gagId", "nbComments", "showComments"],
	data() {
		return {
			componentKey: 0,
			detailComments: this.showComments,
			nbCom: parseInt(this.nbComments),
			comments: "",
			response: "",
		};
	},
	computed: { ...mapState(["userId", "isAdmin", "token"]) },
	methods: {
		setTimeDiff(date) {
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
		deleteComment(id) {
			let auth = "bearer " + this.token;
			let url =
				"http://localhost:3000/api/gag/" + this.gagId + "/comment/" + id;
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
						let com = document.getElementById("comment_" + id);
						com.remove();
						this.nbCom -= 1;
						this.response = "Votre commentaire a bien été supprimé!";
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
		modifyComment(id) {
			let modblock = document.getElementById("mod_" + id);
			if (modblock.style.display == "none") {
				modblock.style.display = "flex";
			} else {
				modblock.style.display = "none";
			}
		},
		updateComment(id) {
			let modblock = document.getElementById("mod_" + id);
			let content = modblock.firstChild.value;
			const body = { userId: this.userId, content: content };
			let auth = "bearer " + this.token;
			let url =
				"http://localhost:3000/api/gag/" + this.gagId + "/comment/" + id;
			fetch(url, {
				method: "PUT",
				headers: { "Content-Type": "application/json", Authorization: auth },
				body: JSON.stringify(body),
			})
				.then((res) => {
					if (!res.ok) {
						return res.json();
					} else {
						return "Votre commentaire a été modifié !";
					}
				})
				.then((message) => {
					if (message.error) {
						this.response = message.error;
					} else {
						this.response = message;
						for (let comment of this.comments) {
							if (comment._id == id) {
								comment.content = content;
							}
						}
						this.componentKey += 1;
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
	},
	created() {
		let auth = "bearer " + this.token;
		let url = "http://localhost:3000/api/gag/" + this.gagId + "/comment";
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
					this.comments = message;
				}
			})
			.catch((error) => {
				this.response = error;
			});
	},
};
</script>

<style lang="scss">
.comment {
	&__header {
		display: flex;
		align-items: center;
		border-top: 1px solid #192b48;
		margin-top: 0.5rem;
	}
	p {
		margin: 0.2rem 2rem;
	}
	&__container {
		text-align: left;
		padding: 0 2rem;
		margin-bottom: 0.5rem;
		a {
			color: #192b48;
			font-weight: bold;
		}
		p {
			text-align: left;
		}
	}
	&__content1 {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		row-gap: 0.5rem;
		align-items: center;
		p {
			margin: 0.1rem 0 0.1rem 0;
			color: lighten(#192b48, 20%);
		}
		.btn {
			font-size: 0.8rem;
			font-weight: 400;
			padding: 0.3rem 0.5rem;
			border-radius: 30px;
			margin: 0 0.1rem 0 0.1rem;
		}
	}
	&__modif {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;

		margin-top: 0.5rem;
		height: 23px;
		input {
			width: 100%;
			padding: 0 0.1rem 0 0.1rem;
			border: solid 2px #192b48;
			border-top-left-radius: 5px;
			border-bottom-left-radius: 5px;
			height: 23px;
			margin: 0;
			box-sizing: border-box;
			color: #192b48;
			&:focus {
				outline: none;
				box-shadow: 0 0 5px darken(#b3deff, 30%);
			}
		}
		button {
			box-sizing: border-box;
			font-size: 0.8rem;
			font-weight: 600;
			margin: 0px 0 0 -2px;
			padding: 0 0.2rem;
			color: #192b48;
			border-color: #192b48;
			border-top-right-radius: 5px;
			border-bottom-right-radius: 5px;
			background-color: #ffd7d7;
			font-family: "Blinker", Arial, sans-serif;
			transition: 150ms;
			height: 23px;
			white-space: nowrap;
		}
	}
}
.btn.btn__show {
	color: #c32240;
	background: #cde9ff;
	box-shadow: 1px 1px 4px darken(#b3deff, 15%);
}
</style>
