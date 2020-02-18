import Project from '@/models/project';
import InfiniteCubeComponent from '@/components/sandbox/InfiniteCube.vue';
import TriangleComponent from '@/components/sandbox/Triangle.vue';
import SolutionComponent from '@/components/sandbox/Solution.vue';

const projects = [
	new Project(1, 'Cubes-Fever', InfiniteCubeComponent),
	new Project(2, 'Triangles', TriangleComponent),
	new Project(3, 'Solution', SolutionComponent, false)
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
