// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import { Sections } from '../types';
import { sum_asana_tasks } from './asana_scripts/task_sum';

function dom_content_loaded_handler(e: Event) {
	let sum_up_button = document.querySelector('#countUp');
	sum_up_button.addEventListener('click', (e: MouseEvent) => {
    console.log("Sections", sum_asana_tasks());
	});
}
// Adds a listener to the "Sum Up" button that will
// iterate through the tasks and sum them up.
document.addEventListener('DOMContentLoaded', dom_content_loaded_handler);
