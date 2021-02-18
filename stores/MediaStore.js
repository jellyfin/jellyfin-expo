/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, computed, decorate, observable } from 'mobx';
import { ignore } from 'mobx-sync';

import { ticksToMs } from '../utils/Time';

export default class MediaStore {
	/**
	 * The MediaType being played
	 */
	type

	/**
	 * URI of the current media item
	 */
	uri

	/**
	 * Is the media currently playing
	 */
	isPlaying = false

	/**
	 * The current playback position in ticks
	 */
	positionTicks = 0

	/**
	 * The URI of the poster image of the current media item
	 */
	posterUri

	get positionMillis() {
		return ticksToMs(this.positionTicks);
	}

	reset() {
		this.type = null;
		this.uri = null;
		this.isPlaying = false;
		this.positionTicks = 0;
		this.posterUri = null;
	}
}

decorate(MediaStore, {
	type: [ ignore, observable ],
	uri: [ ignore, observable ],
	isPlaying: [ ignore, observable ],
	positionTicks: [ ignore, observable ],
	positionMillis: computed,
	posterUri: [ ignore, observable ],
	reset: action
});
