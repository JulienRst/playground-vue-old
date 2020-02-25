<template>
	<div class="page about" :class="{ mounted: isMounted }">
		<back-button-component @navigation="goToRoot"/>
		<section>
			<article>
				<p>Hi, my name is Julien Rousset and i'm a french <strong>Creative Developer</strong>, currently based in Paris.</p>
				<p>Working as a <strong>Experienced Front End Developer</strong> at <strong>onepoint</strong>.</p>
				<p>I'm looking for new opportunity to use <strong>3D</strong> and <strong>Web</strong> together into <strong>neat experiences</strong>.</p>
			</article>
			<article>
				<p>julien.rousset01[at]gmail[dot]com</p>
				<div class="ctn-socials row">
					<a href="https://twitter.com/JulienRst">
						<img :src="twitter" alt="twitter icon">
					</a>
					<a href="https://github.com/JulienRst">
						<img :src="github" alt="github icon">
					</a>
				</div>
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { twitter, github } from '@/assets/images';
import BackButtonComponent from '@/components/BackButton.vue';

@Component({
	name: 'AboutView',
	components: { BackButtonComponent },
	data: () => {
		return {
			twitter,
			github
		};
	}
})
export default class AboutView extends Vue {
	public isMounted: boolean = false;

	public mounted () {
		window.setTimeout(() => {
			this.isMounted = true;
		}, 50);
	}

	public goToRoot () {
		this.isMounted = false;
		window.setTimeout(() => {
			this.$router.push({ name: 'Root' });
		}, 350);
	}
}
</script>
