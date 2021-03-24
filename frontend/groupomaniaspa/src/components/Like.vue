<template>
	<div>
		<div class="like">
			<button
				type="button"
				v-show="isLikedByUser === true"
				class="like--true"
				@click="postLike(0)"
			>
				<i class="fas fa-arrow-alt-circle-up"></i> <span> J'aime</span>
			</button>
			<button
				type="button"
				@click="postLike(1)"
				v-show="!isLikedByUser"
				:disabled="isLikedByUser === false"
			>
				<i class="fas fa-arrow-alt-circle-up"></i>
				<span> J'aime</span>
			</button>
			<p>{{ totalLikes }} J'aime</p>
			<button
				type="button"
				class="like--false"
				v-show="isLikedByUser === false"
				@click="postLike(0)"
			>
				<i class="fas fa-arrow-alt-circle-down"></i> Je n'aime pas
			</button>
			<button
				type="button"
				v-show="isLikedByUser !== false"
				:disabled="isLikedByUser === true"
				@click="postLike(-1)"
			>
				<i class="fas fa-arrow-alt-circle-down"></i> Je n'aime pas
			</button>
			<p>{{ totalDislikes }} Je n'aime pas</p>
		</div>
		<p class="like__response" v-show="response">{{ response }}</p>
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

<style lang="scss">
.like {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 0 2rem 0 3rem;
	align-items: center;
	button {
		border-radius: 10px;
		font-family: "Blinker", Arial, sans-serif;
		font-size: 1rem;
		font-weight: 600;
		padding: 0rem 0.5rem 0rem 0;
		color: #192b48;
		border: 3px solid #192b48;
		background-color: white;
		width: 120px;
		position: relative;
		text-align: left;
		transition: transform 150ms;
		cursor: pointer;
		&:disabled {
			opacity: 0.5;
		}
		&:hover:enabled {
			transform: scale(1.05);
		}
		i {
			font-size: 2rem;
			vertical-align: middle;
			margin-left: -1rem;
			background-color: white;
			text-align: left;
		}
		span {
			position: relative;
			left: 20px;
		}
	}
	p {
		margin: 0;
		padding: 0 0 0 5px;
		flex: 1;
		white-space: nowrap;
		text-align: left;
	}
	.like--true {
		color: #2a9e82;
		border-color: #2a9e82;
	}
	.like--false {
		color: #c32240;
		border-color: #c32240;
	}
	&__response {
		text-align: center;
		margin: 0.5rem 2rem;
	}
}
</style>
