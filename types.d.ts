/**
 * @file
 * This file contains definitions for types used throughout this plugin.
 */

export type Task = {
	name: string;
	completed: boolean;
	time: number;
};
export type TaskTotal = {
	time: number;
	complete: number;
	incomplete: number;
};
export type Section = {
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
