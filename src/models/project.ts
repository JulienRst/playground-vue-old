import slug from 'slug';
import { Component } from 'vue';

export default class Project {
	public id: number;
	public name: string;
	public component: Component;
	public slug: string;

	constructor (id: number, name: string, component: Component) {
		this.id = id;
		this.name = name;
		this.component = component;
		this.slug = slug(name).toLowerCase();
	}
}
