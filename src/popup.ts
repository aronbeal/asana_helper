'use strict';

import { ACTION_TASK_SUM, RESPONSE_TASK_SUM } from './asana_scripts/task_sum';
import { send_runtime_msg_to_content as send_runtime_message } from './utilities/chrome_runtime';
import { ChromeData } from '../types';

// Adds a listener to the "Sum Up" button that will
// iterate through the tasks and sum them up.
document.addEventListener('DOMContentLoaded', (e: Event) => {
	console.log("Mouse event detected", e);
	let sum_up_button = document.querySelector('#sum_times');
	if (sum_up_button === null) {
		throw 'Could not find the #sum_times button in the popup window';
	}
	sum_up_button.addEventListener('click', (e: MouseEvent) => {
		send_runtime_message({ cmd: ACTION_TASK_SUM }, (response: ChromeData) => {
			console.log(response.response, response.data);
		});
	});
});
console.log('Popup script running');
