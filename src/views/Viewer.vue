<template>
	<div class="viewer">
		<component :is="project.component" v-if="project" />
		<back-button-component />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Project from '@/models/project';
import { getProjectFromSlug } from '@/utils/ProjectData';
import BackButtonComponent from '@/components/BackButton.vue';
@Component({
	name: 'componentName',
	components: { BackButtonComponent },
	data: () => {
		return {
			project: null
		};
	}
})
export default class ViewerView extends Vue {
	public project!: Project;
	public mounted () {
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