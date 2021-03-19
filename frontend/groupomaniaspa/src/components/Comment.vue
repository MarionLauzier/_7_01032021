<template>
	<div :key="componentKey">
		<p>{{ nbCom }} Commentaire(s)</p>
		<button
			type="button"
			v-show="detailComments === false"
			@click="detailComments = !detailComments"
		>
			Voir les commentaires
		</button>
		<button
			type="button"
			v-show="detailComments === true"
			@click="detailComments = !detailComments"
		>
			Masquer les commentaires
		</button>
		<div
			v-show="detailComments"
			v-for="comment in comments"
			:key="comment._id"
			:id="comment._id"
		>
			<a> {{ comment.User.pseudo }} </a>
			<span> - {{ setTimeDiff(comment.createdAt) }}</span>
			<p>{{ comment.content }}</p>
			<button
				type="button"
				v-if="comment.userId == userId"
				@click="modifyComment(comment._id)"
			>
				Modifier
			</button>
			<div :id="'mod_' + comment._id" style="display:none">
				<textarea
					type="text"
					maxlength="255"
					rows="3"
					:value="comment.content"
				></textarea>
				<button type="button" @click="updateComment(comment._id)">
					<i class="fas fa-comment-alt"></i> Modifier
				</button>
			</div>
			<button
				type="button"
				v-if="comment.userId == userId || isAdmin"
				@click="deleteComment(comment._id)"
			>
				Supprimer
			</button>
		</div>
		<p>{{ response }} la réponse</p>
	</div>
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
						let com = document.getElementById(id);
						com.remove();
						this.nbCom -= 1;
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
		modifyComment(id) {
			let modblock = document.getElementById("mod_" + id);
			if (modblock.style.display == "none") {
				modblock.style.display = "block";
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

<style></style>
