<template>
  <router-view />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'App'
})
export default class App extends Vue {
	public mounted () {
		console.log('%cJulien Rousset | PlayGround', 'padding: 3px; background-color: white; color: #101010');
		console.log('%cMail          %cjulien.rousset01@gmail.com', 'padding: 3px; background-color: white; color: #101010', ' padding: 3px; background-color: white; color: black');
		console.log('%cPhone         %c+33608957135', 'padding: 3px; background-color: white; color: #101010', ' padding: 3px; background-color: white; color: black');
		console.log('%cTwitter       %c@JulienRst', 'padding: 3px; background-color: white; color: #101010', ' padding: 3px; background-color: white; color: black');
	}
}
</script>

<style lang="scss">
@import '@/assets/sass/master.scss';
</style>