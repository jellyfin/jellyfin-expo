/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fetchServerInfo, getServerUrl } from '../utils/ServerValidator';

export default class ServerModel {
	id

	url

	online = false

	info

	constructor(id, url, info) {
		this.id = id;
		this.url = url;
		this.info = info;
		this.urlString = this.parseUrlString;
	}

	get name() {
		return this.info?.ServerName || this.url?.host;
	}

	get parseUrlString() {
		try {
			return getServerUrl(this);
		} catch (ex) {
			return '';
		}
	}

	/**
	 * Development note -- this was originally wrapped in mobx task(), which
	 * provides some state tracking on asynchronous operations. This has been
	 * re-implemented with a direct async call, but if the .pending property is
	 * actively needed, a fetch hook will need to be written around this to track
	 * the status of the request.
	 */
	fetchInfo = async () => {
		return fetchServerInfo(this)
			.then((info) => {
				this.online = true;
				this.info = info;
				return;
			})
			.catch((err) => {
				console.warn(err);
				this.online = false;
			});
	}
}
