import slug from 'slug';
import { Component } from 'vue';

export default class Project {
	public id: number;
	public name: string;
	public component: Component;
	public slug: string;
	public needTitle: boolean;
	public informations: any;

	constructor (id: number, name: string, component: Component, informations: any, needTitle: boolean = true) {
		this.id = id;
		this.name = name;
		this.component = component;
		this.slug = slug(name).toLowerCase();
		this.needTitle = needTitle;
		this.informations = informations;
	}
}
