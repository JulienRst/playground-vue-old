<template>
	<div class="more-info" :class="{ open: open }" v-if="project">
		<div class="button" @click="toggleOpen">
			<div class="small-stroke"></div>
			<div class="small-stroke"></div>
		</div>
		<div class="ctn-informations" v-show="open">
			<div class="title">
				{{ project.name }}
			</div>
			<div class="date">
				{{ project.informations.date }}
			</div>
			<div class="block" v-if="project.informations.technos.length">
				<div class="label">
					Technos
				</div>
				<div class="items row">
					<div class="item" v-for="(tech, key) in project.informations.technos" :key="key">{{ tech }}</div>
				</div>
			</div>
			<div class="block" v-if="project.informations.inspirations.length">
				<div class="label">
					Inspirations
				</div>
				<div class="items row">
					<div class="item" v-for="(insp, key) in project.informations.inspirations" :key="key">
						<a :href="insp.link" target="_blank">{{ insp.name }}</a> 
					</div>
				</div>
			</div>
			<div class="source">
				<a :href="project.informations.source" target="_blank"><img :src="github" alt=""></a> 
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { github } from '@/assets/images';
import Project from '@/models/project';

@Component({
	name: 'MoreInfoComponent',
	data: () => {
		return {
			github
		};
	}
})
export default class MoreInfoComponent extends Vue {
	public open: boolean = false;

	@Prop({ required: true })
	public project!: Project;

	public mounted () {
		console.log('MoreInfoComponent has been properly mounted');
	}

	public toggleOpen () {
		this.open = !this.open;
	}
}
</script>