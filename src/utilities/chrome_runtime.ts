'use strict';

import { ChromeOp, ChromeData, ChromeOpCallback, ChromeDataCallback } from '../../types';

/**
 * Sends a message from the content script.
 *
 * This method is only ever meant to be used by the content script
 * to send messages to other scripts.  To send messages
 * in the other direction, see send_runtime_msg_to_content()
 *
 * @param {ChromeOp} msg
 *   A message to send.
 * @param {ChromeDataCallback} callback
 *   The function invoked when the listener receives the
 *   callback.  While optional, this specifies that if present,
 *   the op expects a data response back that it can act
 *   upon.
 */
export function send_runtime_msg_from_content(msg: ChromeOp, callback?: ChromeDataCallback): void {
	chrome.runtime.sendMessage(msg, callback);
}

/**
 * Sends a message to the content script.
 *
 * This method is only ever meant to be used by other scripts
 * to send messages to the content script.  To send messages
 * in the other direction, see send_runtime_msg_from_content()
 *
 * @param {ChromeOp} msg
 *   A message to send.
 * @param {ChromeDataCallback} callback
 *   The function invoked when the listener receives the
 *   callback.  While optional, this specifies that if present,
 *   the op expects a data response back that it can act
 *   upon.
 */
export function send_runtime_msg_to_content(msg: ChromeOp, callback?: ChromeDataCallback): void {
	console.log("Sending a runtime message to content");
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg, callback);
	});
}

/**
 * Binds a callback with the chrome runtime.
 *
 * This binds a callback listener with the chrome runtime,
 * listening for the command specified by cmd.  It will
 * execute callback once that condition is met, passing
 * the request received from the listener into the callback, and
 * invoking sendResponse() on the result, sending a response
 * back to the origin containing the callback result to
 * the message.
 *
 * @param {ChromeOpCallback} callback
 *   The callback to execute when the listener receives a message.
 */
export function add_runtime_listener(cmd: string, callback: ChromeOpCallback) {
	chrome.runtime.onMessage.addListener(function(request: ChromeOp, sender, sendResponse) {
		console.log("Message received, Cmd, ", cmd, ", Request", request);
		if(cmd === request.cmd) {
			let response = callback(request);
			console.log("Sending response", response);
			sendResponse(response);
			return;
		}
		console.log("no action matched, response sent");
	});
}
