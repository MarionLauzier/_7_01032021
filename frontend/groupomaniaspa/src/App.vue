<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Blinker:wght@300;400;600&display=swap");
#app {
	box-sizing: border-box;
	font-family: "Blinker", Arial, sans-serif;
	font-weight: 400;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #192b48;
	background: linear-gradient(
			rgba(150, 150, 200, 0.7),
			rgba(150, 150, 200, 0.7)
		),
		url("./assets/bg.jpg");

	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-size: cover;
	width: 100%;
	button {
		transition: transform 150ms;
		&:focus:enabled {
			outline: none;
			box-shadow: 0 0 5px darken(#b3deff, 30%);
			transform: scale(1.05);
		}
	}
}
</style>
