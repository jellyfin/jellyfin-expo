/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* globals AbortController, URL */

import normalizeUrl from 'normalize-url';

const TIMEOUT_DURATION = 5000; // timeout request after 5s

export const parseUrl = (host = '', port = '') => {
	if (!host?.trim()) {
		throw new Error('host cannot be blank');
	}

	host = normalizeUrl(host, { stripWWW: false });

	// Parse the host as a url
	const url = new URL(host);

	if (!url.hostname) {
		throw new Error(`Could not parse hostname for ${host}`);
	}

	// Override the port if provided
	if (port) {
		url.port = port;
	}
	return url;
};

export const fetchServerInfo = async (server = {}) => {
	const serverUrl = server.urlString || getServerUrl(server);
	const infoUrl = `${serverUrl}system/info/public`;
	console.log('info url', infoUrl);

	// Try to fetch the server's public info
	const controller = new AbortController();
	const { signal } = controller;

	const request = fetch(infoUrl, { signal });

	const timeoutId = setTimeout(() => {
		console.log('request timed out, aborting');
		controller.abort();
	}, TIMEOUT_DURATION);

	const responseJson = await request.then(response => {
		clearTimeout(timeoutId);
		if (!response.ok) {
			throw new Error(`Error response status [${response.status}] received from ${infoUrl}`);
		}
		return response.json();
	});
	console.log('response', responseJson);

	return responseJson;
};

export const getServerUrl = (server = {}) => {
	if (!server?.url?.href) {
		throw new Error('Cannot get server url for invalid server', server);
	}

	// Strip the query string or hash if present
	let serverUrl = server.url.href;
	if (server.url.search || server.url.hash) {
		const endUrl = server.url.search || server.url.hash;
		serverUrl = serverUrl.substring(0, serverUrl.indexOf(endUrl));
	}

	// Ensure the url ends with /
	if (!serverUrl.endsWith('/')) {
		serverUrl += '/';
	}

	console.log('getServerUrl:', serverUrl);
	return serverUrl;
};

export const validateServer = async (server = {}) => {
	try {
		// Does the server have a valid url?
		getServerUrl(server);
	} catch (err) {
		return {
			isValid: false,
			message: 'invalid'
		};
	}

	try {
		const responseJson = await fetchServerInfo(server);

		// Versions prior to 10.3.x do not include ProductName so return true if response
		// includes Version < 10.3.x and has an Id
		if (responseJson.Version) {
			const versionNumber = responseJson.Version.split('.').map(num => Number.parseInt(num, 10));
			if (versionNumber.length === 3 && versionNumber[0] === 10 && versionNumber[1] < 3) {
				const isValid = responseJson.Id?.length > 0;
				console.log('Is valid old version', isValid);
				return { isValid };
			}
		}

		const isValid = responseJson.ProductName === 'Jellyfin Server';
		const answer = {
			isValid
		};
		if (!isValid) {
			answer.message = 'invalidProduct';
		}
		return answer;
	} catch (err) {
		return {
			isValid: false,
			message: 'noConnection'
		};
	}
};
