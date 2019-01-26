/**
 * @file
 * This file contains definitions for types used throughout this plugin.
 */

export type Task = {
	name: string;
	completed: boolean;
	time: number;
	is_section: boolean,
};
export type Tasks = Array<Task>;
export type TaskTotal = {
	time: number;
	complete: number;
	incomplete: number;
};
export type Section = {
	section_head: Task;
	tasks: Array<Task>;
	totals: TaskTotal;
};
export type Sections = { [key: string]: Section };

// @TODO (Defer): Follow up on this.
// This presumably allows importing html assets via webpack,
// but in actuality, doesn't seem to work.
declare module '*.html' {
	const value: string;
	export default value;
}
export type ChromeOp = {
	cmd: string,
	data?: any
}
export type ChromeData = {
	response: string,
	data: any
}
export type ChromeOpCallback = (msg: ChromeOp) => ChromeData;
export type ChromeDataCallback = (msg: ChromeData) => any;