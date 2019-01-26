'use strict';
import task_sum, { RESPONSE_TASK_SUM, sum_asana_major_sections } from './asana_scripts/task_sum';
import { Task, Sections, Section, ChromeOp} from '../types';
import { hash_change_handler } from './background';
import { ACTION_TASK_SUM } from './asana_scripts/task_sum';
import { add_runtime_listener } from './utilities/chrome_runtime';

add_runtime_listener(ACTION_TASK_SUM, (msg: ChromeOp) => {
    let result:any = {
        sections: task_sum()
    };
    result.interesting_section_times = sum_asana_major_sections(result.sections);
    return { response: RESPONSE_TASK_SUM, data: result };
});
