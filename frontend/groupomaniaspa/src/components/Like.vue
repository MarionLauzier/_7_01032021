<template>
	<div>
		<button
			type="button"
			v-show="isLikedByUser === true"
			class="like"
			@click="postLike(0)"
		>
			<i class="fas fa-arrow-alt-circle-up"></i>J'aime
		</button>
		<button
			type="button"
			@click="postLike(1)"
			v-show="!isLikedByUser"
			:disabled="isLikedByUser === false"
		>
			<i class="fas fa-arrow-alt-circle-up"></i>J'aime
		</button>
		<p>{{ totalLikes }} J'aime</p>
		<button
			type="button"
			class="dislike"
			v-show="isLikedByUser === false"
			@click="postLike(0)"
		>
			<i class="fas fa-arrow-alt-circle-down"></i>Je n'aime pas
		</button>
		<button
			type="button"
			v-show="isLikedByUser !== false"
			:disabled="isLikedByUser === true"
			@click="postLike(-1)"
		>
			<i class="fas fa-arrow-alt-circle-down"></i>Je n'aime pas
		</button>
		<p>{{ totalDislikes }} Je n'aime pas</p>
		<p>{{ response }} la réponse</p>
	</div>
</template>

<script>
export default {
	name: "Like",
	props: ["gagId", "isLiked", "likes", "dislikes"],
	data() {
		return {
			isLikedByUser: this.isLiked,
			totalLikes: parseInt(this.likes),
			totalDislikes: parseInt(this.dislikes),
			response: "",
		};
	},
	methods: {
		postLike(value) {
			const body = { userId: this.$store.state.userId, like: value };
			let auth = "bearer " + this.$store.state.token;
			let url = "http://localhost:3000/api/gag/" + this.gagId + "/like";
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: auth },
				body: JSON.stringify(body),
			})
				.then((res) => {
					if (!res.ok) {
						return res.json();
					} else {
						if (value == 1) {
							this.totalLikes += 1;
							this.isLikedByUser = true;
						} else if (value == -1) {
							this.totalDislikes += 1;
							this.isLikedByUser = false;
						} else if (value == 0 && this.isLikedByUser == true) {
							this.totalLikes -= 1;
							this.isLikedByUser = "";
						} else if (value == 0 && this.isLikedByUser == false) {
							this.totalDislikes -= 1;
							this.isLikedByUser = "";
						}
						return "Votre opinion est comptabilisée!";
					}
				})
				.then((message) => {
					if (message.error) {
						this.response = message.error;
					} else {
						this.response = message;
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
	},
};
</script>

<style>
.like {
	color: green;
}
.dislike {
	color: red;
}
</style>
