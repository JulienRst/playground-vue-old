<template>
	<router-link :to="{ name: 'Root' }" class="back-button">
		<div class="main-stroke"></div>
		<div class="small-stroke"></div>
		<div class="small-stroke"></div>
	</router-link>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'BackButtonComponent'
})
export default class BackButtonComponent extends Vue {
}
</script>