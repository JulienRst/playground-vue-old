<template>
  <div class="page root row center">
		<text-rendering-component :text="computedText" />
		<div class="item-container column">
			<router-link
				:to="{ name: 'Viewer', params: { slug: project.slug }}"
				class="item row"
				v-for="(project, key) in projects"
				:key="project.id"
				@mouseenter.native="triggerHoverIn(key)"
				@mouseleave.native="triggerHoverOut()"
			>
				<div class="key">0{{ project.id }}</div>
				<div class="title" :data-text="project.name">{{ project.name }}</div>
				<div class="class">see more</div>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import projects from '@/utils/ProjectData';
import { Component, Vue } from 'vue-property-decorator';
import TextRenderingComponent from '@/components/TextRendering.vue';

@Component({
	name: 'RootView',
	components: {
		TextRenderingComponent
	},
	data: () => {
		return {
			projects
		};
	}
})
export default class RootView extends Vue {
	public activeKey: number = -1;

	public triggerHoverIn (key: number) { this.activeKey = key; }

	public triggerHoverOut () { this.activeKey = -1; }

	get computedText (): string {
		if (this.activeKey !== -1) {
			return projects[this.activeKey].name;
		} else {
			return '';
		}
	}
}
</script>