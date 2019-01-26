'use strict';

/**
 * @file
 * This file contains functions used for various Asana tasks
 */

import { Task, Tasks, TaskTotal, Section, Sections } from '../../types';
import { strict } from 'assert';

/**
 * Output generators take the contents found by the get-testable-modules
 * module (in the form of an array of discovery entries), and write them
 * to a single location in the filesystem.   Each generator is responsbile
 * for a different output.
 */

/**
 * These constants define actions and responses that can
 * be taken, provided by the functions in this class.
 * A caller will invoke an action with the ACTION_* prefix,
 * and should expect a response of the corresponding type.
 * Each response will contain a ChromeData object as a
 * result, containing any data the response should provide.
 */
export const ACTION_TASK_SUM = 'action_task_sum';
export const RESPONSE_TASK_SUM = 'response_task_sum';

function get_asana_tasks(document:Document): Tasks {
	let tasks: Tasks = [];
	document.querySelectorAll('.ItemRow').forEach((item_row: Element) => {
		// Assemble the elements we'll need for processing.
		let taskname_element: Element = item_row.querySelector('.TaskName');
		let taskname: string = taskname_element.querySelector('textarea').value;
		let section_row: boolean = taskname_element.classList.contains('SectionRow-sectionName');
		let completed: boolean = item_row.classList.contains('SectionRow--completed');
		// Regex matches text in the form of "[1.5] Some task".  We want to
		// extract the 1.5 value, as it is the time needed for the task.
		let r = /^s*\[([\d.]+)\]/;
		let new_task: Task = {
			name: taskname,
			completed: completed,
			time: 0,
			is_section: section_row
		};
		let matches: RegExpExecArray = null;
		if ((matches = r.exec(taskname)) !== null) {
			new_task.time = parseFloat(matches[1]);
		}
		tasks.push(new_task);
	});
	return tasks;
}

/**
 * Returns a new section object with the given name.
 *
 * Sections in asana end with a colon (:).  A section
 * object stores both the task with the section name,
 * and a series of tasks that occur subsequent to the
 * section, but before the next section.
 *
 * @param {string} name
 *   The name of the new section.
 */
function create_new_section(name: string): Section {
	return {
		section_head: {
			name: name,
			completed: false,
			time: 0,
			is_section: true
		},
		tasks: [],
		totals: {
			time: 0,
			complete: 0,
			incomplete: 0
		}
	};
}
function get_asana_sections(tasks: Tasks): Sections {
	let default_section: Section = create_new_section('None');
	let current_section_name: string = 'None';
	return tasks.reduce((sections: Sections, task: Task) => {
		if (!task.is_section) {
			sections[current_section_name].tasks.push(task);
			return sections;
		}
		current_section_name = task.name
		// Task has section text.  Create a section for it if
		// none already exists.
		if (sections[current_section_name] === undefined) {
			let new_section = create_new_section(task.name);
			// Set the task itself to be the section head.
			new_section.section_head = task;
			sections[current_section_name] = new_section;
			return sections;
		}
	}, {
		[current_section_name]: default_section
	});
}

function sum_asana_sections(sections: Sections): Sections {
	Object.keys(sections).map((section_name: string) => {
		let section = sections[section_name];
		// Sum up the totals of all task times by running reduce(), and adding the
		// time of each to the accumulator.  This value will go in the 'totals'
		// property of the section.
		section.totals = section.tasks.reduce((accumulator: TaskTotal, task: Task) => {
			accumulator.time += task.time;
			if (task.completed) {
				accumulator.complete += task.time;
			} else {
				accumulator.incomplete += task.time;
			}
			return accumulator;
		}, section.totals);
	});
	return sections;
}

export function sum_asana_major_sections (sections:Sections) {
	console.log("Summing major sections");
	const interesting_sections = [ 'DISCOVERY', 'PLANNING', 'DEVELOPMENT', 'REVIEW READY & REVIEWING' ];
	const current_section = 'None';
	// Iterates through the sections and groups them by 'intersting'
	// sections, e.g. whether the section name contains one of the above
	// interesting_section keys.  The result will be a dictionary with
	// the above interesting sections (where found), with a time of that
	// section as the value.  Sections that are not interesting will be
	// added to the 'none' categore.  Recall that tasks have already been
	// added to sections, so this *only* applies to sections that are not
	// interesting.
	let intermediary_result: {[key:string]:number} = Object.keys(sections).reduce((accumulator: {[key:string]:number}, section_name: string) => {
		let section = sections[section_name];
		// If at least one of the "interesting sections" occurs as a
		// substring within the section name, it should be totaled as a
		// separate section within the accumulator.
		interesting_sections.map((v) => {
			let interesting_section_name = 'None';
			if (section_name.indexOf(v) >= 0) {
				interesting_section_name = v;
			}
			if (accumulator[interesting_section_name] === undefined) {
				accumulator[interesting_section_name] = 0;
			}
			// Add the section time totals to the interesting section times.
			accumulator[interesting_section_name] += section.totals.time;
		});
		// Sum up the totals of all task times by running reduce(), and adding the
		// time of each to the accumulator.  This value will go in the 'totals'
		// property of the section.
		return accumulator;
	}, {});
	// Change the accumulator to string values before returning.
	let result: {[key:string]:string} = {};
	Object.keys(intermediary_result).map((key) => {
		let value = intermediary_result[key].toFixed(2);
		result[key] = value;
	});
	return result;
}
export default function task_sum(): Sections {
	return sum_asana_sections(
		get_asana_sections(
			get_asana_tasks(document)));
}
