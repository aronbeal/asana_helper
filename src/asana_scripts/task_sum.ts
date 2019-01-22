'use strict';

/**
 * @file
 * This file contains functions used for various Asana tasks
 */

import {Task, TaskTotal, Section, Sections} from "../../types";

/**
 * Output generators take the contents found by the get-testable-modules
 * module (in the form of an array of discovery entries), and write them
 * to a single location in the filesystem.   Each generator is responsbile
 * for a different output.
 */

const interesting_sections = [ 'PLANNING', 'DEVELOPMENT', 'REVIEW READY & REVIEWING' ];

export function sum_asana_tasks() {
	let sections:Sections = {};
	let current_section:string = 'Default';
	document.querySelectorAll('.ItemRow').forEach((item_row:Element) => {
		if (sections[current_section] === undefined) {
			// Add the default values for a new section.
			let new_section: Section = {
                tasks: [],
                totals: {
					time: 0,
					complete: 0,
					incomplete: 0
				}
            };
			sections[current_section] = new_section;
		}
		// Assemble the elements we'll need for processing.
		let taskname_element = item_row.querySelector('.TaskName');
		let taskname:string = taskname_element.querySelector('textarea').value;
		let section_row:boolean = taskname_element.classList.contains('SectionRow-sectionName');
        let completed:boolean = item_row.classList.contains('SectionRow--completed');
		// Regex matches text in the form of "[1.5] Some task".  We want to
		// extract the 1.5 value, as it is the time needed for the task.
		let r = /^s*\[(\d+)\].*/;
		if (section_row) {
			// Sum up the totals of all task times by running reduce(), and adding the
			// time of each to the accumulator.  This value will go in the 'totals'
			// property of the section.
			sections[current_section].totals = sections[current_section].tasks.reduce((accumulator:TaskTotal, task:Task) => {
				accumulator.time += task.time;
				if (task.completed) {
					accumulator.complete += task.time;
				} else {
					accumulator.incomplete += task.time;
				}
                return accumulator;
			}, sections[current_section].totals);
			current_section = taskname;
			return;
        }
        let new_task:Task = {
            name: taskname,
			completed: completed,
			time: 0
        };
        let matches:RegExpExecArray = null;
		if ((matches = r.exec(taskname)) !== null) {
            new_task.time = parseFloat(matches[1]);
        }
		sections[current_section].tasks.push(new_task);

	});
	return sections;
}
window.addEventListener('load', function(event) {
	sum_asana_tasks();
});
