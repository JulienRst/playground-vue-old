<template>
  <div class="page root row center">
		<div class="item-container column">
			<router-link
				:to="{ name: 'Viewer', params: { slug: project.slug }}"
				class="item row"
				v-for="project in projects"
				:key="project.id"
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

@Component({
	name: 'RootView',
	data: () => {
		return {
			projects
		};
	}
})
export default class RootView extends Vue {
}
</script>