import slug from 'slug';
import { Component } from 'vue';

export default class Project {
	public id: number;
	public name: string;
	public component: Component;
	public slug: string;
	public needTitle: boolean;

	constructor (id: number, name: string, component: Component, needTitle: boolean = true) {
		this.id = id;
		this.name = name;
		this.component = component;
		this.slug = slug(name).toLowerCase();
		this.needTitle = needTitle;
	}
}
