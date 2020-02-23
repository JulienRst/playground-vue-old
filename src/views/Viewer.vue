<template>
	<div class="viewer" :class="{ mounted: isMounted }">
		<component :is="project.component" v-if="project" />
		<h1 v-if="project && project.needTitle && !$refs.moreinfo.open">{{ project.name }}</h1>
		<back-button-component />
		<more-info-component :project="project" ref="moreinfo" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Project from '@/models/project';
import { getProjectFromSlug } from '@/utils/ProjectData';
import BackButtonComponent from '@/components/BackButton.vue';
import MoreInfoComponent from '@/components/MoreInfo.vue';
@Component({
	name: 'componentName',
	components: {
		BackButtonComponent,
		MoreInfoComponent
	},
	data: () => {
		return {
			project: null,
			isMounted: false
		};
	}
})
export default class ViewerView extends Vue {
	public project!: Project;
	public isMounted!: boolean;

	public mounted () {
		window.setTimeout(() => {
			this.isMounted = true;
		}, 50);
		this.init();
	}

	private init () {
		const project = getProjectFromSlug(this.$route.params.slug);
		if (project) {
			this.project = project;
		} else {
			console.log('No project found');
			// [TODO] Add a 404 page !
		}
	}
}
</script>

<style lang="scss" scoped>
h1 {
	text-align: center;
	font-family: 'Titilium';
	position: absolute;
	font-size: 5rem;
	text-transform: uppercase;
	color: white;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 8000;
}
</style>