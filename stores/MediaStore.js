/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, computed, decorate, observable } from 'mobx';
import { ignore } from 'mobx-sync-lite';

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
	 * Has media playback finished
	 */
	isFinished = false

	/**
	 * Is the media a local file (not streaming media)
	 */
	isLocalFile = false

	/**
	 * Is the media currently playing
	 */
	isPlaying = false

	/**
	 * The current playback position in ticks
	 */
	positionTicks = 0

	/**
	 * The URI of the backdrop image of the current media item
	 */
	backdropUri

	/**
	 * The player should toggle the play/pause state
	 */
	shouldPlayPause = false

	/**
	 * The player should stop playback
	 */
	shouldStop = false

	get positionMillis() {
		return ticksToMs(this.positionTicks);
	}

	reset() {
		this.type = null;
		this.uri = null;
		this.isFinished = false;
		this.isLocalFile = false;
		this.isPlaying = false;
		this.positionTicks = 0;
		this.backdropUri = null;
		this.shouldPlayPause = false;
		this.shouldStop = false;
	}
}

decorate(MediaStore, {
	type: [ ignore, observable ],
	uri: [ ignore, observable ],
	isFinished: [ ignore, observable ],
	isLocalFile: [ ignore, observable ],
	isPlaying: [ ignore, observable ],
	positionTicks: [ ignore, observable ],
	positionMillis: computed,
	backdropUri: [ ignore, observable ],
	shouldPlayPause: [ ignore, observable ],
	shouldStop: [ ignore, observable ],
	reset: action
});
