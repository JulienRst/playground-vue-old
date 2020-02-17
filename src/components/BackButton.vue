<template>
	<div>BackButtonComponent is working !</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'BackButtonComponent'
})
export default class BackButtonComponent extends Vue {
	public mounted () {
		console.log('BackButtonComponent has been properly mounted');
	}
}
</script>