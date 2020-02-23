<template>
	<div class="about-me" @click="navigation">
			About me
		</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'AboutMeComponent'
})
export default class AboutMeComponent extends Vue {

	public navigation () {
		this.$emit('navigation');
	}
}
</script>