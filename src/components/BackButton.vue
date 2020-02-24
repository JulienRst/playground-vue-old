<template>
	<div @click="goToRoot" class="back-button">
		<div class="main-stroke"></div>
		<div class="small-stroke"></div>
		<div class="small-stroke"></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'BackButtonComponent'
})
export default class BackButtonComponent extends Vue {
	public goToRoot () {
		this.$emit('navigation');
	}
}
</script>