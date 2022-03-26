/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function fetchWithTimeout(url, timeout) {
	const abortController = new AbortController();
	const { signal } = abortController;

	const timeoutId = setTimeout(() => {
		console.log('fetch timed out, aborting');
		abortController.abort();
	}, timeout);

	return fetch(url, { signal })
		.finally(() => {
			clearTimeout(timeoutId);
		});
}
