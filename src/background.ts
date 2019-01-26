// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// See https://developer.chrome.com/extensions/background_pages
// for more on background scripts.

'use strict';

import task_sum from './asana_scripts/task_sum';
import { Task, Sections, Section, ChromeOp, ChromeOpCallback as ChromeOpCallback } from '../types';
import debounce from './utilities/debounce';
import { ACTION_TASK_SUM } from './asana_scripts/task_sum';
import { send_runtime_msg_to_content as send_runtime_msg, add_runtime_listener } from './utilities/chrome_runtime';

/**
 * Responds to a chrome hash change event.
 *
 * This is the best equivalent I can find of a DOM content
 * loaded event for a single page app.
 *
 * This function needs to sum up the tasks rendered on
 * the page, and make it available to others.
 */
export function hash_change_handler() {
	/* things */
	console.info('HASH CHANGE');
	let page_tasks: Sections = task_sum();
	let task_keys = Object.keys(page_tasks);
	console.log('Task keys', task_keys);
}
// Bind all events here.
chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({ sections: null }, () => {
		console.log('Background script processed.');
	});

	add_runtime_listener(ACTION_TASK_SUM, (msg: ChromeOp) => {
		return {
			response: msg.cmd,
			data: task_sum()
		};
	});
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	chrome.declarativeContent.onPageChanged.addRules([
		{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostEquals: 'app.asana.com' }
				})
			],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		}
	]);
});
// chrome.tabs.onUpdated.addListener(
// 	debounce(function(tabId: number, changeInfo: any, tab: any) {
// 		send_runtime_msg({cmd: "hello"}, function(response) {
// 			console.log(response.cmd);
// 		});
// 	}, 500)
// );


// We bind a tab onUpdated listender in addition to the
// window hashchange one, so we can detect *all* url
// changes.
// chrome.tabs.onUpdated.addListener(function(){
//     console.log('tabs updated');
//     // hash_change_handler();
// });
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
// 	console.log('sending message to tab ', tabs[0].id);
//     chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});
// });
