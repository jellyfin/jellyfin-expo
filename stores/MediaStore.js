/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, computed, decorate, observable } from 'mobx';
import { ignore } from 'mobx-sync';

const TICKS_PER_MS = 10000;

export default class MediaStore {
	type
	uri
	positionTicks = 0
	posterUri

	get positionMillis() {
		return (this.positionTicks || 0) / TICKS_PER_MS;
	}

	reset() {
		this.type = null;
		this.uri = null;
		this.positionTicks = 0;
		this.posterUri = null;
	}
}

decorate(MediaStore, {
	type: [ ignore, observable ],
	uri: [ ignore, observable ],
	positionTicks: [ ignore, observable ],
	positionMillis: computed,
	posterUri: [ ignore, observable ],
	reset: action
});
