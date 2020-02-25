<template>
	<div class="viewer" :class="{ mounted: isMounted }">
		<div class="ctn-render">
			<component :is="project.component" v-if="project" />
		</div>
		<h1 v-if="project && project.needTitle && !$refs.moreinfo.open">{{ project.name }}</h1>
		<back-button-component @navigation="goToRoot" />
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
		}, 10);
		this.init();
	}

	public goToRoot () {
		this.isMounted = false;
		window.setTimeout(() => {
			this.$router.push({ name: 'Root' });
		}, 350);
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