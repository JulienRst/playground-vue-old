import Project from '@/models/project';
import InfiniteCubeComponent from '@/components/sandbox/InfiniteCube.vue';
import TriangleComponent from '@/components/sandbox/Triangle.vue';
import SolutionComponent from '@/components/sandbox/Solution.vue';
import NormalVertexPartyComponent from '@/components/sandbox/NormalVertexParty.vue';
import TunnelComponent from '@/components/sandbox/Tunnel.vue';

const projects = [
	new Project(
		1,
		'Cubes Fever',
		InfiniteCubeComponent,
		{
			date: 'January 2020',
			technos: ['Three.js', 'Vue.js'],
			inspirations: [{
				link: 'https://numbersinmotion.tumblr.com/post/157226693561/up-down',
				name: 'Numbers in Motion'
			}],
			source: 'https://github.com/JulienRst/Playground/blob/master/src/components/sandbox/InfiniteCube.vue'
		}
	),
	new Project(
		2,
		'Twerking Triangle',
		TriangleComponent,
		{
			date: 'January 2020',
			technos: ['Three.js', 'Vue.js'],
			inspirations: [],
			source: 'https://github.com/JulienRst/Playground/blob/master/src/components/sandbox/Triangle.vue'
		}
	),
	new Project(
		3,
		'Solution',
		SolutionComponent,
		{
			date: 'August 2019',
			technos: ['Three.js', 'Vue.js'],
			inspirations: [{
				link: 'http://jonathan-larradet.com/',
				name: 'Jonathan Larradet'
			}],
			source: 'https://github.com/JulienRst/Playground/blob/master/src/components/sandbox/Solution.vue'
		},
		false
	),
	new Project(
		4,
		'Triangles Party',
		NormalVertexPartyComponent,
		{
			date: 'February 2020',
			technos: ['Three.js', 'Vue.js'],
			inspirations: [],
			source: 'https://github.com/JulienRst/Playground/blob/master/src/components/sandbox/NormalVertexParty.vue'
		},
		false
	),
	new Project(
		5,
		'Square Tunnel',
		TunnelComponent,
		{
			date: 'April 2020',
			technos: ['Three.js', 'Vue.js'],
			inspirations: [{
				link: 'https://tympanus.net/Development/InfiniteTubes/',
				name: 'Codrops'
			}],
			source: 'https://github.com/JulienRst/Playground/blob/master/src/components/sandbox/Tunnel.vue'
		},
		false
	)
];

export const getProjectFromSlug = (slug: string): Project|null => {
	let result = null;
	projects.forEach((project) => {
		if (project.slug === slug) {
			result = project;
		}
	});

	return result;
};

export default projects;
