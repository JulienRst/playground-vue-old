import Project from '@/models/project';
import InfiniteCubeComponent from '@/components/sandbox/InfiniteCube.vue';
import TriangleComponent from '@/components/sandbox/Triangle.vue';

const projects = [
	new Project(1, 'Cubes-Fever', InfiniteCubeComponent),
	new Project(2, 'Triangles', TriangleComponent)
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
