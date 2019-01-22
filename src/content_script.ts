'use strict';
import { sum_asana_tasks } from './asana_scripts/task_sum';

alert('Content script running');
console.log("Tasks", sum_asana_tasks());