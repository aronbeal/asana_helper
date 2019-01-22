// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function on_install() {
	chrome.runtime.onInstalled.addListener(() => {
		chrome.storage.sync.set({ sections: null }, () => {
			console.log('Background script processed.');
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
}

chrome.runtime.onInstalled.addListener(on_install);
