<template>
	<div class="page about">
		<back-button-component />
		<article>
			<p>Hi, my name is Julien Rousset and i'm a french <strong>creative developper</strong>, currently based in Paris.</p>
			<p>Working as a <strong>Confirmed Front Developer</strong> with <strong>OnePoint</strong>.</p>
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
	public mounted () {
		console.log('AboutView has been properly mounted');
	}
}
</script>
