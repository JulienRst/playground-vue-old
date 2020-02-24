<template>
  <div class="page root row center" :class="{ active: isMounted }">
		<div class="item-container column">
			<div
				@click="goToProject(project)"
				class="item row"
				v-for="(project, key) in projects"
				:key="project.id"
				@mouseenter="triggerHoverIn(key)"
				@mouseleave="triggerHoverOut()"
				role="link"
				:tabindex="key"
			>
				<div class="key">0{{ project.id }}</div>
				<div class="title" :data-text="project.name">{{ project.name }}</div>
				<div class="class">see more</div>
			</div>
		</div>
		<about-me-component @navigation="prepareToLeave"/>
	</div>
</template>

<script lang="ts">
import projects from '@/utils/ProjectData';
import { Component, Vue } from 'vue-property-decorator';
import AboutMeComponent from '@/components/AboutMe.vue';
import Project from '@/models/project';

@Component({
	name: 'RootView',
	components: {
		AboutMeComponent
	},
	data: () => {
		return {
			isMounted: false,
			projects
		};
	}
})
export default class RootView extends Vue {
	public isMounted: boolean = false;
	public activeKey: number = -1;

	public mounted () {
		window.setTimeout(() => {
			this.isMounted = true;
		}, 10);
	}

	public triggerHoverIn (key: number) { this.activeKey = key; }

	public triggerHoverOut () { this.activeKey = -1; }

	get computedText (): string {
		if (this.activeKey !== -1) {
			return projects[this.activeKey].name;
		} else {
			return '';
		}
	}

	public goToProject (project: Project) {
		this.isMounted = false;
		window.setTimeout(() => {
			this.$router.push({
				name: 'Viewer',
				params: {
					slug: project.slug
				}
			});
		}, 310);
	}

	public prepareToLeave () {
		this.isMounted = false;
		window.setTimeout(() => {
			this.$router.push({
				name: 'About'
			});
		}, 310);
	}
}
</script>