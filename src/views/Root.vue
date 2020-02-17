<template>
  <div>RootView is working !</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'RootView'
})
export default class RootView extends Vue {
	public mounted () {
		console.log('RootView has been properly mounted');
	}
}
</script>