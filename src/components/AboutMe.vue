<template>
	<div class="about-me">
			About me
		</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'AboutMeComponent'
})
export default class AboutMeComponent extends Vue {
	public mounted () {
		console.log('AboutMeComponent has been properly mounted');
	}
}
</script>