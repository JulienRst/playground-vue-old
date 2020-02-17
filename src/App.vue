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
		console.log('App View has been properly mounted');
	}
}
</script>

<style lang="scss">
@import '@/assets/sass/master.scss';
</style>