<template>
	<div class="more-info">
		<div class="button">
			<div class="small-stroke"></div>
			<div class="small-stroke"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'MoreInfoComponent'
})
export default class MoreInfoComponent extends Vue {
	public mounted () {
		console.log('MoreInfoComponent has been properly mounted');
	}
}
</script>